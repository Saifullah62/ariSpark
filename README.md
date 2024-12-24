# College Dashboard Application

A comprehensive dashboard application designed to help college students manage their academic life, featuring AI-powered assistance, study tools, and organizational features.

## 🌟 Features

### 📚 Academic Tools
- **AI Tutor**: Get personalized help with subjects and homework
- **Math Solver**: Step-by-step solutions for math problems
- **Document Management**: Create and organize study materials
- **Glossary**: AI-powered term definitions and explanations

### ⏰ Organization
- **Schedule Management**: Track classes, assignments, and events
- **Task Management**: To-do lists with due dates and priorities
- **Goal Setting**: Set and track academic and personal goals
- **Study Plans**: AI-generated study schedules

### 💰 Finance
- **Budget Tracking**: Monitor expenses and income
- **Financial Categories**: Organize spending by category
- **Budget Goals**: Set and track financial targets
- **Expense Analytics**: Visual insights into spending patterns

### 🎯 Additional Features
- **Motivational Quotes**: Daily inspiration tailored for students
- **Dark/Light Mode**: Comfortable viewing in any environment
- **Notifications**: Stay updated on tasks and deadlines
- **Mobile Responsive**: Access from any device

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a .env file with required environment variables:
```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_TINYMCE_API_KEY=your_tinymce_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 🛠️ Tech Stack

- **Frontend Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Text Editor**: TinyMCE
- **AI Integration**: OpenAI API
- **Build Tool**: Vite
- **Date Handling**: date-fns
- **Icons**: Material Icons, Lucide React

## 📁 Project Structure

```
project/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Main application pages
│   ├── services/         # Business logic and API services
│   ├── styles/           # Global styles and themes
│   ├── config/           # Configuration files
│   └── types/            # TypeScript type definitions
├── public/              # Static assets
└── docs/               # Additional documentation
```

## 🔧 Configuration

### Environment Variables
- `VITE_OPENAI_API_KEY`: OpenAI API key for AI features
- `VITE_TINYMCE_API_KEY`: TinyMCE API key for rich text editing

### Theme Configuration
The application supports both light and dark themes, configurable through the UI.

## 📱 Components

### Core Components
- **Header**: App bar with navigation and theme controls
- **Navigation**: Sidebar menu for page navigation
- **NotificationsMenu**: Notification system UI
- **Layout**: Main application layout structure

### Feature Components
- **DocumentEditor**: Rich text editor for notes
- **ScheduleCalendar**: Calendar view for events
- **TaskList**: Interactive task management
- **FinancialDashboard**: Budget and expense tracking

## 🔔 Notifications System

### Usage
```typescript
import { useNotificationStore } from '../services/notifications';

// Add a notification
const { addNotification } = useNotificationStore();
addNotification({
  message: "Assignment due tomorrow!",
  type: "warning"
});

// Mark as read
const { markAsRead } = useNotificationStore();
markAsRead(notificationId);
```

### Notification Types
- `info`: General information
- `success`: Successful actions
- `warning`: Important alerts
- `error`: Error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Material-UI for the component library
- TinyMCE for rich text editing
- All other open-source contributors
