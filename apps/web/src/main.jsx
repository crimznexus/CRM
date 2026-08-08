import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import { convexClient } from './lib/convex.js'
import { authClient } from './lib/auth-client.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConvexBetterAuthProvider client={convexClient} authClient={authClient}>
      <App />
    </ConvexBetterAuthProvider>
  </StrictMode>,
)
