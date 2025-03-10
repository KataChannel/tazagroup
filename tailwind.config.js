/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      order: {
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10'
      },
      colors: {
        light: {
          background: '#fff',
          text: '#000',
          primary: '#3366ff',
          secondary: '#f0f0f0',
        },
        dark: {
          background: '#111',
          text: '#fff',
          primary: '#00ccff',
          secondary: '#333',
        },
      },
      width: {
          'screen-40': 'calc(100% - 160px)',      
          'screen-60': 'calc(100% - 240px)',   
          'screen-14': 'calc(100vw - 3.5rem)',     
      },
      height: {
          'screen-16': 'calc(100vh - 4rem)',              
          'screen-14': 'calc(100vh - 3.5rem)', 
          'screen-12': 'calc(100vh - 3rem)',                
          'screen-28': 'calc(100vh - 7rem)',                
      },
    },
    screens: {
        sm: '540px',
        md: '720px',
        lg: '960px',
        xl: '1200px',
    },
  },
  plugins: [],
}

