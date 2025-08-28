import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleUserProfile } from '../../types';
import UserProfile from './UserProfile';
import { GoogleIcon } from '../icons/GoogleIcon';

interface GoogleAuthProps {
  user: GoogleUserProfile | null;
  onLoginSuccess: (tokenResponse: { access_token: string }) => void;
  onLoginError: () => void;
  onLogout: () => void;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ user, onLoginSuccess, onLoginError, onLogout }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => onLoginSuccess(tokenResponse),
    onError: onLoginError,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
  });

  if (user) {
    return <UserProfile user={user} onLogout={onLogout} />;
  }

  return (
    <button
      title="Sign in with Google"
      onClick={() => googleLogin()}
      className="p-3 rounded-lg w-full flex justify-center items-center transition-colors text-gray-400 hover:bg-surface hover:text-white"
    >
      <GoogleIcon className="w-7 h-7" />
    </button>
  );
};

export default GoogleAuth;
