import Layout from '../components/Layout';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';

// Register service worker for offline support
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('Service Worker registration failed:', err);
    });
  });
}

export default function App({ Component, pageProps }) {
  // Get custom layout if defined by page
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  
  return (
    <ThemeProvider>
      {getLayout(<Component {...pageProps} />)}
    </ThemeProvider>
  );
}
