import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Calculator, 
  Target, 
  Calendar, 
  MessageSquare,
  Wallet,
  FileText,
  Book,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../store/auth';

const navigation = [
  { name: 'Dashboard', to: '/', icon: Home },
  { name: 'Math Solver', to: '/math', icon: Calculator },
  { name: 'Goals', to: '/goals', icon: Target },
  { name: 'Schedule', to: '/schedule', icon: Calendar },
  { name: 'AI Tutor', to: '/tutor', icon: MessageSquare },
  { name: 'Finance', to: '/finance', icon: Wallet },
  { name: 'Documents', to: '/documents', icon: FileText },
  { name: 'Glossary', to: '/glossary', icon: Book },
];

export default function Sidebar() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="flex flex-col w-64 bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <h1 className="text-xl font-bold text-[#4A90E2]">StudentSuccess Pro</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <div className="px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-[#4A90E2] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}