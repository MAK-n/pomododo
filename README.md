# 🍅 Pomodoro Timer App

A beautiful, feature-rich Pomodoro Timer application with todo management, statistics tracking, and achievement system.

## ✨ Features

- **⏰ Pomodoro Timer** - 25-minute work sessions with short and long breaks
- **📝 Todo Management** - Organize tasks by categories with progress tracking
- **📊 Statistics** - Track your productivity with detailed analytics
- **🏆 Achievement System** - Unlock achievements as you complete tasks and sessions
- **📝 Quick Notepad** - Write important notes that reset on page refresh
- **🎵 Background Music** - Optional ambient music for focus
- **🌙 Theme Support** - Day/night mode with beautiful backgrounds
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **🔄 Fresh Start** - All data resets on page refresh for focused sessions

## 📁 Project Structure

```
pomodoro-app/
├── index.html                 # Main HTML file
├── assets/                    # Static assets
│   ├── css/                   # Stylesheets
│   │   ├── main.css          # Base styles & layout
│   │   ├── components.css    # Component-specific styles
│   │   ├── todos.css         # Todo list styles
│   │   ├── statistics.css    # Statistics panel styles
│   │   ├── achievements.css  # Achievement system styles
│   │   └── responsive.css    # Mobile responsive styles
│   ├── js/                   # JavaScript modules
│   │   ├── app.js           # Main application entry point
│   │   ├── timer.js         # Timer functionality
│   │   ├── todos.js         # Todo list management
│   │   ├── statistics.js    # Statistics tracking
│   │   ├── achievements.js  # Achievement system
│   │   ├── notepad.js       # Quick notepad functionality
│   │   └── utils.js         # Utility functions
│   ├── img/                 # Images
│   └── music/               # Audio files
└── README.md                # Project documentation
```

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Start using** the Pomodoro Timer!

### Local Development

For local development with a web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 🎮 How to Use

### Timer Controls
- **Space** - Start/Stop timer
- **Session/Break buttons** - Switch between work and break modes
- **Reset** - Reset current timer

### Todo Management
- **T** - Toggle todo panel
- **Add tasks** with categories (Study, Work, Personal, Exercise)
- **Check off** completed tasks
- **Track progress** with visual progress bar

### Quick Notepad
- **Alt + N** - Toggle notepad panel
- **Write important notes** for the current session
- **Character counter** shows note length
- **Clear button** to reset notes
- **Notes reset** on page refresh for fresh starts

### Statistics
- **S** - Toggle statistics panel
- **View** today, this week, and all-time stats
- **Track time** spent by category

### Achievements
- **A** - Toggle achievements panel
- **Unlock achievements** by completing tasks and sessions
- **Filter** by category (Tasks, Sessions, Streaks, Special)

### Music & Theme
- **M** - Toggle background music
- **L** - Toggle day/night theme
- **Ambient sounds** to help with focus

## 🎯 Achievement Categories

### 📋 Tasks
- 🎯 **First Steps** - Complete your first task
- ⭐ **Task Master** - Complete 5 tasks
- 🏆 **Task Champion** - Complete 10 tasks
- 👑 **Task Legend** - Complete 25 tasks
- 💎 **Perfectionist** - Complete all tasks in a day

### 🍅 Sessions
- 🍅 **Pomodoro Beginner** - Complete your first session
- ⚔️ **Session Warrior** - Complete 10 sessions
- 🥇 **Session Master** - Complete 25 sessions
- 🌟 **Session Legend** - Complete 50 sessions
- 🏃 **Marathon Runner** - Complete 5 sessions in one day

### 🔥 Streaks
- 🔥 **Streak Starter** - Complete tasks for 3 days in a row
- 🔥🔥 **Streak Keeper** - Complete tasks for 7 days in a row
- 🔥🔥🔥 **Streak Master** - Complete tasks for 14 days in a row
- ⚡ **Unstoppable** - Complete tasks for 30 days in a row

### ✨ Special
- 🌅 **Early Bird** - Complete a task before 8 AM
- 🦉 **Night Owl** - Complete a task after 10 PM
- 💨 **Speed Demon** - Complete 3 tasks in one hour
- 🗺️ **Category Explorer** - Complete tasks in all 4 categories
- ⏰ **Time Master** - Spend 10 hours on tasks

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Modular architecture
- **jQuery** - DOM manipulation and events

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Data Storage & Session Management
- **Fresh Start Philosophy** - All data resets on page refresh for focused sessions
- **No Persistent Storage** - Tasks, achievements, statistics, and notes reset when you reload
- **Session-Based Productivity** - Perfect for focused work sessions without distractions
- **No Backend Required** - Runs entirely in your browser
- **Privacy Focused** - No data is saved or tracked between sessions

## 🎨 Customization

### Colors
The app uses a warm, cozy color palette:
- **Warm Beige**: `#FBE7C6` (Background)
- **Soft Green**: `#A0E7E5` (Buttons and highlights)
- **Muted Red**: `#FFAEBB` (Accent color)
- **Deep Brown**: `#8B5A2B` (Text color)
- **Golden Yellow**: `#FFD700` (Highlights and timer)

### Adding New Achievements
Edit `assets/js/achievements.js` and add new achievement definitions to the `achievementDefinitions` array.

### Modifying Timer Durations
Edit the `TIMER_DURATIONS` object in `assets/js/timer.js`.

### Customizing the Notepad
Edit `assets/js/notepad.js` to modify notepad behavior or `assets/css/components.css` for styling.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Space** | Start/Stop timer |
| **G** | Toggle settings menu |
| **T** | Toggle todo panel |
| **S** | Toggle statistics panel |
| **A** | Toggle achievements panel |
| **M** | Toggle background music |
| **L** | Toggle day/night theme |
| **Alt + N** | Toggle notepad |
| **Escape** | Close all panels and menus |

## 📱 Mobile Support

The app is fully responsive and works great on:
- 📱 Mobile phones (portrait and landscape)
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🧪 Testing & Development

For developers and testing purposes, the following functions are available in the browser console:

| Function | Description |
|----------|-------------|
| `testTimer()` | Test timer functionality |
| `testButtons()` | Test all button elements |
| `testMusic()` | Test music functionality |
| `testLampToggle()` | Test theme toggle |
| `testFadeEffect()` | Test background fade transitions |
| `testNotepad()` | Test notepad functionality |

Simply open the browser console (F12) and type any of these functions to test specific features.

## 🤝 Contributing

Feel free to contribute to this project by:
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🔧 Submitting pull requests
- 📖 Improving documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Pomodoro Technique by Francesco Cirillo
- Icons from Unicode Emoji
- Background images and design inspiration
- jQuery and modern web technologies

---

**Happy Productivity! 🍅✨**
