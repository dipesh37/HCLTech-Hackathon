import React, { useState, useRef, useEffect } from 'react';
import { Send, ShoppingBag, RotateCcw, X, MessageSquare, ArrowUpRight, Check } from 'lucide-react';
import { INITIAL_GREETING, QUICK_PROMPTS } from '../data/shopkeeperBrain';
import { askShopkeeper } from '../api/aiApi';

export const ShopkeeperChat = ({
  isOpen,
  onClose,
  onAddToCart,
  onOpenQuickView
}) => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'shopkeeper',
      text: INITIAL_GREETING,
      recommendedProducts: [],
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendInquiry = async (textToSend) => {
    const text = textToSend.trim();
    if (!text || isSubmitting) return;

    const userMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSubmitting(true);

    try {
      const reply = await askShopkeeper(text);
      const shopkeeperMessage = {
        id: `msg-sk-${Date.now()}`,
        sender: 'shopkeeper',
        text: reply.text,
        recommendedProducts: reply.recommendedProducts || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, shopkeeperMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sk-${Date.now()}`,
          sender: 'shopkeeper',
          text: "I'm right here at the counter! Feel free to ask about our apothecary tinctures, beauty oils, modular laptops, or linen clothes.",
          recommendedProducts: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendInquiry(inputValue);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'shopkeeper',
        text: INITIAL_GREETING,
        recommendedProducts: [],
        timestamp: 'Just now'
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#FEF9F0] dark:bg-[#1A261D] border-l border-[#2C3625]/15 dark:border-[#FEF9F0]/20 shadow-2xl flex flex-col text-[#2C3625] dark:text-[#FEF9F0] transition-colors">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/images/shopkeeper_avatar.jpg"
              alt="Clara - Resident Curator"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#F28482]"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#84A59D] border-2 border-white dark:border-[#2C3625]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
                Clara
              </h2>
              <span className="text-[10px] font-semibold text-[#84A59D] bg-[#84A59D]/15 px-1.5 py-0.2 rounded-full">
                Shopkeeper
              </span>
            </div>
            <p className="text-[11px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60">
              At the Counter • ShopSmart
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-full text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625] dark:hover:text-[#FEF9F0] hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D]"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#2C3625]/60 dark:text-[#FEF9F0]/60 hover:text-[#2C3625] dark:hover:text-[#FEF9F0] hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D]"
            title="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#2C3625]/60 dark:text-[#FEF9F0]/60 px-1">
                <span>{isUser ? 'You' : 'Clara'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] text-xs leading-relaxed p-3.5 shadow-xs ${
                  isUser
                    ? 'bg-[#84A59D] text-[#FEF9F0] rounded-2xl rounded-tr-xs'
                    : 'bg-white dark:bg-[#2C3625] text-[#2C3625] dark:text-[#FEF9F0] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 rounded-2xl rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 space-y-2">
                    <p className="text-[10px] font-bold text-[#2C3625] dark:text-[#FEF9F0] uppercase tracking-wider">
                      Recommended:
                    </p>
                    <div className="space-y-2">
                      {msg.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-[#FEF9F0] dark:bg-[#1A261D] rounded-xl p-2 border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center gap-2.5"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-[#2C3625] dark:text-[#FEF9F0] truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-xs font-bold text-[#F28482]">
                                ${prod.price}
                              </span>
                              <button
                                onClick={() => onAddToCart(prod)}
                                className="px-2 py-0.5 rounded-full bg-[#F28482] text-[#FEF9F0] text-[10px] font-bold"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {messages.length === 1 && (
          <div className="pt-2 space-y-2">
            <p className="text-[11px] font-semibold text-[#2C3625]/60 dark:text-[#FEF9F0]/60 uppercase tracking-wider px-1">
              Ask about our inventory:
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                "Which facial oil is best for sensitive skin?",
                "Tell me about the Chamomile tincture",
                "What is the best laptop for café writing?",
                "How are the linen shirts washed?"
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendInquiry(prompt)}
                  className="text-left text-xs px-3 py-2 rounded-xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-[#2C3625] dark:text-[#FEF9F0] hover:border-[#F28482] transition-colors flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#2C3625]/50 dark:text-[#FEF9F0]/50 group-hover:text-[#F28482]" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white dark:bg-[#2C3625] border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ask Clara about any product..."
            className="flex-1 py-2 px-3.5 bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-full text-xs text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/45 dark:placeholder-[#FEF9F0]/45 focus:outline-none focus:border-[#F28482]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className="p-2 rounded-full bg-[#F28482] hover:bg-[#E57371] disabled:opacity-50 text-[#FEF9F0] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
