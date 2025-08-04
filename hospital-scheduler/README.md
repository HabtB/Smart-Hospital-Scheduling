# Smart Hospital Scheduling System

A comprehensive hospital staff scheduling and management system built with React, TypeScript, and Firebase. Features role-based authentication, real-time data management, and an intuitive interface for healthcare administrators.

## 🚀 Features

### Authentication & Access Control
- **Role-Based Authentication** with 4 user types:
  - **Admin**: Full system access, user management
  - **Supervisor**: Staff management, scheduling, reports
  - **Doctor**: Dashboard, requests, notifications
  - **Nurse**: Dashboard, requests, notifications
- **Admin-Only User Creation** with temporary password generation
- **Mock Authentication** for development and testing
- **Persistent Login** with localStorage

### Core Functionality
- **Dashboard** with staff overview, shift summaries, and activity feed
- **Staff Management** with department organization and role assignments
- **Shift Scheduling** with drag-and-drop interface and conflict detection
- **Request Management** for time-off, shift swaps, and schedule changes
- **Real-time Updates** via Firebase integration
- **Responsive Design** optimized for desktop and mobile

### Technical Features
- **TypeScript** throughout for type safety
- **Mock Data System** for development and testing
- **Firebase Integration** for production data storage
- **Tailwind CSS** for modern, responsive styling
- **Performance Optimized** with efficient data loading

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Real-time updates)
- **Development**: Mock data system for offline development
- **Build Tool**: Vite with HMR and fast refresh
- **Code Quality**: ESLint + TypeScript strict mode

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (for production)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd hospital-scheduler
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Development Mode (optional)
VITE_USE_MOCK_DATA=true
```

**Important**: Use `=` (not `:`) and no trailing commas in .env files!

### 3. Tailwind CSS Setup

The project requires proper Tailwind CSS configuration:

1. **Stop the dev server** (Ctrl + C if running)
2. **Clear browser cache** (Ctrl + Shift + R)
3. **Restart the dev server**:

```bash
npm run dev
```

### 4. Firebase Setup (Production)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Copy your Firebase config to the `.env` file
4. Set `VITE_USE_MOCK_DATA=false` in `.env`

## 🎮 Demo Accounts

For quick testing with mock data, use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | demo123 |
| Supervisor | supervisor@hospital.com | demo123 |
| Doctor | doctor@hospital.com | demo123 |
| Nurse | nurse@hospital.com | demo123 |

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main navigation layout
│   ├── PrivateRoute.tsx # Authentication guard
│   └── RoleBasedLogin.tsx # Login interface
├── pages/               # Main application pages
│   ├── Dashboard.tsx    # Main dashboard
│   ├── StaffManagement.tsx
│   ├── ShiftScheduling.tsx
│   └── RequestsManagement.tsx
├── hooks/               # Custom React hooks
│   └── useRealtimeData.ts
├── services/            # Data layer
│   ├── firebaseService.ts
│   ├── mockDataService.ts
│   └── mockData.ts
├── context/             # React context providers
│   ├── AuthContext.tsx
│   └── MockAuthContext.tsx
├── types/               # TypeScript definitions
│   └── index.ts
├── config/              # Configuration files
│   ├── firebase.ts
│   └── env.ts
└── styles/
    └── index.css        # Tailwind directives
```

## 👥 User Roles & Permissions

### Admin
- Full system access
- Create and manage user accounts
- View all reports and analytics
- System configuration

### Supervisor  
- Staff management and scheduling
- Approve/reject requests
- Department oversight
- Generate reports

### Doctor/Nurse
- View personal dashboard
- Submit time-off requests
- View notifications
- Limited scheduling view

## 🧪 Development & Testing

### Mock Data System
```javascript
// Test mock data functionality in browser console
testMockData.runAllTests()        // Complete test suite
testMockData.testMockDataService() // Service functionality
testMockData.testDataIntegrity()   // Data relationships
testMockData.testPerformance()     // Performance benchmarks
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🎨 UI Features

- **Modern Design** with rounded corners, shadows, and gradients
- **Hover Effects** and smooth transitions
- **Responsive Layout** that works on all screen sizes
- **Professional Color Scheme** suitable for healthcare
- **Intuitive Navigation** with role-based menu items
- **Loading States** for better user experience

## 🔧 Configuration

### Environment Variables
- `VITE_USE_MOCK_DATA`: Toggle between mock and Firebase data
- `VITE_FIREBASE_*`: Firebase configuration keys

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Extended color palette for healthcare themes
- Custom spacing and typography scales
- Responsive breakpoints optimized for medical workflows

## 📚 Development Guidelines

### Code Standards
- **TypeScript**: Strict mode enabled, all components typed
- **Component Structure**: Functional components with hooks
- **Styling**: Tailwind CSS classes, no inline styles
- **State Management**: React Context for global state
- **Error Handling**: Comprehensive try-catch blocks

### Documentation
- All development work documented in `Error.md`
- Real-time documentation updates required
- Feature implementations and bug fixes tracked

## 🐛 Troubleshooting

### Common Issues

**Cramped UI / Styles Not Applied**
- Ensure Tailwind CSS is properly configured
- Check that `@tailwind` directives are in `src/styles/index.css`
- Restart dev server after Tailwind changes

**Firebase Configuration Errors**
- Verify `.env` file format (use `=`, no `:` or commas)
- Check all required Firebase environment variables
- Ensure Firebase project has Authentication and Firestore enabled

**TypeScript Errors**
- Run `npm run type-check` to identify issues
- Check imports are from correct paths
- Ensure all components have proper type definitions

### Getting Help
- Check `Error.md` for development history and solutions
- Review browser console for detailed error messages
- Test with mock data to isolate Firebase issues

## 📈 Performance

- **Build Size**: Optimized with Vite bundling and tree-shaking
- **Load Time**: Lazy loading for non-critical components
- **Data Loading**: Efficient Firebase queries with real-time updates
- **Mock Performance**: All operations < 100ms for development

## 🚀 Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to hosting** (Firebase Hosting, Netlify, Vercel, etc.)

3. **Environment Variables**: Ensure production environment has proper Firebase configuration

## 📄 License

This project is developed for educational and demonstration purposes.

## 🤝 Contributing

1. Follow the established TypeScript and component patterns
2. Update documentation in `Error.md` for all changes
3. Test with both mock and Firebase data
4. Ensure responsive design on all screen sizes
5. Maintain role-based access control principles

---

**Built with ❤️ for healthcare professionals**
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
