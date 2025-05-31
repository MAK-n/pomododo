/*
===========================================
POMODORO TIMER - TODOS MODULE
===========================================
Todo list management and progress tracking
===========================================
*/

// ===== TODO VARIABLES =====
let todos = []; // Reset on every page refresh - no persistence
let todoIdCounter = 1; // Reset on every page refresh - no persistence

// Todo Elements
const todoToggleBtn = $('#todo-toggle-btn');
const todoPanel = $('#todo-panel');
const closeTodoBtn = $('#close-todo');
const todoInput = $('#todo-input');
const todoCategory = $('#todo-category');
const addTodoBtn = $('.add-todo-btn');
const todoList = $('#todo-list');
const completedCount = $('#completed-count');
const totalCount = $('#total-count');
const progressPercentage = $('#progress-percentage');
const progressBarFill = $('#progress-bar-fill');
const clearCompletedBtn = $('#clear-completed');
const clearAllBtn = $('#clear-all');

// ===== TODO INITIALIZATION =====
function initializeTodos() {
  console.log('📝 Initializing Todos Module');

  // Debug: Check if elements exist
  console.log('Todo button found:', todoToggleBtn.length > 0);
  console.log('Todo panel found:', todoPanel.length > 0);

  renderTodos();

  // Event Listeners
  if (todoToggleBtn.length > 0) {
    todoToggleBtn.on('click', function(e) {
      console.log('📝 Todo button clicked!');
      toggleTodoPanel();
    });
  } else {
    console.error('❌ Todo toggle button not found!');
  }

  closeTodoBtn.on('click', closeTodoPanel);
  addTodoBtn.on('click', addTodo);
  clearCompletedBtn.on('click', clearCompletedTodos);
  clearAllBtn.on('click', clearAllTodos);

  // Enter key to add todo
  todoInput.on('keypress', function(e) {
    if (e.which === 13) {
      addTodo();
    }
  });

  // Todo item interactions
  $(document).on('click', '.todo-checkbox', toggleTodoCompletion);
  $(document).on('click', '.todo-delete', deleteTodo);

  console.log('✅ Todos Module Initialized');
}

// ===== TODO PANEL FUNCTIONS =====

function toggleTodoPanel() {
  const isOpening = !todoPanel.hasClass('active');
  todoPanel.toggleClass('active');

  if (isOpening) {
    if (window.trackPanelOpen) {
      window.trackPanelOpen('todos');
    }
    renderTodos();
  } else {
    if (window.trackPanelClose) {
      window.trackPanelClose('todos');
    }
  }
}

function closeTodoPanel() {
  todoPanel.removeClass('active');
  if (window.trackPanelClose) {
    window.trackPanelClose('todos');
  }
}

// ===== TODO MANAGEMENT FUNCTIONS =====

