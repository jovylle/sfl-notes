(() => {
  // Helper function to wait for an element to appear in the DOM
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

  // Keys for localStorage to store notes data
  const domainKey = `autosave_notes_${window.location.hostname}`;
  const positionKey = `notes_position_${window.location.hostname}`;
  const stateKey = `notes_state_${window.location.hostname}`;
  
  // Global variables
  let textarea;
  let toggleButton;
  let isDragging = false;
  let offsetX, offsetY;

  // Load saved state from localStorage
  const loadSavedState = () => {
    const savedState = localStorage.getItem(stateKey);
    return savedState ? JSON.parse(savedState) : {
      visible: true,  // Default to visible
      x: window.innerWidth - 100,  // Default position X
      y: 20  // Default position Y
    };
  };

  // Save current state to localStorage
  const saveState = (state) => {
    localStorage.setItem(stateKey, JSON.stringify(state));
  };

  // Create the toggle button that shows/hides the notes
  const createToggleButton = () => {
    const savedState = loadSavedState();
    
    // Create button element
    toggleButton = document.createElement('button');
    toggleButton.id = 'notes-toggle-btn';
    toggleButton.textContent = savedState.visible ? '📝 Hide Notes' : '📝 Show Notes';
    
    // Apply styles to the button
    Object.assign(toggleButton.style, {
      position: 'fixed',
      left: `${savedState.x}px`,
      top: `${savedState.y}px`,
      zIndex: '1001',  // High z-index to stay on top
      padding: '8px 12px',
      backgroundColor: '#f0c14b',  // Yellow color
      color: '#333',
      border: 'none',
      borderRadius: '4px',
      cursor: 'move',  // Indicates draggable
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      userSelect: 'none'  // Prevent text selection
    });

    // Drag functionality - mouse down event
    toggleButton.addEventListener('mousedown', (e) => {
      isDragging = true;
      // Calculate offset from mouse to button corner
      offsetX = e.clientX - toggleButton.getBoundingClientRect().left;
      offsetY = e.clientY - toggleButton.getBoundingClientRect().top;
      e.preventDefault();
    });

    // Drag functionality - mouse move event
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // Calculate new position
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      // Move button
      toggleButton.style.left = `${x}px`;
      toggleButton.style.top = `${y}px`;
      
      // Update notes position relative to button
      updateNotePosition();
    });

    // Drag functionality - mouse up event
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        // Save new position and visibility state
        saveState({
          visible: !textarea.style.display || textarea.style.display === 'block',
          x: parseInt(toggleButton.style.left),
          y: parseInt(toggleButton.style.top)
        });
      }
    });

    // Toggle visibility when clicked (without dragging)
    toggleButton.addEventListener('click', (e) => {
      if (isDragging) return;
      
      const isVisible = textarea.style.display !== 'none';
      // Toggle visibility
      textarea.style.display = isVisible ? 'none' : 'block';
      toggleButton.textContent = isVisible ? '📝 Show Notes' : '📝 Hide Notes';
      
      // Save new state
      saveState({
        visible: !isVisible,
        x: parseInt(toggleButton.style.left),
        y: parseInt(toggleButton.style.top)
      });
    });

    // Add button to DOM
    document.body.appendChild(toggleButton);
    return toggleButton;
  };

  // Create the notes textarea
  const createNotesArea = () => {
    const savedState = loadSavedState();
    
    // Create textarea element
    textarea = document.createElement('textarea');
    textarea.placeholder = 'Write your Sunflower Land notes here...';

    // Apply styles to the textarea
    Object.assign(textarea.style, {
      position: 'fixed',
      width: '350px',
      height: '500px',
      fontSize: '1.2rem',
      backgroundColor: 'rgba(255, 253, 208, 0.95)',  // Semi-transparent yellow
      border: '2px solid #f0c14b',
      borderRadius: '8px',
      zIndex: '1000',  // Just below the button
      outline: 'none',
      padding: '15px',
      resize: 'vertical',  // Allow vertical resizing
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: savedState.visible ? 'block' : 'none',  // Initial visibility
      opacity: '0.95',  // Slightly transparent
      pointerEvents: 'auto'  // Ensure it's interactive
    });

    // Load saved notes content
    textarea.value = localStorage.getItem(domainKey) || '';

    // Auto-save when content changes
    textarea.addEventListener('input', () => {
      localStorage.setItem(domainKey, textarea.value);
    });

    // Visual feedback on focus
    textarea.addEventListener('focus', () => {
      textarea.style.opacity = '1';
    });

    // Visual feedback on blur
    textarea.addEventListener('blur', () => {
      textarea.style.opacity = '0.9';
    });

    // Blur when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target !== textarea) {
        textarea?.blur();
      }
    });

    // Add textarea to DOM
    document.body.appendChild(textarea);
    return textarea;
  };

  // Update notes position relative to toggle button
  const updateNotePosition = () => {
    if (!toggleButton || !textarea) return;
    const buttonRect = toggleButton.getBoundingClientRect();
    // Position notes below the button with a small gap
    textarea.style.left = `${buttonRect.left}px`;
    textarea.style.top = `${buttonRect.bottom + 10}px`;
  };

  // Initialize the extension
  const init = () => {
    // Wait for the game to load (detected by specific image)
    waitForElement('img[src="https://sunflower-land.com/game-assets/land/mushroom_island.png"]', () => {
      // Create UI elements
      createToggleButton();
      createNotesArea();
      updateNotePosition();
      
      // Update position when window resizes
      window.addEventListener('resize', updateNotePosition);
    });
  };

  // Start the extension
  init();
})();