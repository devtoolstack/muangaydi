import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../ProductContext';

export default function LoadingBar() {
  const { loading } = useProducts();
  const location = useLocation();
  const [navLoading, setNavLoading] = useState(false);

  // Short loading state on route change to provide feedback
  useEffect(() => {
    setNavLoading(true);
    const timer = setTimeout(() => {
      setNavLoading(false);
    }, 600); // Mimic a quick load

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isActive = loading || navLoading;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ width: "0%", opacity: 0, height: "2px" }}
          animate={{ 
            width: "100%", 
            opacity: 1,
            height: ["2px", "4px", "3px"],
          }}
          exit={{ opacity: 0, height: "0px" }}
          transition={{ 
            width: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.3 },
            height: { duration: 0.6, times: [0, 0.7, 1] }
          }}
          className="fixed top-0 left-0 z-[9999] overflow-hidden"
          style={{ width: "100%" }}
        >
          <motion.div 
            className="w-full h-full bg-gradient-to-r from-brand-primary via-white to-brand-primary bg-[length:200%_100%]"
            animate={{ 
              backgroundPosition: ["0% 0%", "200% 0%"] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "linear" 
            }}
            style={{ 
              boxShadow: "0 0 10px rgba(255, 56, 92, 0.5), 0 0 20px rgba(255, 56, 92, 0.3)" 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
