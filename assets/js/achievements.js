/*
===========================================
POMODORO TIMER - ACHIEVEMENTS MODULE
===========================================
Achievement system and gamification
===========================================
*/

// ===== ACHIEVEMENTS VARIABLES =====
let achievements = JSON.parse(localStorage.getItem('pomodoroAchievements')) || {};

const achievementDefinitions = [
  // Task Achievements
  { id: 'first_task', category: 'tasks', icon: '🎯', title: 'First Steps', description: 'Complete your first task', target: 1, type: 'first_task_ever' },
  { id: 'task_master_5', category: 'tasks', icon: '⭐', title: 'Task Master', description: 'Complete 5 tasks', target: 5, type: 'tasks_completed' },
  { id: 'task_champion_10', category: 'tasks', icon: '🏆', title: 'Task Champion', description: 'Complete 10 tasks', target: 10, type: 'tasks_completed' },
  { id: 'task_legend_25', category: 'tasks', icon: '👑', title: 'Task Legend', description: 'Complete 25 tasks', target: 25, type: 'tasks_completed' },
  { id: 'perfectionist', category: 'tasks', icon: '💎', title: 'Perfectionist', description: 'Complete all tasks in a day', target: 1, type: 'perfect_day' },
  
  // Session Achievements
  { id: 'first_session', category: 'sessions', icon: '🍅', title: 'Pomodoro Beginner', description: 'Complete your first session', target: 1, type: 'sessions_completed' },
  { id: 'session_warrior_10', category: 'sessions', icon: '⚔️', title: 'Session Warrior', description: 'Complete 10 sessions', target: 10, type: 'sessions_completed' },
  { id: 'session_master_25', category: 'sessions', icon: '🥇', title: 'Session Master', description: 'Complete 25 sessions', target: 25, type: 'sessions_completed' },
  { id: 'session_legend_50', category: 'sessions', icon: '🌟', title: 'Session Legend', description: 'Complete 50 sessions', target: 50, type: 'sessions_completed' },
  { id: 'marathon_runner', category: 'sessions', icon: '🏃', title: 'Marathon Runner', description: 'Complete 5 sessions in one day', target: 5, type: 'daily_sessions' },
  
  // Streak Achievements
  { id: 'streak_starter', category: 'streaks', icon: '🔥', title: 'Streak Starter', description: 'Complete tasks for 3 days in a row', target: 3, type: 'daily_streak' },
  { id: 'streak_keeper', category: 'streaks', icon: '🔥🔥', title: 'Streak Keeper', description: 'Complete tasks for 7 days in a row', target: 7, type: 'daily_streak' },
  { id: 'streak_master', category: 'streaks', icon: '🔥🔥🔥', title: 'Streak Master', description: 'Complete tasks for 14 days in a row', target: 14, type: 'daily_streak' },
  { id: 'unstoppable', category: 'streaks', icon: '⚡', title: 'Unstoppable', description: 'Complete tasks for 30 days in a row', target: 30, type: 'daily_streak' },
  
  // Special Achievements
  { id: 'early_bird', category: 'special', icon: '🌅', title: 'Early Bird', description: 'Complete a task before 8 AM', target: 1, type: 'early_completion' },
  { id: 'night_owl', category: 'special', icon: '🦉', title: 'Night Owl', description: 'Complete a task after 10 PM', target: 1, type: 'late_completion' },
  { id: 'speed_demon', category: 'special', icon: '💨', title: 'Speed Demon', description: 'Complete 3 tasks in one hour', target: 3, type: 'speed_completion' },
  { id: 'category_explorer', category: 'special', icon: '🗺️', title: 'Category Explorer', description: 'Complete tasks in all 4 categories', target: 4, type: 'category_diversity' },
  { id: 'time_master', category: 'special', icon: '⏰', title: 'Time Master', description: 'Spend 10 hours on tasks', target: 36000, type: 'total_time' }
];

// Achievements Elements
const achievementsToggleBtn = $('#achievements-toggle-btn');
const achievementsPanel = $('#achievements-panel');
const closeAchievementsBtn = $('#close-achievements');
const achievementsGrid = $('#achievements-grid');
const categoryFilters = $('.category-filter');

// ===== ACHIEVEMENTS INITIALIZATION =====
function initializeAchievements() {
  console.log('🏆 Initializing Achievements Module');
  
  // Event Listeners
  achievementsToggleBtn.on('click', toggleAchievementsPanel);
  closeAchievementsBtn.on('click', closeAchievementsPanel);
  
  // Category filter functionality
  $(document).on('click', '.category-filter', function() {
    $('.category-filter').removeClass('active');
    $(this).addClass('active');
    renderAchievements();
  });
  
  console.log('✅ Achievements Module Initialized');
}

// ===== ACHIEVEMENTS PANEL FUNCTIONS =====

function toggleAchievementsPanel() {
  achievementsPanel.toggleClass('active');
  renderAchievements();
}

function closeAchievementsPanel() {
  achievementsPanel.removeClass('active');
}

// ===== ACHIEVEMENTS CHECKING =====

function checkAchievements() {
  const newAchievements = [];
  
  achievementDefinitions.forEach(achievement => {
    // Skip "first_task" as it's handled separately in todos.js
    if (achievement.id === 'first_task') return;
    
    if (!achievements[achievement.id]) {
      const progress = getAchievementProgress(achievement);
      
      if (progress >= achievement.target) {
        achievements[achievement.id] = {
          unlockedAt: new Date().toISOString(),
          progress: progress
        };
        newAchievements.push(achievement);
      }
    }
  });

  if (newAchievements.length > 0) {
    saveAchievements();
    showAchievementNotification(newAchievements);
  }
}

