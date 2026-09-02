// js/rag/synonyms.js
// Preserves entity meaning like "Tata Elxsi", "computer vision", etc.
// Extract key phrases from the profile markdown to prevent tokenization
// from splitting them into meaningless single tokens.
export const PHRASE_DICTIONARY = new Set([
  "tata elxsi", "computer vision", "artificial intelligence", "machine learning",
  "deep learning", "sensor fusion", "edge deployment", "collision warning",
  "rtsp streaming", "gstreamer pipeline", "redis caching", "postgresql",
  "azure postgresql", "fastapi flask", "mlflow", "qlora", "pyndantic",
  "nvidia jetson", "nvidia tensorrt", "cuda kernel", "twinlitenetplus",
  "you only look once", "segment anything", "robot operating system",
  "optical character recognition", "vision language model", "tata elxsi",
  "collision warning system", "sensor fusion pipeline", "real-time perception",
  "model context protocol", "retrieval augmented generation", "quantized low-rank",
]);

// Acronym & synonym dictionary. Expands common AI/ML acronyms and terms
// for broader matching.
export const SYNONYM_DICT = {
  // Acronym expansions
  "ml": ["machine learning"],
  "ai": ["artificial intelligence"],
  "cv": ["computer vision"],
  "nlp": ["natural language processing"],
  "rl": ["reinforcement learning"],
  "qlora": ["quantized low-rank adaptation"],
  "tfidf": ["term frequency inverse document frequency"],
  "rag": ["retrieval augmented generation"],
  "mcp": ["model context protocol"],
  "llm": ["large language model"],
  "gpu": ["graphics processing unit"],
  "cpu": ["central processing unit"],
  "api": ["application programming interface"],

  // Domain synonyms
  "yolo": ["you only look once", "object detection"],
  "sam": ["segment anything model"],
  "tensorrt": ["nvidia tensorrt"],
  "onnx": ["open neural network exchange"],
  "fastapi": ["fast api"],
  "flask": ["flask framework"],
  "ros": ["robot operating system"],
  "postgres": ["postgresql"],
  "sqlite": ["sqlite3"],
  "rfid": ["radio frequency identification"],
  "gps": ["global positioning system"],
  "iot": ["internet of things"],
};
