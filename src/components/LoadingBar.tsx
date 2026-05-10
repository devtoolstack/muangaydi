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
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            scaleX: { duration: 1.5, ease: "easeOut" },
            opacity: { duration: 0.2 }
          }}
          style={{ originX: 0 }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary z-[9999]"
        />
      )}
    </AnimatePresence>
  );
}
