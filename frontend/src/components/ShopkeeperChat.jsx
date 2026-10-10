import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Store, X, RotateCcw, ArrowUpRight } from 'lucide-react';
import { INITIAL_GREETING, QUICK_PROMPTS } from '../data/shopkeeperBrain';
import { askShopkeeper } from '../api/aiApi';

export const ShopkeeperChat = ({
  isOpen,
  onClose,
  onAddToCart
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
          text: "I'm right here at the counter! Feel free to ask about any product in our shop.",
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
    <div className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-white dark:bg-[#1A261D] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-2xl shadow-2xl flex flex-col text-[#2C3625] dark:text-[#FEF9F0] overflow-hidden transition-all duration-200">
      {/* Header: Reads "Ask the Shopkeeper" */}
      <div className="p-4 bg-white dark:bg-[#2C3625] border-b border-[#2C3625]/10 dark:border-[#FEF9F0]/15 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F28482] text-white flex items-center justify-center shadow-xs">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm tracking-tight text-[#2C3625] dark:text-[#FEF9F0]">
              Ask the Shopkeeper
            </h3>
            <p className="text-xs text-[#2C3625]/80 dark:text-[#FEF9F0]/80">
              Online • ShopSmart Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-full text-[#2C3625]/75 dark:text-[#FEF9F0]/75 hover:text-[#2C3625] dark:hover:text-[#FEF9F0] hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D] transition-colors cursor-pointer"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#2C3625]/75 dark:text-[#FEF9F0]/75 hover:text-[#2C3625] dark:hover:text-[#FEF9F0] hover:bg-[#FEF9F0] dark:hover:bg-[#1A261D] transition-colors cursor-pointer"
            title="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FEF9F0]/40 dark:bg-[#1A261D]/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1 mb-1 text-xs text-[#2C3625]/75 dark:text-[#FEF9F0]/75 px-1">
                <span>{isUser ? 'You' : 'Shopkeeper'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Chat Bubbles */}
              <div
                className={`max-w-[85%] text-xs sm:text-sm leading-relaxed p-3.5 shadow-xs transition-colors ${
                  isUser
                    ? 'bg-[#84A59D] text-white dark:bg-[#F28482] dark:text-white rounded-2xl rounded-tr-xs'
                    : 'bg-[#F9DC5C] text-[#2C3625] dark:bg-[#2C3625] dark:text-[#FEF9F0] rounded-2xl rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line font-medium">{msg.text}</p>

                {/* Recommended Products */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-[#FEF9F0]/15 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#2C3625]/85 dark:text-[#FEF9F0]/85">
                      Recommended for you:
                    </p>
                    <div className="space-y-2">
                      {msg.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-white/90 dark:bg-[#1A261D] rounded-xl p-2 border border-black/10 dark:border-[#FEF9F0]/15 flex items-center gap-2.5 text-[#2C3625] dark:text-[#FEF9F0]"
                        >
                          <Link to={`/product/${prod.id}`} onClick={onClose} className="shrink-0">
                            <img
                              src={prod.image || prod.imageUrl}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${prod.id}`}
                              onClick={onClose}
                              className="font-display text-xs sm:text-sm font-semibold truncate block hover:text-[#F28482]"
                            >
                              {prod.name}
                            </Link>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="font-display text-xs font-bold tabular-nums text-[#E07A5F]">
                                ${prod.price}
                              </span>
                              <button
                                onClick={() => onAddToCart(prod)}
                                className="px-3 py-1 rounded-full bg-[#F28482] hover:bg-[#E57371] text-white text-xs font-semibold transition-colors cursor-pointer"
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
            <p className="text-xs font-semibold text-[#2C3625]/80 dark:text-[#FEF9F0]/80 uppercase tracking-wider px-1">
              Quick Suggestions:
            </p>
            <div className="flex flex-col gap-1.5">
              {QUICK_PROMPTS.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendInquiry(prompt)}
                  className="text-left text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-[#2C3625] border border-[#2C3625]/10 dark:border-[#FEF9F0]/15 text-[#2C3625] dark:text-[#FEF9F0] hover:border-[#F28482] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#2C3625]/60 dark:text-[#FEF9F0]/60 group-hover:text-[#F28482]" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white dark:bg-[#2C3625] border-t border-[#2C3625]/10 dark:border-[#FEF9F0]/15 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSubmitting}
            placeholder="Type your message..."
            className="flex-1 py-2 px-3.5 bg-[#FEF9F0] dark:bg-[#1A261D] border border-[#2C3625]/15 dark:border-[#FEF9F0]/20 rounded-full text-xs sm:text-sm text-[#2C3625] dark:text-[#FEF9F0] placeholder-[#2C3625]/60 dark:placeholder-[#FEF9F0]/60 focus:outline-none focus:border-[#F28482]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className="p-2 rounded-full bg-[#F28482] hover:bg-[#E57371] disabled:opacity-50 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
