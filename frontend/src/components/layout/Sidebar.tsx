import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  MapIcon, 
  TrophyIcon, 
  UserIcon,
  BookOpenIcon,
  GamepadIcon
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: HomeIcon },
  { name: 'Learning Worlds', href: '/app/worlds', icon: MapIcon },
  { name: 'Dictionary', href: '/app/dictionary', icon: BookOpenIcon },
  { name: 'Simulator', href: '/app/simulator', icon: GamepadIcon },
  { name: 'Leaderboard', href: '/app/leaderboard', icon: TrophyIcon },
  { name: 'Profile', href: '/app/profile', icon: UserIcon },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex flex-col flex-grow">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 flex-shrink-0 h-6 w-6
                      ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}; 