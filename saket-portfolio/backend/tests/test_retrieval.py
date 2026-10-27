from backend.app.retrieval import (
    REFUSAL,
    Retriever,
    is_grounded,
    is_overview,
    small_talk,
    stem,
    tokenize,
)


def test_stem_and_tokenize_drop_stopwords_and_possessives():
    assert stem("pipelines") == stem("pipeline") == "pipeline"
    assert stem("services") == stem("service")
    assert stem("databases") == stem("database")
    assert stem("classes") == stem("class")
    assert stem("engineering") == stem("engineer")
    assert tokenize("What is Saket's current role?") == ["current", "role"]


def test_search_ranks_the_matching_chunk_first(retriever):
    hits = retriever.search("what is catalogsage", 3)
    assert hits[0].chunk.id == "DOC-2"
    assert hits[0].score > 0


def test_synonyms_find_education_from_everyday_words(retriever):
    assert retriever.search("where did he go to college", 3)[0].chunk.id == "DOC-3"


def test_off_topic_questions_are_not_grounded(retriever):
    for q in ("what is the capital of France", "write me a poem", "how do I bake bread"):
        assert not is_grounded(q, retriever.search(q, 6)), q


def test_on_topic_questions_are_grounded(retriever):
    q = "what is catalogsage"
    assert is_grounded(q, retriever.search(q, 6))


def test_empty_or_stopword_only_queries_return_nothing(retriever):
    assert retriever.search("", 3) == []
    assert retriever.search("what is the", 3) == []


def test_overview_questions_retrieve_the_profile_summary(retriever):
    for q in (
        "tell me about sake",
        "who is saket",
        "tell me more about saket",
        "describe saket",
        "saket",
        "hey who is saket",
        "hey, who is saket?",
        "so who is saket",
        "can you tell me about saket",
        "hello tell me about him",
        "who's saket",
        "please introduce saket deshmukh",
        "hey tell me more about saket please",
    ):
        assert is_overview(q), q
        assert retriever.search(q, 3)[0].chunk.id == "DOC-1", q
    assert not is_overview("tell me about saket projects")
    assert not is_overview("what is the capital of France")


def test_search_on_empty_knowledge_base():
    assert Retriever([]).search("anything", 3) == []


def test_small_talk_replies_without_retrieval():
    assert small_talk("hi there").startswith("Hi there!")
    assert small_talk("thanks a lot")
    assert small_talk("bye")
    assert small_talk("who are you")
    assert small_talk("what is catalogsage") is None


def test_refusal_text_is_the_documentation_wording():
    assert "does not specify that detail" in REFUSAL
