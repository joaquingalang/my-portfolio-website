import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Layer 2: referrers, country, device. The trusted scan count is the
        server-side counter in `api/_lib/analytics.ts` — this script is dropped
        by ad blockers and privacy browsers, so it measures texture, not volume.
        Requires Web Analytics to be enabled on the Vercel project. */}
    <Analytics />
  </StrictMode>,
)
