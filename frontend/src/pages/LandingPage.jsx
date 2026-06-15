import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Code2, Cpu, FastForward, Terminal } from 'lucide-react';
import ModelPipeline from '../components/ModelPipeline';

const Github = ({ size = 20, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function LandingPage({ setActivePage }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ padding: '0 2rem 6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}
    >
      {/* HERO SECTION */}
      <section style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        padding: '6rem 1rem 4rem 1rem',
        position: 'relative'
      }}>
        {/* Glow behind hero */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <motion.div 
          variants={itemVariants}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '50px',
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#c084fc',
            marginBottom: '2rem',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)'
          }}
        >
          <Zap size={14} />
          <span>Next-Generation Deep Learning Code Completion</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-gradient"
          style={{ 
            fontSize: '4.5rem', 
            fontWeight: 800, 
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}
        >
          CodePilot AI
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          style={{ 
            fontSize: '1.4rem', 
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            lineHeight: 1.5,
            fontWeight: 400,
            marginBottom: '3rem'
          }}
        >
          Deep Learning Powered Code Autocomplete Engine. Autocomplete C++ structures and generate entire code blocks with millisecond latencies.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          style={{ display: 'flex', gap: '1.25rem' }}
        >
          <button 
            onClick={() => setActivePage('dashboard')}
            className="btn-primary"
            style={{ fontSize: '1.05rem', padding: '0.88rem 2.25rem' }}
          >
            <Play size={18} fill="white" />
            <span>Try Now</span>
          </button>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '1.05rem', padding: '0.88rem 2.25rem' }}
          >
            <Github size={18} />
            <span>GitHub Repository</span>
          </a>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '6rem 1rem 3rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Built for Extreme Developer Velocity
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Powered by modern deep learning and high-performance server structures.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="glass-card">
            <div style={{ color: 'var(--color-secondary)', marginBottom: '1.25rem' }}>
              <Code2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Code Completion</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Get instant, single next-token recommendations as you type. Predict keywords, symbols, variables, or functions.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="glass-card">
            <div style={{ color: '#ec4899', marginBottom: '1.25rem' }}>
              <FastForward size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Code Generation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Expand code instructions using top-k sampling. Autocompletes long-form structural blocks from simple prompt headers.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="glass-card">
            <div style={{ color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              <Cpu size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>TensorFlow Model</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Integrated with a Gated Recurrent Unit (GRU) neural network, trained directly on 1500+ standard LeetCode C++ solutions.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants} className="glass-card">
            <div style={{ color: '#eab308', marginBottom: '1.25rem' }}>
              <Terminal size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>FastAPI Backend</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              High-throughput asynchronous routes written in FastAPI, powered by Uvicorn, delivering microsecond request processing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PIPELINE ARCHITECTURE SECTION */}
      <section style={{ padding: '6rem 1rem 0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
            Model Inference Architecture
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            The pipeline that transforms code strings into real-time syntactic predictions.
          </p>
        </div>

        <ModelPipeline />
      </section>
    </motion.div>
  );
}
