import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Auto-detect and route API calls to the Cloud Run backend if hosted on external domains like Vercel
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  let url = "";
  if (typeof input === "string") {
    url = input;
  } else if (input && typeof input === "object" && "url" in input) {
    url = (input as any).url;
  }

  // Check if the URL contains "/api/"
  const apiIndex = url.indexOf("/api/");
  if (apiIndex !== -1) {
    const apiBase = ((import.meta as any).env?.VITE_API_URL as string | undefined) || (() => {
      const origin = window.location.origin;
      if (!origin.includes("europe-west2.run.app") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
        return "https://ais-dev-zd5aptb5l4it23fd5y4q5b-266917751289.europe-west2.run.app";
      }
      return "";
    })();
    
    if (apiBase) {
      const cleanBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
      const apiPath = url.substring(apiIndex);
      const newUrl = cleanBase + apiPath;

      if (typeof input === "string") {
        return originalFetch(newUrl, init);
      } else {
        try {
          return originalFetch(new Request(newUrl, input as any));
        } catch (e) {
          return originalFetch(newUrl, init);
        }
      }
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
