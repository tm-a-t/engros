import * as THREE from 'three';

export function addBackground(element: HTMLElement) {
  let destroyAnimation;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        destroyAnimation = initializeAnimation();
      } else {
        destroyAnimation();
      }
    });
  });

  observer.observe(element);
}

