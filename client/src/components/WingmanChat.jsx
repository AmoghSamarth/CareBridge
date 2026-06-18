import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWingman } from '../context/WingmanContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, ArrowLeft, Send, Calendar, Zap } from 'lucide-react';

const STEPS = [
  {
    id: 1, key: 'hairType',
    q: 'What is your\nhair type?',
    sub: 'Select the choice that matches your natural hair structure.',
    options: ['Straight', 'Wavy', 'Curly', 'Coily'],
    emoji: ['🧑', '🌊', '🌀', '✨'],
  },
  {
    id: 2, key: 'groomFrequency',
    q: 'How often do\nyou groom?',
    sub: 'Wingman calculates when your next trim is due.',
    options: ['Weekly', 'Bi-weekly', 'Monthly', 'Rarely'],
    emoji: ['⚡', '🗓️', '📅', '😴'],
  },
  {
    id: 4, key: 'priority',
    q: 'What matters\nmost to you?',
    sub: 'Choose the style goal that defines your look.',
    options: ['Confidence', 'Routine', 'First Impressions', 'Looking Fresh'],
    emoji: ['💪', '🔁', '👀', '✨'],
  },
  {
    id: 5, key: 'budgetRange',
    q: 'What is your\nbudget range?',
    sub: 'We filter Nagpur professionals in this price tier.',
    options: ['100-300', '300-600', '600-1200', '1200+'],
    emoji: ['💸', '💵', '💰', '👑'],
    prefix: '₹',
    format: (v) => '₹' + v.replace('-', '–'),
  },
];

const EVENT_TYPES = ['Interview', 'Wedding', 'Date Night', 'Festival', 'Party', 'Other'];
const EVENT_EMOJI = { Interview: '💼', Wedding: '💒', 'Date Night': '💖', Festival: '🎆', Party: '🎉', Other: '📅' };

const QUICK_REPLIES = [
  'Suggest a haircut',
  'Book for my event',
  "Who's available today",
  "What's trending in Nagpur",
];

