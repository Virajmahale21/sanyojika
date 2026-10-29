import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { X, Send, Sparkles, BookOpen, ExternalLink, Bot, User } from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
  suggestedActions?: { label: string; url: string }[];
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं एआईसीटीई सारथी हूँ। मैं अनुमोदन प्रक्रिया पुस्तिका (APH 2026-27), दस्तावेज़ आवश्यकताओं, संकाय अनुपात और निरीक्षण नियमों के बारे में आपकी सहायता कर सकता हूँ।'
          : language === 'mr'
          ? 'नमस्कार! मी एआयसीटीई सारथी आहे. मी मंजुरी प्रक्रिया पुस्तिका (APH २०२६-२७), आवश्यक कागदपत्रे, प्राध्यापक निकष आणि ईव्हीसी तपासणी नियमांबाबत मार्गदर्शन करू शकतो.'
          : 'Greetings! I am AICTE Saarthi, your intelligent administrative guide. I can assist you with Approval Process Handbook (APH 2026-27) regulations, document checklists, and application workflow status.',
      citations: ['AICTE Approval Process Handbook (APH) 2026-27'],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickChips = [
    { labelEn: 'Fire NOC Norms', labelHi: 'अग्नि एनओसी नियम', labelMr: 'अग्निशमन NOC नियम', q: 'What are the Fire NOC norms?' },
    { labelEn: 'Faculty Cadre Ratio', labelHi: 'संकाय कैडर अनुपात', labelMr: 'प्राध्यापक प्रमाण निकष', q: 'Explain faculty cadre ratio requirements' },
    { labelEn: 'EVC Inspection Protocol', labelHi: 'ईवीसी निरीक्षण नियम', labelMr: 'ईव्हीसी तपासणी पद्धत', q: 'What is the EVC inspection process?' },
  ];

  const handleSend = async (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: q,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAi(q, language);
      if (res.success && res.data) {
        const botMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: res.data.answer,
          citations: res.data.citations,
          suggestedActions: res.data.suggestedActions,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: 'Unable to reach regulatory knowledge base. Please consult the published APH 2026-27 handbook directly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 bg-opacity-40 transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-gov-navy text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gov-blue flex items-center justify-center border border-amber-300">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{t('aiAssistant.title')}</h3>
                <p className="text-[10px] text-amber-200">{t('aiAssistant.subtitle')}</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Query Chips */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.q)}
                className="text-[11px] bg-white border border-slate-300 hover:border-gov-blue hover:text-gov-blue rounded-full px-2.5 py-1 text-slate-700 transition"
              >
                {language === 'hi' ? chip.labelHi : language === 'mr' ? chip.labelMr : chip.labelEn}
              </button>
            ))}
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex space-x-2.5 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gov-blue text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded p-3 ${
                    msg.sender === 'user'
                      ? 'bg-gov-blue text-white font-medium'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                  {/* Regulatory Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 space-y-1">
                      <div className="font-semibold text-slate-600 flex items-center">
                        <BookOpen className="w-3 h-3 mr-1 text-gov-blue" />
                        {t('aiAssistant.citationsLabel')}
                      </div>
                      {msg.citations.map((c, i) => (
                        <div key={i} className="italic text-slate-600">
                          • {c}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Portal Action Buttons */}
                  {msg.suggestedActions && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <a
                          key={i}
                          href={action.url}
                          className="inline-flex items-center text-[10px] bg-white border border-gov-blue text-gov-blue hover:bg-blue-50 px-2 py-0.5 rounded font-medium"
                        >
                          <span>{action.label}</span>
                          <ExternalLink className="w-2.5 h-2.5 ml-1" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                <span>{t('aiAssistant.analyzing')}</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('aiAssistant.placeholder')}
                className="flex-1 border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gov-blue"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-gov-blue text-white px-3 py-2 rounded text-xs hover:bg-blue-700 disabled:opacity-50 transition flex items-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
