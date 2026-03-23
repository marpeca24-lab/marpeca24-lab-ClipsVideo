'use client';

import { useState } from 'react';
import { useAuth } from '@/components/FirebaseProvider';
import { signInWithEmailAndPassword, auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const { signIn: signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">Bienvenido de nuevo</h1>
          <p className="text-gray-400">Inicia sesión para continuar ganando</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1.5 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <>
                Iniciar Sesión
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-gray-500 font-bold">O continúa con</span>
          </div>
        </div>

        <button 
          onClick={() => signInWithGoogle()}
          className="w-full bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" referrerPolicy="no-referrer" />
          Google
        </button>

        <p className="text-center text-gray-400 mt-8 text-sm">
          ¿No tienes cuenta? <Link href="/register" className="text-red-500 font-bold hover:underline">Regístrate</Link>
        </p>
      </motion.div>
    </div>
  );
}
