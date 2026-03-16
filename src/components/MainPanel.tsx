'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/components/MainPanel.module.css';

// IDE Components
import Header from './ide/Header';
import ModeTabs from './ide/ModeTabs';
import Workspace from './ide/Workspace';
import EditorPanel from './ide/EditorPanel';
import ChatPanel from './ide/ChatPanel';
import RepoPanel from './ide/RepoPanel';
import ResponsePanel from './ide/ResponsePanel';
import ActionBar from './ide/ActionBar';
import ConfirmDialog from './ConfirmDialog';

import {
  modeButtonLabels,
  FeatureMode,
  ModelId,
  EditorLanguage,
} from '@/constants/frontend-constants';
import { Message } from '@/features/chat/chat-slice';

interface MainPanelProps {
  isLoading: boolean;
  isAnyLoading: boolean;
  selectedMode: FeatureMode;
  selectedModel: ModelId;
  editorLanguage: EditorLanguage;
  hasInputChanged: boolean;
  messages: Message[];
  code: string;
  response: string;
  onModeChange: (mode: FeatureMode) => void;
  onModelChange: (model: ModelId) => void;
  onLanguageChange: (lang: EditorLanguage) => void;
  onCodeChange: (code: string) => void;
  onAddMessageToHistory: (mode: FeatureMode, text: string) => void;
  onAnalyze: () => void;
}

// Modes that use the Monaco code editor
const editorModes: FeatureMode[] = ['explain', 'review', 'debug', 'tests'];

export default function MainPanel({
  isLoading,
  isAnyLoading,
  selectedMode,
  selectedModel,
  editorLanguage,
  hasInputChanged,
  messages,
  code,
  response,
  onModeChange,
  onModelChange,
  onLanguageChange,
  onCodeChange,
  onAddMessageToHistory,
  onAnalyze,
}: MainPanelProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MonacoEditor, setMonacoEditor] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [lastSentMessage, setLastSentMessage] = useState('');

  // Confirmation dialog state
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingMode, setPendingMode] = useState<FeatureMode | null>(null);

  // Only load Monaco on the client after hydration
  useEffect(() => {
    setMounted(true);
    import('@monaco-editor/react').then((mod) => {
      setMonacoEditor(() => mod.default);
    });
  }, []);

  // Sync lastSentMessage with code prop when in chat mode
  // This ensures that restoring a session from history updates the preview bubble,
  // and that "New Session" clears the bubble.
  useEffect(() => {
    if (selectedMode === 'chat') {
      setLastSentMessage(code || '');
    }
  }, [selectedMode, code]);

  const handleCopyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mode switching with confirmation when loading
  const handleModeTabClick = useCallback((mode: FeatureMode) => {
    if (mode === selectedMode) return;
    if (isAnyLoading) {
      setPendingMode(mode);
      setShowConfirm(true);
    } else {
      onModeChange(mode);
    }
  }, [selectedMode, isAnyLoading, onModeChange]);

  const handleConfirmSwitch = useCallback(() => {
    if (pendingMode) {
      onModeChange(pendingMode);
    }
    setShowConfirm(false);
    setPendingMode(null);
  }, [pendingMode, onModeChange]);

  const handleCancelSwitch = useCallback(() => {
    setShowConfirm(false);
    setPendingMode(null);
  }, []);

  const isEditorMode = editorModes.includes(selectedMode);
  const isChatMode = selectedMode === 'chat';
  const isRepoMode = selectedMode === 'repo';
  const buttonConfig = modeButtonLabels[selectedMode];

  // Determine if the action button should be disabled
  const isInputEmpty = isEditorMode ? !code.trim() :
    isChatMode ? !chatInput.trim() :
      isRepoMode ? !repoUrl.trim() : true;

  const isDuplicateMessage = isChatMode && chatInput.trim() === lastSentMessage.trim();

  const isActionDisabled = isLoading || isInputEmpty || isDuplicateMessage || (
    !isChatMode && !hasInputChanged
  );

  // Handle action for all modes
  const handleAction = () => {
    if (isChatMode) {
      if (isDuplicateMessage) return;
      // In chat mode, we use chatInput
      setLastSentMessage(chatInput);
      // Synchronously push to history for instant UI feedback
      onAddMessageToHistory(selectedMode, chatInput);
      onCodeChange(chatInput);
      setChatInput('');
    } else if (isRepoMode) {
      // In repo mode, we use repoUrl
      onCodeChange(repoUrl);
    } else if (isEditorMode) {
      // For analytical modes (Explain, Review, ect.), push code to history for visual continuity
      onAddMessageToHistory(selectedMode, code);
    }
    // Perform analysis
    onAnalyze();
  };

  const renderLeftPanel = () => {
    if (isEditorMode) {
      return (
        <EditorPanel
          editorLanguage={editorLanguage}
          code={code}
          onCodeChange={onCodeChange}
          onLanguageChange={onLanguageChange}
          mounted={mounted}
          MonacoEditor={MonacoEditor}
        />
      );
    }
    if (isChatMode) {
      return (
        <ChatPanel
          chatInput={chatInput}
          onChatInputChange={setChatInput}
          onAction={handleAction}
          isDisabled={isActionDisabled}
        />
      );
    }
    if (isRepoMode) {
      return (
        <RepoPanel
          repoUrl={repoUrl}
          onRepoUrlChange={setRepoUrl}
          onAction={handleAction}
          isDisabled={isActionDisabled}
        />
      );
    }
    return null;
  };

  return (
    <>
      <main className={styles.mainPanel}>
        <div className={styles.mainLayout}>
          <Header
            selectedModel={selectedModel}
            onModelChange={onModelChange}
          />

          <ModeTabs
            selectedMode={selectedMode}
            onModeTabClick={handleModeTabClick}
          />

          <Workspace
            leftPanel={renderLeftPanel()}
            rightPanel={
              <ResponsePanel
                isLoading={isLoading}
                selectedMode={selectedMode}
                lastSentMessage={lastSentMessage}
                messages={messages}
                response={response}
                onCopyResponse={handleCopyResponse}
                copied={copied}
              />
            }
          />

          <ActionBar
            isLoading={isLoading}
            isDisabled={isActionDisabled}
            onAnalyze={handleAction}
            buttonLabel={buttonConfig.action}
            loadingLabel={buttonConfig.loading}
            icon={buttonConfig.icon}
          />
        </div>
      </main>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Analysis in Progress"
        message="An analysis is still running. If you switch modes now, the current process will continue in the background. Do you want to switch?"
        confirmLabel="Switch Mode"
        cancelLabel="Cancel"
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
      />
    </>
  );
}
