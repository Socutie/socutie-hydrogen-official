import {motion} from 'framer-motion';
import React from 'react';

export function FadeInDiv({children, offsetY = 40, viewportAmount = 0.3, duration = 0.4}: {children: React.ReactNode, offsetY?: number, viewportAmount?: number, duration?: number}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offsetY }}          // start hidden & slightly down
      whileInView={{ opacity: 1, y: 0 }}       // fade in & move up
      transition={{ duration, ease: "easeOut" }}
      viewport={{ once: true, amount: viewportAmount }}
    >
      {children}
    </motion.div>
  )
}