import React from 'react';
import { motion } from 'framer-motion';
import { Binary, Layers, GitBranch, ArrowDown, Hash, ChevronRight } from 'lucide-react';

const steps = [
  {
    title: "Tokenizer",
    subtitle: "Input Preprocessing",
    icon: <Binary size={22} color="#06b6d4" />,
    description: "Splits C++ strings into sequential token arrays based on whitespace and matches them to a vocabulary index of 21,226 items.",
    color: "#06b6d4"
  },
  {
    title: "Embedding Layer",
    subtitle: "Dimensionality Expansion",
    icon: <Layers size={22} color="#6366f1" />,
    description: "Transforms integer token indices into high-density 128-dimensional continuous vector embeddings representing code semantics.",
    color: "#6366f1"
  },
  {
    title: "GRU (Gated Recurrent Unit)",
    subtitle: "Sequential Context Engine",
    icon: <GitBranch size={22} color="#7c3aed" />,
    description: "Processes sequential code embeddings, maintaining context and learning long-range dependencies across the code syntax.",
    color: "#7c3aed"
  },
  {
    title: "Dense (Softmax) Output",
    subtitle: "Probability Mapping",
    icon: <Hash size={22} color="#ec4899" />,
    description: "Maps the hidden state output to the entire vocabulary space, applying Softmax to yield probabilities for the next token.",
    color: "#ec4899"
  }
];

export default function ModelPipeline() {
  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '700px',
        margin: '0 auto'
      }}>
        {/* Input Node */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel"
          style={{
            padding: '1rem 2rem',
            borderLeft: '4px solid var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px'
          }}
        >
          <span style={{ color: 'var(--color-secondary)' }}>input_code</span> = "vector&lt;int&gt;"
        </motion.div>

        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            {/* Connecting Arrow */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <ArrowDown size={20} color="var(--text-muted)" className="animate-pulse-slow" />
            </motion.div>

            {/* Pipeline Step Card */}
            <motion.div 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="glass-panel"
              style={{
                width: '100%',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'flex-start',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.01)',
                borderLeft: `4px solid ${step.color}`
              }}
            >
              {/* Background gradient hint */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, ${step.color}05 0%, transparent 100%)`,
                pointerEvents: 'none'
              }} />

              {/* Icon container */}
              <div style={{
                background: `${step.color}15`,
                padding: '0.75rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${step.color}25`
              }}>
                {step.icon}
              </div>

              {/* Card content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{step.title}</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: step.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {step.subtitle}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          </React.Fragment>
        ))}

        {/* Output Connecting Arrow */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <ArrowDown size={20} color="var(--text-muted)" />
        </motion.div>

        {/* Output Node */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel"
          style={{
            padding: '1rem 2rem',
            borderLeft: '4px solid var(--color-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.05))',
            borderColor: 'rgba(124, 58, 237, 0.3)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <span style={{ color: 'var(--color-primary)' }}>prediction</span> = "nums"
        </motion.div>
      </div>
    </div>
  );
}
