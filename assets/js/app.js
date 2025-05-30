/*
===========================================
POMODORO TIMER - MAIN APPLICATION
===========================================
Main application entry point and initialization
===========================================
*/

$(document).ready(function() {
  console.log('🍅 Pomodoro Timer App Initialized');

  // ===== GLOBAL VARIABLES =====

  // Theme Variables
  let isDarkMode = localStorage.getItem('darkMode') === 'true';

  // Background Elements
  const backgroundOverlay = $('.background-overlay');
  const lampOverlay = $('#lamp-overlay');

  // Music Elements
  const musicBtn = $('.music-btn');
  const speakerIcon = $('.speaker-icon');
  const backgroundMusic = $('#background-music')[0];
  let isMusicPlaying = false;

  // ===== INITIALIZATION =====

  // Initialize all modules
  console.log('🚀 Starting module initialization...');

  if (typeof initializeTimer === 'function') {
    initializeTimer();
  } else {
    console.error('❌ initializeTimer function not found');
  }

  if (typeof initializeTodos === 'function') {
    initializeTodos();
  } else {
    console.log('⚠️ initializeTodos function not found (optional)');
  }

  if (typeof initializeStatistics === 'function') {
    initializeStatistics();
  } else {
    console.log('⚠️ initializeStatistics function not found (optional)');
  }

  if (typeof initializeAchievements === 'function') {
    initializeAchievements();
  } else {
    console.log('⚠️ initializeAchievements function not found (optional)');
  }

  initializeTheme();
  initializeMusic();

  // ===== THEME FUNCTIONALITY =====

  function initializeTheme() {
    updateTheme();
  }

  function updateTheme() {
    if (isDarkMode) {
      backgroundOverlay.css('background-image', 'url("assets/img/couch-alt-night.png")');
      if (lampOverlay.length) lampOverlay.show();
    } else {
      backgroundOverlay.css('background-image', 'url("assets/img/couch-alt-night.png")'); // Keep night theme for now
      if (lampOverlay.length) lampOverlay.hide();
    }
  }

  // Theme toggle (can be triggered by external controls)
  window.toggleTheme = function() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateTheme();
  };

  // ===== MUSIC FUNCTIONALITY =====

  function initializeMusic() {
    // Set initial music state
    if (backgroundMusic) {
      backgroundMusic.volume = 0.3;
      backgroundMusic.loop = true;
    }

    updateMusicButton();
  }

  function updateMusicButton() {
    if (isMusicPlaying) {
      musicBtn.addClass('playing');
      speakerIcon.text('🔊');
    } else {
      musicBtn.removeClass('playing');
      speakerIcon.text('🔇');
    }
  }

  // Music toggle
  musicBtn.on('click', function() {
    if (!backgroundMusic) return;

    if (isMusicPlaying) {
      backgroundMusic.pause();
      isMusicPlaying = false;
    } else {
      backgroundMusic.play().catch(e => {
        console.log('Music play failed:', e);
      });
      isMusicPlaying = true;
    }

    updateMusicButton();
  });

  // ===== UTILITY FUNCTIONS =====

  // Format time in seconds to readable format
  window.formatTime = function(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Format timer display (MM:SS)
  window.formatTimerDisplay = function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get current date string
  window.getCurrentDateString = function() {
    return new Date().toDateString();
  };

  // Get this week's dates
  window.getThisWeekDates = function() {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toDateString());
    }
    return weekDates;
  };

  // ===== PANEL MANAGEMENT =====

  // Close all panels when clicking outside
  $(document).on('click', function(e) {
    const clickedElement = $(e.target);

    // Check if click is outside all panels and toggle buttons
    if (!clickedElement.closest('.stats-panel, .stats-toggle-btn, .achievements-panel, .achievements-toggle-btn, .todo-panel, .todo-toggle-btn').length) {
      $('.stats-panel').removeClass('active');
      $('.achievements-panel').removeClass('active');
      $('.todo-panel').removeClass('active');
    }
  });

  // ===== ERROR HANDLING =====

  window.addEventListener('error', function(e) {
    console.error('Application Error:', e.error);
  });

  // ===== KEYBOARD SHORTCUTS =====

  $(document).on('keydown', function(e) {
    // Space bar to start/stop timer
    if (e.code === 'Space' && !$(e.target).is('input, textarea, select')) {
      e.preventDefault();
      const startBtn = $('#start');
      const stopBtn = $('#stop');

      if (!startBtn.hasClass('invalid')) {
        startBtn.click();
      } else if (!stopBtn.hasClass('invalid')) {
        stopBtn.click();
      }
    }

    // Escape to close panels
    if (e.code === 'Escape') {
      $('.stats-panel').removeClass('active');
      $('.achievements-panel').removeClass('active');
      $('.todo-panel').removeClass('active');
    }

    // T for todo panel
    if (e.code === 'KeyT' && !$(e.target).is('input, textarea, select')) {
      $('#todo-toggle-btn').click();
    }

    // S for statistics panel
    if (e.code === 'KeyS' && !$(e.target).is('input, textarea, select')) {
      $('#stats-toggle-btn').click();
    }

    // A for achievements panel
    if (e.code === 'KeyA' && !$(e.target).is('input, textarea, select')) {
      $('#achievements-toggle-btn').click();
    }

    // M for music toggle
    if (e.code === 'KeyM' && !$(e.target).is('input, textarea, select')) {
      musicBtn.click();
    }
  });

  // ===== PERFORMANCE OPTIMIZATION =====

  // Debounce function for performance
  window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // ===== TIMER TEST FUNCTION =====

  window.testTimer = function() {
    console.log('🧪 Testing timer functionality...');

    // Test element selection
    const testStart = $('#start');
    const testStop = $('#stop');
    const testReset = $('#reset');
    const testTimer = $('.timer');

    console.log('Start button found:', testStart.length > 0);
    console.log('Stop button found:', testStop.length > 0);
    console.log('Reset button found:', testReset.length > 0);
    console.log('Timer display found:', testTimer.length > 0);

    // Test click simulation
    if (testStart.length > 0) {
      console.log('Simulating start button click...');
      testStart.trigger('click');
    }
  };

  // ===== INITIALIZATION COMPLETE =====

  console.log('🚀 Pomodoro Timer App Ready!');
  console.log('📝 Keyboard shortcuts:');
  console.log('  Space - Start/Stop timer');
  console.log('  T - Toggle todo panel');
  console.log('  S - Toggle statistics panel');
  console.log('  A - Toggle achievements panel');
  console.log('  M - Toggle music');
  console.log('  Escape - Close panels');
  console.log('🧪 Type testTimer() in console to test timer functionality');
});
