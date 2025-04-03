(() => {
  const domainKey = `autosave_notes_${window.location.hostname}`;
  let note = null;

  const checkAndAttachNote = () => {
    const image = document.querySelector('img[src="https://sunflower-land.com/game-assets/land/mushroom_island.png"]');

    if (image && !note) {
      note = document.createElement('textarea');
      note.placeholder = 'Write your notes here...';
      note.dataset.note = 'mushroom';

      Object.assign(note.style, {
        width: '350px',
        height: '500px',
        fontSize: '1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #ccc',
        borderRadius: '5px',
        zIndex: '10',
        outline: 'none',
        padding: '10px',
        resize: 'both',
        opacity: '0.8',
        position: 'absolute',
        left: '70px',
        top: '0',
      });

      note.value = localStorage.getItem(domainKey) || '';

      note.addEventListener('input', () => {
        localStorage.setItem(domainKey, note.value);
      });

      note.addEventListener('focus', () => {
        note.style.opacity = '1';
      });

      note.addEventListener('blur', () => {
        note.style.opacity = '0.8';
      });

      document.addEventListener('click', (e) => {
        if (e.target !== note) {
          note.blur();
        }
      });

      image.parentNode.appendChild(note);
    }

    // Remove the note if image is gone
    if (!image && note) {
      note.remove();
      note = null;
    }
  };

  setInterval(checkAndAttachNote, 500); // Check every 500ms
})();
