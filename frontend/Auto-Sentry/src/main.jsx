import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-prcadxa6cb3hoydl.us.auth0.com"
    clientId="KBPcKOIylTB5bzloJPwUHktUOQRqC9iH"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