function addTodo() {
  const text = todoInput.val().trim();
  const category = todoCategory.val();

  if (!text) {
    todoInput.focus();
    return;
  }

  const todo = {
    id: todoIdCounter++,
    text: text,
    category: category,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.unshift(todo); // Add to beginning of array

  // Clear input
  todoInput.val('');
  todoInput.focus();

  // Save and render
  saveTodos();
  renderTodos();

  console.log('➕ Todo added:', todo);
}

function toggleTodoCompletion() {
  const todoId = parseInt($(this).data('id'));
  const todo = todos.find(t => t.id === todoId);

  if (todo) {
    const wasCompleted = todo.completed;
    todo.completed = !todo.completed;

    // Check for achievements when task is completed
    if (!wasCompleted && todo.completed) {
      checkFirstTaskAchievement();

      // Check for other achievements
      if (window.checkAchievements) {
        window.checkAchievements();
      }
    }

    saveTodos();
    renderTodos();

    console.log('✅ Todo toggled:', todo);
  }
}

function deleteTodo() {
  const todoId = parseInt($(this).data('id'));
  todos = todos.filter(t => t.id !== todoId);

  saveTodos();
  renderTodos();

  console.log('🗑️ Todo deleted:', todoId);
}

function clearCompletedTodos() {
  todos = todos.filter(t => !t.completed);
  saveTodos();
  renderTodos();

  console.log('🧹 Completed todos cleared');
}

function clearAllTodos() {
  if (confirm('Are you sure you want to delete all todos?')) {
    todos = [];
    saveTodos();
    renderTodos();

    console.log('🧹 All todos cleared');
  }
}

// ===== ACHIEVEMENT INTEGRATION =====

function checkFirstTaskAchievement() {
  const completedTasksCount = todos.filter(t => t.completed).length;

  if (completedTasksCount === 1) {
    // This is the first task ever completed
    if (window.achievements && !window.achievements['first_task']) {
      window.achievements['first_task'] = {
        unlockedAt: new Date().toISOString(),
        progress: 1
      };

      if (window.saveAchievements) {
        window.saveAchievements();
      }

      if (window.achievementDefinitions && window.showAchievementNotification) {
        const firstTaskAchievement = window.achievementDefinitions.find(a => a.id === 'first_task');
        if (firstTaskAchievement) {
          window.showAchievementNotification([firstTaskAchievement]);
        }
      }
    }
  }
}

// ===== RENDERING FUNCTIONS =====

function renderTodos() {
  todoList.empty();

  if (todos.length === 0) {
    todoList.html(`
      <div class="todo-empty">
        <div class="todo-empty-icon">📝</div>
        <div class="todo-empty-text">No tasks yet</div>
        <div class="todo-empty-subtext">Add your first task to get started!</div>
      </div>
    `);
  } else {
    todos.forEach(todo => {
      const todoHtml = `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
          <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
          <div class="todo-content">
            <div class="todo-text">${escapeHtml(todo.text)}</div>
            <div class="todo-category">${getCategoryIcon(todo.category)} ${todo.category}</div>
          </div>
          <button class="todo-delete" data-id="${todo.id}">&times;</button>
        </div>
      `;
      todoList.append(todoHtml);
    });
  }

  updateCompletedCount();
}

function updateCompletedCount() {
  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update text elements
  completedCount.text(completed);
  totalCount.text(total);
  progressPercentage.text(percentage + '%');

  // Update progress bar
  progressBarFill.css('width', percentage + '%');

  // Add completion celebration effect for 100%
  if (percentage === 100 && total > 0) {
    progressBarFill.addClass('completed');
    setTimeout(() => {
      progressBarFill.removeClass('completed');
    }, 2000);
  }
}

// ===== UTILITY FUNCTIONS =====

function getCategoryIcon(category) {
  const icons = {
    study: '📚',
    work: '💼',
    personal: '🏠',
    exercise: '💪'
  };
  return icons[category] || '📝';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function saveTodos() {
  // No persistence - todos reset on page refresh
  console.log('📝 Todos updated (no persistence)');
}

// ===== TODO GETTERS =====

function getTodos() {
  return todos;
}

function getCompletedTodos() {
  return todos.filter(t => t.completed);
}

function getIncompleteTodos() {
  return todos.filter(t => !t.completed);
}

function getCurrentTaskCategory() {
  const incompleteTodos = getIncompleteTodos();
  if (incompleteTodos.length > 0) {
    return incompleteTodos[0].category;
  }
  return 'study'; // default category
}

function getTodoStats() {
  const completed = getCompletedTodos().length;
  const total = todos.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    completed,
    total,
    percentage,
    incomplete: total - completed
  };
}

// ===== DEBUG FUNCTIONS =====

function testTodoButton() {
  console.log('🧪 Testing Todo Button');
  console.log('Button element:', $('#todo-toggle-btn'));
  console.log('Button exists:', $('#todo-toggle-btn').length > 0);
  console.log('Button visible:', $('#todo-toggle-btn').is(':visible'));
  console.log('Button CSS display:', $('#todo-toggle-btn').css('display'));
  console.log('Button CSS pointer-events:', $('#todo-toggle-btn').css('pointer-events'));
  console.log('Button CSS cursor:', $('#todo-toggle-btn').css('cursor'));

  // Try to trigger click manually
  $('#todo-toggle-btn').trigger('click');
}

// ===== EXPORT FUNCTIONS =====

// Make functions available globally
window.initializeTodos = initializeTodos;
window.getTodos = getTodos;
window.getCompletedTodos = getCompletedTodos;
window.getIncompleteTodos = getIncompleteTodos;
window.getCurrentTaskCategory = getCurrentTaskCategory;
window.getTodoStats = getTodoStats;
window.addTodo = addTodo;
window.saveTodos = saveTodos;
window.testTodoButton = testTodoButton;
window.toggleTodoPanel = toggleTodoPanel;
