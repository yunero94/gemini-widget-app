import React, { useEffect, useState } from 'react';

interface ClockWidgetProps {
  textColor?: string;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ textColor = '#ffffff' }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateString = date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div 
      className="flex flex-col items-center drop-shadow-lg mb-8 animate-fade-in transition-colors duration-300"
      style={{ color: textColor }}
    >
      <div className="text-xl font-medium opacity-90 mb-1 tracking-wide">{dateString}</div>
      <div className="text-7xl font-bold tracking-tighter leading-none">{timeString}</div>
    </div>
  );
};