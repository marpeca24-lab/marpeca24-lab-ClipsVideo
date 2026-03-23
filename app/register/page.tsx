'use client';

import { useState } from 'react';
import { useAuth } from '@/components/FirebaseProvider';
import { createUserWithEmailAndPassword, auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail, Lock, User, Globe, ArrowRight, Loader2 } from 'lucide-react';

const COUNTRIES = [
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brasil' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Perú' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'PA', name: 'Panamá' },
  { code: 'MX', name: 'México' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'ES', name: 'España' },
];

export default function Register() {
  const { createProfile } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('AR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createProfile(userCredential.user.uid, email, displayName, country);
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
          <h1 className="text-3xl font-black mb-2">Crea tu cuenta</h1>
          <p className="text-gray-400">Empieza a ganar USDT hoy mismo</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1.5 ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-1.5 ml-1">País de Residencia</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors appearance-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
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
                Registrarse
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-sm">
          ¿Ya tienes cuenta? <Link href="/login" className="text-red-500 font-bold hover:underline">Inicia sesión</Link>
        </p>
      </motion.div>
    </div>
  );
}
