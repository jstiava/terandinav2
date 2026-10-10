'use client'
// pages/reset-password.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query; // grab token from URL
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json();

    if (json.success) {
      setMessage('Password reset successful! Signing you in...');
      // Optionally sign in the user automatically:
      router.push('/admin'); // or whatever page you want
    } else {
      setMessage(json.error || 'Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset your password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p>{message}</p>}
    </form>
  );
}