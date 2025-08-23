import React from 'react';
import { RobotIcon } from '../icons/RobotIcon';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <RobotIcon className="w-24 h-24 text-gray-600 mb-6" />
      <h1 className="text-3xl font-bold text-text-primary mb-2">Web Dev AI Toolkit</h1>
      <p className="text-lg text-text-secondary max-w-md">
        Select an assistant specializing in Node, Vue, Shadcn, or another web technology. Or, create a custom AI dev partner to start your project.
      </p>
    </div>
  );
};

export default WelcomeScreen;