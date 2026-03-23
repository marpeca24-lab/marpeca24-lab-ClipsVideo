'use client';

import Link from 'next/link';
import { useAuth } from './FirebaseProvider';
import { Play, User, LogOut, Wallet, ShieldCheck, DollarSign, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { user, profile, signIn, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300">
                <Play className="text-black w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">
                CLIPS<span className="text-orange-500">VIDEO</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm font-semibold transition-all duration-300 hover:tracking-wider">
                TAREAS
              </Link>
              <Link href="/kyc" className="text-zinc-400 hover:text-white text-sm font-semibold transition-all duration-300 hover:tracking-wider">
                VERIFICACIÓN
              </Link>
              <Link href="/withdraw" className="text-zinc-400 hover:text-white text-sm font-semibold transition-all duration-300 hover:tracking-wider">
                RETIROS
              </Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" className="text-orange-500 hover:text-orange-400 text-sm font-black transition-all duration-300 hover:tracking-wider">
                  ADMIN
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md">
                  <Wallet className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-mono text-orange-500 font-bold">
                    {profile?.balance?.toFixed(2) || "0.00"} USDT
                  </span>
                </div>
                <div className="relative group">
                  <button className="flex items-center gap-2 focus:outline-none">
                    <div className="w-10 h-10 rounded-full border-2 border-white/10 bg-zinc-800 flex items-center justify-center overflow-hidden hover:border-orange-500 transition-colors duration-300">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || ""} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-4 w-56 bg-[#0f0f0f] border border-white/5 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 backdrop-blur-2xl">
                    <div className="px-5 py-3 border-b border-white/5 mb-2">
                      <p className="text-sm font-bold text-white truncate">{user.displayName || 'Usuario'}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard" className="block px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/withdraw" className="block px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                      Retiros
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="w-full text-left px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-black hover:bg-orange-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              >
                INGRESAR
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
