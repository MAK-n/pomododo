/*
===========================================
POMODORO TIMER - TIMER MODULE
===========================================
Timer functionality and mode management
===========================================
*/

// ===== TIMER VARIABLES =====
let currentMode = 'session';
let timeLeft = 1500; // 25 minutes in seconds
let defaultTime = 1500;
let interval;

// Timer Elements (will be initialized in initializeTimer)
let timer, start, stop, reset, modeButtons;

// Timer Durations (in seconds)
const TIMER_DURATIONS = {
  session: 1500,      // 25 minutes
  'short-break': 300, // 5 minutes
  'long-break': 900   // 15 minutes
};

// ===== TIMER INITIALIZATION =====
function initializeTimer() {
  console.log('⏰ Initializing Timer Module');

  // Initialize DOM elements
  timer = $('.timer');
  start = $('#start');
  stop = $('#stop');
  reset = $('#reset');
  modeButtons = $('.mode-btn');

  // Verify elements exist
  if (timer.length === 0) {
    console.error('❌ Timer element not found');
    return;
  }
  if (start.length === 0) {
    console.error('❌ Start button not found');
    return;
  }
  if (stop.length === 0) {
    console.error('❌ Stop button not found');
    return;
  }
  if (reset.length === 0) {
    console.error('❌ Reset button not found');
    return;
  }

  console.log('✅ All DOM elements found');

  // Set initial state
  updateTimer();
  updateButtonStates();

  // Ensure correct initial button states
  if (start && start.length > 0) {
    start.removeClass('invalid');
  }

  if (stop && stop.length > 0) {
    stop.addClass('invalid');
  }

  console.log('✅ Initial state: Start button active, Stop button inactive');

  // Event Listeners
  start.on('click', function(e) {
    e.preventDefault();
    console.log('🖱️ Start button clicked');
    startTimer();
  });

  stop.on('click', function(e) {
    e.preventDefault();
    console.log('🖱️ Stop button clicked');
    stopTimer();
  });

  reset.on('click', function(e) {
    e.preventDefault();
    console.log('🖱️ Reset button clicked');
    resetTimer();
  });

  modeButtons.on('click', function(e) {
    e.preventDefault();
    const mode = $(this).data('mode');
    console.log(`🖱️ Mode button clicked: ${mode}`);
    switchMode(mode);
  });

  console.log('✅ Timer Module Initialized');
}

// ===== TIMER FUNCTIONS =====

function startTimer() {
  if (!start || start.hasClass('invalid')) {
    console.log('⚠️ Cannot start timer - button invalid or not found');
    return;
  }

  console.log('▶️ Starting timer');

  interval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft === 0) {
      completeTimer();
    }
  }, 1000);

  updateButtonStates();

  // Trigger event
  triggerTimerEvent('started', { mode: currentMode, timeLeft });
}

function stopTimer() {
  if (!stop || stop.hasClass('invalid')) {
    console.log('⚠️ Cannot stop timer - button invalid or not found');
    return;
  }

  console.log('⏸️ Stopping timer');

  clearInterval(interval);
  interval = null;
  updateButtonStates();

  // Trigger event
  triggerTimerEvent('stopped', { mode: currentMode, timeLeft });
}

function resetTimer() {
  if (!reset || reset.hasClass('invalid')) {
    console.log('⚠️ Cannot reset timer - button invalid or not found');
    return;
  }

  console.log('🔄 Resetting timer');

  clearInterval(interval);
  interval = null;
  timeLeft = defaultTime;
  updateTimer();
  updateButtonStates();

  // Trigger event
  triggerTimerEvent('reset', { mode: currentMode, timeLeft });
}

function completeTimer() {
  console.log('✅ Timer completed');

  clearInterval(interval);
  interval = null;

  // Track completion in statistics
  if (window.trackCompletedSession) {
    window.trackCompletedSession(currentMode);
  }

  // Show completion message
  showCompletionMessage();

  // Reset timer
  timeLeft = defaultTime;
  updateTimer();
  updateButtonStates();

  // Trigger event
  triggerTimerEvent('completed', { mode: currentMode, duration: defaultTime });
}

