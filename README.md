# 🌙 LofiSchedule — Chill Study Planner

<div align="center">

**A beautiful, ambient study scheduler with lo-fi music, Pomodoro timer, and workload analytics.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF6C37?style=for-the-badge&logo=webaudio&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen?style=flat-square)](./index.html)
[![Single File](https://img.shields.io/badge/Single%20File-App-blueviolet?style=flat-square)](./index.html)

</div>

---

## 📸 Preview

![Screenshot](./preview.png)

> *Dark ambient UI with animated starfield, animated rain, and a glowing purple palette.*

---

## ✨ Features

### 📅 Smart Calendar
- **3 views**: Week / Day / Month — switch instantly with `W`, `D`, `M` keyboard shortcuts
- **Click-to-create**: Click any time slot to open the event form pre-filled with that time
- **Recurring events**: Daily, Weekly, Monthly, Yearly recurrence patterns
- **Color coding**: 7 vibrant colors to categorize subjects or activities
- **Now-line**: Real-time red indicator showing current time on the calendar
- **Mini calendar**: Sidebar navigation with event-dot indicators

### 📋 Task Management
- Add and check off tasks with animated checkboxes
- **Star difficulty rating (1–5)** for each task
- Tasks auto-sorted: pending → completed
- Persistent storage via `localStorage`

### 🍅 Pomodoro Timer
- Full **25 / 5 / 15 min** Pomodoro cycle (focus → short break → long break after 4 sessions)
- Visual progress bar + session tracker (🍅 emoji dots)
- **Auto-triggers** when a calendar event's start time arrives (if Pomodoro is enabled on that event)
- Today's focus time counter and completed Pomodoro count

### 🎵 Lo-fi Music Player & Ambient Mixer
| Feature | Description |
|---|---|
| **Lo-fi Synthesizer** | 5 procedurally generated tracks via **Web Audio API** — no MP3 files needed |
| **Ambient Mixer** | Mix Rain 🌧 · Ocean Waves 🌊 · Fire 🔥 · Coffee Shop ☕ · Forest 🌿 — all synthesized |
| **Scene → Music pairing** | Switching scenes auto-changes track and ambient sound |
| **Volume control** | Per-channel volume slider for music + per-ambient-source sliders |

### 🎨 Animated Scenes (Canvas-drawn, zero image files)
| Scene | Background | Auto-ambient |
|---|---|---|
| 🌙 Night | Drifting nebulas + twinkling stars | — |
| 🌧 Rain | Animated rain drops on canvas | Rain sounds |
| 🌿 Forest | Star field + glowing fireflies | Forest ambience |
| ☕ Cafe | Warm golden glows + fireflies | Cafe chatter |

### 📊 Workload Analytics & Smart Warnings
- **Daily subject bars**: Visualize time and difficulty per subject
- **7-day history chart**: Bar chart of learning load for the past week
- **⚠️ Overload warning**: Auto-detects when ≥2 subjects with difficulty ≥4 are scheduled on the same day
- **Load level indicator**: 🟢 Light / 🟡 Moderate / 🔴 Overloaded

### 🔔 Notifications
- **5-minute reminder** toast before each event
- **On-time notification** when an event starts
- Native **Browser Notification API** (with permission)

### 📱 Responsive Design
- Fully responsive from desktop (3-column) to mobile (slide-out drawer sidebars)
- Touch-friendly UI on mobile devices

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | New event |
| `Space` | Play / Pause lo-fi music |
| `P` | Start / Pause Pomodoro |
| `W` | Week view |
| `D` | Day view |
| `M` | Month view |
| `T` | Jump to Today |
| `← →` | Navigate calendar |
| `Esc` | Close modal / Exit focus mode |

---

## 🚀 Getting Started

### Option 1 — Live Demo (GitHub Pages)
👉 **[https://YOUR-USERNAME.github.io/lofi-scheduler](https://YOUR-USERNAME.github.io/lofi-scheduler)**

### Option 2 — Run Locally
No installation required. Just open the file in any modern browser:

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/lofi-scheduler.git
cd lofi-scheduler

# Open directly (Windows)
start index.html

# Open directly (macOS)
open index.html

# Open directly (Linux)
xdg-open index.html
```

> **Requirements**: Any modern browser (Chrome 80+, Firefox 75+, Edge 80+, Safari 14+). No server needed.

---

## 🏗️ Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic markup, `<canvas>`, `<audio>` |
| **CSS3** | CSS Grid, custom properties, `backdrop-filter`, responsive media queries |
| **Vanilla JavaScript** | Zero dependencies — no frameworks, no bundler |
| **Web Audio API** | Procedural lo-fi music synthesis + ambient noise generation |
| **Canvas 2D API** | Animated starfield, rain, nebulas, fireflies |
| **localStorage** | Persistent events, tasks, and focus session data |
| **Notifications API** | Native browser event reminders |

---

## 📁 Project Structure

```
lofi-scheduler/
├── index.html      # Entire app — single self-contained file
├── preview.png     # Screenshot for README (add your own)
├── README.md       # This file
├── LICENSE         # MIT License
└── .gitignore      # Git ignore rules
```

---

## 🌐 Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set Source to **Deploy from a branch → main → / (root)**
4. Your app will be live at `https://YOUR-USERNAME.github.io/lofi-scheduler`

---

## 🛣️ Roadmap

- [ ] Export events to `.ics` (iCalendar) format
- [ ] Google Calendar sync via public API
- [ ] Drag-and-drop event rescheduling
- [ ] Dark/Light theme toggle
- [ ] PWA support (offline + home screen install)
- [ ] Statistics dashboard page

---

## 📝 License

MIT © 2026 [Gia Kiet](https://github.com/YOUR-USERNAME)

---

<div align="center">

Made with ❤️ and ☕ — *because studying is better with lo-fi.*

</div>
