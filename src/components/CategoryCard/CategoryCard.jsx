import React, { memo, useState, useEffect, useCallback } from 'react';
import s from './CategoryCard.module.css';

export const CategoryCard = memo(({ category, items, onSelect, isExpanded }) => {
  const [state, setState] = useState({
    isAnimating: false,
    showContent: false
  });

  useEffect(() => {
    if (isExpanded) {
      setState(prev => ({ ...prev, isAnimating: true }));
      
      const expandTimer = setTimeout(() => {
        setState(prev => ({ ...prev, showContent: true }));
        
        const animationTimer = setTimeout(() => {
          setState(prev => ({ ...prev, isAnimating: false }));
        }, 900);

        return () => clearTimeout(animationTimer);
      }, 300);

      return () => clearTimeout(expandTimer);
    } else {
      setState({ isAnimating: false, showContent: false });
    }
  }, [isExpanded]);

  const handleClick = useCallback(() => {
    if (!state.isAnimating) {
      onSelect(category);
    }
  }, [category, onSelect, state.isAnimating]);

  return (
    <div className={s.categoryCard} onClick={handleClick}>
      <CategoryCardContent 
        category={category} 
        itemCount={items.length}
        isExpanded={isExpanded}
      />
      <CategoryCardItems 
        items={items}
        isExpanded={isExpanded}
        showContent={state.showContent}
      />
    </div>
  );
}); 