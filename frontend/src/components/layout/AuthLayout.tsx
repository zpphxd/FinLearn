import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center items-center space-x-2">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">FinLearn</span>
        </Link>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Master Your Financial Future
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Learn finance through gamified, bite-sized lessons
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout; 