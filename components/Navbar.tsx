'use client';

import Link from 'next/link';
import { useAuth } from './FirebaseProvider';
import { Play, User, LogOut, Wallet } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { user, profile, signIn, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Play className="text-white w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold text-white tracking-tighter">
                CLIPS<span className="text-red-600">VIDEO</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Tareas
              </Link>
              <Link href="/ranking" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Ranking
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                  <Wallet className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-mono text-emerald-500 font-bold">
                    {profile?.balance?.toFixed(2) || "0.00"} USDT
                  </span>
                </div>
                <div className="relative group">
                  <button className="flex items-center gap-2 focus:outline-none">
                    <img 
                      src={user.photoURL || ""} 
                      alt={user.displayName || ""} 
                      className="w-8 h-8 rounded-full border border-white/20"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => signIn()}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Ingresar
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
