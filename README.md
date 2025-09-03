# 🚀 DSA Learning Portal

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-Build-yellow?style=for-the-badge&logo=vite" alt="Vite" />
</div>

<div align="center">
  <h3>🎯 Master Data Structures & Algorithms with Interactive Learning</h3>
  <p>A comprehensive, modern web application for learning DSA concepts through interactive tutorials, coding challenges, and progress tracking.</p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📱 Responsive Design](#-responsive-design)
- [🎨 UI/UX Highlights](#-uiux-highlights)
- [📊 Learning Modules](#-learning-modules)
- [🏆 Progress Tracking](#-progress-tracking)
- [🔐 Authentication](#-authentication)
- [📁 Project Structure](#-project-structure)
- [🌟 Key Features Breakdown](#-key-features-breakdown)
- [🔧 Configuration](#-configuration)
- [📈 Performance](#-performance)
- [🤝 Contributing](#-contributing)
- [📞 Contact](#-contact)

---

## ✨ Features

### 🎓 **Comprehensive Learning Experience**
- **6 Core DSA Topics**: Strings, Programming Basics, Bit Manipulation, Sorting, Searching, Hash Maps
- **Interactive Video Tutorials**: Step-by-step explanations with visual demonstrations
- **Multiple Choice Questions (MCQs)**: Test understanding with instant feedback
- **Coding Problems**: Hands-on practice with real programming challenges
- **Cheat Sheets**: Quick reference guides for algorithms and data structures
- **Personal Notes**: Take and save notes while learning

### 📊 **Progress & Analytics**
- **Real-time Progress Tracking**: Visual progress bars for each topic
- **Learning Statistics**: Track problems solved, streak days, completion rates
- **Performance Analytics**: Detailed insights into learning patterns
- **Achievement System**: Gamified learning experience

### 🏆 **Competitive Features**
- **Programming Contests**: Participate in coding competitions
- **Leaderboards**: Compare progress with other learners
- **Problem Difficulty Levels**: Beginner to Advanced challenges
- **Time-based Challenges**: Improve coding speed and accuracy

### 🔐 **User Management**
- **Secure Authentication**: Email/Username & Password based login
- **User Profiles**: Customizable profiles with learning preferences
- **Progress Persistence**: All progress saved and synced across devices
- **Social Features**: Connect with other learners

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern UI library with hooks and context
- **TypeScript** - Type-safe development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful, accessible component library
- **Lucide React** - Comprehensive icon library
- **React Router DOM** - Client-side routing
- **React Query** - Server state management

### **Backend & Database**
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Secure data access
- **Real-time Subscriptions** - Live data updates

### **Development Tools**
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dsa-learning-portal.git
   cd dsa-learning-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Configure your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📱 Responsive Design

### **Mobile First Approach**
- ✅ **Mobile Optimized**: Fully responsive design from 320px+
- ✅ **Touch Friendly**: Optimized tap targets and gestures
- ✅ **Performance**: Optimized for mobile networks
- ✅ **Progressive Web App**: Installable on mobile devices

### **Breakpoint System**
- **xs**: 475px+ (Small phones)
- **sm**: 640px+ (Large phones)
- **md**: 768px+ (Tablets)
- **lg**: 1024px+ (Laptops)
- **xl**: 1280px+ (Desktops)
- **2xl**: 1536px+ (Large screens)

---

## 🎨 UI/UX Highlights

### **Modern Design System**
- **Gradient Backgrounds**: Beautiful blue-to-purple gradients
- **Smooth Animations**: 60fps transitions and micro-interactions
- **Glassmorphism**: Modern frosted glass effects
- **Dark/Light Mode**: Comprehensive theme support
- **Accessibility**: WCAG 2.1 AA compliant

### **Interactive Elements**
- **Hover Effects**: Subtle animations and state changes
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: User feedback for all actions
- **Modal Dialogs**: Contextual information display

---

## 📊 Learning Modules

### **1. 🔤 Strings**
- String manipulation algorithms
- Pattern matching techniques
- Substring problems
- Regular expressions
- **Topics**: KMP, Rabin-Karp, Boyer-Moore

### **2. 💻 Programming Basics**
- Variables and data types
- Control structures
- Functions and recursion
- **Topics**: Loops, Conditionals, I/O Operations

### **3. 🔢 Bit Manipulation**
- Bitwise operations
- Bit masking techniques
- Number system conversions
- **Topics**: XOR tricks, Bit counting, Power of 2

### **4. 📈 Sorting Algorithms**
- Comparison-based sorting
- Non-comparison sorting
- Stability and complexity analysis
- **Topics**: QuickSort, MergeSort, HeapSort, RadixSort

### **5. 🔍 Searching Algorithms**
- Linear and binary search
- Search in rotated arrays
- Tree and graph searching
- **Topics**: Binary Search variations, DFS, BFS

### **6. 🗂️ Hash Maps**
- Hash table implementation
- Collision resolution
- Applications and use cases
- **Topics**: Chaining, Open Addressing, Hash Functions

---

## 🏆 Progress Tracking

### **Individual Progress**
- ✅ **Topic Completion**: Percentage-based progress tracking
- ✅ **Problem Statistics**: Solved/Total problems ratio
- ✅ **Learning Streaks**: Daily learning habit tracking
- ✅ **Time Spent**: Track time invested in learning
- ✅ **Skill Levels**: Beginner → Intermediate → Advanced

### **Global Statistics**
- 📊 **Leaderboards**: Top performers across all topics
- 📈 **Trending Topics**: Most popular learning content
- 🎯 **Achievement Badges**: Unlock badges for milestones
- 📅 **Learning Calendar**: Visual representation of daily progress

---

## 🔐 Authentication

### **Secure Login System**
- **Multi-option Login**: Username or Email + Password
- **Registration**: Username, Email, Password with validation
- **Profile Management**: Edit profile information
- **Session Management**: Secure JWT-based authentication
- **Password Security**: Encrypted password storage

### **User Features**
- **Personalized Dashboard**: Custom learning recommendations
- **Progress Sync**: Cross-device synchronization
- **Privacy Controls**: Manage data sharing preferences

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/UI components
│   ├── AuthForm.tsx     # Authentication forms
│   ├── Dashboard.tsx    # Main dashboard
│   ├── TopicCard.tsx    # Learning topic cards
│   ├── QuizView.tsx     # MCQ interface
│   ├── CodingProblem.tsx # Coding challenges
│   ├── VideoPlayer.tsx   # Video tutorial player
│   └── ...
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication logic
│   ├── useTopicProgress.tsx # Progress tracking
│   └── use-mobile.tsx   # Mobile detection
├── pages/               # Route components
│   ├── Index.tsx        # Home page
│   ├── Contests.tsx     # Contests page
│   ├── Progress.tsx     # Progress analytics
│   └── NotFound.tsx     # 404 page
├── integrations/        # External service integrations
│   └── supabase/        # Supabase configuration
├── lib/                 # Utility functions
└── styles/              # Global styles and themes
```

---

## 🌟 Key Features Breakdown

### **Interactive Learning Interface**
```typescript
// Real-time progress tracking
const { progress, updateProgress } = useTopicProgress(topicId);

// Responsive topic cards with animations
<TopicCard 
  topic="strings"
  progress={progress.overallProgress}
  onClick={handleTopicSelect}
/>
```

### **Smart Navigation System**
- **Desktop**: Collapsible sidebar with icon-only mode
- **Mobile**: Bottom navigation with horizontal scroll
- **Adaptive**: Automatically switches based on screen size

### **Performance Optimizations**
- **Code Splitting**: Lazy-loaded components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Optimization**: Tree-shaking and minification
- **Caching Strategy**: Service worker implementation

---

## 🔧 Configuration

### **Environment Variables**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_TITLE=DSA Learning Portal
VITE_APP_VERSION=1.0.0
```

### **Database Schema**
```sql
-- Users table (managed by Supabase Auth)
profiles (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE,
  email TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Progress tracking
topic_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  topic TEXT,
  progress INTEGER,
  problems_solved INTEGER,
  total_problems INTEGER
)

-- User notes
user_notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  topic TEXT,
  content TEXT,
  created_at TIMESTAMP
)
```

---

## 📈 Performance

### **Core Web Vitals**
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)  
- **CLS**: < 0.1 (Cumulative Layout Shift)

### **Optimization Techniques**
- ⚡ **Vite Build Tool**: Lightning-fast development and builds
- 🗜️ **Code Splitting**: Dynamic imports for route-based splitting
- 🎨 **CSS Optimization**: Tailwind CSS purging and minification
- 📱 **Mobile Performance**: Optimized touch interactions and animations

---

## 🌐 Deployment

### **Build for Production**
```bash
npm run build
# or
yarn build
```

### **Deploy to Vercel/Netlify**
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

### **Environment Setup**
Ensure all environment variables are configured in your deployment platform.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Code Style**
- Follow TypeScript best practices
- Use ESLint and Prettier for formatting
- Write meaningful commit messages
- Add tests for new features

---

## 🐛 Bug Reports & Feature Requests

### **Reporting Issues**
- Use GitHub Issues for bug reports
- Provide detailed reproduction steps
- Include screenshots if applicable
- Specify browser and device information

### **Feature Requests**
- Describe the feature in detail
- Explain the use case and benefits
- Provide mockups if available

---

## 📞 Contact

### **Developer Information**
- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **LinkedIn**: [Your LinkedIn Profile]
- **Portfolio**: [Your Portfolio Website]
- **GitHub**: [Your GitHub Profile]

### **Project Links**
- **Live Demo**: [https://dsa-learning-portal.vercel.app](https://dsa-learning-portal.vercel.app)
- **Repository**: [https://github.com/yourusername/dsa-learning-portal](https://github.com/yourusername/dsa-learning-portal)
- **Documentation**: [Project Wiki](https://github.com/yourusername/dsa-learning-portal/wiki)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- **Supabase Team** - For the excellent backend platform
- **Shadcn** - For the beautiful UI component library
- **Tailwind CSS** - For the utility-first CSS framework
- **React Team** - For the amazing frontend library
- **Open Source Community** - For continuous inspiration and support

---

<div align="center">
  <h3>⭐ Star this repository if you found it helpful!</h3>
  <p>Built with ❤️ by [Your Name]</p>
  
  <a href="#top">⬆️ Back to Top</a>
</div>

---

**🚀 Ready to master Data Structures & Algorithms? Start your learning journey today!**