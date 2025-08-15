import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => (
  <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-display font-bold text-2xl text-therapy-600">Mind Heavenly</span>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-base font-medium text-gray-700 hover:text-therapy-500 transition">Home</Link>
        <Link href="/auth/signup" className="text-base font-medium text-gray-700 hover:text-therapy-500 transition">Sign Up</Link>
        <Link href="/dashboard" className="text-base font-medium text-gray-700 hover:text-therapy-500 transition">Dashboard</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
