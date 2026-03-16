'use client';
import React, { useEffect } from 'react'
import MainPanel from '@/components/MainPanel';
import Sidebar from '@/components/Sidebar'
import styles from '../../styles/pages/home-page.module.css'
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentChat,
  selectIsLoading,
  selectIsAnyModeLoading,
  selectMode,
  selectModel,
  selectCode,
  selectResponseText,
  selectEditorLanguage,
  selectHasInputChanged,
  selectMessages,
  setMode,
  setModel,
  setCode,
  setEditorLanguage,
  addMessageToHistory,
  selectRepoUrl,
  selectIsRepoConnected,
  setRepoUrl,
  setRepoConnected,
} from '@/features/chat/chat-slice';
import { analyzeCode, loadUserSessions } from '@/features/chat/chat-thunks';
import { EditorLanguage, FeatureMode, ModelId } from '@/constants/frontend-constants';
import { selectIsAuthenticated } from '@/features/auth/auth-slice';

function HomePage() {
  const dispatch = useDispatch();
  const currentChat = useSelector(selectCurrentChat);
  const isLoading = useSelector(selectIsLoading);
  const isAnyLoading = useSelector(selectIsAnyModeLoading);
  const selectedMode = useSelector(selectMode);
  const selectedModel = useSelector(selectModel);
  const code = useSelector(selectCode);
  const response = useSelector(selectResponseText);
  const editorLanguage = useSelector(selectEditorLanguage);
  const hasInputChanged = useSelector(selectHasInputChanged);
  const messages = useSelector(selectMessages);
  const repoUrl = useSelector(selectRepoUrl);
  const isRepoConnected = useSelector(selectIsRepoConnected);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Load persisted sessions from Supabase on mount
  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(loadUserSessions() as any);
    }
  }, [isAuthenticated, dispatch]);


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

  const handleRepoUrlChange = (url: string) => {
    dispatch(setRepoUrl(url));
  };

  const handleRepoConnectedChange = (connected: boolean) => {
    dispatch(setRepoConnected(connected));
  };

  const handleAnalyze = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(analyzeCode() as any);
  };

  return (
    <div className={styles.app}>
      <Sidebar
        activeChatId={currentChat?.id}
      />
      <MainPanel
        isLoading={isLoading}
        isAnyLoading={isAnyLoading}
        selectedMode={selectedMode}
        selectedModel={selectedModel}
        editorLanguage={editorLanguage}
        hasInputChanged={hasInputChanged}
        messages={messages}
        code={code}
        response={response}
        repoUrl={repoUrl}
        isRepoConnected={isRepoConnected}
        onModeChange={handleModeChange}
        onModelChange={handleModelChange}
        onLanguageChange={handleLanguageChange}
        onCodeChange={handleCodeChange}
        onRepoUrlChange={handleRepoUrlChange}
        onRepoConnectedChange={handleRepoConnectedChange}
        onAddMessageToHistory={(mode, text) => dispatch(addMessageToHistory({ mode, text }))}
        onAnalyze={handleAnalyze}
      />
    </div>
  )
}

export default HomePage