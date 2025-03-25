import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
const rootElement = document.getElementById('root');
if (!rootElement)
    throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(_jsx(React.StrictMode, { children: _jsx(App, {}) }));
