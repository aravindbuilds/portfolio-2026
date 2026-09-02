// js/rag/retriever.js
// Hybrid BM25 keyword + cosine semantic retrieval. Combines exact phrase
// matching (BM25) with semantic similarity (cosine) for better recall and
// precision than either alone.
import { phraseAwareTokenize, expandQueryTerms } from "./tokenizer.js";

const BM25_K1 = 1.5;  // term frequency saturation
const BM25_B = 0.75;  // document length normalization

// ---- Enrich chunks with semantic tags for better matching ----
// Adds derived content that improves both BM25 and cosine similarity.
function enrichChunksForSearch(chunks) {
  return chunks.map((chunk) => {
    const text = chunk.searchText || chunk.text;
    const lowerText = text.toLowerCase();

    const semanticTags = [];

    // Skill-based tags
    const skillKeywords = [
      "yolo", "sam", "tensorrt", "cuda", "onnx", "fastapi",
      "postgresql", "redis", "docker", "kubernetes", "jetson",
      "python", "c++", "sql", "ml", "ai", "computer vision",
      "deep learning", "nlp", "mcp", "rag", "qlora", "pyndantic",
      "twinlitenetplus", "ros", "rfid", "gps", "iot",
    ];

    skillKeywords.forEach((skill) => {
      if (lowerText.includes(skill)) {
        semanticTags.push(`skill:${skill}`);
      }
    });

    // Entity/location tags
    if (lowerText.includes("tata elxsi")) {
      semanticTags.push("company:tata-elxsi");
      semanticTags.push("experience:enterprise-ai");
    }
    if (lowerText.includes("kerala")) {
      semanticTags.push("location:kerala");
    }
    if (lowerText.includes("rail") || lowerText.includes("safety")) {
      semanticTags.push("domain:rail-safety");
      semanticTags.push("application:safety-critical");
    }

    // Platform/cloud tags
    if (lowerText.includes("aws")) semanticTags.push("cloud:aws");
    if (lowerText.includes("azure")) semanticTags.push("cloud:azure");
    if (lowerText.includes("docker")) semanticTags.push("deployment:docker");
    if (lowerText.includes("kubernetes")) semanticTags.push("deployment:kubernetes");

    // Project type tags
    if (lowerText.includes("perception")) semanticTags.push("project:perception");
    if (lowerText.includes("collision")) semanticTags.push("project:collision-warning");
    if (lowerText.includes("sensor")) semanticTags.push("project:sensor-fusion");
    if (lowerText.includes("agentic")) semanticTags.push("project:agentic-ai");

    return {
      ...chunk,
      semanticTags,
      // Enhanced search text combining original with semantic tags
      searchTextEnhanced: `${text} ${semanticTags.join(" ")}`,
    };
  });
}

// ---- TF-IDF + Cosine helpers ----
function buildIdf(chunks) {
  const docFreq = {};
  chunks.forEach((chunk) => {
    const uniqueTerms = new Set(
      phraseAwareTokenize(chunk.searchTextEnhanced || chunk.searchText || chunk.text)
    );
    uniqueTerms.forEach((t) => { docFreq[t] = (docFreq[t] || 0) + 1; });
  });
  const N = chunks.length;
  return Object.fromEntries(
    Object.entries(docFreq).map(([t, df]) => [t, Math.log((N + 1) / (df + 1))])
  );
}

function buildTfIdfVec(tokens, idf) {
  const tf = {};
  tokens.forEach((t) => { tf[t] = (tf[t] || 0) + 1; });
  const maxTf = Math.max(...Object.values(tf), 1);
  return Object.fromEntries(
    Object.entries(tf).map(([t, f]) => [t, (f / maxTf) * (idf[t] || 0)])
  );
}

function cosineSim(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, magA = 0, magB = 0;
  keys.forEach((k) => {
    dot += (a[k] || 0) * (b[k] || 0);
    magA += (a[k] || 0) ** 2;
    magB += (b[k] || 0) ** 2;
  });
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-9);
}

