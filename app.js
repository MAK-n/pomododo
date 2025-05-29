$(document).ready(function() {
  const start = $('#start');
  const stop = $('#stop');
  const reset = $('#reset');
  const timer = $('#timer');
  const modeButtons = $('.mode-btn');
  const musicToggle = $('#music-toggle');
  const backgroundMusic = $('#background-music')[0]; // Get the DOM element
  const speakerIcon = $('.speaker-icon');

  let currentMode = 'session';
  let timeLeft = 1500;
  let defaultTime = 1500;
  let interval;
  let isMusicPlaying = false;

  const updateTimer = function() {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timer.html(`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);
  };

  // Mode switching functionality
  modeButtons.on('click', function() {
    if (!interval) { // Only allow mode switching when timer is not running
      // Remove active class from all buttons
      modeButtons.removeClass('active');
      // Add active class to clicked button
      $(this).addClass('active');

      // Update current mode and default time
      currentMode = $(this).data('mode');
      defaultTime = parseInt($(this).data('duration'));
      timeLeft = defaultTime;

      // Update timer display
      updateTimer();

      // Reset button states
      start.removeClass('invalid');
      reset.addClass('invalid');
      stop.addClass('invalid');
    }
  });

  start.on('click', function() {
    if (!interval) {
      timeLeft = defaultTime;
      updateTimer();
      interval = setInterval(function() {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
          clearInterval(interval);
          interval = null;

          // Show completion message based on mode
          let message = '';
          switch(currentMode) {
            case 'session':
              message = '🍅 Session Complete! Time for a break!';
              break;
            case 'short-break':
              message = '☕ Short Break Complete! Ready to focus?';
              break;
            case 'long-break':
              message = '🌟 Long Break Complete! Feeling refreshed?';
              break;
          }
          alert(message);

          timeLeft = defaultTime;
          updateTimer();
          start.removeClass('invalid');
          reset.addClass('invalid');
          stop.addClass('invalid');
        }
      }, 1000);
      start.addClass('invalid');
      reset.addClass('invalid');
      stop.removeClass('invalid');
    }
  });

stop.on('click', function() {
  if (interval) {
    clearInterval(interval);
    interval = null;
    start.removeClass('invalid');
    reset.removeClass('invalid');
    stop.addClass('invalid');
  }
});

  reset.on('click', function() {
    if (!interval) {
      timeLeft = defaultTime;
      updateTimer();
      start.removeClass('invalid');
      reset.addClass('invalid');
      stop.addClass('invalid');
    }
  });

  // Music Player Functionality
  musicToggle.on('click', function() {
    if (isMusicPlaying) {
      // Pause music
      backgroundMusic.pause();
      isMusicPlaying = false;
      speakerIcon.text('🔇');
      musicToggle.addClass('muted').removeClass('playing');
    } else {
      // Play music
      backgroundMusic.play().then(() => {
        isMusicPlaying = true;
        speakerIcon.text('🔊');
        musicToggle.removeClass('muted').addClass('playing');
      }).catch((error) => {
        console.log('Error playing music:', error);
        // Handle autoplay restrictions
        speakerIcon.text('🔇');
        musicToggle.addClass('muted');
      });
    }
  });

  // Handle music ended event (though it's set to loop)
  backgroundMusic.addEventListener('ended', function() {
    isMusicPlaying = false;
    speakerIcon.text('🔇');
    musicToggle.addClass('muted').removeClass('playing');
  });

  // Handle music error
  backgroundMusic.addEventListener('error', function() {
    console.log('Error loading music file');
    speakerIcon.text('❌');
    musicToggle.addClass('muted');
  });

  // Initialize the timer with proper button states
  function initializeTimer() {
    start.removeClass('invalid');
    reset.addClass('invalid');
    stop.addClass('invalid');
    updateTimer();

    // Set initial music state
    backgroundMusic.volume = 0.3; // Set volume to 30%
    speakerIcon.text('🔇');
    musicToggle.addClass('muted');
  }

  // Initialize on page load
  initializeTimer();

  // Optional: Shake effect on invalid button click (uncomment if desired)
  // $('.button-wrapper button').on('click', function() {
  //   if ($(this).hasClass('invalid')) {
  //     $(this).effect('shake', { times: 2 }, 200);
  //   }
  // });
});