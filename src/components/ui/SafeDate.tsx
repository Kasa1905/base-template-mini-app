import { useState, useEffect } from 'react';

interface SafeDateProps {
  timestamp?: string | number;
  dateValue?: string | Date;
  format?: 'locale' | 'localeString' | 'iso' | 'full';
}

/**
 * Safe date component that avoids hydration mismatches
 * Renders dates only on client side to prevent SSR/hydration issues
 */
export function SafeDate({ timestamp, dateValue, format = 'locale' }: SafeDateProps) {
  const [formattedDate, setFormattedDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    try {
      let date;
      if (timestamp) {
        // Handle timestamp (could be in seconds or milliseconds)
        const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
        date = new Date(ts < 10000000000 ? ts * 1000 : ts);
      } else if (dateValue) {
        date = new Date(dateValue);
      } else {
        date = new Date();
      }

      if (isNaN(date.getTime())) {
        setFormattedDate('Invalid Date');
        return;
      }

      switch (format) {
        case 'locale':
          setFormattedDate(date.toLocaleDateString());
          break;
        case 'localeString':
          setFormattedDate(date.toLocaleString());
          break;
        case 'iso':
          setFormattedDate(date.toISOString().split('T')[0]);
          break;
        case 'full':
          setFormattedDate(date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }));
          break;
        default:
          setFormattedDate(date.toLocaleDateString());
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      setFormattedDate('Date unavailable');
    }
  }, [timestamp, dateValue, format]);

  // Render placeholder during SSR
  if (!isClient) {
    return <span className="opacity-50">Loading...</span>;
  }

  return <span>{formattedDate}</span>;
}

/**
 * Safe current date component for forms
 */
export function SafeCurrentDate() {
  const [currentDate, setCurrentDate] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  if (!isClient) {
    return <span>Loading...</span>;
  }

  return currentDate;
}

export default SafeDate;