// ---- BM25 ----
function bm25Score(queryTokens, chunkText, idf, k1 = BM25_K1, b = BM25_B) {
  const tokens = phraseAwareTokenize(chunkText);
  const docLen = tokens.length;

  const termFreq = {};
  for (const token of tokens) {
    termFreq[token] = (termFreq[token] || 0) + 1;
  }

  let score = 0;
  const seen = new Set();

  for (const term of queryTokens) {
    if (seen.has(term)) continue;
    seen.add(term);
    if (!idf[term]) continue;

    const tf = termFreq[term] || 0;
    const idfVal = idf[term];
    const saturation = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * docLen / 50));
    score += idfVal * saturation;
  }

  return score;
}

// ---- Hybrid retrieval ----
// Returns a flat list of chunk objects (heading, parentSection, text, ...)
// ranked by combined BM25 + cosine + phrase-match score. Chunk fields are
// flattened so callers can read them directly without going through .chunk.
export function hybridRetrieveChunks(query, chunks, idf, k = 3, minScore = 0.05) {
  const rawTokens = phraseAwareTokenize(query);
  const expandedTokens = expandQueryTerms(rawTokens);
  const qTokens = phraseAwareTokenize(expandedTokens.join(" "));

  // Phase 1: BM25 keyword scoring
  const bm25Results = chunks
    .map((chunk) => ({
      chunk,
      score: bm25Score(qTokens, chunk.searchTextEnhanced || chunk.searchText || chunk.text, idf),
    }))
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  // Phase 2: Cosine similarity on enriched text
  const enrichedChunks = enrichChunksForSearch(chunks);
  const cosineResults = enrichedChunks
    .map((chunk) => ({
      chunk,
      score: cosineSim(
        buildTfIdfVec(qTokens, idf),
        buildTfIdfVec(phraseAwareTokenize(chunk.searchTextEnhanced), idf)
      ),
    }))
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  // Phase 3: Hybrid scoring
  const scoredResults = new Map();

  bm25Results.forEach((result, idx) => {
    const key = JSON.stringify(result.chunk);
    scoredResults.set(key, {
      chunk: result.chunk,
      bm25Score: result.score,
      cosineScore: 0,
      phraseMatchCount: 0,
      rankSum: idx + 1,
    });
  });

  cosineResults.forEach((result, idx) => {
    const key = JSON.stringify(result.chunk);
    if (!scoredResults.has(key)) {
      scoredResults.set(key, {
        chunk: result.chunk,
        bm25Score: 0,
        cosineScore: result.score,
        phraseMatchCount: 0,
        rankSum: idx + k + 1,
      });
    } else {
      scoredResults.get(key).cosineScore = result.score;
      scoredResults.get(key).rankSum += idx + k + 1;
    }
  });

  // Count phrase matches for additional boosting
  const queryLower = query.toLowerCase();
  chunks.forEach((chunk) => {
    const textLower = (chunk.searchText || chunk.text).toLowerCase();
    const matches = qTokens.filter((term) => textLower.includes(term)).length;
    if (matches > 0) {
      const key = JSON.stringify(chunk);
      if (scoredResults.has(key)) {
        scoredResults.get(key).phraseMatchCount = matches;
      } else {
        scoredResults.set(key, {
          chunk,
          bm25Score: 0,
          cosineScore: 0,
          phraseMatchCount: matches,
          rankSum: chunks.length + 1,
        });
      }
    }
  });

  const hybridResults = Array.from(scoredResults.values())
    .map((result) => {
      const hybridScore =
        result.bm25Score * 0.5 +
        result.cosineScore * 0.3 +
        result.phraseMatchCount * 0.2;
      return {
        ...result,
        finalScore: hybridScore,
        displayScore: hybridScore > 0 ? hybridScore : 0.01,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, k);

  // Flatten chunk fields so downstream callers can read heading /
  // parentSection / text directly without going through .chunk.
  return hybridResults.map((r) => ({
    ...r.chunk,
    bm25Score: r.bm25Score,
    cosineScore: r.cosineScore,
    phraseMatchCount: r.phraseMatchCount,
    finalScore: r.finalScore,
    relevanceScore: r.finalScore,
  }));
}

export { buildIdf };
