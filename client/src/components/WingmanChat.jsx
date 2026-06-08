import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWingman } from '../context/WingmanContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, ArrowRight, ArrowLeft, Send } from 'lucide-react';

export default function WingmanChat() {
  const { user } = useAuth();
  const {
    onboardingComplete,
    onboardingStep,
    onboardingData,
    messages,
    isTyping,
    setOnboardingStep,
    updateOnboardingData,
    completeOnboarding,
    sendUserMessage
  } = useWingman();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendUserMessage(inputVal);
    setInputVal('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const nextStep = () => setOnboardingStep(onboardingStep + 1);
  const prevStep = () => setOnboardingStep(onboardingStep - 1);

  if (!onboardingComplete) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white border-3 border-dark p-6 sm:p-8 shadow-brutal rounded-none relative">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-dark" strokeWidth={2.5} />
            <span className="font-display font-extrabold text-sm tracking-widest text-dark uppercase">WINGMAN SETUP</span>
          </div>
          <span className="text-xs font-display font-bold text-muted uppercase">Step {onboardingStep} of 5</span>
        </div>

        {/* Onboarding screens container */}
        <div className="min-h-[280px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {onboardingStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <h2 className="font-display font-extrabold text-2xl mb-2 text-dark">WHAT IS YOUR HAIR TYPE?</h2>
                <p className="text-xs font-sans font-bold text-muted mb-6 uppercase">Select the choice that matches your natural hair structure.</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Straight', 'Wavy', 'Curly', 'Coily'].map((type) => {
                    const isSelected = onboardingData.hairType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateOnboardingData('hairType', type)}
                        className={`py-4 px-6 border-3 border-dark font-display font-bold text-sm transition-all duration-150 rounded-none cursor-pointer ${
                          isSelected
                            ? 'bg-yellow text-dark shadow-[4px_4px_0px_#1A1A1A] translate-x-[-2px] translate-y-[-2px]'
                            : 'bg-white text-dark shadow-[2px_2px_0px_#1A1A1A] hover:bg-cream hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {onboardingStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <h2 className="font-display font-extrabold text-2xl mb-2 text-dark">HOW OFTEN DO YOU GROOM?</h2>
                <p className="text-xs font-sans font-bold text-muted mb-6 uppercase">This helps Wingman calculate when your next trim is due.</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Weekly', 'Bi-weekly', 'Monthly', 'Rarely'].map((freq) => {
                    const isSelected = onboardingData.groomFrequency === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => updateOnboardingData('groomFrequency', freq)}
                        className={`py-4 px-6 border-3 border-dark font-display font-bold text-sm transition-all duration-150 rounded-none cursor-pointer ${
                          isSelected
                            ? 'bg-yellow text-dark shadow-[4px_4px_0px_#1A1A1A] translate-x-[-2px] translate-y-[-2px]'
                            : 'bg-white text-dark shadow-[2px_2px_0px_#1A1A1A] hover:bg-cream hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none'
                        }`}
                      >
                        {freq.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {onboardingStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 space-y-4"
              >
                <div>
                  <h2 className="font-display font-extrabold text-2xl mb-2 text-dark">ANY UPCOMING EVENTS?</h2>
                  <p className="text-xs font-sans font-bold text-muted mb-6 uppercase">Wingman will ensure you look absolute best for the big day.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-display font-bold text-dark uppercase tracking-wider mb-2">EVENT TYPE</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Interview', 'Wedding', 'Date Night', 'Festival', 'Party', 'Other'].map((evt) => {
                        const isSelected = onboardingData.upcomingEvent.eventType === evt;
                        return (
                          <button
                            key={evt}
                            type="button"
                            onClick={() => updateOnboardingData('upcomingEvent', { ...onboardingData.upcomingEvent, eventType: evt })}
                            className={`py-2 px-1 border-2 border-dark font-display font-bold text-[10px] transition-all rounded-none truncate cursor-pointer ${
                              isSelected
                                ? 'bg-yellow text-dark shadow-[2px_2px_0px_#1A1A1A]'
                                : 'bg-white text-dark hover:bg-cream hover:shadow-[2px_2px_0px_#1A1A1A]'
                            }`}
                          >
                            {evt.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-display font-bold text-dark uppercase tracking-wider mb-2">EVENT DATE</label>
                    <input
                      type="date"
                      value={onboardingData.upcomingEvent.eventDate}
                      onChange={(e) => updateOnboardingData('upcomingEvent', { ...onboardingData.upcomingEvent, eventDate: e.target.value })}
                      className="w-full bg-white border-3 border-dark text-dark rounded-none py-3 px-4 text-sm focus:outline-none focus:shadow-[4px_4px_0px_#1A1A1A] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all font-sans [color-scheme:light]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {onboardingStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <h2 className="font-display font-extrabold text-2xl mb-2 text-dark">WHAT MATTERS MOST?</h2>
                <p className="text-xs font-sans font-bold text-muted mb-6 uppercase">Choose the style goal that defines your aesthetic.</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'Confidence', label: 'CONFIDENCE BOOST' },
                    { key: 'Routine', label: 'CLEAN ROUTINE' },
                    { key: 'First Impressions', label: 'FIRST IMPRESSIONS' },
                    { key: 'Looking Fresh', label: 'LOOKING FRESH' }
                  ].map((item) => {
                    const isSelected = onboardingData.priority === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => updateOnboardingData('priority', item.key)}
                        className={`py-4 px-4 border-3 border-dark font-display font-bold text-xs text-center transition-all duration-150 rounded-none cursor-pointer leading-normal ${
                          isSelected
                            ? 'bg-yellow text-dark shadow-[4px_4px_0px_#1A1A1A] translate-x-[-2px] translate-y-[-2px]'
                            : 'bg-white text-dark shadow-[2px_2px_0px_#1A1A1A] hover:bg-cream hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {onboardingStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <h2 className="font-display font-extrabold text-2xl mb-2 text-dark">WHAT IS YOUR BUDGET RANGE?</h2>
                <p className="text-xs font-sans font-bold text-muted mb-6 uppercase">We'll filter Nagpur service providers in this price tier.</p>
                <div className="grid grid-cols-2 gap-4">
                  {['100-300', '300-600', '600-1200', '1200+'].map((range) => {
                    const isSelected = onboardingData.budgetRange === range;
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => updateOnboardingData('budgetRange', range)}
                        className={`py-4 px-6 border-3 border-dark font-display font-bold text-sm transition-all duration-150 rounded-none cursor-pointer ${
                          isSelected
                            ? 'bg-yellow text-dark shadow-[4px_4px_0px_#1A1A1A] translate-x-[-2px] translate-y-[-2px]'
                            : 'bg-white text-dark shadow-[2px_2px_0px_#1A1A1A] hover:bg-cream hover:shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none'
                        }`}
                      >
                        ₹{range.replace('-', '–')}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t-3 border-dark">
            {onboardingStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 font-display font-bold text-xs text-muted hover:text-dark transition-colors py-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> BACK
              </button>
            ) : (
              <div />
            )}

            {onboardingStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (onboardingStep === 1 && !onboardingData.hairType) ||
                  (onboardingStep === 2 && !onboardingData.groomFrequency) ||
                  (onboardingStep === 3 && !onboardingData.upcomingEvent.eventType) ||
                  (onboardingStep === 4 && !onboardingData.priority)
                }
                className="flex items-center gap-1.5 font-display font-bold text-xs py-2.5 px-5 border-3 border-dark bg-yellow text-dark shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-none cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                NEXT <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={completeOnboarding}
                disabled={!onboardingData.budgetRange}
                className="flex items-center gap-2 font-display font-extrabold text-xs py-2.5 px-6 border-3 border-dark bg-teal text-dark shadow-[4px_4px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-none cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                MEET WINGMAN <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Conversational view
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[calc(100vh-230px)] bg-white border-3 border-dark overflow-hidden shadow-[6px_6px_0px_#1A1A1A] rounded-none">
      {/* Header bar */}
      <div className="bg-dark px-6 py-4 border-b-3 border-dark flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-cream bg-yellow flex items-center justify-center rounded-none">
            <Sparkles className="w-5 h-5 text-dark" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-cream text-base tracking-[0.1em] uppercase">WINGMAN</h3>
            <p className="text-[10px] text-cream/70 font-display font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-teal rounded-full animate-pulse border border-dark" /> ACTIVE COMPANION
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cream">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] border-2 border-dark px-4 py-3 text-sm leading-relaxed font-sans rounded-none shadow-[3px_3px_0px_#1A1A1A] ${
                  isUser
                    ? 'bg-dark text-cream'
                    : 'bg-yellow text-dark'
                }`}
              >
                {msg.text}
                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-dark animate-pulse align-middle" />
                )}
              </div>
            </div>
          );
        })}
        {isTyping && !messages.some(m => m.isStreaming) && (
          <div className="flex justify-start">
            <div className="bg-yellow border-2 border-dark text-dark px-4 py-3 text-sm flex items-center gap-1.5 rounded-none shadow-[3px_3px_0px_#1A1A1A]">
              <span className="font-display font-bold text-xs">THINKING</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-dark rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-dark rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-dark rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input panel */}
      <div className="p-4 border-t-3 border-dark bg-white flex gap-3">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask Wingman anything..."
          className="flex-1 bg-white border-3 border-dark text-dark text-sm font-sans px-4 py-3 focus:outline-none focus:shadow-[4px_4px_0px_#1A1A1A] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all rounded-none placeholder-muted/80"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!inputVal.trim() || isTyping}
          className="bg-yellow hover:bg-yellow border-3 border-dark text-dark p-3 shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none rounded-none shrink-0 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
