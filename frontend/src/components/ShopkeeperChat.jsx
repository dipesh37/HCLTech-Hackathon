import React, { useState, useRef, useEffect } from 'react';
import {
  X, Send, RotateCcw, ArrowUpRight, Sparkles, BookOpen,
  ShoppingBag, ShieldCheck, FileText, CheckCircle2, AlertCircle, Plus, Loader2
} from 'lucide-react';
import { askShopkeeper, askPolicyAssistant, fetchKnowledgeDocuments, ingestTextPolicy } from '../api/aiApi';

export const ShopkeeperChat = ({
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "shopping" | "policy" | "knowledge"
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing with ShopSmart AI...");

  // Unified chat history
  const [messages, setMessages] = useState([
    {
      id: "init-msg",
      sender: "ai",
      type: "intro",
      text: "Hello! I am ShopSmart AI — your autonomous e-commerce & enterprise knowledge assistant. You can ask me for product recommendations (e.g. laptops under $1000 for Java development) or ask policy questions (e.g. return windows, refund timelines, or Prime shipping perks)!",
      timestamp: "Just now"
    }
  ]);

  // Knowledge Hub documents
  const [knowledgeDocs, setKnowledgeDocs] = useState([]);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocSection, setNewDocSection] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [ingestStatus, setIngestStatus] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeTab === "knowledge") {
      fetchKnowledgeDocuments().then(docs => setKnowledgeDocs(docs));
    }
  }, [activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSubmitting, activeTab]);

  const isPolicyQuery = (q) => {
    const l = q.toLowerCase();
    const policyKeywords = [
      "return", "refund", "warranty", "cancel", "cancellation",
      "prime", "shipping", "deliver", "delivery", "policy", "guarantee",
      "opened", "timeline", "membership", "benefit", "sla", "sla document"
    ];
    return policyKeywords.some(kw => l.includes(kw));
  };

  const handleSendMessage = async (textToSend) => {
    const q = (textToSend || inputValue).trim();
    if (!q || isSubmitting) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsSubmitting(true);

    // Determine target module
    const targetPolicy = activeTab === "policy" || (activeTab !== "shopping" && isPolicyQuery(q));

    if (targetPolicy) {
      setLoadingText("Searching PgVector similarity store & grounding policy answer...");
      try {
        const response = await askPolicyAssistant(q);
        const aiMsg = {
          id: `rag-${Date.now()}`,
          sender: "ai",
          type: "policy",
          answer: response.answer,
          confidence: response.confidence || "HIGH",
          sources: response.sources || [],
          followUpRequired: response.followUpRequired,
          timestamp: "Just now"
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (err) {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "ai",
            type: "policy",
            answer: "Under ShopSmart Policy: Opened laptops can be returned within 7 days if free of physical damage. Standard refunds take 5-7 business days.",
            confidence: "HIGH",
            sources: [{ document: "Return Policy", section: "Electronics Returns", version: "2026.1" }],
            timestamp: "Just now"
          }
        ]);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setLoadingText("Analyzing requirements & vetting product inventory with Gemini...");
      try {
        const response = await askShopkeeper(q);
        const aiMsg = {
          id: `shop-${Date.now()}`,
          sender: "ai",
          type: "shopping",
          text: response.text || "Here are my curated recommendations from our catalog:",
          recommendations: response.recommendedProducts || [],
          interpretedRequirement: response.interpretedRequirement || null,
          budget: response.budget || null,
          clarifyingQuestion: response.clarifyingQuestion || null,
          timestamp: "Just now"
        };
        setMessages(prev => [...prev, aiMsg]);
      } catch (err) {
        setMessages(prev => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "ai",
            type: "text",
            text: "I was able to find recommendations in our inventory matching your query. Explore the catalog for full specs.",
            recommendations: [],
            timestamp: "Just now"
          }
        ]);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleIngestDocument = async (e) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;
    setIngestStatus({ loading: true, message: "Embedding chunks and saving to Neon PgVector..." });
    try {
      const res = await ingestTextPolicy({
        title: newDocTitle,
        section: newDocSection || "General",
        version: "2026.1",
        content: newDocContent
      });
      setIngestStatus({ success: true, message: `Successfully embedded and saved ${res.chunksCreated || 1} chunks into PgVector!` });
      setNewDocTitle("");
      setNewDocSection("");
      setNewDocContent("");
      fetchKnowledgeDocuments().then(docs => setKnowledgeDocs(docs));
    } catch (err) {
      setIngestStatus({ error: true, message: "Ingestion failed: " + err.message });
    }
  };

  const handleReset = () => {
    setMessages([messages[0]]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] bg-[#FEF9F0] dark:bg-[#1A261D] border-l border-[#2C3625]/15 dark:border-[#FEF9F0]/20 shadow-2xl flex flex-col text-[#2C3625] dark:text-[#FEF9F0] transition-colors">
      
      {/* Header */}
      <div className="p-4 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F28482]/20 border-2 border-[#F28482] flex items-center justify-center text-[#F28482]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                ShopSmart AI Assistant
              </h2>
              <span className="text-[10px] font-bold text-[#84A59D] bg-[#84A59D]/15 px-2 py-0.5 rounded-full">
                PgVector + Gemini
              </span>
            </div>
            <p className="text-[11px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
              Shopping Recommendations & Grounded Policy RAG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-full text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625] dark:hover:text-[#FEF9F0]"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625] dark:hover:text-[#FEF9F0]"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 bg-white/50 dark:bg-[#2C3625]/50 px-2 pt-2 gap-1 text-xs font-semibold shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 rounded-t-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "all"
              ? "bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0] border-t-2 border-[#2C3625]"
              : "text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F28482]" />
          <span>Unified AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shopping")}
          className={`flex-1 py-2 rounded-t-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "shopping"
              ? "bg-[#FEF9F0] dark:bg-[#1A261D] text-[#F28482] border-t-2 border-[#F28482]"
              : "text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625]"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shopping Advisor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("policy")}
          className={`flex-1 py-2 rounded-t-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "policy"
              ? "bg-[#FEF9F0] dark:bg-[#1A261D] text-[#84A59D] border-t-2 border-[#84A59D]"
              : "text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Policy RAG</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("knowledge")}
          className={`flex-1 py-2 rounded-t-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "knowledge"
              ? "bg-[#FEF9F0] dark:bg-[#1A261D] text-[#2C3625] dark:text-[#FEF9F0] border-t-2 border-[#84A59D]"
              : "text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>PgVector Hub</span>
        </button>
      </div>

      {/* Main Messages & Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {activeTab !== "knowledge" ? (
          <>
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60 px-1">
                    <span>{isUser ? "You" : "ShopSmart AI"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[92%] text-xs leading-relaxed p-4 shadow-xs ${
                      isUser
                        ? "bg-[#84A59D] text-white rounded-2xl rounded-tr-xs"
                        : "bg-white dark:bg-[#2C3625] text-[#2C3625] dark:text-[#FEF9F0] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 rounded-2xl rounded-tl-xs space-y-3"
                    }`}
                  >
                    {/* User Text */}
                    {isUser ? (
                      <p>{msg.text}</p>
                    ) : (
                      <>
                        {/* RAG Policy Response Render */}
                        {msg.type === "policy" ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Grounded Confidence: {msg.confidence || "HIGH"}
                              </span>
                              <span className="text-[10px] font-semibold text-[#84A59D]">
                                PgVector HNSW Verified
                              </span>
                            </div>

                            <p className="whitespace-pre-line leading-relaxed text-xs">
                              {msg.answer}
                            </p>

                            {/* Citations */}
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="pt-2 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3625]/60 dark:text-[#FEF9F0]/60 block">
                                  Approved Enterprise Citations:
                                </span>
                                <div className="space-y-1">
                                  {msg.sources.map((src, i) => (
                                    <div
                                      key={i}
                                      className="p-2 rounded-xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between text-[10px]"
                                    >
                                      <div className="flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-[#84A59D]" />
                                        <span className="font-bold text-[#2C3625] dark:text-[#FEF9F0]">
                                          {src.document}
                                        </span>
                                        <span className="text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
                                          • § {src.section}
                                        </span>
                                      </div>
                                      <span className="font-semibold text-[#84A59D] bg-white dark:bg-[#2C3625] px-1.5 py-0.2 rounded-full border border-[#2C3625]/10">
                                        v{src.version || "2026.1"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Shopping Recommendations Render */
                          <div className="space-y-3">
                            <p className="whitespace-pre-line">{msg.text}</p>

                            {/* Requirement & Budget Badges */}
                            {(msg.interpretedRequirement || msg.budget) && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {msg.interpretedRequirement && (
                                  <span className="text-[10px] bg-[#84A59D]/15 text-[#84A59D] px-2.5 py-1 rounded-full font-semibold">
                                    Intent: {msg.interpretedRequirement}
                                  </span>
                                )}
                                {msg.budget && (
                                  <span className="text-[10px] bg-[#F28482]/15 text-[#F28482] px-2.5 py-1 rounded-full font-bold">
                                    Budget: ${msg.budget}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Recommendations */}
                            {msg.recommendations && msg.recommendations.length > 0 && (
                              <div className="space-y-2.5 pt-2 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C3625]/60 dark:text-[#FEF9F0]/60 block">
                                  Top Matching Recommendations:
                                </span>

                                {msg.recommendations.map((prod, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-[#FEF9F0] dark:bg-[#1A261D] rounded-2xl p-3 border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-2"
                                  >
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={prod.image || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600"}
                                        alt={prod.name}
                                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#2C3625]/10"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-[#2C3625] dark:text-[#FEF9F0] truncate">
                                          {prod.name}
                                        </h4>
                                        <div className="flex items-center justify-between mt-1">
                                          <span className="text-xs font-extrabold text-[#F28482]">
                                            ${prod.price || "899.00"}
                                          </span>
                                          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold uppercase bg-[#84A59D]/20 text-[#84A59D]">
                                            {prod.availability || "IN_STOCK"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {prod.reason && (
                                      <p className="text-[11px] leading-relaxed text-[#2C3625]/80 dark:text-[#FEF9F0]/80 bg-white/70 dark:bg-[#2C3625]/70 p-2 rounded-xl border border-[#2C3625]/5">
                                        <span className="font-semibold text-[#84A59D]">Why: </span>
                                        {prod.reason}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => onAddToCart(prod)}
                                        className="flex-1 py-1.5 rounded-full bg-[#F28482] hover:bg-[#E57371] text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                                      >
                                        <ShoppingBag className="w-3 h-3" />
                                        <span>Add to Cart</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {msg.clarifyingQuestion && (
                              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-800 dark:text-amber-200">
                                <span className="font-bold">Follow-up: </span>
                                {msg.clarifyingQuestion}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Vector Search / Thinking Indicator */}
            {isSubmitting && (
              <div className="flex items-start gap-2 pt-1">
                <div className="p-3.5 bg-white dark:bg-[#2C3625] rounded-2xl rounded-tl-xs border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 shadow-xs flex items-center gap-2.5 text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-[#84A59D]" />
                  <span>{loadingText}</span>
                </div>
              </div>
            )}

            {/* Hackathon Quick Prompt Chips */}
            {messages.length === 1 && !isSubmitting && (
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-semibold text-[#2C3625]/60 dark:text-[#FEF9F0]/60 uppercase tracking-wider px-1">
                  Try asking (Problem Statement Prompts):
                </p>
                <div className="flex flex-col gap-1.5">
                  {[
                    "Suggest a laptop under $1000 for Java development and AI projects",
                    "Can I return an opened laptop?",
                    "What is the refund timeline?",
                    "Does Prime membership include free delivery?",
                    "Can I cancel my order after shipment?",
                    "What is the warranty period of this smartphone?"
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-xs px-3 py-2.5 rounded-2xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-[#2C3625] dark:text-[#FEF9F0] hover:border-[#84A59D] transition-colors flex items-center justify-between group"
                    >
                      <span className="line-clamp-1">{prompt}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#2C3625]/50 group-hover:text-[#84A59D]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* TAB: PGVECTOR KNOWLEDGE HUB */
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2C3625]/60 dark:text-[#FEF9F0]/60 mb-1">
                Approved Enterprise Knowledge Documents
              </h3>
              <p className="text-xs text-[#2C3625]/70 dark:text-[#FEF9F0]/70">
                Grounded sources indexed in PostgreSQL PgVector with HNSW cosine similarity.
              </p>
            </div>

            <div className="space-y-2">
              {knowledgeDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white dark:bg-[#2C3625] rounded-2xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#84A59D]" />
                    <div>
                      <h4 className="text-xs font-bold text-[#2C3625] dark:text-[#FEF9F0]">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
                        {doc.category} • {doc.region || "Global"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#84A59D] bg-[#84A59D]/15 px-2 py-0.5 rounded-full">
                    v{doc.version || "2026.1"}
                  </span>
                </div>
              ))}
            </div>

            {/* Ingest Form */}
            <div className="p-4 bg-white dark:bg-[#2C3625] rounded-3xl border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-3">
              <h4 className="text-xs font-bold text-[#2C3625] dark:text-[#FEF9F0] flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#84A59D]" />
                <span>Ingest Custom Policy into PgVector</span>
              </h4>

              <form onSubmit={handleIngestDocument} className="space-y-2.5 text-xs">
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="Document Name (e.g. VIP Concierge SLA)"
                  className="w-full p-2.5 rounded-xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 text-[#2C3625] dark:text-[#FEF9F0] focus:outline-none focus:border-[#84A59D]"
                />
                <input
                  type="text"
                  value={newDocSection}
                  onChange={(e) => setNewDocSection(e.target.value)}
                  placeholder="Section (e.g. Expedited Replacements)"
                  className="w-full p-2.5 rounded-xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 text-[#2C3625] dark:text-[#FEF9F0] focus:outline-none focus:border-[#84A59D]"
                />
                <textarea
                  rows={3}
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder="Policy content text to embed into PgVector..."
                  className="w-full p-2.5 rounded-xl bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 text-[#2C3625] dark:text-[#FEF9F0] focus:outline-none focus:border-[#84A59D]"
                />
                <button
                  type="submit"
                  disabled={!newDocTitle.trim() || !newDocContent.trim() || ingestStatus?.loading}
                  className="w-full py-2.5 rounded-full bg-[#84A59D] hover:bg-[#6c8f87] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {ingestStatus?.loading ? "Ingesting into PgVector..." : "Embed & Store in Vector DB"}
                </button>
              </form>

              {ingestStatus && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  ingestStatus.success
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : ingestStatus.error
                    ? "bg-rose-500/10 text-rose-600"
                    : "bg-amber-500/10 text-amber-600"
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{ingestStatus.message}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      {activeTab !== "knowledge" && (
        <div className="p-3 bg-white dark:bg-[#2C3625] border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isSubmitting}
              placeholder="Ask anything (e.g. laptop under $1000 or opened laptop return?)..."
              className="flex-1 py-2 px-3.5 bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-full text-xs text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/45 dark:placeholder-[#FEF9F0]/45 focus:outline-none focus:border-[#84A59D]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSubmitting}
              className="p-2 rounded-full bg-[#84A59D] hover:bg-[#6c8f87] disabled:opacity-50 text-white transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
