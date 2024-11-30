import React from 'react';
import { Layout, Star, Tag, Briefcase, Bookmark, FileText, BookOpen, Settings, HelpCircle } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const mainMenuItems = [
    { icon: Layout, label: 'Templates', path: '/' },
    { icon: Star, label: 'Inspirations', path: '/inspirations' },
    { icon: Briefcase, label: 'Brands', path: '/brands' },
    { icon: FileText, label: 'Knowledge Base', path: '/knowledge' },
    { icon: Bookmark, label: 'Mes sauvegardes', path: '/saved' },
  ];

  const bottomMenuItems = [
    { icon: BookOpen, label: 'Guides', path: '/guides' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-72 h-screen bg-[#13141B] text-white p-6">
      <div className="bg-gradient-to-br from-[#1C1D24] via-[#1C1D24] to-[#2A1F3D] rounded-2xl p-6 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0L32 16L16 32L0 16L16 0Z" fill="#6563FC"/>
            <path d="M16 6.4L25.6 16L16 25.6L6.4 16L16 6.4Z" fill="white"/>
            <path d="M16 9.6L22.4 16L16 22.4L9.6 16L16 9.6Z" fill="#6563FC"/>
          </svg>
          <span className="text-xl font-bold text-white">Fill Creative</span>
        </div>
        
        {/* Main Menu */}
        <div className="flex-1 space-y-2">
          {mainMenuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                item.path === path
                  ? 'bg-[#6563fc] text-white' 
                  : 'text-gray-400 hover:bg-[#282A33]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Bottom Menu */}
        <div className="pt-4 border-t border-[#282A33] space-y-2">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                item.path === path
                  ? 'bg-[#6563fc] text-white' 
                  : 'text-gray-400 hover:bg-[#282A33]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}