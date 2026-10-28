import React, { useState } from 'react';

export default function LoginScreen({ onLoginSuccess }) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basic validation: Check if phone number is empty or less than 10 digits
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    const fullPhoneNumber = `${countryCode} ${phoneNumber.trim()}`;
    
    // User data save karein local state ya storage mein
    const userData = { phone: fullPhoneNumber, loginTime: new Date().toISOString() };
    localStorage.setItem('hnc_user', JSON.stringify(userData));

    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-orange-100">
        
        {/* Logo/Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-14 h-14 bg-orange-500 text-white font-black text-2xl rounded-2xl items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
            H
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to HNC Hub</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your mobile number to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Mobile Number (Mandatory)</label>
            <div className="flex gap-2">
              {/* Country Code Dropdown */}
              <select 
                value={countryCode} 
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-slate-100 border border-slate-200 text-slate-800 font-bold text-sm rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (UAE)</option>
              </select>

              {/* Phone Input */}
              <input 
                type="tel" 
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => {
                  // Sirf numbers allow karein
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setPhoneNumber(val);
                }}
                className="flex-1 bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={10}
                required
              />
            </div>
            {error && <p className="text-xs text-red-500 font-semibold mt-1.5">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700 transition-all active:scale-[0.98]"
          >
            Continue with Phone
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-400 mt-6">
          By continuing, you agree to HNC Hub's Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
