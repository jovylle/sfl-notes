(() => {
  const domainKey = `autosave_notes_${window.location.hostname}`;

  // Wait for the image to exist in the DOM
  const waitForElement = (selector, callback) => {
    const observer = new MutationObserver(() => {
      const target = document.querySelector(selector);
      if (target) {
        observer.disconnect();
        callback(target);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  waitForElement('img[src="https://sunflower-land.com/game-assets/land/mushroom_island.png"]', (image) => {
    // Create textarea element
    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Write your notes here...';

    // Styling
    Object.assign(textarea.style, {
      position: 'absolute',
      width: '350px',
      height: '500px', // Minimum height, can expand
      fontSize: '1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      border: '1px solid #ccc',
      borderRadius: '5px',
      zIndex: '10',
      outline: 'none',
      padding: '10px',
      resize: 'both',
      opacity: '0.8', // Increased non-focus opacity
      transition: 'opacity 0.2s ease-in-out',
    });

    // Function to keep the note following the image
    const updatePosition = () => {
      const rect = image.getBoundingClientRect();
      textarea.style.left = `${rect.right - 50}px`; // Move 150px left
      textarea.style.top = `${rect.top}px`;

      // Keep updating its position
      requestAnimationFrame(updatePosition);
    };

    // Load saved notes
    textarea.value = localStorage.getItem(domainKey) || '';

    // Save on input
    textarea.addEventListener('input', () => {
      localStorage.setItem(domainKey, textarea.value);
    });

    // Increase opacity on focus
    textarea.addEventListener('focus', () => {
      textarea.style.opacity = '1';
    });

    // Restore opacity when blurred
    textarea.addEventListener('blur', () => {
      textarea.style.opacity = '0.8';
    });

    // Click outside to remove focus
    document.addEventListener('click', (event) => {
      if (event.target !== textarea) {
        textarea.blur();
      }
    });

    // Append to body and start tracking the position
    document.body.appendChild(textarea);
    updatePosition(); // Start animation loop
  });
})();
