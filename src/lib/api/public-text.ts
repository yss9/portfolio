// Only paragraph text leaves the private editor. Links, embeds, files and HTML
// attributes are intentionally outside the public snapshot format.
export function publicParagraphs(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.flatMap((block) => {
    if (!block || block.type !== "paragraph") return [];
    if (typeof block.content === "string")
      return block.content.trim() ? [block.content.trim()] : [];
    if (!Array.isArray(block.content)) return [];
    const text = block.content
      .map((i: { type?: string; text?: string }) =>
        i.type === "text" && typeof i.text === "string" ? i.text : "",
      )
      .join("")
      .trim();
    return text ? [text] : [];
  });
}
