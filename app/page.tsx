"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import BackgroundLayers from '@/components/BackgroundLayers';
// --- MODULAR IMPORTS ---
import Sidebar from '@/components/Sidebar';
import MobileMenu from '@/components/MobileMenu';
import HeroSection from '@/components/HeroSection';
import InputArea from '@/components/InputArea';
import MessageItem from '@/components/MessageItem';
import ThinkingIndicator from '@/components/ThinkingIndicator';
import Footer from '@/components/Footer';
import { Message, Suggestion } from '@/types';

// --- TYPESCRIPT FIXES ---
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  date: number;
}

// --- GLOBAL STYLES ---
const styles = `
    :root { --sidebar-width: 260px; }
`;

export default function Home() {
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [badgeState, setBadgeState] = useState(0); 
  const [badgeVisible, setBadgeVisible] = useState(true);
  const [titleIndex, setTitleIndex] = useState(0);
  const [inputHasText, setInputHasText] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [suggestionStartIndex, setSuggestionStartIndex] = useState(0);

  const [chatStarted, setChatStarted] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  // HISTORY STATE
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const compassBtnRef = useRef<HTMLButtonElement>(null);
  const compassIconRef = useRef<HTMLDivElement>(null);
  const mainLogoRef = useRef<HTMLAnchorElement>(null); 
  const compassPhysicsRef = useRef({ angle: 0, velocity: 40, spinning: true });
  const requestRef = useRef<number>();

  const phrases = ["Strategic foresight", "Actionable intelligence", "Verifiable insight"];
  const titles = [{ text: "Strategic Intelligence", class: "hero-text-gradient-2" }, { text: "Engineered for Decisions", class: "hero-text-gradient-1" }];
  const suggestionsList: Suggestion[] = [
    { id: 1, icon: 'fa-earth-americas', label: 'Web-Search', prompt: "Conduct a comprehensive web search on [topic] and synthesize the key findings.", color: '#38bdf8' },
    { id: 2, icon: 'fa-video', label: 'Video Script', prompt: "Create a detailed script for a YouTube video about [topic], including hooks, chapters, and a call to action.", color: '#f87171' },
    { id: 3, icon: 'fa-file-pdf', label: 'Summarize PDF', prompt: "Summarize the key arguments and data points from the attached PDF document.", color: '#fbbf24' },
    { id: 4, icon: 'fa-code', label: 'Coding', prompt: "Generate the HTML, CSS, and React code for a responsive website featuring [features].", color: '#a78bfa' },
    { id: 5, icon: 'fa-newspaper', label: 'Global News', prompt: "Provide a concise briefing on today's top global news stories affecting [industry/region].", color: '#34d399' }
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); document.documentElement.setAttribute('data-theme', newTheme); localStorage.setItem('theme', newTheme);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`;
    setInputValue(e.target.value); setInputHasText(e.target.value.trim().length > 0);
    if (e.target.value.trim().length > 0) compassPhysicsRef.current.velocity += (Math.random() * 20 - 10);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return alert("Voice Input not supported.");
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r = new SR();
    r.continuous = false; r.interimResults = false; r.lang = 'en-US';
    r.onstart = () => setIsListening(true); 
    r.onend = () => setIsListening(false);
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInputValue(prev => { const n = prev ? prev + " " + t : t; setInputHasText(n.length > 0); return n; });
      if (textareaRef.current) textareaRef.current.focus();
    };
    r.start();
  };

  const handleSuggestionClick = (p: string) => { 
     setInputValue(p); setInputHasText(true); 
     if (p.toLowerCase().includes("web search")) setSearchMode(true);
     if (textareaRef.current) textareaRef.current.focus();
  };
  
  const handleNewChat = (e: React.MouseEvent) => {
    e.preventDefault(); setChatStarted(false); setMessages([]); setInputValue(""); setInputHasText(false); setSearchMode(false);
  };

  const handleLoadChat = (id: string) => { console.log("Load", id); };
  const handleClearHistory = () => { setRecentChats([]); };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    setChatStarted(true);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    
    // SAVE TO HISTORY (Mock logic)
    setRecentChats(prev => {
        const title = inputValue.substring(0, 30) + "...";
        if (!prev.find(c => c.title === title)) {
            return [{ id: Date.now().toString(), title, messages: [], date: Date.now() }, ...prev];
        }
        return prev;
    });

    const txt = inputValue.toLowerCase();
    const triggers = ["current", "today", "latest", "price", "news", "stock", "weather", "who is", "what is"];
    const doSearch = searchMode || txt.includes("search") || triggers.some(t => txt.includes(t));

    setInputValue(""); setInputHasText(false); setSearchMode(false); setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], useSearch: doSearch })
      });

      if (!response.ok) throw new Error(response.statusText);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";
      setIsThinking(false);
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
             try {
                const json = JSON.parse(line.replace('data: ', ''));
                const content = json.choices[0]?.delta?.content || "";
                if (content) {
                  aiContent += content;
                  setMessages(current => current.map(m => m.id === aiMsgId ? { ...m, content: aiContent } : m));
                }
             } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error(error); setIsThinking(false);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "⚠️ Connection Failed." }]);
    }
  };

  const rotateSuggestions = () => setSuggestionStartIndex((prev) => (prev + 1) % suggestionsList.length);
  const getVisibleSuggestions = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) visible.push(suggestionsList[(suggestionStartIndex + i) % suggestionsList.length]);
    return visible;
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => { const s = localStorage.getItem('theme') || 'dark'; setTheme(s); document.documentElement.setAttribute('data-theme', s); }, []);
  useEffect(() => { const i = setInterval(() => { setBadgeVisible(false); setTimeout(() => { setBadgeState(p => (p + 1) % (2 + phrases.length)); setBadgeVisible(true); }, 500); }, 4000); return () => clearInterval(i); }, [phrases.length]);
  useEffect(() => { const i = setInterval(() => setTitleIndex(p => (p + 1) % titles.length), 8000); return () => clearInterval(i); }, [titles.length]);
  useEffect(() => { const s = () => { setShowBackToTop(window.scrollY > 300); setScrollPercent(window.scrollY / (document.body.offsetHeight - window.innerHeight)); }; window.addEventListener('scroll', s); return () => window.removeEventListener('scroll', s); }, []);
  useEffect(() => { if (chatStarted) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isThinking]);

  const animateCompass = useCallback(() => {
    if (!compassBtnRef.current || !compassIconRef.current) { requestRef.current = requestAnimationFrame(animateCompass); return; }
    let target = 0;
    if (mainLogoRef.current) {
      const r1 = mainLogoRef.current.getBoundingClientRect(); const r2 = compassBtnRef.current.getBoundingClientRect();
      target = (Math.atan2((r1.top+r1.height/2)-(r2.top+r2.height/2), (r1.left+r1.width/2)-(r2.left+r2.width/2)) * 180 / Math.PI) + 90;
    } else target = compassPhysicsRef.current.angle + 2;
    let diff = target - compassPhysicsRef.current.angle; while (diff < -180) diff += 360; while (diff > 180) diff -= 360;
    if (compassPhysicsRef.current.spinning) { compassPhysicsRef.current.velocity *= 0.96; if (Math.abs(compassPhysicsRef.current.velocity) < 2) compassPhysicsRef.current.spinning = false; } 
    else { if (mainLogoRef.current) { compassPhysicsRef.current.velocity += diff * 0.05; compassPhysicsRef.current.velocity *= 0.90; } else { compassPhysicsRef.current.velocity = 0.5; } }
    compassPhysicsRef.current.angle += compassPhysicsRef.current.velocity;
    compassIconRef.current.style.transform = `rotate(${compassPhysicsRef.current.angle}deg)`;
    requestRef.current = requestAnimationFrame(animateCompass);
  }, []);
  useEffect(() => { requestRef.current = requestAnimationFrame(animateCompass); return () => cancelAnimationFrame(requestRef.current!); }, [animateCompass]);

  return (
    <div style={{ color: 'var(--text-primary)' }}>
      <style>{styles}</style>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet"/>
      
      <BackgroundLayers theme={theme} />
      <a href="https://www.hqaim.com" className="brand-logo" id="mainLogo" ref={mainLogoRef}><img src="https://assets.hqaim.com/images/HQAIM_LOGO_Gradient_Minimal.svg" alt="HQAIM" style={{height:'100%',width:'auto'}}/></a>
      
      {/* SIDEBAR WITH HISTORY */}
      <Sidebar 
        onNewChat={handleNewChat} 
        recentChats={recentChats} 
        onLoadChat={handleLoadChat} 
        onClearHistory={handleClearHistory} 
      />
      
      <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><i className={`fa-solid ${mobileMenuOpen?'fa-xmark':'fa-bars'}`}></i></button>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onNewChat={handleNewChat} recentChats={recentChats} onLoadChat={handleLoadChat} />
      
      <button className="standalone-theme-btn" onClick={toggleTheme}>{theme === 'light' ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}</button>
      
      <main className={`main-container ${chatStarted ? 'chat-mode' : ''}`}>
         <HeroSection 
            visible={!chatStarted} 
            badgeVisible={badgeVisible} 
            badgeState={badgeState} 
            titles={titles} 
            titleIndex={titleIndex} 
            suggestions={getVisibleSuggestions()} 
            onSuggestionClick={handleSuggestionClick} 
            onRotateSuggestions={rotateSuggestions} 
         />
         
         {chatStarted && <div className="chat-container">
            {messages.map(m => <MessageItem key={m.id} msg={m} theme={theme} />)}
            {isThinking && <ThinkingIndicator theme={theme} />}
            <div ref={messagesEndRef} />
         </div>}
         
         <InputArea 
            chatMode={chatStarted} 
            inputValue={inputValue} 
            onInputChange={handleInput} 
            onKeyDown={(e:any) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())} 
            onSubmit={handleSubmit} 
            onVoiceInput={handleVoiceInput} 
            isListening={isListening} 
            inputHasText={inputHasText} 
            compassRef={compassBtnRef} 
            iconRef={compassIconRef} 
            textareaRef={textareaRef} 
         />
      </main>
      <Footer />
      <button id="backToTopBtn" className={showBackToTop ? 'show' : ''} onClick={scrollToTop}>
        <svg className="progress-ring" width="36" height="36"><circle className="progress-ring__circle" stroke="var(--accent-cyan)" strokeWidth="2" fill="transparent" r={15} cx="18" cy="18" style={{ strokeDasharray: `${15 * 2 * Math.PI} ${15 * 2 * Math.PI}`, strokeDashoffset: (15 * 2 * Math.PI) - (scrollPercent * (15 * 2 * Math.PI)) }} /></svg>
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
}


