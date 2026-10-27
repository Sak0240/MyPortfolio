function Inline({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : part
  );
}

/** Paragraphs and "- " bullet lists with **bold**. Built from elements, never from raw HTML. */
export default function RichText({ text }) {
  const blocks = [];
  let list = null;
  for (const line of text.split("\n")) {
    const bullet = line.match(/^\s*[-•*]\s+(.*)$/);
    if (bullet) {
      if (!list) {
        list = { type: "ul", items: [] };
        blocks.push(list);
      }
      list.items.push(bullet[1]);
    } else {
      list = null;
      if (line.trim()) blocks.push({ type: "p", text: line });
    }
  }
  return blocks.map((b, i) =>
    b.type === "ul" ? (
      <ul key={i}>
        {b.items.map((item, j) => (
          <li key={j}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    ) : (
      <p key={i}>
        <Inline text={b.text} />
      </p>
    )
  );
}
