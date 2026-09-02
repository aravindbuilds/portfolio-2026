// js/rag/tokenizer.js
import { PHRASE_DICTIONARY, SYNONYM_DICT } from "./synonyms.js";

// Tokenizes text while preserving multi-word phrases as single tokens.
// This prevents "Tata Elxsi" from becoming ["tata", "elxsi"].
export function phraseAwareTokenize(str) {
  const lower = str.toLowerCase();
  const tokens = [];
  let i = 0;

  while (i < lower.length) {
    let matched = false;

    // Try to match longest multi-word phrase first
    const sortedPhrases = Array.from(PHRASE_DICTIONARY).sort(
      (a, b) => b.length - a.length
    );

    for (const phrase of sortedPhrases) {
      const phraseLen = phrase.length;
      // Check if phrase matches at current position
      if (lower.slice(i, i + phraseLen) === phrase) {
        tokens.push(phrase);
        i += phraseLen;
        matched = true;
        break;
      }
    }

    if (matched) continue;

    // Fallback: extract single alphanumeric word
    const match = lower.slice(i).match(/[a-z0-9]+/);
    if (match) {
      tokens.push(match[0]);
      i += match[0].length;
    } else {
      i++;
    }
  }

  return tokens;
}

// Adds semantic expansions so "ml" searches also match "machine learning".
export function expandQueryTerms(terms) {
  const expanded = new Set();

  for (const term of terms) {
    // Always include the original term
    expanded.add(term);

    // Check for acronym expansion (lowercase lookup)
    const lower = term.toLowerCase();
    if (SYNONYM_DICT[lower]) {
      for (const syn of SYNONYM_DICT[lower]) {
        expanded.add(syn);
      }
    }

    // Reverse lookup: if term is a value, add the key
    for (const [key, values] of Object.entries(SYNONYM_DICT)) {
      if (values.includes(term) && !expanded.has(key)) {
        expanded.add(key);
      }
    }
  }

  return Array.from(expanded);
}
