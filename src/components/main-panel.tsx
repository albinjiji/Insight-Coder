'use client';

import React, { useState, useEffect, useCallback, ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../styles/components/main-panel.module.css';
import ConfirmDialog from './confirm-dialog';
import {
  featureModes,
  modelOptions,
  editorLanguages,
  mainPanelValues,
  modeButtonLabels,
  FeatureMode,
  ModelId,
  EditorLanguage,
} from '@/constants/frontend-constants';
import { CopyIcon } from './icons';

interface MainPanelProps {
  isLoading: boolean;
  isAnyLoading: boolean;
  selectedMode: FeatureMode;
  selectedModel: ModelId;
  editorLanguage: EditorLanguage;
  code: string;
  response: string;
  onModeChange: (mode: FeatureMode) => void;
  onModelChange: (model: ModelId) => void;
  onLanguageChange: (lang: EditorLanguage) => void;
  onCodeChange: (code: string) => void;
  onAnalyze: () => void;
}

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean;
};

// Modes that use the Monaco code editor
const editorModes: FeatureMode[] = ['explain', 'review', 'debug', 'tests'];

export default function MainPanel({
  isLoading,
  isAnyLoading,
  selectedMode,
  selectedModel,
  editorLanguage,
  code,
  response,
  onModeChange,
  onModelChange,
  onLanguageChange,
  onCodeChange,
  onAnalyze,
}: MainPanelProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MonacoEditor, setMonacoEditor] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [repoUrl, setRepoUrl] = useState('');

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
  const isActionDisabled = isLoading || (
    isEditorMode ? !code.trim() :
      isChatMode ? !chatInput.trim() :
        isRepoMode ? !repoUrl.trim() : true
  );

  // Handle action for all modes
  const handleAction = () => {
    if (isChatMode) {
      onCodeChange(chatInput);
      setChatInput('');
      setTimeout(() => onAnalyze(), 0);
    } else if (isRepoMode) {
      onCodeChange(repoUrl);
      setTimeout(() => onAnalyze(), 0);
    } else {
      onAnalyze();
    }
  };

  // Render the left panel based on mode
  const renderLeftPanel = () => {
    if (isChatMode) {
      return (
        <section className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelDot} data-color="red" />
            <span className={styles.panelDot} data-color="yellow" />
            <span className={styles.panelDot} data-color="green" />
            <span className={styles.panelTitle}>Chat</span>
          </div>
          <div className={styles.chatContainer}>
            <div className={styles.chatIcon}>💬</div>
            <h3 className={styles.chatHeading}>Ask anything about code</h3>
            <p className={styles.chatSubtext}>
              Get help with programming concepts, debugging strategies, or code explanations.
            </p>
            <textarea
              className={styles.chatTextarea}
              placeholder={mainPanelValues.chatPlaceholder}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isActionDisabled) handleAction();
                }
              }}
              rows={5}
            />
          </div>
        </section>
      );
    }

    if (isRepoMode) {
      return (
        <section className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelDot} data-color="red" />
            <span className={styles.panelDot} data-color="yellow" />
            <span className={styles.panelDot} data-color="green" />
            <span className={styles.panelTitle}>Repository</span>
          </div>
          <div className={styles.chatContainer}>
            <div className={styles.chatIcon}>📁</div>
            <h3 className={styles.chatHeading}>Analyze a Repository</h3>
            <p className={styles.chatSubtext}>
              Enter a GitHub repository URL to analyze its structure, architecture, and code quality.
            </p>
            <input
              type="url"
              className={styles.repoInput}
              placeholder={mainPanelValues.repoPlaceholder}
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!isActionDisabled) handleAction();
                }
              }}
            />
          </div>
        </section>
      );
    }

    // Default: code editor for explain/review/debug/tests
    return (
      <section className={styles.editorPanel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelDot} data-color="red" />
          <span className={styles.panelDot} data-color="yellow" />
          <span className={styles.panelDot} data-color="green" />
          <span className={styles.panelTitle}>Code Editor</span>
          <select
            value={editorLanguage}
            onChange={(e) => onLanguageChange(e.target.value as EditorLanguage)}
            className={styles.langDropdown}
          >
            {editorLanguages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.editorContainer}>
          {mounted && MonacoEditor ? (
            <MonacoEditor
              height="100%"
              language={editorLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value: string | undefined) => onCodeChange(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'Geist Mono', 'Fira Code', 'Consolas', monospace",
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
                renderLineHighlight: 'gutter',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                bracketPairColorization: { enabled: true },
                wordWrap: 'on',
              }}
            />
          ) : (
            <div className={styles.editorLoading}>
              <div className={styles.editorLoadingSpinner} />
              <span>Loading editor...</span>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      <main className={styles.mainPanel}>
        {/* ═══ Header Bar ═══ */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logoMark} />
            <h1 className={styles.headerTitle}>InsightCoder</h1>
            <span className={styles.headerBadge}>AI</span>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.modelSelector}>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value as ModelId)}
                className={styles.modelDropdown}
              >
                {modelOptions.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* ═══ Mode Tabs ═══ */}
        <nav className={styles.modeTabs}>
          {featureModes.map((mode) => (
            <button
              key={mode.id}
              className={`${styles.modeTab} ${selectedMode === mode.id ? styles.modeTabActive : ''
                }`}
              onClick={() => handleModeTabClick(mode.id)}
              title={mode.label}
            >
              <span className={styles.modeIcon}>{mode.icon}</span>
              <span className={styles.modeLabel}>{mode.label}</span>
            </button>
          ))}
        </nav>

        {/* ═══ Split Pane Workspace ═══ */}
        <div className={styles.workspace}>
          {/* Left: Mode-specific input */}
          {renderLeftPanel()}

          {/* Divider */}
          <div className={styles.divider} />

          {/* Right: AI Response */}
          <section className={styles.responsePanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>AI Response</span>
              {response && (
                <button
                  className={styles.copyBtn}
                  onClick={handleCopyResponse}
                  title={mainPanelValues.copyResponse}
                >
                  <CopyIcon />
                  <span>{copied ? mainPanelValues.copiedText : mainPanelValues.copyResponse}</span>
                </button>
              )}
            </div>
            <div className={styles.responseContainer}>
              {isLoading && !response ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingPulse} />
                  <span className={styles.loadingText}>
                    {buttonConfig.loading}
                  </span>
                  <div className={styles.loadingDots}>
                    <span /><span /><span />
                  </div>
                </div>
              ) : response ? (
                <div className={styles.responseContent}>
                  {isLoading && (
                    <div className={styles.streamingIndicator}>
                      <div className={styles.streamingBar} />
                      <span>Streaming response...</span>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      code({ inline, className, children, ...props }: CodeProps) {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!inline && match) {
                          return (
                            <div className={styles.codeBlockWrapper}>
                              <div className={styles.codeBlockHeader}>
                                <span>{match[1]}</span>
                                <button
                                  className={styles.codeBlockCopy}
                                  onClick={() => navigator.clipboard.writeText(String(children))}
                                  title="Copy code"
                                >
                                  <CopyIcon />
                                </button>
                              </div>
                              <SyntaxHighlighter
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                style={oneDark as any}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                  borderRadius: '0 0 0.5rem 0.5rem',
                                  padding: '1rem',
                                  background: '#0d1017',
                                  fontSize: '0.85rem',
                                  overflowX: 'auto',
                                  margin: 0,
                                }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          );
                        }
                        return (
                          <code className={styles.inlineCode} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {response}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className={styles.responsePlaceholder}>
                  <div className={styles.placeholderIcon}>✨</div>
                  <p>{mainPanelValues.responsePlaceholder}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ═══ Action Bar ═══ */}
        <div className={styles.actionBar}>
          <button
            className={`${styles.analyzeBtn} ${isLoading ? styles.analyzeBtnLoading : ''}`}
            onClick={handleAction}
            disabled={isActionDisabled}
          >
            {isLoading ? (
              <>
                <div className={styles.btnSpinner} />
                <span>{buttonConfig.loading}</span>
              </>
            ) : (
              <>
                <span className={styles.btnIcon}>{buttonConfig.icon}</span>
                <span>{buttonConfig.action}</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* ═══ Confirmation Dialog ═══ */}
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
