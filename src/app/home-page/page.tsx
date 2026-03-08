'use client';
import React from 'react'
import MainPanel from '@/components/main-panel';
import Sidebar from '@/components/sidebar'
import styles from '../../styles/pages/home-page.module.css'
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteChat,
  newChat,
  selectChat,
  selectChats,
  selectCurrentChat,
  selectIsLoading,
  selectIsAnyModeLoading,
  selectMode,
  selectModel,
  selectCode,
  selectResponseText,
  selectEditorLanguage,
  setMode,
  setModel,
  setCode,
  setEditorLanguage,
} from '@/features/chat/chat-slice';
import { analyzeCode } from '@/features/chat/chat-thunks';
import { EditorLanguage, FeatureMode, ModelId } from '@/constants/frontend-constants';

function HomePage() {
  const dispatch = useDispatch();
  const chats = useSelector(selectChats);
  const currentChat = useSelector(selectCurrentChat);
  const isLoading = useSelector(selectIsLoading);
  const isAnyLoading = useSelector(selectIsAnyModeLoading);
  const selectedMode = useSelector(selectMode);
  const selectedModel = useSelector(selectModel);
  const code = useSelector(selectCode);
  const response = useSelector(selectResponseText);
  const editorLanguage = useSelector(selectEditorLanguage);

  const handleNewChat = () => {
    dispatch(newChat());
  };

  const handleSelectChat = (id: string) => {
    dispatch(selectChat(id));
  };

  const handleDeleteChat = (id: string) => {
    dispatch(deleteChat(id));
  };

  const handleModeChange = (mode: FeatureMode) => {
    dispatch(setMode(mode));
  };

  const handleModelChange = (model: ModelId) => {
    dispatch(setModel(model));
  };

  const handleCodeChange = (value: string) => {
    dispatch(setCode(value));
  };

  const handleLanguageChange = (lang: EditorLanguage) => {
    dispatch(setEditorLanguage(lang));
  };

  const handleAnalyze = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(analyzeCode() as any);
  };

  return (
    <div className={styles.app}>
      <Sidebar
        chats={chats.map(c => ({
          id: c.id,
          title: c.title || 'New Chat',
        }))}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        activeChatId={currentChat?.id}
        onDeleteChat={handleDeleteChat}
      />
      <MainPanel
        isLoading={isLoading}
        isAnyLoading={isAnyLoading}
        selectedMode={selectedMode}
        selectedModel={selectedModel}
        editorLanguage={editorLanguage}
        code={code}
        response={response}
        onModeChange={handleModeChange}
        onModelChange={handleModelChange}
        onLanguageChange={handleLanguageChange}
        onCodeChange={handleCodeChange}
        onAnalyze={handleAnalyze}
      />
    </div>
  )
}

export default HomePage