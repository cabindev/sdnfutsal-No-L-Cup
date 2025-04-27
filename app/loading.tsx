// app/loading.tsx
import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
      {/* Modern animated dots */}
      <div className="flex space-x-3 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 bg-white rounded-full animate-pulse"
            style={{
              animationDuration: '1.5s',
              animationDelay: `${i * 0.2}s`,
              animationIterationCount: 'infinite'
            }}
          />
        ))}
      </div>

      {/* Animated text */}
      <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">
        Loading 
      </h2>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden mt-6">
        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-progress" />
      </div>

      {/* Modern particle animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 6 + 4;
          const duration = Math.random() * 4 + 3;
          const delay = Math.random() * 5;
          const color = i % 2 === 0 ? 'bg-amber-400' : 'bg-orange-400';
          
          return (
            <div 
              key={i}
              className={`absolute rounded-full ${color} opacity-80`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${duration}s infinite ease-in-out ${delay}s`,
                filter: 'blur(1px)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}