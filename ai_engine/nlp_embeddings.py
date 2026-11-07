"""
AICTE Sanyojika - NLP Semantic Similarity Embedding Generator
Calculates term-frequency vector embeddings and cosine similarity scores
for incoming complaints to detect cross-bureau overlaps.
"""

import math
import re
from typing import Dict, List, Set, Tuple

STOPWORDS: Set[str] = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
    "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "me", "more",
    "most", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
    "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "should", "so",
    "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then",
    "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom",
    "why", "with", "would", "you", "your", "yours", "yourself", "yourselves"
}


def tokenize(text: str) -> List[str]:
    """Tokenize narrative string into normalized lowercase alphanumeric words."""
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    tokens = [t for t in cleaned.split() if len(t) > 2 and t not in STOPWORDS]
    return tokens


def build_term_frequencies(tokens: List[str]) -> Dict[str, float]:
    """Calculate normalized term frequencies."""
    tf: Dict[str, float] = {}
    if not tokens:
        return tf
    for t in tokens:
        tf[t] = tf.get(t, 0.0) + 1.0
    total = float(len(tokens))
    for t in tf:
        tf[t] = tf[t] / total
    return tf


def compute_cosine_similarity(vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
    """Compute cosine similarity between two term frequency dictionaries."""
    if not vec1 or not vec2:
        return 0.0
    common_keys = set(vec1.keys()).intersection(set(vec2.keys()))
    if not common_keys:
        return 0.0
    
    dot_product = sum(vec1[k] * vec2[k] for k in common_keys)
    norm1 = math.sqrt(sum(v * v for v in vec1.values()))
    norm2 = math.sqrt(sum(v * v for v in vec2.values()))
    
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return round(dot_product / (norm1 * norm2), 4)


def evaluate_complaint_overlap(text_a: str, text_b: str) -> Tuple[float, List[str]]:
    """
    Evaluates semantic overlap between two complaints and returns:
    (similarity_score, top_overlapping_keywords)
    """
    tokens_a = tokenize(text_a)
    tokens_b = tokenize(text_b)
    
    vec_a = build_term_frequencies(tokens_a)
    vec_b = build_term_frequencies(tokens_b)
    
    score = compute_cosine_similarity(vec_a, vec_b)
    common_words = sorted(
        list(set(tokens_a).intersection(set(tokens_b))),
        key=lambda w: vec_a.get(w, 0) + vec_b.get(w, 0),
        reverse=True
    )
    return score, common_words[:10]
