/*
===========================================
POMODORO TIMER - STATISTICS MODULE
===========================================
Statistics tracking and data visualization
===========================================
*/

// ===== STATISTICS VARIABLES =====
let statistics = JSON.parse(localStorage.getItem('pomodoroStatistics')) || {
  sessions: [],
  shortBreaks: [],
  longBreaks: [],
  totalTimeSpent: {
    study: 0,
    work: 0,
    personal: 0,
    exercise: 0
  },
  dailyStats: {},
  createdAt: new Date().toISOString()
};

// Statistics Elements
const statsToggleBtn = $('#stats-toggle-btn');
const statsPanel = $('#stats-panel');
const closeStatsBtn = $('#close-stats');

// ===== STATISTICS INITIALIZATION =====
function initializeStatistics() {
  console.log('📊 Initializing Statistics Module');

  // Event Listeners
  statsToggleBtn.on('click', toggleStatsPanel);
  closeStatsBtn.on('click', closeStatsPanel);

  console.log('✅ Statistics Module Initialized');
}

// ===== STATISTICS PANEL FUNCTIONS =====

function toggleStatsPanel() {
  const isOpening = !statsPanel.hasClass('active');
  statsPanel.toggleClass('active');

  if (isOpening) {
    if (window.trackPanelOpen) {
      window.trackPanelOpen('statistics');
    }
    renderStatistics();
  } else {
    if (window.trackPanelClose) {
      window.trackPanelClose('statistics');
    }
  }
}

function closeStatsPanel() {
  statsPanel.removeClass('active');
  if (window.trackPanelClose) {
    window.trackPanelClose('statistics');
  }
}

// ===== STATISTICS TRACKING =====

function trackCompletedSession(mode) {
  const now = new Date();
  const today = now.toDateString();
  const defaultTime = window.getDefaultTime ? window.getDefaultTime() : 1500;

  const sessionData = {
    mode: mode,
    completedAt: now.toISOString(),
    duration: defaultTime,
    date: today
  };

  // Add to appropriate array
  switch(mode) {
    case 'session':
      statistics.sessions.push(sessionData);
      // Track time spent by category (get from active todo if any)
      const activeCategory = window.getCurrentTaskCategory ? window.getCurrentTaskCategory() : 'study';
      if (activeCategory) {
        statistics.totalTimeSpent[activeCategory] += defaultTime;
      }
      break;
    case 'short-break':
      statistics.shortBreaks.push(sessionData);
      break;
    case 'long-break':
      statistics.longBreaks.push(sessionData);
      break;
  }

  // Update daily stats
  if (!statistics.dailyStats[today]) {
    statistics.dailyStats[today] = {
      sessions: 0,
      shortBreaks: 0,
      longBreaks: 0,
      totalTime: 0
    };
  }

  statistics.dailyStats[today][mode === 'session' ? 'sessions' : mode === 'short-break' ? 'shortBreaks' : 'longBreaks']++;
  if (mode === 'session') {
    statistics.dailyStats[today].totalTime += defaultTime;
  }

  saveStatistics();

  console.log('📈 Session tracked:', sessionData);
}

// ===== STATISTICS RENDERING =====

function renderStatistics() {
  const today = window.getCurrentDateString ? window.getCurrentDateString() : new Date().toDateString();
  const thisWeek = window.getThisWeekDates ? window.getThisWeekDates() : [today];

  // Calculate today's stats
  const todayStats = statistics.dailyStats[today] || { sessions: 0, shortBreaks: 0, longBreaks: 0, totalTime: 0 };

  // Calculate this week's stats
  const weekStats = thisWeek.reduce((acc, date) => {
    const dayStats = statistics.dailyStats[date] || { sessions: 0, shortBreaks: 0, longBreaks: 0, totalTime: 0 };
    acc.sessions += dayStats.sessions;
    acc.shortBreaks += dayStats.shortBreaks;
    acc.longBreaks += dayStats.longBreaks;
    acc.totalTime += dayStats.totalTime;
    return acc;
  }, { sessions: 0, shortBreaks: 0, longBreaks: 0, totalTime: 0 });

  // Calculate all-time stats
  const allTimeStats = {
    sessions: statistics.sessions.length,
    shortBreaks: statistics.shortBreaks.length,
    longBreaks: statistics.longBreaks.length,
    totalTime: Object.values(statistics.totalTimeSpent).reduce((a, b) => a + b, 0)
  };

  // Update the statistics display
  updateStatisticsDisplay(todayStats, weekStats, allTimeStats);
}

