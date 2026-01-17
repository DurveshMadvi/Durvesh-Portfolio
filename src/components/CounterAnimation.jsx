import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const CounterAnimation = ({ value = 0, suffix = '', duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = value / (duration * 60); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <motion.p
      ref={ref}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      className="text-3xl font-bold text-slate-200"
    >
      {displayValue}
      {suffix}
    </motion.p>
  );
};

export default CounterAnimation;
