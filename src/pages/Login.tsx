import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setLoginError(error.message);
    } else {
      navigate('/admin');
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In | Themixhq</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Creator Studio</h1>
            <p className="text-gray-500 font-medium">Sign in to manage your content</p>
          </div>
          {loginError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{loginError}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2 tracking-wider">Email Address</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[14px] text-black outline-none focus:border-red-600 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase text-gray-600 mb-2 tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12 text-[14px] text-black outline-none focus:border-red-600 focus:bg-white transition-colors" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-xl mt-2 hover:bg-red-700 active:scale-[0.98] transition-all uppercase tracking-wider text-[14px] shadow-md shadow-red-600/20">Sign In</button>
          </form>
        </div>
      </div>
    </>
  );
}
