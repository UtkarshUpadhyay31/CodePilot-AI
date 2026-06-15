import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Play, Code, Sparkles, Trash2, Copy, Check, Info, Server, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000'; // Default local FastAPI address

export default function DashboardPage({ apiStatus, setApiStatus }) {
  const [code, setCode] = useState('// Write your C++ code context here\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> ');
  const [tokens, setTokens] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [latency, setLatency] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('generation'); // 'generation' or 'prediction'

  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setCode('');
    setResult('');
    setLatency(null);
    setErrorMsg('');
  };

  // Predict endpoint call
  const triggerPrediction = async () => {
    setIsLoading(true);
    setResult('');
    setErrorMsg('');
    setLatency(null);
    const startTime = Date.now();

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, {
        code: code
      });
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setResult(response.data.prediction);
      setActiveTab('prediction');
      setApiStatus('online');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to communicate with prediction API. Ensure backend is running.');
      setApiStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate endpoint call
  const triggerGeneration = async () => {
    setIsLoading(true);
    setResult('');
    setErrorMsg('');
    setLatency(null);
    const startTime = Date.now();

    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, {
        prompt: code,
        tokens: tokens
      });
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setResult(response.data.generated_code);
      setActiveTab('generation');
      setApiStatus('online');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to communicate with generation API. Ensure backend is running.');
      setApiStatus('offline');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.2fr 0.8fr',
      gap: '2rem',
      padding: '0 2rem 4rem 2rem',
      height: 'calc(100vh - 120px)',
      minHeight: '600px',
      maxWidth: '1440px',
      margin: '0 auto'
    }}>
      {/* LEFT COLUMN: MONACO EDITOR */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
          padding: '1.5rem',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          paddingBottom: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={18} color="var(--color-secondary)" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>C++ Solution Workspace</span>
          </div>
          
          <button 
            onClick={handleClear}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem', color: '#ef4444' }}
          >
            <Trash2 size={14} />
            <span>Clear Workspace</span>
          </button>
        </div>

        {/* Monaco Editor Wrapper */}
        <div style={{ 
          flex: 1, 
          borderRadius: '10px', 
          overflow: 'hidden', 
          border: '1px solid rgba(255,255,255,0.05)' 
        }}>
          <Editor
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'var(--font-mono)',
              lineHeight: 22,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              padding: { top: 16, bottom: 16 },
              tabSize: 4,
              insertSpaces: true,
              wordWrap: 'on'
            }}
          />
        </div>
      </motion.div>

      {/* RIGHT COLUMN: CONTROLS & TERMINAL */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          height: '100%',
        }}
      >
        {/* CONTROL CARD */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
            <Sparkles size={18} color="var(--color-primary)" />
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>CodePilot Panel</span>
          </div>

          {/* Token count slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Generation Length</span>
              <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>{tokens} Tokens</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={tokens}
              onChange={(e) => setTokens(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--color-primary)',
                background: 'rgba(255,255,255,0.1)',
                height: '5px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>1 Token</span>
              <span>100 Tokens</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button 
              disabled={isLoading || !code.trim()}
              onClick={triggerPrediction}
              className="btn-secondary"
              style={{
                justifyContent: 'center',
                padding: '0.75rem 1rem',
                opacity: (!code.trim()) ? 0.5 : 1
              }}
            >
              <Code size={16} />
              <span>Predict Next</span>
            </button>
            
            <button 
              disabled={isLoading || !code.trim()}
              onClick={triggerGeneration}
              className="btn-primary"
              style={{
                justifyContent: 'center',
                padding: '0.75rem 1rem',
                opacity: (!code.trim()) ? 0.5 : 1
              }}
            >
              <Sparkles size={16} />
              <span>Generate ({tokens})</span>
            </button>
          </div>
        </div>

        {/* TERMINAL PANEL */}
        <div className="glass-panel" style={{
          flex: 1,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '0.75rem'
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Output Console
            </span>
            
            {result && (
              <button 
                onClick={handleCopy}
                className="btn-secondary"
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '0.3rem' }}
              >
                {isCopied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{isCopied ? 'Copied!' : 'Copy Result'}</span>
              </button>
            )}
          </div>

          {/* Terminal display */}
          <div style={{
            flex: 1,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            padding: '1rem',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88rem',
            border: '1px solid rgba(255,255,255,0.03)',
            position: 'relative'
          }}>
            {/* Loading spinner */}
            {isLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(3,0,20,0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                zIndex: 10
              }}>
                <div className="spinner" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} className="animate-pulse-slow">
                  Processing sequence inference...
                </span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* Error state */}
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', gap: '0.5rem', color: '#ef4444' }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700 }}>Error: </span>
                    <span>{errorMsg}</span>
                  </div>
                </motion.div>
              )}

              {/* No output yet */}
              {!isLoading && !result && !errorMsg && (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  padding: '2rem 1rem'
                }}>
                  <Info size={24} style={{ marginBottom: '0.5rem' }} />
                  <p>Write context code on the workspace editor and select an action to run model prediction.</p>
                </div>
              )}

              {/* Prediction result */}
              {!isLoading && result && !errorMsg && activeTab === 'prediction' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>// NEXT TOKEN PREDICTION</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                    {result}
                  </div>
                  {latency && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>
                      Inference Latency: <span style={{ color: 'var(--text-secondary)' }}>{latency}ms</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Generation result */}
              {!isLoading && result && !errorMsg && activeTab === 'generation' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>// AUTOCOMPLETE GENERATION</span>
                  </div>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    color: '#e2e8f0',
                    lineHeight: 1.6
                  }}>{result}</pre>
                  {latency && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem' }}>
                      Inference Latency: <span style={{ color: 'var(--text-secondary)' }}>{latency}ms</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