export default function WingmanChat({ onCollapse }) {
  const { user } = useAuth();
  const {
    onboardingComplete, onboardingStep, onboardingData, messages, isTyping,
    setOnboardingStep, updateOnboardingData, completeOnboarding, sendUserMessage
  } = useWingman();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputVal.trim() || isTyping) return;
    sendUserMessage(inputVal.trim());
    setInputVal('');
  };

  const handleQuickReply = (text) => {
    if (isTyping) return;
    sendUserMessage(text);
  };

  const isEventStep = onboardingStep === 3;
  const currentStepData = STEPS.find(s => s.id === onboardingStep);

  const canProceed = () => {
    if (onboardingStep === 1) return !!onboardingData.hairType;
    if (onboardingStep === 2) return !!onboardingData.groomFrequency;
    if (onboardingStep === 3) return !!onboardingData.upcomingEvent?.eventType;
    if (onboardingStep === 4) return !!onboardingData.priority;
    if (onboardingStep === 5) return !!onboardingData.budgetRange;
    return false;
  };

  const getValue = (step) => {
    if (step === 1) return onboardingData.hairType;
    if (step === 2) return onboardingData.groomFrequency;
    if (step === 4) return onboardingData.priority;
    if (step === 5) return onboardingData.budgetRange;
    return null;
  };

  const setValue = (step, val) => {
    if (step === 1) updateOnboardingData('hairType', val);
    if (step === 2) updateOnboardingData('groomFrequency', val);
    if (step === 4) updateOnboardingData('priority', val);
    if (step === 5) updateOnboardingData('budgetRange', val);
  };

  if (!onboardingComplete) {
    return (
      <div style={{
        width: '100%', maxWidth: '560px', margin: '0 auto',
        background: 'var(--bg-card)', border: '3px solid #1A1A1A',
        boxShadow: '8px 8px 0 #1A1A1A',
      }}>
        {/* Top bar */}
        <div style={{
          background: '#1A1A1A', padding: '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} strokeWidth={2.5} color="#F5C842" />
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px', color: '#F5C842', letterSpacing: '0.1em' }}>
              WINGMAN SETUP
            </span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: i <= onboardingStep ? '24px' : '8px', height: '8px',
                background: i <= onboardingStep ? '#F5C842' : '#333',
                borderRadius: '4px', transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', color: '#666', letterSpacing: '0.06em' }}>
            {onboardingStep} / 5
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 28px 24px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={onboardingStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              {!isEventStep && currentStepData && (
                <>
                  <h2 style={{
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
                    fontSize: 'clamp(22px, 4vw, 30px)', color: 'var(--text-primary)',
                    lineHeight: 1.2, marginBottom: '8px', whiteSpace: 'pre-line',
                    letterSpacing: '-0.02em',
                  }}>
                    {currentStepData.q}
                  </h2>
                  <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', fontWeight: 600, marginBottom: '28px', lineHeight: 1.5 }}>
                    {currentStepData.sub}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {currentStepData.options.map((opt, i) => {
                      const selected = getValue(onboardingStep) === opt;
                      return (
                        <button key={opt} onClick={() => setValue(onboardingStep, opt)}
                          style={{
                            padding: '18px 12px', border: '2.5px solid #1A1A1A',
                            background: selected ? '#F5C842' : 'var(--bg-card)',
                            boxShadow: selected ? '4px 4px 0 #1A1A1A' : '3px 3px 0 #1A1A1A',
                            transform: selected ? 'translate(-2px,-2px)' : '',
                            cursor: 'pointer', transition: 'all 0.12s',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                          }}
                          onMouseEnter={e => { if (!selected) { e.currentTarget.style.transform='translate(-1px,-1px)'; e.currentTarget.style.background='#FFF8F0'; }}}
                          onMouseLeave={e => { if (!selected) { e.currentTarget.style.transform=''; e.currentTarget.style.background='var(--bg-card)'; }}}
                        >
                          <span style={{ fontSize: '24px', lineHeight: 1 }}>{currentStepData.emoji[i]}</span>
                          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                            {currentStepData.format ? currentStepData.format(opt) : opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {isEventStep && (
                <>
                  <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 'clamp(22px, 4vw, 30px)', color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                    Any upcoming{'\n'}events?
                  </h2>
                  <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', fontWeight: 600, marginBottom: '24px' }}>
                    Wingman will make sure you look your absolute best.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                    {EVENT_TYPES.map(evt => {
                      const sel = onboardingData.upcomingEvent?.eventType === evt;
                      return (
                        <button key={evt} onClick={() => updateOnboardingData('upcomingEvent', { ...onboardingData.upcomingEvent, eventType: evt })}
                          style={{
                            padding: '14px 8px', border: '2px solid #1A1A1A',
                            background: sel ? '#F5C842' : 'var(--bg-card)',
                            boxShadow: sel ? '3px 3px 0 #1A1A1A' : '2px 2px 0 #1A1A1A',
                            transform: sel ? 'translate(-1px,-1px)' : '',
                            cursor: 'pointer', transition: 'all 0.12s',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                          }}>
                          <span style={{ fontSize: '20px' }}>{EVENT_EMOJI[evt]}</span>
                          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>{evt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                      <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} /> Event Date (optional)
                    </p>
                    <input type="date"
                      value={onboardingData.upcomingEvent?.eventDate || ''}
                      onChange={e => updateOnboardingData('upcomingEvent', { ...onboardingData.upcomingEvent, eventDate: e.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-card)', border: '2.5px solid #1A1A1A', padding: '12px 14px', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '13px', outline: 'none', colorScheme: 'light', color: 'var(--text-primary)' }}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        <div style={{ padding: '16px 28px 24px', borderTop: '2.5px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)' }}>
          {onboardingStep > 1 ? (
            <button onClick={() => setOnboardingStep(onboardingStep - 1)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#6B6B6B', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', cursor: 'pointer', padding: '8px 0' }}>
              <ArrowLeft size={14} strokeWidth={2.5} /> BACK
            </button>
          ) : <div />}

          {onboardingStep < 5 ? (
            <button onClick={() => setOnboardingStep(onboardingStep + 1)}
              disabled={!canProceed()}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: canProceed() ? '#F5C842' : '#eee',
                border: '2.5px solid #1A1A1A', color: '#1A1A1A',
                padding: '12px 24px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
                fontSize: '12px', letterSpacing: '0.06em', cursor: canProceed() ? 'pointer' : 'not-allowed',
                boxShadow: canProceed() ? '4px 4px 0 #1A1A1A' : 'none',
                transition: 'all 0.12s', opacity: canProceed() ? 1 : 0.4,
              }}
              onMouseEnter={e => { if (canProceed()) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = canProceed() ? '4px 4px 0 #1A1A1A' : 'none'; }}
            >
              NEXT <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          ) : (
            <button onClick={completeOnboarding}
              disabled={!onboardingData.budgetRange}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#2EC4B6', border: '2.5px solid #1A1A1A', color: '#1A1A1A',
                padding: '12px 24px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
                fontSize: '12px', letterSpacing: '0.06em', cursor: 'pointer',
                boxShadow: '4px 4px 0 #1A1A1A', transition: 'all 0.12s',
                opacity: onboardingData.budgetRange ? 1 : 0.4,
              }}
              onMouseEnter={e => { if (onboardingData.budgetRange) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A'; }}
            >
              MEET WINGMAN <Sparkles size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Chat view (post-onboarding) ──
  return (
    <div style={{
      width: '100%', maxWidth: '680px', margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 200px)', minHeight: '480px',
      background: 'var(--bg-card)', border: '3px solid #1A1A1A',
      boxShadow: '8px 8px 0 #1A1A1A', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ background: '#1A1A1A', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ width: '40px', height: '40px', background: '#F5C842', border: '2px solid #F5C842', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
          <Sparkles size={20} strokeWidth={2.5} color="#1A1A1A" />
        </div>
        <div>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px', color: '#F5C842', margin: 0, letterSpacing: '0.08em' }}>WINGMAN</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', background: '#2EC4B6', borderRadius: '50%' }} />
            <p style={{ fontFamily: 'Inter', fontSize: '10px', color: '#aaa', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active · AI Companion</p>
          </div>
        </div>
        {onCollapse && (
          <button 
            onClick={onCollapse} 
            style={{
              marginLeft: 'auto',
              background: '#F5C842',
              border: '2px solid #1A1A1A',
              color: '#1A1A1A',
              padding: '6px 12px',
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 800,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              boxShadow: '2.5px 2.5px 0 #000',
              transition: 'transform 0.1s, box-shadow 0.1s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translate(-1.5px, -1.5px)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #000';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '2.5px 2.5px 0 #000';
            }}
          >
            ▲ Collapse
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#FFF8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && !isTyping && (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✦</div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#6B6B6B' }}>Wingman is ready. Ask me anything!</p>
          </div>
        )}
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
              {!isUser && (
                <div style={{ width: '28px', height: '28px', background: '#F5C842', border: '2px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', flexShrink: 0, marginRight: '8px', marginTop: '4px' }}>
                  <Sparkles size={13} strokeWidth={2.5} color="#1A1A1A" />
                </div>
              )}
              <div style={{
                maxWidth: '78%', padding: '12px 16px',
                background: isUser ? '#1A1A1A' : '#F5C842',
                border: '2px solid #1A1A1A',
                boxShadow: '3px 3px 0 #1A1A1A',
                fontFamily: 'Inter', fontSize: '14px', fontWeight: 500,
                color: isUser ? '#FFF8F0' : '#1A1A1A', lineHeight: 1.6,
              }}>
                {msg.text || (msg.isStreaming ? '' : '')}
                {msg.isStreaming && (
                  <span style={{ display: 'inline-block', width: '2px', height: '16px', background: '#1A1A1A', marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 1.2s step-end infinite' }} />
                )}
              </div>
            </div>
          );
        })}
        {isTyping && !messages.some(m => m.isStreaming) && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', background: '#F5C842', border: '2px solid #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', flexShrink: 0 }}>
              <Sparkles size={13} strokeWidth={2.5} color="#1A1A1A" />
            </div>
            <div style={{ background: '#F5C842', border: '2px solid #1A1A1A', boxShadow: '3px 3px 0 #1A1A1A', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', color: '#1A1A1A', letterSpacing: '0.06em' }}>THINKING</span>
              {[0, 150, 300].map((d, i) => (
                <span key={i} style={{ width: '6px', height: '6px', background: '#1A1A1A', borderRadius: '50%', animation: 'bounce 0.6s infinite', animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick reply chips */}
      <div style={{ padding: '10px 16px 4px', background: 'var(--bg-card)', borderTop: '1.5px solid rgba(26,26,26,0.1)', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
        {QUICK_REPLIES.map(qr => (
          <button
            key={qr}
            onClick={() => handleQuickReply(qr)}
            disabled={isTyping}
            style={{
              background: 'var(--bg-card)', border: '1.5px solid #1A1A1A', color: 'var(--text-primary)',
              padding: '5px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px',
              letterSpacing: '0.04em', cursor: isTyping ? 'not-allowed' : 'pointer',
              boxShadow: '2px 2px 0 #1A1A1A', transition: 'all 0.1s',
              opacity: isTyping ? 0.4 : 1,
            }}
            onMouseEnter={e => { if (!isTyping) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.background = '#F5C842'; e.currentTarget.style.boxShadow = '3px 3px 0 #1A1A1A'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.boxShadow = '2px 2px 0 #1A1A1A'; }}
          >
            <Zap size={10} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {qr}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 16px', borderTop: '2.5px solid #1A1A1A', background: 'var(--bg-card)', display: 'flex', gap: '10px', flexShrink: 0 }}>
        <input
          type="text" value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask Wingman anything..."
          style={{ flex: 1, background: 'var(--bg-card)', border: '2.5px solid #1A1A1A', color: 'var(--text-primary)', padding: '12px 16px', fontFamily: 'Inter', fontSize: '14px', outline: 'none', boxShadow: '3px 3px 0 #1A1A1A' }}
        />
        <button onClick={handleSend} disabled={!inputVal.trim() || isTyping}
          style={{ background: '#F5C842', border: '2.5px solid #1A1A1A', color: '#1A1A1A', padding: '12px 16px', cursor: 'pointer', boxShadow: '3px 3px 0 #1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!inputVal.trim() || isTyping) ? 0.4 : 1, transition: 'all 0.12s' }}
          onMouseEnter={e => { if (inputVal.trim() && !isTyping) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 #1A1A1A'; }}}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #1A1A1A'; }}
        >
          <Send size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}