---
title: "Understanding Embeddings: The Hidden Cost in LLM Applications"
description: "Learn what embeddings are, how they work, and why they're crucial for RAG applications"
date: "2026-01-08"
author: "LLM PriceCheck Team"
tags: ["embeddings", "rag", "advanced"]
---

# Understanding Embeddings: The Hidden Cost in LLM Applications

If you're building RAG (Retrieval-Augmented Generation) applications, embeddings are a critical but often overlooked cost factor.

## What Are Embeddings?

Embeddings are numerical representations of text. They convert words, sentences, or documents into vectors (arrays of numbers) that capture meaning.

**Example:**
- "King" → [0.23, -0.45, 0.67, ...]
- "Queen" → [0.21, -0.43, 0.69, ...]

Words with similar meanings have similar vectors.

## How Embeddings Work

### The Process

1. **Input**: "The quick brown fox"
2. **Tokenization**: Split into tokens
3. **Neural Network**: Process through embedding model
4. **Output**: 1536-dimensional vector (for OpenAI ada-002)

```
[0.023, -0.145, 0.067, 0.342, ..., -0.089]
```

## Why Use Embeddings?

### 1. Semantic Search

Find relevant documents based on meaning, not just keywords:

```javascript
// Traditional search: "machine learning" matches "machine learning"
// Semantic search: "machine learning" matches "AI algorithms" (similar meaning)
```

### 2. RAG Applications

**Architecture:**
```
User Query → Embedding → Vector Search → Retrieved Docs → LLM → Answer
```

### 3. Classification & Clustering

Group similar content automatically.

## Embedding Models Comparison

| Model | Dimensions | Cost/1M tokens | Best For |
|-------|-----------|----------------|----------|
| OpenAI ada-002 | 1536 | $0.10 | General purpose |
| OpenAI ada-003 | 3072 | $0.13 | Higher accuracy |
| Cohere embed | 768 | $0.10 | Multilingual |
| Voyage AI | 1024 | $0.20 | Code/search |

## Cost Analysis

### Embedding Costs

**Scenario**: Embedding 1M documents (avg 500 tokens each)

- **OpenAI ada-002**: 500M tokens × $0.10/1M = **$50**
- **Cohere embed**: 500M tokens × $0.10/1M = **$50**

### Search Costs

**Vector database queries**:
- Pinecone: $0.096/hour for 1M vectors
- Weaviate: Free (self-hosted)
- Qdrant: Free (self-hosted)

### Total RAG Cost Example

**Application**: Customer support with 10K documents, 1000 queries/day

**Setup costs:**
- Embedding 10K docs (5M tokens): $0.50 (one-time)
- Vector DB storage: $20/month

**Query costs:**
- Embed query (100 tokens): $0.00001
- Vector search: $0.000001
- LLM generation: $0.001
- **Total per query: $0.001011**

**Monthly**: 1000 × 30 × $0.001011 = **$30.33**

## Implementation Example

### Using OpenAI Embeddings

```javascript
import { OpenAI } from 'openai';

const openai = new OpenAI();

async function embedText(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text
  });

  return response.data[0].embedding;
}

// Usage
const embedding = await embedText("Your text here");
// Returns: [0.023, -0.145, 0.067, ...]
```

### Vector Search

```javascript
// Using Pinecone
const index = pinecone.Index('my-index');

async function search(query, topK = 5) {
  const queryEmbedding = await embedText(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK: topK,
    includeMetadata: true
  });

  return results.matches;
}
```

### Complete RAG Pipeline

```javascript
async function ragQuery(userQuestion) {
  // 1. Embed the question
  const questionEmbedding = await embedText(userQuestion);

  // 2. Search for relevant documents
  const relevantDocs = await vectorSearch(questionEmbedding, 3);

  // 3. Build context
  const context = relevantDocs.map(d => d.text).join('\n\n');

  // 4. Generate answer
  const prompt = `
    Context: ${context}

    Question: ${userQuestion}

    Answer based on the context above.
  `;

  const response = await llm.generate(prompt);
  return response;
}
```

## Optimization Strategies

### 1. Chunking Strategy

**Bad**: Embed entire documents (1000+ tokens)
**Good**: Chunk into 200-500 token pieces

```javascript
function chunkDocument(text, chunkSize = 400) {
  const words = text.split(' ');
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }

  return chunks;
}
```

### 2. Hybrid Search

Combine keyword + semantic search:

```javascript
const results = await Promise.all([
  vectorSearch(embedding, 10),
  keywordSearch(query, 10)
]);

const combined = [...new Set([...results.vector, ...results.keyword])];
```

### 3. Embedding Caching

Cache embeddings for common queries:

```javascript
const embeddingCache = new Map();

async function getCachedEmbedding(text) {
  const hash = createHash('md5').update(text).digest('hex');

  if (embeddingCache.has(hash)) {
    return embeddingCache.get(hash);
  }

  const embedding = await embedText(text);
  embeddingCache.set(hash, embedding);
  return embedding;
}
```

### 4. Model Selection

**When to use which model:**

- **ada-002**: 90% of use cases
- **ada-003**: Need higher accuracy
- **Cohere**: Multilingual requirements
- **Voyage**: Code search

## Common Pitfalls

### ❌ **Over-embedding**

Embedding everything without filtering:
- Cost: 10× higher
- Solution: Pre-filter with keywords

### ❌ **Wrong chunk size**

Too small = lost context
Too large = poor search results
**Sweet spot**: 200-500 tokens

### ❌ **Ignoring metadata**

Store metadata with embeddings:
```javascript
{
  vector: [...],
  metadata: {
    source: 'doc.pdf',
    category: 'support',
    date: '2024-01-01'
  }
}
```

### ❌ **No re-ranking**

Always re-rank top-k results:
```javascript
const top10 = await vectorSearch(embedding, 10);
const top3 = rerankWithLLM(userQuery, top10);
```

## Cost Comparison: RAG vs No RAG

**Scenario**: Answer 1000 questions about 1000 documents

**Without RAG** (send all docs to LLM):
- 1000 Q × 1000 docs × 500 tokens = 500M tokens
- Cost: $7,500

**With RAG** (retrieve 3 relevant docs):
- Embedding: $50 (one-time)
- 1000 Q × 3 docs × 500 tokens = 1.5M tokens
- Cost: $22.50 + $50 = $72.50

**Savings**: 99%

## When NOT to Use Embeddings

Embeddings aren't always the answer:

❌ **Exact matching** (use traditional search)
❌ **Small document sets** (<100 docs)
❌ **Simple keyword lookup**
❌ **Structured data queries**

## Best Practices Checklist

- [ ] Chunk documents into 200-500 token pieces
- [ ] Store metadata with embeddings
- [ ] Use hybrid search (vector + keyword)
- [ ] Cache common embeddings
- [ ] Re-rank results with LLM
- [ ] Monitor embedding costs monthly
- [ ] Test different chunk sizes
- [ ] Use appropriate embedding model

---

*Ready to optimize your RAG costs? Use our [Cost Calculator](/) to model your embedding and LLM expenses.*
