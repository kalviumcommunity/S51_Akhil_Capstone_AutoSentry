import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import App from './App.jsx'


const supabase = createClient(
  "https://iftdqglvxcgcurdolqpt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmdGRxZ2x2eGNnY3VyZG9scXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM4NTA3NTcsImV4cCI6MjAyOTQyNjc1N30.vGMLA5BWDi3q3s5-_s-4x6_yc6NGmA_8vruyLQZxWjQ"
); 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <Auth0Provider
        domain="dev-prcadxa6cb3hoydl.us.auth0.com"
        clientId="KBPcKOIylTB5bzloJPwUHktUOQRqC9iH"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0Provider>
    </SessionContextProvider>
  </React.StrictMode>
);
