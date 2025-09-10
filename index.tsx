import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import type { Root } from 'react-dom/client';

// Define a type for our custom property on the window object to store the React root.
// This prevents TypeScript errors and ensures type safety.
declare global {
  interface Window {
    _reactRoot?: Root;
  }
}


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// To prevent the app from crashing on hot-reloads in certain development environments,
// we ensure that the React root is created only once.
// If the root doesn't exist on the window object, we create it and attach it.
// Subsequent executions of this script will reuse the existing root.
if (!window._reactRoot) {
  window._reactRoot = ReactDOM.createRoot(rootElement);
}

// Render the application into the root. On hot-reloads, this will update
// the existing application instance rather than creating a new one.
window._reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);