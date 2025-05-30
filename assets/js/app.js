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

  // Background Elements
  const backgroundOverlay = $('.background-overlay');
  const backgroundTransition = $('.background-transition');

  // Music Elements
  const musicBtn = $('.music-btn');
  const speakerIcon = $('.speaker-icon');
  const backgroundMusic = $('#background-music')[0];
  let isMusicPlaying = false;

  // Settings Menu Elements
  const settingsToggleBtn = $('#settings-toggle-btn');
  const settingsMenuContainer = $('.settings-menu-container');
  let isSettingsExpanded = false;

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

  initializeMusic();
  initializeSettingsMenu();

  // ===== THEME FUNCTIONALITY =====
  // Note: Background image switching is now handled by lamp toggle functionality

  // ===== MUSIC FUNCTIONALITY =====

  function initializeMusic() {
    console.log('🎵 Initializing Music - Button found:', musicBtn.length > 0);
    console.log('🎵 Background music element found:', backgroundMusic ? 'Yes' : 'No');

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

  // Music toggle - using both class and ID selectors for reliability
  $('#music-toggle, .music-btn').on('click', function() {
    console.log('🎵 Music button clicked!');
    if (!backgroundMusic) {
      console.log('❌ Background music element not found');
      return;
    }

    if (isMusicPlaying) {
      backgroundMusic.pause();
      isMusicPlaying = false;
      console.log('🔇 Music paused');
    } else {
      backgroundMusic.play().catch(e => {
        console.log('Music play failed:', e);
      });
      isMusicPlaying = true;
      console.log('🔊 Music playing');
    }

    updateMusicButton();
  });

  // ===== SETTINGS MENU FUNCTIONALITY =====

  function initializeSettingsMenu() {
    console.log('⚙️ Initializing Settings Menu');

    // Settings toggle event
    settingsToggleBtn.on('click', toggleSettingsMenu);

    console.log('✅ Settings Menu Initialized');
  }



  function closeSettingsMenu() {
    if (isSettingsExpanded) {
      isSettingsExpanded = false;
      settingsMenuContainer.removeClass('expanded');
      settingsToggleBtn.removeClass('active');
      console.log('⚙️ Settings menu closed');
    }
  }

  // Track which panels are open to prevent settings menu from reopening
  let activePanels = new Set();

  function trackPanelOpen(panelName) {
    activePanels.add(panelName);
    closeSettingsMenu();
    console.log('📋 Panel opened:', panelName, '- Settings menu closed');
  }

  function trackPanelClose(panelName) {
    activePanels.delete(panelName);
    console.log('📋 Panel closed:', panelName);
  }

  function canOpenSettingsMenu() {
    return activePanels.size === 0;
  }

  // Override settings toggle to check if panels are open
  function toggleSettingsMenu() {
    if (!canOpenSettingsMenu()) {
      console.log('⚙️ Settings menu blocked - panels are open:', Array.from(activePanels));
      return;
    }

    isSettingsExpanded = !isSettingsExpanded;

    if (isSettingsExpanded) {
      settingsMenuContainer.addClass('expanded');
      settingsToggleBtn.addClass('active');
    } else {
      settingsMenuContainer.removeClass('expanded');
      settingsToggleBtn.removeClass('active');
    }

    console.log('⚙️ Settings menu toggled:', isSettingsExpanded ? 'expanded' : 'collapsed');
  }

  // Make panel tracking functions available globally
  window.trackPanelOpen = trackPanelOpen;
  window.trackPanelClose = trackPanelClose;

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
    if (!clickedElement.closest('.stats-panel, .stats-toggle-btn, .achievements-panel, .achievements-toggle-btn, .todo-panel, .todo-toggle-btn, .settings-menu-container, .music-player').length) {
      // Track panel closures
      if ($('.stats-panel').hasClass('active')) {
        trackPanelClose('statistics');
      }
      if ($('.achievements-panel').hasClass('active')) {
        trackPanelClose('achievements');
      }
      if ($('.todo-panel').hasClass('active')) {
        trackPanelClose('todos');
      }

      $('.stats-panel').removeClass('active');
      $('.achievements-panel').removeClass('active');
      $('.todo-panel').removeClass('active');
      closeSettingsMenu();
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

    // Escape to close panels and settings menu
    if (e.code === 'Escape') {
      // Track panel closures
      if ($('.stats-panel').hasClass('active')) {
        trackPanelClose('statistics');
      }
      if ($('.achievements-panel').hasClass('active')) {
        trackPanelClose('achievements');
      }
      if ($('.todo-panel').hasClass('active')) {
        trackPanelClose('todos');
      }

      $('.stats-panel').removeClass('active');
      $('.achievements-panel').removeClass('active');
      $('.todo-panel').removeClass('active');
      closeSettingsMenu();
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
      $('#music-toggle').click();
    }

    // G for settings menu (G for "Gear")
    if (e.code === 'KeyG' && !$(e.target).is('input, textarea, select')) {
      settingsToggleBtn.click();
    }

    // L for lamp toggle (L for "Light")
    if (e.code === 'KeyL' && !$(e.target).is('input, textarea, select')) {
      $('#lamp-toggle-btn').click();
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

  // ===== LAMP TOGGLE FUNCTIONALITY =====

  let isLampOn = false;
  const lampToggleBtn = $('#lamp-toggle-btn');

  function initializeLampToggle() {
    console.log('💡 Initializing Lamp Toggle');

    // Load saved lamp state
    isLampOn = localStorage.getItem('lampState') === 'true';
    updateBackgroundImage();

    // Event listener
    lampToggleBtn.on('click', toggleLamp);

    console.log('✅ Lamp Toggle Initialized');
  }

  function toggleLamp() {
    isLampOn = !isLampOn;
    updateBackgroundImage();

    // Save state
    localStorage.setItem('lampState', isLampOn.toString());

    console.log('💡 Lamp toggled:', isLampOn ? 'ON' : 'OFF');
  }

  function updateBackgroundImage() {
    const newImageUrl = isLampOn ?
      'url("assets/img/couch-alt3.png")' :
      'url("assets/img/couch-alt-night.png")';

    console.log('🎨 Starting background fade transition...');
    console.log(isLampOn ? '🌞 Fading to couch-alt3.png' : '🌙 Fading to couch-alt-night.png');

    // Set the new image on the transition layer
    backgroundTransition.css('background-image', newImageUrl);

    // Fade in the transition layer
    backgroundTransition.css('opacity', '1');

    // After the fade completes, swap the images and reset
    setTimeout(() => {
      backgroundOverlay.css('background-image', newImageUrl);
      backgroundTransition.css('opacity', '0');
      console.log('✨ Background fade transition complete');
    }, 800); // Match the CSS transition duration
  }

  // Initialize lamp toggle
  initializeLampToggle();

  // ===== BUTTON TESTING =====

  window.testButtons = function() {
    console.log('🧪 Testing button functionality...');
    console.log('Music button:', $('#music-toggle').length > 0 ? 'Found' : 'Not found');
    console.log('Settings button:', $('#settings-toggle-btn').length > 0 ? 'Found' : 'Not found');
    console.log('Achievements button:', $('#achievements-toggle-btn').length > 0 ? 'Found' : 'Not found');
    console.log('Stats button:', $('#stats-toggle-btn').length > 0 ? 'Found' : 'Not found');
    console.log('Todo button:', $('#todo-toggle-btn').length > 0 ? 'Found' : 'Not found');
    console.log('Lamp button:', $('#lamp-toggle-btn').length > 0 ? 'Found' : 'Not found');
  };

  // Test music functionality specifically
  window.testMusic = function() {
    console.log('🎵 Testing music functionality...');
    console.log('Music button by ID:', $('#music-toggle').length > 0 ? 'Found' : 'Not found');
    console.log('Music button by class:', $('.music-btn').length > 0 ? 'Found' : 'Not found');
    console.log('Speaker icon:', $('.speaker-icon').length > 0 ? 'Found' : 'Not found');
    console.log('Background music element:', $('#background-music').length > 0 ? 'Found' : 'Not found');
    console.log('Background music audio object:', backgroundMusic ? 'Found' : 'Not found');
    console.log('Current music state:', isMusicPlaying ? 'Playing' : 'Stopped');

    // Test clicking the music button
    console.log('Simulating music button click...');
    $('#music-toggle').trigger('click');
  };

  // Test lamp toggle functionality
  window.testLampToggle = function() {
    console.log('🧪 Testing lamp toggle functionality...');
    console.log('Lamp button element found:', $('#lamp-toggle-btn').length > 0);
    console.log('Background overlay element found:', $('.background-overlay').length > 0);
    console.log('Background transition element found:', $('.background-transition').length > 0);
    console.log('Current lamp state:', localStorage.getItem('lampState'));

    // Test clicking the lamp button
    console.log('Simulating lamp button click with fade effect...');
    $('#lamp-toggle-btn').trigger('click');

    setTimeout(() => {
      console.log('New lamp state after fade:', localStorage.getItem('lampState'));
    }, 1000); // Wait for fade to complete
  };

  // Test fade effect multiple times
  window.testFadeEffect = function() {
    console.log('🎨 Testing fade effect with multiple toggles...');
    let count = 0;
    const maxToggles = 4;

    const toggleInterval = setInterval(() => {
      console.log(`Toggle ${count + 1}/${maxToggles}`);
      $('#lamp-toggle-btn').trigger('click');
      count++;

      if (count >= maxToggles) {
        clearInterval(toggleInterval);
        console.log('✅ Fade effect test complete');
      }
    }, 1500); // Wait 1.5 seconds between toggles to see the effect
  };

  // ===== INITIALIZATION COMPLETE =====

  console.log('🚀 Pomodoro Timer App Ready!');
  console.log('📝 Keyboard shortcuts:');
  console.log('  Space - Start/Stop timer');
  console.log('  G - Toggle settings menu');
  console.log('  T - Toggle todo panel');
  console.log('  S - Toggle statistics panel');
  console.log('  A - Toggle achievements panel');
  console.log('  M - Toggle music');
  console.log('  L - Toggle lamp/theme');
  console.log('  Escape - Close panels and settings menu');
  console.log('🧪 Type testTimer(), testButtons(), testMusic(), testLampToggle(), or testFadeEffect() in console to test functionality');
});
