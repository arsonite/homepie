import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const defineCapitalizePrototypeFunction = () => {
    // Definining a custom capitalize function for all global strings
    Object.defineProperty(String.prototype, 'capitalize', {
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        enumerable: false,
    });
};

defineCapitalizePrototypeFunction();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
