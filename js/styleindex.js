tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        'tech': ['"Share Tech Mono"', 'monospace'],
        'orbitron': ['Orbitron', 'sans-serif'],
      },
      colors: {
        'matrix': '#00ff41',
        'hacker': '#00ff9d',
        'dark-terminal': '#0a0a0a',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glow: {
          '0%': { 'text-shadow': '0 0 5px #00ff41' },
          '100%': { 'text-shadow': '0 0 20px #00ff41, 0 0 30px #00ff41' },
        }
      }
    }
  }
}
