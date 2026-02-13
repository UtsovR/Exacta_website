import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#05060a',
        surface: '#0b0d14',
        surface2: '#121624',
        text: '#e8ecf5',
        muted: '#9aa2b5',
        primaryNeon: '#6ddcff',
        secondaryNeon: '#9c6bff'
      },
      fontFamily: {
        display: ['Sora', 'Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        neon: '0 10px 40px rgba(109, 220, 255, 0.35), 0 10px 50px rgba(156, 107, 255, 0.25)',
        card: '0 18px 40px rgba(0, 0, 0, 0.45)',
        glowSoft: '0 0 0 1px rgba(255,255,255,0.04), 0 12px 32px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(109,220,255,0.08), transparent 35%), radial-gradient(circle at 80% 0%, rgba(156,107,255,0.12), transparent 28%), radial-gradient(circle at 50% 90%, rgba(109,220,255,0.08), transparent 28%)"
      }
    }
  },
  plugins: []
};

export default config;
