//components/FloatingRegisterButton.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingRegisterButton() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // แสดงปุ่มเมื่อเลื่อนลงมาเกินหน้าจอแรก
      const shouldShow = window.scrollY > window.innerHeight * 0.5;
      setVisible(shouldShow);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#registration"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-24 right-6 z-50 bg-futsal-orange text-white px-4 py-3 rounded-full
                   shadow-lg flex items-center gap-2 hover:bg-futsal-orange-dark transition-colors"
        >
          <span className="font-medium">สมัครอบรม</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}