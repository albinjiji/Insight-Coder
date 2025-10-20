'use client';
import React, { useState } from 'react'
import MainPanel from '@/components/main-panel';
import Sidebar from '@/components/sidebar'
import styles from '../../styles/pages/home-page.module.css'
import { useGetGeminiResponseMutation } from '@/features/gemini/gemini-slice';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

function HomePage() {
    const router = useRouter();
    const [generate, { isLoading }] = useGetGeminiResponseMutation();
    const [messages, setMessages] = useState<Message[]>([]);
  
    const handleNewChat = () => {
      setMessages([]);
      router.push('/home-page');
    };
  
    console.log('messages', messages);
  
    const handleSend = async (prompt: string) => {
      if (!prompt.trim()) return;
  
      // Step 1 - Add user message to chat immediately
      setMessages((prev) => [...prev, { role: "user", text: prompt }]);
  
      try {
        // Step 2 - Ask Gemini if the prompt is code-related
        const classificationPrompt = `
        You are a classifier. Answer ONLY "true" or "false".
        Is the following question about programming, debugging, code explanation, software development, or learning to code?
  
        "${prompt}"
        `;
  
        const classification = await generate({ prompt: classificationPrompt }).unwrap();
        const isCodeRelated = classification.text?.toLowerCase().includes("true");
  
        if (isCodeRelated) {
          // Step 3 - It’s code-related → get InsightCoder's intelligent response
          const res = await generate({ prompt }).unwrap();
          setMessages((prev) => [
            ...prev,
            { role: "assistant", text: res.text },
          ]);
        } else {
          // Step 4 - Not a code question → show a polite message
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: "💡 This question doesn't seem related to coding or debugging. InsightCoder helps with programming, debugging, and code learning assistance.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error generating response:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Something went wrong. Please try again.",
          },
        ]);
      }
    };
  
  
  return (
    <div className={styles.app}>
      <Sidebar onNewChat={handleNewChat}/>
      <MainPanel onSend={handleSend} onNewChat={handleNewChat} isLoading={isLoading} messages={messages} />
    </div>
  )
}

export default HomePage