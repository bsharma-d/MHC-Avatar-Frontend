# 🤖 MHC Avatar Frontend

> Voice-based conversational AI with 3D avatar for the National Quality Framework

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-Latest-black?logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss)](https://tailwindcss.com/)

---

## 🚀 Quick Start

Get up and running in 4 steps:

```bash
# 1. Clone the repository
git clone https://github.com/bsharma-d/MHC-Avatar-Frontend.git
cd MHC-Avatar-Frontend

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_API_URL=http://localhost:7071" > .env

# 4. Start development server
npm run dev
```

Open **`http://localhost:5173/`** in your browser 🎉

---

## 📖 Full Setup Guide

For detailed setup instructions, see **[SETUP.md](./SETUP.md)**

---

## ✨ Features

### 🎤 Voice Interaction
- Real-time speech recognition
- Natural language processing
- Voice input with visual feedback

### 💬 Chat Interface
- Real-time message display
- Conversation history
- Responsive design

### 🤖 3D Avatar
- Three.js powered 3D rendering
- Gesture animations
- Lip-sync with audio

### 🎨 Modern UI
- Tailwind CSS styling
- Mobile responsive
- Dark/Light mode ready

### 📦 State Management
- Redux Toolkit
- Centralized state
- Easy debugging

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D rendering
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Build & Dev Tools
- **Vite** - Lightning fast build tool
- **PostCSS** - CSS processing
- **ESLint** - Code quality

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Avatar.tsx          # 3D avatar (Three.js)
│   ├── Chat.tsx            # Chat interface
│   └── VoiceInput.tsx      # Voice input button
├── services/
│   ├── api.ts              # Backend API calls
│   └── avatar.ts           # Avatar utilities
├── store/
│   ├── chatSlice.ts        # Redux chat state
│   └── index.ts            # Redux store config
├── types/
│   └── index.ts            # TypeScript types
├── App.tsx                 # Main component
├── main.tsx                # Entry point
└── index.css               # Global styles
```

---

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint (if configured)
npm run format       # Format code (if configured)
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:7071
```

See `.env.example` for all available variables.

### Vite Config
- `vite.config.ts` - Vite configuration

### Tailwind Config
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### TypeScript Config
- `tsconfig.json` - TypeScript configuration

---

## 🔄 How It Works

```
User Input (Voice/Text)
        ↓
Frontend (React + Three.js)
        ↓
Backend API (http://localhost:7071)
        ↓
AI Processing (Azure OpenAI)
        ↓
Response Generation
        ↓
Avatar Animation + Audio + Chat Display
```

### Step-by-Step Flow

1. **User Input** - Speaks or types a question
2. **Frontend Processing** - Captures and sends to backend
3. **Backend Processing** - AI processes query with knowledge base
4. **Response Generation** - Backend returns text + gesture + audio
5. **Avatar Display** - Frontend plays animation and audio
6. **Chat Update** - Message added to conversation history

---

## 📋 Requirements

| Requirement | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | Latest | Package manager |
| Backend | Running | API server at :7071 |
| Browser | Modern | Chrome/Edge/Firefox |

---

## 🤝 Contributing

### Workflow

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Commit**: `git commit -m "Add amazing feature"`
5. **Push**: `git push origin feature/amazing-feature`
6. **Create** Pull Request

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components small and focused

---

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
npm run dev -- --port 3000
```

**Dependencies Not Installing**
```bash
rm -r node_modules package-lock.json
npm install
```

**Tailwind Not Working**
```bash
npm run dev  # Restart dev server
```

**Avatar Not Showing**
- Check browser console (F12)
- Verify `public/avatar.glb` exists
- Check network tab for 404 errors

See **[SETUP.md](./SETUP.md)** for more troubleshooting tips.

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup guide
- **[React Docs](https://react.dev/)** - React documentation
- **[Three.js Docs](https://threejs.org/docs/)** - 3D rendering
- **[Redux Docs](https://redux-toolkit.js.org/)** - State management
- **[Tailwind Docs](https://tailwindcss.com/docs)** - CSS framework

---

## 🔐 Security

- Never commit `.env` file
- Keep API keys private
- Use HTTPS in production
- Validate user input
- Follow OWASP guidelines

---

## 📄 License

Proprietary - MHC (Mental Health Commission)

All rights reserved.

---

## 👥 Team

- **Frontend Team** - React, Three.js, UI/UX
- **Backend Team** - API, AI, Database
- **DevOps Team** - Infrastructure, Deployment

---

## 📞 Support

- 📖 Check [SETUP.md](./SETUP.md) first
- 🐛 Check browser console (F12)
- 💬 Contact the team
- 📧 Email: support@example.com

---

## 🎯 Roadmap

- [ ] Add more avatar animations
- [ ] Implement conversation persistence
- [ ] Add multi-language support
- [ ] Improve voice recognition
- [ ] Add accessibility features
- [ ] Performance optimization

---

## 📊 Project Stats

- **Language:** TypeScript
- **Framework:** React 18
- **Build Tool:** Vite
- **Package Manager:** npm
- **License:** Proprietary

---

**Last Updated:** June 2026  
**Version:** 1.0.0  
**Status:** Active Development

---

<div align="center">

Made with ❤️ by the MHC Team

[⬆ Back to Top](#-mhc-avatar-frontend)

</div>
