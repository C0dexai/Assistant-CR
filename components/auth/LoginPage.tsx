import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
        <SignIn 
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: '#2563eb',
                    colorBackground: '#1f2937', // surface
                    colorText: '#f9fafb', // text-primary
                    colorInputBackground: '#111827', // background
                    colorInputText: '#f9fafb',
                },
                elements: {
                    card: 'bg-surface shadow-2xl border border-border',
                    footer: 'bg-transparent',
                }
            }}
        />
    </div>
  );
};

export default LoginPage;
