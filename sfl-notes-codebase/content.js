(() => {
  const domainKey = `autosave_notes_${window.location.hostname}`;
  let note = null;

  const syncNoteToImage = () => {
    const image = document.querySelector('img[src="https://sunflower-land.com/game-assets/land/mushroom_island.png"]');

    // Create note if needed
    if (image && !note) {
      note = document.createElement('textarea');
      note.placeholder = 'Write your notes here...';

      Object.assign(note.style, {
        position: 'fixed',
        width: '350px',
        height: '500px',
        fontSize: '1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #ccc',
        borderRadius: '5px',
        zIndex: '9',
        padding: '10px',
        resize: 'both',
        opacity: '0.95',
        pointerEvents: 'auto',
      });

      note.value = localStorage.getItem(domainKey) || '';

      note.addEventListener('input', () => {
        localStorage.setItem(domainKey, note.value);
      });

      note.addEventListener('focus', () => {
        note.style.opacity = '1';
      });

      note.addEventListener('blur', () => {
        note.style.opacity = '0.9';
      });

      document.addEventListener('click', (e) => {
        if (e.target !== note) {
          note.blur();
        }
      });

      document.body.appendChild(note);
    }

    // Remove if image disappeared
    if (!image && note) {
      note.remove();
      note = null;
    }

    // If both exist, follow the image smoothly
    if (image && note) {
      const rect = image.getBoundingClientRect();
      note.style.left = `${rect.right - 50}px`;
      note.style.top = `${rect.top}px`;
    }

    requestAnimationFrame(syncNoteToImage);
  };

  syncNoteToImage(); // Start the animation loop
})();
