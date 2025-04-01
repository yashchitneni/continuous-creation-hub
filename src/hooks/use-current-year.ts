
import { useState, useEffect } from 'react';

export function useCurrentYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  
  useEffect(() => {
    // Update the year once at midnight on January 1st if the page stays open
    const timer = setInterval(() => {
      const newYear = new Date().getFullYear();
      if (newYear !== year) {
        setYear(newYear);
      }
    }, 1000 * 60 * 60); // Check every hour
    
    return () => clearInterval(timer);
  }, [year]);
  
  return year;
}
