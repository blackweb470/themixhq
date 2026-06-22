import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }]);
      
    if (error) {
      if (error.code === '23505') { // Unique violation
        setMessage("You're already subscribed!");
        setStatus('success');
      } else {
        setMessage('An error occurred. Please try again.');
        setStatus('error');
      }
    } else {
      setMessage('Successfully subscribed!');
      setStatus('success');
      setEmail('');
    }
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="w-full bg-black text-white py-10 px-4 mt-16 mb-16 flex flex-col items-center justify-center text-center border-t-4 border-yellow-400">
      <h3 className="text-yellow-400 font-black italic text-3xl md:text-4xl mb-3 tracking-tighter">THE THEMIXHQ NEWSLETTER</h3>
      <p className="font-semibold text-sm md:text-base mb-6 text-gray-300">
        Get the latest entertainment news and Afrobeats updates delivered straight to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-lg items-center">
        <div className="flex w-full">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 text-black font-sans font-semibold focus:outline-none" 
            required
            disabled={status === 'loading'}
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-wider text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : 'Sign Up'}
          </button>
        </div>
        {message && (
          <p className={`mt-3 text-sm font-bold ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};
