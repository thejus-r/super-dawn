import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./app.css"

// biome-ignore lint/style/noNonNullAssertion: react's create root
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>Hello World</h1>
  </StrictMode>,
)
