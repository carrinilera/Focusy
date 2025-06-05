# ⏳ Focusy – Pomodoro Timer Web App

**Focusy** is a sleek and modern Pomodoro timer built with React and DFINITY's Internet Computer (IC) backend using Motoko. It helps users manage focus sessions effectively and keeps track of completed sessions in a persistent history.

## ✨ Features

- 🕒 Start, pause, and reset focus sessions easily.
- 🛠 Customizable focus duration (default: 25 minutes).
- 📜 Automatically records each completed session to history.
- 💾 Session history is saved using a Motoko backend on the Internet Computer.
- 🧹 Option to clear all previous session records.
- 💡 Clean, animated UI with glowing effects for better UX.

## 🚀 Tech Stack

- **Frontend:** React (with Vite)
- **Backend:** Motoko (DFINITY Internet Computer)
- **Styling:** Bootstrap 5 + custom CSS
- **Icons:** Bootstrap Icons

## 🛠 Installation & Development

### Prerequisites

- Node.js + npm
- [DFINITY SDK (dfx)](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- Internet connection (to deploy to local Internet Computer replica)

### Getting Started

1. Clone the repository:

```
   git clone https://github.com/carrinilera/Focusy.git
   cd focusy
```

2. Install frontend dependencies:
```
  cd frontend
  npm install
```

3. Start the DFINITY backend locally:
```
  dfx start --background
  dfx deploy
```

## 📂 Project Structure
```
focusy/
├── .devcontainer/
├── backend/  
│   └── app.mo
├── frontend/
│   ├── app.jsx
│   ├── index.html
│   └── ...
└── README.md
```

## ⚙️ Backend API (Motoko)

The Motoko canister exposes the following methods:
- `addSession(duration: Nat)`: Add a completed session with duration in minutes.
- `getSessions(): [Session]`: Get the list of all sessions.
- `clearSessions()`: Clear all session history.

## 🙌 Credits

Built with ❤️ using React + Motoko
Icons by Bootstrap Icons

## 📄 License

MIT License © 2025.
