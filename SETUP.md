# 📋 MHC Avatar Frontend - Setup Guide

## 📌 Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 Quick Start

### Step 1️⃣ Clone Repository

```bash
git clone https://github.com/bsharma-d/MHC-Avatar-Frontend.git
cd MHC-Avatar-Frontend
```

### Step 2️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages (React, Three.js, Redux, Tailwind, etc.)

### Step 3️⃣ Create Environment File

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:7071
```

### Step 4️⃣ Start Development Server

```bash
npm run dev
```

The app will be available at: **`http://localhost:5173/`**

---

## 📁 Project Structure

```
MHC-Avatar-Frontend/
├── src/
│   ├── components/
│   │   ├── Avatar.tsx          # 3D avatar rendering (Three.js)
│   │   ├── Chat.tsx            # Chat message interface
│   │   └── VoiceInput.tsx      # Voice input button
│   ├── services/
│   │   ├── api.ts              # Backend API calls
│   │   └── avatar.ts           # Avatar utilities
│   ├── store/
│   │   ├── chatSlice.ts        # Redux chat state
│   │   └── index.ts            # Redux store configuration
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global Tailwind styles
├── public/
│   └── avatar.glb              # 3D avatar model (add your own)
├── .env                        # Environment variables (create this)
├── .env.example                # Environment template
├── package.json                # Dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── tsconfig.json               # TypeScript config
├── SETUP.md                    # This file
└── README.md                   # Project overview
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎤 **Voice Input** | Web Speech API for voice recognition |
| 💬 **Real-time Chat** | Instant message display and history |
| 🤖 **3D Avatar** | Three.js powered 3D character |
| 🎨 **Modern UI** | Tailwind CSS responsive design |
| 📦 **State Management** | Redux Toolkit for app state |
| 🔊 **Audio Output** | Text-to-speech avatar responses |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Three.js** | 3D rendering |
| **Redux Toolkit** | State management |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP client |
| **Vite** | Build tool |

---

## 📝 Available Scripts

```bash
# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Format code (if configured)
npm run format
```

---

## 🔧 Environment Variables

Create `.env` file in root with:

```env
# Backend API URL
VITE_API_URL=http://localhost:7071

# Optional: Add more variables as needed
# VITE_SPEECH_KEY=your_key_here
# VITE_SPEECH_REGION=your_region_here
```

**Note:** Never commit `.env` file to Git. Use `.env.example` as template.

---

## 🐛 Troubleshooting

### ❌ Port 5173 Already in Use

If you get "port already in use" error:

```bash
npm run dev -- --port 3000
```

### ❌ Dependencies Installation Issues

Clear cache and reinstall:

```bash
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### ❌ Module Not Found Errors

Make sure all files are in correct locations:

```bash
# Check if src folder exists
ls src/

# Check if components exist
ls src/components/
```

### ❌ Tailwind CSS Not Working

Restart dev server:

```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

### ❌ Avatar Not Showing

1. Check browser console for errors (F12)
2. Make sure `public/avatar.glb` exists
3. Check network tab for 404 errors

---

## 🔌 Backend Connection

The frontend expects backend API at: **`http://localhost:7071`**

**Before testing chat:**
1. Make sure backend server is running
2. Check `.env` file has correct API URL
3. Test API endpoint in browser: `http://localhost:7071/api/GetAvatarResponse`

---

## 👥 Contributing

### Creating a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Make your changes
# Edit files...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add: description of your feature"

# Push to GitHub
git push origin feature/your-feature-name
```

### Creating a Pull Request

1. Go to GitHub repository
2. Click "Pull requests" tab
3. Click "New pull request"
4. Select your branch
5. Add description
6. Click "Create pull request"

---

## 📌 Important Notes

⚠️ **Avatar Model**
- Place 3D model file (`avatar.glb`) in `public/` folder
- Download from [Sketchfab](https://sketchfab.com/) or [Mixamo](https://www.mixamo.com/)

⚠️ **Voice Input**
- Requires microphone permissions
- Works best in Chrome/Edge browsers
- Test microphone before using

⚠️ **Backend Required**
- Chat functionality requires backend API running
- Without backend, chat will show connection errors

⚠️ **Environment Variables**
- Never commit `.env` file
- Always use `.env.example` as template
- Keep API keys private

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## ❓ FAQ

**Q: Can I use this on Windows/Mac/Linux?**
A: Yes! Node.js and npm work on all platforms.

**Q: Do I need to install anything else?**
A: No, `npm install` handles all dependencies.

**Q: How do I update dependencies?**
A: Run `npm update` to update all packages.

**Q: Can I change the port?**
A: Yes, use `npm run dev -- --port 3000`

**Q: Where do I put the avatar model?**
A: Place `avatar.glb` in the `public/` folder.

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Check browser console (F12)
3. Check GitHub Issues
4. Contact the team

---

**Last Updated:** June 2026
**Version:** 1.0
