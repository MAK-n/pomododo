/*
===========================================
POMODORO TIMER - NOTEPAD MODULE
===========================================
Quick notes functionality for important reminders
===========================================
*/

// ===== NOTEPAD VARIABLES =====
let notepadContent = ''; // Reset on every page refresh - no persistence

// Notepad Elements
const notepadToggleBtn = $('#notepad-toggle-btn');
const notepadPanel = $('#notepad-panel');
const closeNotepadBtn = $('#close-notepad');
const notepadTextarea = $('#notepad-textarea');
const clearNotesBtn = $('#clear-notes');
const characterCount = $('.character-count');

// ===== NOTEPAD INITIALIZATION =====
function initializeNotepad() {
  console.log('📝 Initializing Notepad Module');
  console.log('📝 Notepad button found:', notepadToggleBtn.length > 0);
  console.log('📝 Notepad panel found:', notepadPanel.length > 0);

  // Event Listeners
  notepadToggleBtn.on('click', toggleNotepadPanel);
  closeNotepadBtn.on('click', closeNotepadPanel);
  clearNotesBtn.on('click', clearNotes);

  // Textarea events
  notepadTextarea.on('input', function() {
    updateCharacterCount();
    saveNotepadContent();
  });

  // Close panel when clicking outside
  $(document).on('click', function(e) {
    if (notepadPanel.hasClass('active') &&
        !$(e.target).closest('.notepad-panel').length &&
        !$(e.target).closest('.notepad-toggle-btn').length) {
      closeNotepadPanel();
    }
  });

  // Keyboard shortcuts
  $(document).on('keydown', function(e) {
    // Escape key to close notepad
    if (e.key === 'Escape' && notepadPanel.hasClass('active')) {
      closeNotepadPanel();
    }
    // Alt + N to toggle notepad (when not typing in input fields)
    if (e.altKey && e.key === 'n' && !$(e.target).is('input, textarea, select')) {
      e.preventDefault();
      toggleNotepadPanel();
    }
  });

  updateCharacterCount();
  console.log('✅ Notepad Module Initialized');
}

// ===== NOTEPAD PANEL FUNCTIONS =====

function toggleNotepadPanel() {
  console.log('📝 Notepad button clicked!');
  const isOpening = !notepadPanel.hasClass('active');

  if (isOpening) {
    openNotepadPanel();
  } else {
    closeNotepadPanel();
  }
}

function openNotepadPanel() {
  notepadPanel.addClass('active');

  // Focus on textarea after animation
  setTimeout(() => {
    notepadTextarea.focus();
  }, 300);

  console.log('📝 Notepad panel opened');
}

function closeNotepadPanel() {
  notepadPanel.removeClass('active');
  console.log('📝 Notepad panel closed');
}

// ===== NOTEPAD CONTENT FUNCTIONS =====

function saveNotepadContent() {
  notepadContent = notepadTextarea.val();
  // No persistence - content resets on page refresh
  console.log('📝 Notepad content updated (no persistence)');
}

function clearNotes() {
  if (notepadTextarea.val().trim() === '') {
    return; // Nothing to clear
  }

  if (confirm('Are you sure you want to clear all notes?')) {
    notepadTextarea.val('');
    notepadContent = '';
    updateCharacterCount();
    notepadTextarea.focus();
    console.log('📝 Notes cleared');
  }
}

function updateCharacterCount() {
  const count = notepadTextarea.val().length;
  characterCount.text(`${count} character${count !== 1 ? 's' : ''}`);

  // Add visual feedback for character count
  if (count > 1000) {
    characterCount.css('color', '#FFAEBB'); // Soft warning color
  } else {
    characterCount.css('color', 'rgba(139, 90, 43, 0.7)'); // Default color
  }
}

// ===== UTILITY FUNCTIONS =====

function getNotepadContent() {
  return notepadContent;
}

function setNotepadContent(content) {
  notepadContent = content;
  notepadTextarea.val(content);
  updateCharacterCount();
}

function isNotepadOpen() {
  return notepadPanel.hasClass('active');
}

// ===== EXPORT FUNCTIONS =====

// Make functions available globally
window.initializeNotepad = initializeNotepad;
window.toggleNotepadPanel = toggleNotepadPanel;
window.openNotepadPanel = openNotepadPanel;
window.closeNotepadPanel = closeNotepadPanel;
window.getNotepadContent = getNotepadContent;
window.setNotepadContent = setNotepadContent;
window.isNotepadOpen = isNotepadOpen;
window.clearNotes = clearNotes;
