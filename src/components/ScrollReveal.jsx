import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({ 
  children, 
  variant = 'fadeUp', 
  delay = 0, 
  duration = 0.8,
  width = '100%',
  className = ''
}) => {
  const variants = {
    fadeUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration, delay, ease: [0.16, 1, 0.3, 1] } }
    },
    fadeLeft: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0, transition: { duration, delay, ease: [0.16, 1, 0.3, 1] } }
    },
    fadeRight: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0, transition: { duration, delay, ease: [0.16, 1, 0.3, 1] } }
    },
    tilt: {
      hidden: { opacity: 0, y: 50, rotateX: 20 },
      visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration, delay, ease: [0.16, 1, 0.3, 1] } }
    }
  };

  return (
    <div style={{ position: 'relative', width, overflow: 'hidden' }} className={className}>
      <motion.div
        variants={variants[variant]}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </div>
  );
};
