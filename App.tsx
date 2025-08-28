import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppLayout from './layouts/AppLayout';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn("FYI: GOOGLE_CLIENT_ID environment variable is not set. Google Drive integration will be disabled.");
}


const App: React.FC = () => {
  return (
    // The provider must be present for the hooks to be used, but the UI will
    // prevent any calls if the client ID is not properly configured.
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'disabled'}>
      <AppLayout />
    </GoogleOAuthProvider>
  );
};

export default App;