import pytest
from pydantic import ValidationError

from backend.app.retrieval import is_follow_up
from backend.app.schemas import ChatRequest
from backend.app.suggestions import ALL_SUGGESTIONS, STARTERS, suggestions_for

ORIGIN = {"Origin": "https://saket-deshmukh-portfolio.vercel.app"}


def ask(client, question, previous=None):
    body = {"question": question, **({"previous": previous} if previous else {})}
    return client.post("/api/chat", json=body, headers=ORIGIN).json()


@pytest.mark.parametrize(
    "q", ["tell me more", "Tell me more!", "more", "go on", "elaborate", "what else?", "ok, tell me more about that", "more details"]
)
def test_bare_continuations_are_follow_ups(q):
    assert is_follow_up(q)


@pytest.mark.parametrize("q", ["tell me more about saket", "what is catalogsage", "more about kubernetes", "hi"])
def test_real_questions_are_not_follow_ups(q):
    assert not is_follow_up(q)


def test_tell_me_more_continues_the_previous_topic(client, llm):
    body = ask(client, "tell me more", previous="what is catalogsage")
    assert body["grounded"] is True
    assert body["sources"][0]["id"] == "DOC-2"  # the CatalogSage chunk, not the generic profile summary
    asked = llm.calls[-1][0]
    assert "earlier question was: what is catalogsage" in asked and asked.endswith("tell me more")


def test_a_vague_question_is_retried_with_the_previous_one(client, llm):
    assert ask(client, "and the second one?")["grounded"] is False  # on its own it means nothing
    body = ask(client, "and the second one?", previous="what is catalogsage")
    assert body["grounded"] is True and body["sources"][0]["id"] == "DOC-2"


def test_previous_is_ignored_when_the_question_stands_alone(client, llm):
    body = ask(client, "where did he study", previous="what is catalogsage")
    assert body["sources"][0]["id"] == "DOC-3"
    assert "earlier question" not in llm.calls[-1][0]


def test_off_topic_stays_refused_even_with_a_previous_question(client, llm):
    body = ask(client, "what is the capital of France", previous="what is catalogsage")
    assert body["grounded"] is False and llm.calls == []


def test_previous_is_validated_like_a_question():
    assert ChatRequest(question="hi", previous="  what   is\x00 x ").previous == "what is x"
    assert ChatRequest(question="hi", previous="   ").previous is None
    assert ChatRequest(question="hi").previous is None
    with pytest.raises(ValidationError):
        ChatRequest(question="hi", previous="x" * 301)


def test_answers_come_with_follow_up_suggestions(client):
    body = ask(client, "what is catalogsage")
    assert 1 <= len(body["suggestions"]) <= 3
    assert "what is catalogsage" not in [s.lower().rstrip("?") for s in body["suggestions"]]


def test_refusals_and_greetings_offer_the_starter_questions(client):
    assert ask(client, "what is the capital of France")["suggestions"] == STARTERS
    assert ask(client, "hi")["suggestions"] == STARTERS


def test_suggestions_never_repeat_the_question_just_asked(retriever):
    hits = retriever.search("what is catalogsage", 3)
    out = suggestions_for(hits, "Tell me about CatalogSage")
    assert "Tell me about CatalogSage" not in out and len(out) == 3 and len(set(out)) == 3


def test_suggestion_lists_are_not_empty_or_duplicated():
    assert len(ALL_SUGGESTIONS) == len(set(ALL_SUGGESTIONS)) >= len(STARTERS)


def test_only_questions_that_point_back_may_borrow_the_previous_topic(client, llm):
    # "capital of France" has nothing that refers to the earlier answer, so it can never ride on it
    assert ask(client, "and what is the capital of France", previous="what is catalogsage")["grounded"] is False
    assert ask(client, "who won the world cup", previous="what is catalogsage")["grounded"] is False
    assert llm.calls == []
    # ...whereas a reference to "it" can
    assert ask(client, "why did he choose it", previous="what is catalogsage")["grounded"] is True


def test_questions_about_an_organization_itself_are_detected():
    from backend.app.retrieval import asks_about_organization as about_org

    for q in ("tell me about KWAD company", "what is the Briowin company", "describe this organization", "tell me about the firm"):
        assert about_org(q), q
    for q in ("which company does he work at", "what company does Saket work for", "who is saket", "what did he build at KWAD"):
        assert not about_org(q), q


def test_the_model_is_told_when_the_visitor_asks_about_the_organization_not_saket(client, llm):
    ask(client, "tell me about the catalogsage company")
    assert "asking about the organization itself, not about Saket's role" in llm.calls[-1][0]
    calls = len(llm.calls)
    ask(client, "what is the catalogsage product catalog assistant company he built")  # mentions him -> about Saket
    assert len(llm.calls) == calls + 1  # the model really was called for this one
    assert "asking about the organization" not in llm.calls[-1][0]


def test_the_prompt_demands_a_direct_answer_and_honesty_about_company_questions():
    from backend.app.llm import SYSTEM_PROMPT

    assert "Answer exactly the question that was asked" in SYSTEM_PROMPT
    assert "do not describe that company/product/technology itself" in SYSTEM_PROMPT
    assert "Never present Saket's role as a description of the company" in SYSTEM_PROMPT
