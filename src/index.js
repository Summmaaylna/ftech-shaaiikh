import React from "react"
import ReactDOM from "react-dom/client"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import App from "./App"
// Import scroll animations utility
import { initScrollAnimations } from './utils/scrollAnimations.js'

// Initialize scroll animations when the app starts
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations({
    debug: process.env.NODE_ENV === 'development',
    once: false,
    resetOnNavigation: true
  });
});

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
