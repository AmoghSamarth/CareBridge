import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const WingmanContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || '';

export const useWingman = () => useContext(WingmanContext);

export const WingmanProvider = ({ children }) => {
  const { user, onboardingComplete: firestoreOnboardingComplete, markOnboardingComplete } = useAuth();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    hairType: '',
    groomFrequency: '',
    upcomingEvent: {
      eventType: '',
      eventDate: ''
    },
    priority: '',
    budgetRange: ''
  });
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [latestResponse, setLatestResponse] = useState('');

  // Sync from Firestore-backed AuthContext value
  useEffect(() => {
    if (user) {
      if (firestoreOnboardingComplete) {
        setOnboardingComplete(true);
        const savedHistory = localStorage.getItem(`carebridge_chat_${user.uid}`);
        if (savedHistory) {
          try { setMessages(JSON.parse(savedHistory)); } catch {}
        } else {
          setMessages([
            {
              id: '1',
              sender: 'wingman',
              text: `Hey ${user.displayName.split(' ')[0]}! Welcome back. Tell me what's on your mind today, or let me know if you have any upcoming events to prepare for.`,
              timestamp: new Date()
            }
          ]);
        }
      } else {
        setOnboardingComplete(false);
        setOnboardingStep(1);
      }
    } else {
      setOnboardingComplete(false);
      setMessages([]);
    }
  }, [user, firestoreOnboardingComplete]);

  const updateOnboardingData = (field, value) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const completeOnboarding = async () => {
    if (!user) return;

    setIsTyping(true);
    setOnboardingComplete(true);
    localStorage.setItem(`carebridge_onboarding_${user.uid}`, 'true');

    // Write to Firestore
    if (isFirebaseInitialized && db) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          onboarding_complete: true
        });
      } catch {
        // Firestore write failed — localStorage is the fallback
      }
    }
    // Signal AuthContext to update its cached value
    markOnboardingComplete();

    const initialUserMessage = {
      id: 'onboarding-finish',
      sender: 'user',
      text: `Completed onboarding: Hair type: ${onboardingData.hairType}, Grooming frequency: ${onboardingData.groomFrequency}, Budget: ${onboardingData.budgetRange}, Event: ${onboardingData.upcomingEvent.eventType || 'None'}`,
      timestamp: new Date()
    };
    setMessages([initialUserMessage]);
    await triggerWingmanStream(user.uid, 'onboarding_complete');
  };

  const triggerWingmanStream = async (userId, triggerType) => {
    setIsTyping(true);
    setLatestResponse('');

    const newWingmanMsgId = `wingman-${Date.now()}`;
    
    // Add an empty message for streaming
    setMessages(prev => [
      ...prev,
      {
        id: newWingmanMsgId,
        sender: 'wingman',
        text: '',
        timestamp: new Date(),
        isStreaming: true
      }
    ]);

    // Build full user profile to send to the server
    const userProfile = {
      name: user?.displayName?.split(' ')[0] || 'User',
      hairType: onboardingData.hairType,
      groomFrequency: onboardingData.groomFrequency,
      budgetRange: onboardingData.budgetRange,
      priority: onboardingData.priority,
      upcomingEvent: onboardingData.upcomingEvent,
    };

    try {
      // Connect to the SSE endpoint
      const response = await fetch(`${API_BASE}/api/wingman/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, triggerType, userProfile })
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported by browser');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          // SSE outputs come as "data: {...}\n\n"
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk;
                  setLatestResponse(accumulatedText);
                  
                  // Update the message in the list
                  setMessages(prev => prev.map(msg => 
                    msg.id === newWingmanMsgId 
                      ? { ...msg, text: accumulatedText }
                      : msg
                  ));
                }
              } catch (e) {
                // Not JSON or partial chunk, skip
              }
            }
          }
        }
      }

      // Turn off streaming status on the final message
      setMessages(prev => {
        const updated = prev.map(msg => 
          msg.id === newWingmanMsgId 
            ? { ...msg, isStreaming: false }
            : msg
        );
        localStorage.setItem(`carebridge_chat_${user.uid}`, JSON.stringify(updated));
        return updated;
      });

    } catch (error) {
      console.error('Error streaming from Wingman API:', error);
      
      // Fallback mock stream if backend fails
      const fallbackText = `Hey ${user.displayName.split(' ')[0]}, let's get you ready! I notice you have a ${onboardingData.upcomingEvent.eventType || 'special event'} coming up. Ravi Sharma in Dharampeth is excellent for a clean styling setup matching your ${onboardingData.hairType} hair. Want me to check bookings?`;
      
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx >= fallbackText.length) {
          clearInterval(interval);
          setMessages(prev => {
            const updated = prev.map(msg => 
              msg.id === newWingmanMsgId 
                ? { ...msg, text: fallbackText, isStreaming: false }
                : msg
            );
            localStorage.setItem(`carebridge_chat_${user.uid}`, JSON.stringify(updated));
            return updated;
          });
          setIsTyping(false);
        } else {
          const nextText = fallbackText.slice(0, currentIdx + 4);
          setLatestResponse(nextText);
          setMessages(prev => prev.map(msg => 
            msg.id === newWingmanMsgId 
              ? { ...msg, text: nextText }
              : msg
          ));
          currentIdx += 4;
        }
      }, 30);
      return;
    } finally {
      setIsTyping(false);
    }
  };

  const sendUserMessage = async (text) => {
    if (!user || !text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => {
      const updated = [...prev, userMsg];
      localStorage.setItem(`carebridge_chat_${user.uid}`, JSON.stringify(updated));
      return updated;
    });

    // Fire recommendation request or check_in flow
    await triggerWingmanStream(user.uid, 'recommendation_request');
  };

  const resetOnboarding = () => {
    if (!user) return;
    localStorage.removeItem(`carebridge_onboarding_${user.uid}`);
    localStorage.removeItem(`carebridge_chat_${user.uid}`);
    setOnboardingComplete(false);
    setOnboardingStep(1);
    setMessages([]);
    // Also update Firestore if available
    if (isFirebaseInitialized && db) {
      updateDoc(doc(db, 'users', user.uid), { onboarding_complete: false }).catch(() => {});
    }
  };

  return (
    <WingmanContext.Provider value={{
      onboardingComplete,
      onboardingStep,
      onboardingData,
      messages,
      isTyping,
      latestResponse,
      setOnboardingStep,
      updateOnboardingData,
      completeOnboarding,
      sendUserMessage,
      resetOnboarding
    }}>
      {children}
    </WingmanContext.Provider>
  );
};
