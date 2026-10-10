import React, { useState, useEffect } from 'react';
import { askPolicyAssistant, ingestDocument, fetchIngestedDocuments } from '../api/aiApi';

/**
 * PolicyAssistant Component (Module 2 RAG)
 * Retrieval-Augmented Generation assistant that queries ingested store policies
 * from PgVector and returns grounded answers with exact source citations.
 */
function PolicyAssistant() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [ragResult, setRagResult] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(null);

  // Quick sample policy questions
  const SAMPLE_QUESTIONS = [
    'Can I return an opened laptop?',
    'What are the standard shipping transit times?',
    'What is the warranty coverage on products?',
    'Is store credit offered for returned items?'
  ];

  useEffect(() => {
    loadVectorDocs();
  }, []);

  const loadVectorDocs = async () => {
    const list = await fetchIngestedDocuments();
    setDocuments(list);
  };

  const handleAskPolicy = async (e, customQ) => {
    if (e) e.preventDefault();
    const qToAsk = customQ || question;
    if (!qToAsk.trim()) return;

    setLoading(true);
    setRagResult(null);

    const result = await askPolicyAssistant(qToAsk);
    setRagResult(result);
    setLoading(false);
  };

  const handleSimulateIngest = async (e) => {
    e.preventDefault();
    setIngesting(true);
    setIngestSuccess(null);

    const res = await ingestDocument({});
    setIngesting(false);
    setIngestSuccess(res);
    loadVectorDocs();
  };

  return (
    <div className="policy-container">
      {/* RAG Policy Assistant Header */}
      <div className="rag-banner">
        <div className="rag-badge font-mono">⚡ Module 2 · Spring AI PgVector RAG</div>
        <h2>Policy & Document AI Assistant</h2>
        <p>Ask questions about returns, shipping, or warranty. Answers are retrieved strictly from vector store documents with source citations.</p>
        
        <div className="rag-stats">
          <span>📚 Vector Knowledge Base: <strong>{documents.length} Policy Files Indexing Active</strong></span>
          <button className="btn-ingest-open" onClick={() => setShowIngestModal(true)}>
            + Ingest New Policy PDF
          </button>
        </div>
      </div>

      {/* Question Form & Quick Samples */}
      <div className="policy-input-card">
        <form onSubmit={handleAskPolicy} className="ai-form">
          <input
            type="text"
            className="ai-input"
            placeholder="e.g. Can I return an opened laptop within 14 days?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" className="btn-rag-submit" disabled={loading || !question.trim()}>
            {loading ? 'Searching RAG...' : 'Query Vector Store 🔍'}
          </button>
        </form>

        <div className="quick-prompts">
          <span className="prompt-label">Quick Policy Questions:</span>
          <div className="chips-wrapper">
            {SAMPLE_QUESTIONS.map((qText, index) => (
              <button
                key={index}
                className="chip-btn chip-rag"
                onClick={() => {
                  setQuestion(qText);
                  handleAskPolicy(null, qText);
                }}
              >
                📜 "{qText}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="ai-loading-box">
          <div className="rag-pulse"></div>
          <p>Performing vector similarity search across PgVector embeddings...</p>
        </div>
      )}

      {/* RAG Result Rendering */}
      {ragResult && !loading && (
        <div className="rag-result-card">
          <div className="rag-result-header">
            <h3>📖 Grounded AI Response</h3>
            <span className={`confidence-badge ${ragResult.confidence?.toLowerCase()}`}>
              Confidence: <strong>{ragResult.confidence}</strong>
            </span>
          </div>

          <div className="answer-body">
            <p>{ragResult.answer}</p>
          </div>

          {/* Citation Sources */}
          {ragResult.sources && ragResult.sources.length > 0 && (
            <div className="sources-section">
              <h4>🔍 Retrieved Document Citations ({ragResult.sources.length})</h4>
              <div className="sources-list">
                {ragResult.sources.map((src, i) => (
                  <div key={i} className="source-item">
                    <div className="source-icon">📄</div>
                    <div className="source-info">
                      <strong>{src.document}</strong>
                      <span className="source-section">{src.section}</span>
                    </div>
                    <span className="source-version">v{src.version}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vector Store Documents List */}
      <div className="vector-docs-card">
        <h3>📂 Indexed Knowledge Base Documents</h3>
        <div className="docs-table-wrapper">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>File Size</th>
                <th>Status</th>
                <th>Vector Chunks</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td><strong>📄 {doc.name}</strong></td>
                  <td>{doc.size}</td>
                  <td><span className="status-indexed">✔ {doc.status}</span></td>
                  <td><code>{doc.vectorChunks} vectors</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Ingestion Modal */}
      {showIngestModal && (
        <div className="modal-backdrop" onClick={() => setShowIngestModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📥 Ingest Policy PDF / Markdown into RAG Vector Store</h3>
              <button className="close-modal" onClick={() => setShowIngestModal(false)}>✕</button>
            </div>

            {ingestSuccess ? (
              <div className="modal-success">
                <div className="success-icon">✅</div>
                <h4>Document Vectorized & Ingested!</h4>
                <p>{ingestSuccess.message}</p>
                <div className="order-summary-box">
                  <p><strong>Ingested Vectors:</strong> {ingestSuccess.vectorCount} chunks</p>
                  <p><strong>Vector Table:</strong> <code>vector_store</code> in PostgreSQL</p>
                </div>
                <button className="btn-primary modal-done-btn" onClick={() => setShowIngestModal(false)}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSimulateIngest} className="modal-form">
                <div className="file-dropzone">
                  <div className="dropzone-icon">📁</div>
                  <p>Upload policy PDF or Markdown document</p>
                  <span className="dropzone-sub">Accepts .pdf, .md, .txt (e.g. return-policy.pdf)</span>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowIngestModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={ingesting}>
                    {ingesting ? 'Chunking & Embedding...' : 'Start Ingestion 🚀'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PolicyAssistant;
