import React, { useRef, useEffect } from 'react';

const InViewChecker = ({ onInView, options }) => {
  const targetRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onInView();
          }
        });
      },
      options
    );

    observer.observe(targetRef.current);

    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  }, [onInView, options]);

  return <div ref={targetRef} style={{ height: '100px' }} />; // Change the style or use children based on your needs
};

export default InViewChecker;