function getAchievementProgress(achievement) {
  const todos = window.getTodos ? window.getTodos() : [];
  const completedTasks = todos.filter(t => t.completed).length;
  const statistics = window.getStatistics ? window.getStatistics() : { sessions: [], shortBreaks: [], longBreaks: [], totalTimeSpent: {} };
  const totalSessions = statistics.sessions ? statistics.sessions.length : 0;
  const today = window.getCurrentDateString ? window.getCurrentDateString() : new Date().toDateString();
  
  switch (achievement.type) {
    case 'first_task_ever':
      // For "First Steps" - return 1 only if user has exactly 1 completed task OR if already unlocked
      if (achievements[achievement.id]) {
        return 1; // Already unlocked
      }
      return completedTasks >= 1 ? 1 : 0; // Check if they have at least 1 completed task
    
    case 'tasks_completed':
      return completedTasks;
    
    case 'sessions_completed':
      return totalSessions;
    
    case 'perfect_day':
      const todayTasks = todos.filter(t => new Date(t.createdAt).toDateString() === today);
      const todayCompleted = todayTasks.filter(t => t.completed).length;
      return (todayTasks.length > 0 && todayCompleted === todayTasks.length) ? 1 : 0;
    
    case 'daily_sessions':
      const todayStats = statistics.dailyStats ? (statistics.dailyStats[today] || { sessions: 0 }) : { sessions: 0 };
      return todayStats.sessions;
    
    case 'early_completion':
      return todos.some(t => t.completed && new Date(t.createdAt).getHours() < 8) ? 1 : 0;
    
    case 'late_completion':
      return todos.some(t => t.completed && new Date(t.createdAt).getHours() >= 22) ? 1 : 0;
    
    case 'category_diversity':
      const categories = new Set(todos.filter(t => t.completed).map(t => t.category));
      return categories.size;
    
    case 'total_time':
      const totalTime = statistics.totalTimeSpent ? Object.values(statistics.totalTimeSpent).reduce((a, b) => a + b, 0) : 0;
      return totalTime;
    
    default:
      return 0;
  }
}

// ===== ACHIEVEMENTS RENDERING =====

function renderAchievements() {
  const activeCategory = $('.category-filter.active').data('category') || 'all';
  const filteredAchievements = activeCategory === 'all' 
    ? achievementDefinitions 
    : achievementDefinitions.filter(a => a.category === activeCategory);

  achievementsGrid.empty();

  if (filteredAchievements.length === 0) {
    achievementsGrid.html(`
      <div class="achievements-empty">
        <div class="achievements-empty-icon">🏆</div>
        <div class="achievements-empty-text">No achievements in this category</div>
      </div>
    `);
    return;
  }

  filteredAchievements.forEach(achievement => {
    const isUnlocked = achievements[achievement.id];
    const progress = getAchievementProgress(achievement);
    const progressPercent = Math.min((progress / achievement.target) * 100, 100);

    const achievementHtml = `
      <div class="achievement-item ${isUnlocked ? 'unlocked' : ''}" data-id="${achievement.id}">
        <div class="achievement-header-item">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-info">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
          </div>
        </div>
        <div class="achievement-progress">
          <div class="achievement-progress-bar">
            <div class="achievement-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <div class="achievement-progress-text">${progress}/${achievement.target}</div>
        </div>
      </div>
    `;

    achievementsGrid.append(achievementHtml);
  });

  updateAchievementSummary();
}

function updateAchievementSummary() {
  const unlockedCount = Object.keys(achievements).length;
  const totalCount = achievementDefinitions.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  $('#unlocked-count').text(unlockedCount);
  $('#total-achievements').text(totalCount);
  $('#achievement-progress').text(progressPercent + '%');
}

function showAchievementNotification(newAchievements) {
  newAchievements.forEach(achievement => {
    // Create notification element
    const notification = $(`
      <div class="achievement-notification">
        <div class="achievement-notification-content">
          <div class="achievement-notification-icon">${achievement.icon}</div>
          <div class="achievement-notification-text">
            <div class="achievement-notification-title">Achievement Unlocked!</div>
            <div class="achievement-notification-name">${achievement.title}</div>
          </div>
        </div>
      </div>
    `);

    // Add to body and animate
    $('body').append(notification);
    
    setTimeout(() => {
      notification.addClass('show');
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
      notification.removeClass('show');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 4000);
  });
  
  console.log('🎉 Achievement notifications shown:', newAchievements);
}

// ===== UTILITY FUNCTIONS =====

function saveAchievements() {
  localStorage.setItem('pomodoroAchievements', JSON.stringify(achievements));
}

function getAchievements() {
  return achievements;
}

function getAchievementDefinitions() {
  return achievementDefinitions;
}

function resetAchievements() {
  if (confirm('Are you sure you want to reset all achievements? This cannot be undone.')) {
    achievements = {};
    saveAchievements();
    renderAchievements();
    
    console.log('🔄 Achievements reset');
  }
}

// ===== EXPORT FUNCTIONS =====

// Make functions available globally
window.initializeAchievements = initializeAchievements;
window.checkAchievements = checkAchievements;
window.getAchievements = getAchievements;
window.getAchievementDefinitions = getAchievementDefinitions;
window.showAchievementNotification = showAchievementNotification;
window.saveAchievements = saveAchievements;
window.resetAchievements = resetAchievements;
window.achievements = achievements;
window.achievementDefinitions = achievementDefinitions;
