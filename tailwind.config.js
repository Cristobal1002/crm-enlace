/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily:{
        nunito:['Nunito']
      },
      backgroundImage: theme => ({
        'login-pattern': "url('/assets/images/bg_login_enlace.png')",
        'home-pattern': "url('/assets/images/construir-cohete.png')"
      })
    },
  },
  plugins: [],
}