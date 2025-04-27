// app/components/ui/SectionLoader.tsx
import React from 'react';
import { cn } from '@/app/lib/utils';

interface SectionLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  variant?: 'dots' | 'spinner' | 'progress';
}

const SectionLoader: React.FC<SectionLoaderProps> = ({
  text = 'Loading',
  size = 'md',
  showText = true,
  className = '',
  variant = 'dots',
}) => {
  const sizeClasses = {
    sm: { container: 'py-4', text: 'text-sm', loader: 'w-4 h-4' },
    md: { container: 'py-6', text: 'text-base', loader: 'w-5 h-5' },
    lg: { container: 'py-8', text: 'text-lg', loader: 'w-6 h-6' },
  };

  const currentSize = sizeClasses[size];

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${currentSize.loader} border-2 border-white/30 rounded-full animate-spin border-t-transparent`} />
        );
      case 'progress':
        return (
          <div className={`w-32 h-1 ${currentSize.loader === 'w-4 h-4' ? 'h-0.5' : 'h-1'} bg-white/20 rounded-full overflow-hidden`}>
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-progress" />
          </div>
        );
      default: // dots
        return (
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${currentSize.loader} bg-indigo-600 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center",
      currentSize.container,
      className
    )}>
      {renderLoader()}
      
      {showText && (
        <div className={cn(
          "mt-3 font-medium text-indigo-700 dark:text-indigo-300",
          currentSize.text
        )}>
          {text}
        </div>
      )}
    </div>
  );
};

export default SectionLoader;