function switchMode(mode) {
  if (interval) {
    console.log('⚠️ Cannot switch mode while timer is running');
    return;
  }

  console.log(`🔄 Switching to ${mode} mode`);

  currentMode = mode;
  defaultTime = TIMER_DURATIONS[mode];
  timeLeft = defaultTime;

  // Update UI
  if (modeButtons && modeButtons.length > 0) {
    modeButtons.removeClass('active');
    $(`.mode-btn[data-mode="${mode}"]`).addClass('active');
  }

  updateTimer();
  updateButtonStates();
}

// ===== UI UPDATE FUNCTIONS =====

function updateTimer() {
  const formattedTime = window.formatTimerDisplay ?
    window.formatTimerDisplay(timeLeft) :
    `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  if (timer && timer.length > 0) {
    timer.text(formattedTime);
  }

  // Update document title
  document.title = `${formattedTime} - Pomodoro Timer`;
}

function updateButtonStates() {
  const isRunning = interval !== null;
  const isAtDefaultTime = timeLeft === defaultTime;

  // Start button - Active when timer is NOT running
  if (start && start.length > 0) {
    if (isRunning) {
      start.addClass('invalid');
    } else {
      start.removeClass('invalid');
    }
  }

  // Stop button - Active ONLY when timer is running
  if (stop && stop.length > 0) {
    if (isRunning) {
      stop.removeClass('invalid');
    } else {
      stop.addClass('invalid');
    }
  }

  // Reset button - Active when timer is NOT running AND time has been modified
  if (reset && reset.length > 0) {
    if (isRunning) {
      reset.addClass('invalid');
    } else if (isAtDefaultTime) {
      reset.addClass('invalid');
    } else {
      reset.removeClass('invalid');
    }
  }
}

function showCompletionMessage() {
  let message = '';
  let emoji = '';

  switch(currentMode) {
    case 'session':
      emoji = '🍅';
      message = 'Session Complete! Time for a break!';
      break;
    case 'short-break':
      emoji = '☕';
      message = 'Short Break Complete! Ready to focus?';
      break;
    case 'long-break':
      emoji = '🌟';
      message = 'Long Break Complete! Feeling refreshed?';
      break;
  }

  // Show browser notification if supported
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`${emoji} Pomodoro Timer`, {
      body: message,
      icon: 'assets/img/tomato-icon.png'
    });
  } else {
    // Fallback to alert
    alert(`${emoji} ${message}`);
  }

  // Request notification permission for future use
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// ===== TIMER STATE GETTERS =====

function getCurrentMode() {
  return currentMode;
}

function getTimeLeft() {
  return timeLeft;
}

function getDefaultTime() {
  return defaultTime;
}

function isTimerRunning() {
  return interval !== null;
}

// ===== TIMER CONTROLS (External API) =====

function pauseTimer() {
  if (interval) {
    stopTimer();
  }
}

function resumeTimer() {
  if (!interval && timeLeft > 0 && timeLeft < defaultTime) {
    startTimer();
  }
}

function addTime(seconds) {
  if (!interval) {
    timeLeft = Math.min(timeLeft + seconds, defaultTime * 2); // Max 2x default time
    updateTimer();
  }
}

function subtractTime(seconds) {
  if (!interval) {
    timeLeft = Math.max(timeLeft - seconds, 0);
    updateTimer();
    updateButtonStates();
  }
}

// ===== EXPORT FUNCTIONS =====

// Make functions available globally
window.initializeTimer = initializeTimer;
window.getCurrentMode = getCurrentMode;
window.getTimeLeft = getTimeLeft;
window.getDefaultTime = getDefaultTime;
window.isTimerRunning = isTimerRunning;
window.pauseTimer = pauseTimer;
window.resumeTimer = resumeTimer;
window.addTime = addTime;
window.subtractTime = subtractTime;

// ===== TIMER EVENTS =====

// Custom events for other modules to listen to
function triggerTimerEvent(eventName, data = {}) {
  $(document).trigger(`timer:${eventName}`, data);
}