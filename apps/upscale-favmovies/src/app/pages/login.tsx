// pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const baseURl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${baseURl}/login/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();

      // Save to Zustand
      setAuth(data.access_token, data.isAnAdmin);

      // Navigate to home
      navigate('/home');
    } catch (err: any) {
      showNotification({
        title: 'Login Failed',
        message: err.message,
        color: 'red',
      });
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="font-inter text-4xl font-bold mb-8 text-center">Login</h1>

      <TextInput
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-inter mb-6 w-full px-4 py-4 text-lg rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400"
      />

      <PasswordInput
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="font-inter mb-8 w-full px-4 py-4 text-lg rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400"
      />

      <button
        className="font-inter w-full text-black bg-amber-200 dark:text-white dark:bg-pink-600 hover:bg-amber-100 dark:hover:bg-pink-500
      focus:ring-2 focus:ring-amber-300 dark:focus:ring-pink-400 font-medium px-4 py-4 rounded-md text-lg transition-colors"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
