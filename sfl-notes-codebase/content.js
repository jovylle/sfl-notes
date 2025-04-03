(() => {
  // Definir waitForElement primero (Mantener tu implementaci車n)
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

  // Resto del c車digo (Tu versi車n con mejoras de master)
  const domainKey = `autosave_notes_${window.location.hostname}`;
  const positionKey = `notes_position_${window.location.hostname}`;
  const stateKey = `notes_state_${window.location.hostname}`;
  
  let textarea;
  let toggleButton;
  let isDragging = false;
  let offsetX, offsetY;

  // Cargar estado guardado (Mantener tu l車gica)
  const loadSavedState = () => {
    const savedState = localStorage.getItem(stateKey);
    return savedState ? JSON.parse(savedState) : {
      visible: true,
      x: window.innerWidth - 100,
      y: 20
    };
  };

  // Guardar estado actual (Mantener tu l車gica)
  const saveState = (state) => {
    localStorage.setItem(stateKey, JSON.stringify(state));
  };

  // Crear bot車n de toggle (Mantener tu implementaci車n + mejoras de master)
  const createToggleButton = () => {
    const savedState = loadSavedState();
    
    toggleButton = document.createElement('button');
    toggleButton.id = 'notes-toggle-btn';
    toggleButton.textContent = savedState.visible ? '?? Hide Notes' : '?? Show Notes';
    
    // Estilos del bot車n (Tus estilos)
    Object.assign(toggleButton.style, {
      position: 'fixed',
      left: `${savedState.x}px`,
      top: `${savedState.y}px`,
      zIndex: '1001',
      padding: '8px 12px',
      backgroundColor: '#f0c14b',
      color: '#333',
      border: 'none',
      borderRadius: '4px',
      cursor: 'move',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      userSelect: 'none'
    });

    // Eventos para arrastrar (Mantener tu l車gica)
    toggleButton.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - toggleButton.getBoundingClientRect().left;
      offsetY = e.clientY - toggleButton.getBoundingClientRect().top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      toggleButton.style.left = `${x}px`;
      toggleButton.style.top = `${y}px`;
      
      updateNotePosition();
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        saveState({
          visible: !textarea.style.display || textarea.style.display === 'block',
          x: parseInt(toggleButton.style.left),
          y: parseInt(toggleButton.style.top)
        });
      }
    });

    // Evento para mostrar/ocultar (Mantener tu l車gica)
    toggleButton.addEventListener('click', (e) => {
      if (isDragging) return;
      
      const isVisible = textarea.style.display !== 'none';
      textarea.style.display = isVisible ? 'none' : 'block';
      toggleButton.textContent = isVisible ? '?? Show Notes' : '?? Hide Notes';
      
      saveState({
        visible: !isVisible,
        x: parseInt(toggleButton.style.left),
        y: parseInt(toggleButton.style.top)
      });
    });

    document.body.appendChild(toggleButton);
    return toggleButton;
  };

  // Crear 芍rea de notas (Combinar ambas versiones)
  const createNotesArea = () => {
    const savedState = loadSavedState();
    
    textarea = document.createElement('textarea');
    textarea.placeholder = 'Write your Sunflower Land notes here...';

    // Tus estilos + mejoras de interacci車n de master
    Object.assign(textarea.style, {
      position: 'fixed',
      width: '350px',
      height: '500px',
      fontSize: '1.2rem',
      backgroundColor: 'rgba(255, 253, 208, 0.95)',
      border: '2px solid #f0c14b',
      borderRadius: '8px',
      zIndex: '1000',
      outline: 'none',
      padding: '15px',
      resize: 'vertical',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      display: savedState.visible ? 'block' : 'none',
      opacity: '0.95', // Mejora de master
      pointerEvents: 'auto' // Mejora de master
    });

    // Cargar notas guardadas (Tu l車gica)
    textarea.value = localStorage.getItem(domainKey) || '';

    // Guardar autom芍ticamente (Tu l車gica)
    textarea.addEventListener('input', () => {
      localStorage.setItem(domainKey, textarea.value);
    });

    // Mejoras de interacci車n de master
    textarea.addEventListener('focus', () => {
      textarea.style.opacity = '1';
    });

    textarea.addEventListener('blur', () => {
      textarea.style.opacity = '0.9';
    });

    document.addEventListener('click', (e) => {
      if (e.target !== textarea) {
        textarea?.blur();
      }
    });

    document.body.appendChild(textarea);
    return textarea;
  };

  // Actualizar posici車n de la nota (Mantener tu l車gica)
  const updateNotePosition = () => {
    if (!toggleButton || !textarea) return;
    const buttonRect = toggleButton.getBoundingClientRect();
    textarea.style.left = `${buttonRect.left}px`;
    textarea.style.top = `${buttonRect.bottom + 10}px`;
  };

  // Inicializaci車n (Mantener tu l車gica de detecci車n)
  const init = () => {
    waitForElement('img[src="https://sunflower-land.com/game-assets/land/mushroom_island.png"]', () => {
      createToggleButton();
      createNotesArea();
      updateNotePosition();
      
      window.addEventListener('resize', updateNotePosition);
    });
  };

  init();
})();