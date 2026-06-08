import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function WingmanChatMockup() {
  const [showTyping, setShowTyping] = useState(false);
  const [msg2, setMsg2] = useState(false);
  const [userMsg, setUserMsg] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setUserMsg(true), 1200);
    const t2 = setTimeout(() => setShowTyping(true), 2200);
    const t3 = setTimeout(() => { setShowTyping(false); setMsg2(true); }, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const WAvatar = () => (
    <div style={{
      width: '32px', height: '32px', borderRadius: '50%',
      background: '#F03E7A', border: '2px solid #1A1A1A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#fff' }}>W</span>
    </div>
  );

  return (
    <div style={{
      width: '100%',
      maxWidth: '360px',
      background: '#FFFFFF',
      border: '2.5px solid #1A1A1A',
      borderRadius: '20px',
      boxShadow: '8px 8px 0 #1A1A1A',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: '#1A1A1A',
        borderRadius: '18px 18px 0 0',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2EC4B6' }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', letterSpacing: '0.1em', color: '#F5C842' }}>
            WINGMAN
          </span>
        </div>
        {/* Mac dots */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#FF5F57','#FFBD2E','#28C840'].map((c,i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.3)' }} />
          ))}
        </div>
      </div>

      {/* Chat body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '200px', justifyContent: 'flex-end' }}>
        {/* Wingman msg 1 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <WAvatar />
          <div style={{
            background: '#F5C842',
            border: '2px solid #1A1A1A',
            borderRadius: '0 16px 16px 16px',
            boxShadow: '3px 3px 0 #1A1A1A',
            padding: '12px 16px',
            maxWidth: '85%',
            fontFamily: 'Inter',
            fontSize: '14px',
            color: '#1A1A1A',
          }}>
            Your Infosys interview is in 5 days, Arjun. You're due for a trim. 💇
          </div>
        </div>

        {/* User message */}
        {userMsg && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              background: '#1A1A1A',
              border: '2px solid #1A1A1A',
              borderRadius: '16px 0 16px 16px',
              padding: '12px 16px',
              maxWidth: '85%',
              fontFamily: 'Inter',
              fontSize: '14px',
              color: '#FFFFFF',
            }}>
              Show me a top stylist in Dharampeth for tomorrow.
            </div>
          </motion.div>
        )}

        {/* Typing */}
        {showTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <WAvatar />
            <div style={{
              background: '#F5C842', border: '2px solid #1A1A1A',
              borderRadius: '0 16px 16px 16px', boxShadow: '3px 3px 0 #1A1A1A',
              padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '14px' }}>
                {[0,1,2].map(i => (
                  <motion.span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1A1A1A', display: 'block' }}
                    animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Wingman msg 2 */}
        {msg2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <WAvatar />
            <div style={{
              background: '#F5C842',
              border: '2px solid #1A1A1A',
              borderRadius: '0 16px 16px 16px',
              boxShadow: '3px 3px 0 #1A1A1A',
              padding: '12px 16px',
              maxWidth: '85%',
              fontFamily: 'Inter',
              fontSize: '14px',
              color: '#1A1A1A',
            }}>
              Ravi in Dharampeth — 4.9⭐, slot tomorrow at 6pm. Book it? ✓
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div style={{
        background: '#FAE8D8',
        borderTop: '2px solid #1A1A1A',
        borderRadius: '0 0 18px 18px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <input
          readOnly
          placeholder="Ask Wingman anything..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: 'Inter',
            fontSize: '14px',
            color: '#6B6B6B',
          }}
        />
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: '#F5C842', border: '2px solid #1A1A1A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M6 1l5 5-5 5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '80px 40px 80px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '64px', flexWrap: 'wrap' }}>

        {/* Left 55% */}
        <div style={{ flex: '1 1 420px', maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Badge */}
          <span style={{
            display: 'inline-block',
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: '#FAE8D8',
            border: '2px solid #1A1A1A',
            borderRadius: '999px',
            padding: '6px 16px',
            color: '#1A1A1A',
            width: 'fit-content',
          }}>
            ✦ AI Grooming Companion
          </span>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: 800,
            fontSize: 'clamp(42px, 5.5vw, 68px)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#1A1A1A',
            margin: 0,
          }}>
            When life gets busy,{' '}
            <span style={{ color: '#F03E7A' }}>care comes to you.</span>
          </h1>

          {/* Body */}
          <p style={{
            fontFamily: 'Inter',
            fontSize: '18px',
            color: '#6B6B6B',
            lineHeight: 1.6,
            maxWidth: '440px',
          }}>
            Wingman knows your schedule, reminds you to groom, and books the right professional — before you even think about it.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/auth')}
              style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px',
                color: '#1A1A1A', background: '#F5C842',
                border: '2.5px solid #1A1A1A', borderRadius: '12px',
                boxShadow: '4px 4px 0 #1A1A1A',
                padding: '16px 32px', cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='6px 6px 0 #1A1A1A'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 #1A1A1A'; }}
            >
              MEET YOUR WINGMAN
            </button>
            <button
              onClick={() => navigate('/auth')}
              style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px',
                color: '#1A1A1A', background: '#2EC4B6',
                border: '2.5px solid #1A1A1A', borderRadius: '12px',
                boxShadow: '4px 4px 0 #1A1A1A',
                padding: '16px 32px', cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='6px 6px 0 #1A1A1A'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 #1A1A1A'; }}
            >
              BROWSE PROFESSIONALS
            </button>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px' }}>
            <div style={{ display: 'flex' }}>
              {['#F03E7A', '#2EC4B6', '#9B8FE8'].map((bg, i) => (
                <div key={i} style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: bg, border: '2px solid #1A1A1A',
                  marginLeft: i === 0 ? 0 : '-8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 3 - i,
                }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px', color: '#fff' }}>
                    {['A','P','R'][i]}
                  </span>
                </div>
              ))}
            </div>
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '14px', color: '#1A1A1A' }}>
              Trusted by 500+ Nagpur residents
            </span>
          </div>
        </div>

        {/* Right 45% */}
        <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
          <WingmanChatMockup />
        </div>
      </div>
    </section>
  );
}
