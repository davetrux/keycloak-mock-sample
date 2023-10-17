import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AuthContextProvider from "./context/AuthContextProvider.tsx"

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </AuthContextProvider>
)
