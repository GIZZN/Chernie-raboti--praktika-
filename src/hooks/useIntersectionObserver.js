export const useIntersectionObserver = (options = {}) => {
  const elementRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-animate');
        }
      }),
      { threshold: 0.1, rootMargin: '50px', ...options }
    );

    elementRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [options]);

  const setRef = useCallback((index) => (el) => {
    elementRefs.current[index] = el;
  }, []);

  return setRef;
}; 