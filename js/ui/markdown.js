// Small, safe Markdown subset for model answers.
export function formatMarkdown(value) {
  const escaped = String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const lines = escaped.split(/\r?\n/);
  const output = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      output.push("</ul>");
      listOpen = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      return;
    }
    const bullet = trimmed.match(/^(?:[*+-])\s+(.+)$/);
    if (bullet) {
      if (!listOpen) {
        output.push("<ul>");
        listOpen = true;
      }
      output.push(`<li>${bullet[1]}</li>`);
      return;
    }
    closeList();
    const heading = trimmed.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      output.push(`<h4>${heading[1]}</h4>`);
      return;
    }
    output.push(`<p>${trimmed}</p>`);
  });
  closeList();

  return output.join("")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}
