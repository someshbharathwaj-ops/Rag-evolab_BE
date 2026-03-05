export function extractSources(content) {
  if (!content) return [];

  const sources = [];
  const seen = new Set();

  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let markdownMatch = markdownLinkRegex.exec(content);
  while (markdownMatch) {
    const label = markdownMatch[1].trim() || markdownMatch[2];
    const url = markdownMatch[2].trim();
    if (!seen.has(url)) {
      sources.push({ label, url });
      seen.add(url);
    }
    markdownMatch = markdownLinkRegex.exec(content);
  }

  const plainUrlRegex = /(https?:\/\/[^\s)]+)/g;
  let plainMatch = plainUrlRegex.exec(content);
  while (plainMatch) {
    const url = plainMatch[1].trim();
    if (!seen.has(url)) {
      sources.push({ label: url, url });
      seen.add(url);
    }
    plainMatch = plainUrlRegex.exec(content);
  }

  return sources;
}
