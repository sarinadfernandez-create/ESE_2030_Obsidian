/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': 'var(--bg-base)',
        'bg-panel': 'var(--bg-panel)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-glass': 'var(--bg-glass)',
        'border-subtle': 'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'border-strong': 'var(--border-strong)',
        'border-glow': 'var(--border-glow)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-bright': 'var(--accent-bright)',
        'accent-dim': 'var(--accent-dim)',
        warn: 'var(--warn)',
        success: 'var(--success)',
        'note-yellow': 'var(--note-yellow)',
        'note-yellow-bg': 'var(--note-yellow-bg)',
        'viz-blue': 'var(--viz-blue)',
        'viz-yellow': 'var(--viz-yellow)',
        'viz-red': 'var(--viz-red)',
        'viz-green': 'var(--viz-green)',
        'viz-purple': 'var(--viz-purple)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        glow: '0 0 0 1px var(--border-glow), 0 0 24px var(--accent-glow)',
        glass:
          '0 1px 0 0 rgba(255, 255, 255, 0.03) inset, 0 24px 48px -12px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}
