/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './js/**/*.js'
  ],
  safelist: [
    'is-visible',
    'is-scrolled',
    'is-open',
    'has-error',
    'has-success',
    'is-loading',
    'shadow-sm',
    'border-red-600',
    'border-green-500',
    'border-gray-300',
    'opacity-0',
    'opacity-50',
    'opacity-100',
    'pointer-events-none',
    'bg-green-50',
    'text-green-700',
    'border-green-200',
    'bg-red-50',
    'text-red-700',
    'border-red-200',
    'hidden',
    'skeleton',
    'contain-card'
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px'
    },
    extend: {
      colors: {
        primary: '#3AAEDC',
        'primary-dark': '#2490BA',
        deep: '#1A2B5C',
        ice: '#E8F7FD',
        accent: '#0F6080',
        'gray-light': '#F4F6F8',
        'gray-text': '#4A4A4A',
        whatsapp: '#25D366'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Barlow', 'Inter', 'system-ui', 'sans-serif']
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'lead': ['1.25rem', { lineHeight: '1.6' }]
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        'sm': '0 6px 22px rgba(26, 43, 92, 0.12)',
        'md': '0 14px 40px rgba(26, 43, 92, 0.18)',
        'lg': '0 4px 12px rgba(26, 43, 92, 0.15)'
      },
      scale: {
        '102': '1.02',
        '98': '0.98'
      }
    }
  },
  plugins: []
}
