import React, { useState, useRef, useEffect } from 'react';
import { GoogleUserProfile } from '../../types';

interface UserProfileProps {
  user: GoogleUserProfile;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-all">
        <img src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-surface rounded-lg shadow-2xl border border-border z-10">
          <div className="p-4 border-b border-border">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-sm text-gray-400 truncate">{user.email}</p>
          </div>
          <div className="p-2">
            <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md">
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
