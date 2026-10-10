import React, { useState, useRef, useEffect } from 'react';
import { Send, ShoppingBag, RotateCcw, Compass, ArrowUpRight, Check } from 'lucide-react';
import { INITIAL_GREETING, QUICK_PROMPTS } from '../data/shopkeeperBrain';
import { askShopkeeper } from '../api/aiApi';

export const ShopkeeperChat = ({
  onAddToCart,
  onOpenQuickView,
  pendingInquiry,
  onClearPendingInquiry
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

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle inquiry sent from catalog ("Ask Shopkeeper about this item")
  useEffect(() => {
    if (pendingInquiry) {
      handleSendInquiry(pendingInquiry);
      onClearPendingInquiry();
    }
  }, [pendingInquiry]);

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
      // Direct call to shopkeeper knowledge / API (NO fake typing indicators)
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
          text: "I'm right here at the counter! Feel free to ask about any of our laptops, keyboards, or workspace essentials.",
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

  return (
    <aside className="w-full h-full flex flex-col bg-[#FDFBF7] border border-[#3D405B]/20 rounded-2xl overflow-hidden shadow-sm">
      {/* Pinned Shopkeeper Header */}
      <div className="bg-[#F4F1DE] border-b border-[#3D405B]/20 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="/images/shopkeeper_avatar.jpg"
              alt="Clara - Resident Curator"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#E07A5F]"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#81B29A] border-2 border-[#F4F1DE]" title="At the counter" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif-boutique text-sm font-bold text-[#3D405B]">
                Clara
              </h2>
              <span className="text-[10px] font-semibold text-[#81B29A] bg-[#81B29A]/15 px-1.5 py-0.2 rounded">
                Resident Curator
              </span>
            </div>
            <p className="text-[11px] text-[#5C5F79]">
              At the Counter • ShopSmart Atelier
            </p>
          </div>
        </div>

        {/* Reset Chat Button */}
        <button
          onClick={handleResetChat}
          className="p-1.5 rounded-lg text-[#5C5F79] hover:text-[#3D405B] hover:bg-[#FDFBF7] border border-transparent hover:border-[#3D405B]/15 transition-all text-xs flex items-center gap-1"
          title="Start fresh conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFBF7]">
        {/* Curated Neighborhood Notice */}
        <div className="p-3 rounded-xl bg-[#F4F1DE]/70 border border-[#3D405B]/15 text-xs text-[#5C5F79] leading-relaxed">
          <p className="font-medium text-[#3D405B] mb-0.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Honest, human advice</span>
          </p>
          <span>Ask me for battery life realities, keyboard comparisons, café portability, or warranty details. No pressure, just good craft.</span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Sender label & timestamp */}
              <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#5C5F79] px-1">
                <span>{isUser ? 'You' : 'Clara'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble strictly conforming to color rules:
                  Shopkeeper messages align left (background #F4F1DE, text #3D405B)
                  User messages align right (background #81B29A, text #FDFBF7) */}
              <div
                className={`max-w-[88%] text-xs leading-relaxed p-3.5 shadow-xs ${
                  isUser
                    ? 'bg-[#81B29A] text-[#FDFBF7] rounded-2xl rounded-tr-xs'
                    : 'bg-[#F4F1DE] text-[#3D405B] border border-[#3D405B]/15 rounded-2xl rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Recommended Products in Shopkeeper message */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#3D405B]/15 space-y-2">
                    <p className="text-[11px] font-semibold text-[#3D405B] uppercase tracking-wide">
                      Items from the shelves:
                    </p>
                    <div className="space-y-2">
                      {msg.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-[#FDFBF7] rounded-lg p-2.5 border border-[#3D405B]/20 flex items-center gap-3 transition-colors hover:border-[#3D405B]/40"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded object-cover border border-[#3D405B]/15 bg-[#F4F1DE] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif-boutique text-xs font-bold text-[#3D405B] truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-bold text-[#E07A5F]">
                                ${prod.price}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onOpenQuickView(prod)}
                                  className="text-[10px] text-[#5C5F79] hover:text-[#3D405B] underline"
                                >
                                  Specs
                                </button>
                                <button
                                  onClick={() => onAddToCart(prod)}
                                  className="px-2 py-1 rounded bg-[#E07A5F] hover:bg-[#D26A4E] text-[#FDFBF7] text-[10px] font-medium flex items-center gap-1"
                                >
                                  <ShoppingBag className="w-3 h-3 text-[#FDFBF7]" />
                                  <span>Add</span>
                                </button>
                              </div>
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

        {/* Quick prompt suggestions when only initial message exists */}
        {messages.length === 1 && (
          <div className="pt-2 space-y-2">
            <p className="text-[11px] font-medium text-[#5C5F79] uppercase tracking-wider px-1">
              Popular shop inquiries:
            </p>
            <div className="flex flex-col gap-1.5">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendInquiry(prompt)}
                  className="text-left text-xs px-3 py-2 rounded-lg bg-[#F4F1DE] hover:bg-[#EAE4CC] border border-[#3D405B]/20 text-[#3D405B] transition-colors flex items-center justify-between group"
                >
                  <span className="line-clamp-1">{prompt}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#5C5F79] group-hover:text-[#E07A5F] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form at Bottom */}
      <div className="p-3 bg-[#F4F1DE] border-t border-[#3D405B]/20 shrink-0">
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isSubmitting}
            placeholder="Ask Clara anything about the products..."
            className="flex-1 py-2.5 pl-3.5 pr-10 bg-[#FDFBF7] border border-[#3D405B]/25 rounded-xl text-xs text-[#3D405B] placeholder-[#7E8199] focus:outline-none focus:border-[#E07A5F] focus:ring-1 focus:ring-[#E07A5F] transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSubmitting}
            className="px-3.5 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D26A4E] disabled:bg-[#D8D1BD] text-[#FDFBF7] transition-all flex items-center justify-center shrink-0 shadow-xs"
            title="Send to Clara"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5 text-[#FDFBF7]" />
          </button>
        </form>
        <p className="text-[10px] text-[#5C5F79] mt-2 text-center">
          Warm Oat & Sage • Clara will package and inspect all items by hand
        </p>
      </div>
    </aside>
  );
};
