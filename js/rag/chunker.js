// js/rag/chunker.js
// Splits markdown into semantic chunks. Handles three levels:
//   ## h2  → one parent chunk per top-level section
//   ### h3 → one chunk per h3 (sub-section within an h2)
//   #### h4 → one chunk per h4 (sub-project within an h3)
// h4 chunks include the parent h3 heading as context. h3 chunks include the
// parent h2 heading as context. Chrome sections (Usage Notes, Contact) are dropped.

const CHROME_HEADINGS = new Set(["usage notes", "contact"]);
const CONTACT_HEADER_RE = /^[A-Z][^|]+\|\s*\+\d[\d\s|]+@[\w.-]+/;

function buildText(lines) {
  return lines
    .filter((l) => !/^#{1,4}\s+/.test(l)) // strip heading lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Splits a block of lines by the next heading at a given level.
// Returns { headLines, sections } where sections is [{ heading, level, lines }].
function splitByHeading(lines, level) {
  const marker = "#".repeat(level) + " ";
  const sections = [];
  let current = null;
  lines.forEach((line) => {
    if (line.startsWith(marker) && !line.startsWith(marker + "#")) {
      if (current) sections.push(current);
      current = { heading: line.slice(marker.length).trim(), level, lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  });
  if (current) sections.push(current);
  return sections;
}

export function buildChunks(markdown) {
  const rawSections = markdown.split(/(?=^## )/m);
  const chunks = [];

  rawSections.forEach((rawText) => {
    if (!rawText.trim()) return;
    const lines = rawText.split("\n");
    const firstLine = lines[0].trim();
    if (!/^## /.test(firstLine)) return; // skip preamble (before first ##)

    const h2Heading = firstLine.slice(3).trim();
    if (CHROME_HEADINGS.has(h2Heading.toLowerCase())) return;

    // Split h2 block by ### h3
    const h2BodyLines = lines.slice(1); // lines after the ## heading line
    const h3Sections = splitByHeading(h2BodyLines, 3);

    if (h3Sections.length === 0) {
      // No h3 children — emit the h2 itself as a chunk
      const body = buildText(h2BodyLines);
      if (body.length > 30 && !CONTACT_HEADER_RE.test(body.split("\n")[0])) {
        chunks.push({
          heading: h2Heading,
          headingLevel: 2,
          parentSection: null,
          text: body,
          searchText: `${h2Heading}\n\n${body}`,
        });
      }
      return;
    }

    h3Sections.forEach((h3sec) => {
      // Split h3 block by #### h4
      const h4Sections = splitByHeading(h3sec.lines, 4);

      if (h4Sections.length > 0) {
        // This h3 has sub-projects → emit each h4 as its own chunk
        h4Sections.forEach((h4sec) => {
          const body = buildText(h4sec.lines);
          if (body.length <= 20) return;
          chunks.push({
            heading: h4sec.heading,
            headingLevel: 4,
            parentSection: h3sec.heading,
            text: body,
            searchText: `${h2Heading} > ${h3sec.heading} > ${h4sec.heading}\n\n${body}`,
          });
        });
      } else {
        // No h4 children → emit h3 as its own chunk
        const body = buildText(h3sec.lines);
        if (body.length <= 20) return;
        if (CONTACT_HEADER_RE.test(body.split("\n")[0])) return;
        chunks.push({
          heading: h3sec.heading,
          headingLevel: 3,
          parentSection: h2Heading,
          text: body,
          searchText: `${h2Heading} > ${h3sec.heading}\n\n${body}`,
        });
      }
    });
  });

  return chunks;
}
