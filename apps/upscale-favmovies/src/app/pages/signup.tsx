// pages/SignUp.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

export default function SignUp() {
  const baseURl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const res = await fetch(`${baseURl}/create/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      if (!res.ok) throw new Error('Sign up failed');

      showNotification({
        title: 'Success',
        message: 'Account created',
        color: 'green',
      });
      navigate('/login');
    } catch (err: any) {
      showNotification({ title: 'Error', message: err.message, color: 'red' });
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-8 text-center">Sign Up</h1>

      <TextInput
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-6 w-full px-4 py-4 text-lg rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400"
      />

      <PasswordInput
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-8 w-full px-4 py-4 text-lg rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400"
      />

      <button
        className="w-full text-black bg-amber-200 dark:text-white dark:bg-pink-600 hover:bg-amber-100 dark:hover:bg-pink-500
      focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400 font-medium px-4 py-4 rounded-md text-lg transition-colors"
        onClick={handleSignUp}
      >
        Sign Up
      </button>
    </div>
  );
}