function updateStatisticsDisplay(today, week, allTime) {
  const formatTime = window.formatTime || ((seconds) => `${Math.floor(seconds / 60)}m`);

  $('#today-sessions').text(today.sessions);
  $('#today-short-breaks').text(today.shortBreaks);
  $('#today-long-breaks').text(today.longBreaks);
  $('#today-time').text(formatTime(today.totalTime));

  $('#week-sessions').text(week.sessions);
  $('#week-short-breaks').text(week.shortBreaks);
  $('#week-long-breaks').text(week.longBreaks);
  $('#week-time').text(formatTime(week.totalTime));

  $('#alltime-sessions').text(allTime.sessions);
  $('#alltime-short-breaks').text(allTime.shortBreaks);
  $('#alltime-long-breaks').text(allTime.longBreaks);
  $('#alltime-time').text(formatTime(allTime.totalTime));

  // Update category breakdown
  updateCategoryBreakdown();
}

function updateCategoryBreakdown() {
  const formatTime = window.formatTime || ((seconds) => `${Math.floor(seconds / 60)}m`);
  const categories = ['study', 'work', 'personal', 'exercise'];

  categories.forEach(category => {
    const time = statistics.totalTimeSpent[category] || 0;
    $(`#category-${category}`).text(formatTime(time));
  });
}

// ===== STATISTICS GETTERS =====

function getStatistics() {
  return statistics;
}

function getTodayStats() {
  const today = window.getCurrentDateString ? window.getCurrentDateString() : new Date().toDateString();
  return statistics.dailyStats[today] || { sessions: 0, shortBreaks: 0, longBreaks: 0, totalTime: 0 };
}

function getWeekStats() {
  const thisWeek = window.getThisWeekDates ? window.getThisWeekDates() : [new Date().toDateString()];

  return thisWeek.reduce((acc, date) => {
    const dayStats = statistics.dailyStats[date] || { sessions: 0, shortBreaks: 0, longBreaks: 0, totalTime: 0 };
    acc.sessions += dayStats.sessions;
    acc.shortBreaks += dayStats.shortBreaks;
    acc.longBreaks += dayStats.longBreaks;
    acc.totalTime += dayStats.totalTime;
    return acc;
  }, { sessions: 0, shortBreaks: 0, longBreaks: 0, totalTime: 0 });
}

function getAllTimeStats() {
  return {
    sessions: statistics.sessions.length,
    shortBreaks: statistics.shortBreaks.length,
    longBreaks: statistics.longBreaks.length,
    totalTime: Object.values(statistics.totalTimeSpent).reduce((a, b) => a + b, 0)
  };
}

function getCategoryStats() {
  return { ...statistics.totalTimeSpent };
}

function getProductivityStreak() {
  const dates = Object.keys(statistics.dailyStats).sort().reverse();
  let streak = 0;

  for (const date of dates) {
    const dayStats = statistics.dailyStats[date];
    if (dayStats.sessions > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getMostProductiveDay() {
  let maxSessions = 0;
  let mostProductiveDay = null;

  Object.entries(statistics.dailyStats).forEach(([date, stats]) => {
    if (stats.sessions > maxSessions) {
      maxSessions = stats.sessions;
      mostProductiveDay = date;
    }
  });

  return {
    date: mostProductiveDay,
    sessions: maxSessions
  };
}

// ===== UTILITY FUNCTIONS =====

function saveStatistics() {
  localStorage.setItem('pomodoroStatistics', JSON.stringify(statistics));
}

function resetStatistics() {
  if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
    statistics = {
      sessions: [],
      shortBreaks: [],
      longBreaks: [],
      totalTimeSpent: {
        study: 0,
        work: 0,
        personal: 0,
        exercise: 0
      },
      dailyStats: {},
      createdAt: new Date().toISOString()
    };

    saveStatistics();
    renderStatistics();

    console.log('🔄 Statistics reset');
  }
}

function exportStatistics() {
  const dataStr = JSON.stringify(statistics, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `pomodoro-statistics-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);

  console.log('📤 Statistics exported');
}

// ===== EXPORT FUNCTIONS =====

// Make functions available globally
window.initializeStatistics = initializeStatistics;
window.trackCompletedSession = trackCompletedSession;
window.getStatistics = getStatistics;
window.getTodayStats = getTodayStats;
window.getWeekStats = getWeekStats;
window.getAllTimeStats = getAllTimeStats;
window.getCategoryStats = getCategoryStats;
window.getProductivityStreak = getProductivityStreak;
window.getMostProductiveDay = getMostProductiveDay;
window.saveStatistics = saveStatistics;
window.resetStatistics = resetStatistics;
window.exportStatistics = exportStatistics;
