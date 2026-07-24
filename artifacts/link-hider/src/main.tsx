import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Redirect BEFORE mounting React — zero flash of the UI
const params = new URLSearchParams(window.location.search);
const r = params.get('r');
if (r) {
  try {
    const dest = atob(r);
    window.location.replace(dest);
  } catch {
    // invalid param, fall through to render the app
  }
} else {
  createRoot(document.getElementById('root')!).render(<App />);
}
