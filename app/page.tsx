'use client';

import { motion } from 'motion/react';
import { Play, TrendingUp, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/FirebaseProvider';

export default function Home() {
  const { user, signIn } = useAuth();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 via-black to-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-medium text-red-500 mb-8">
              <TrendingUp className="w-4 h-4" />
              ¡Nuevo sistema de recompensas en USDT!
            </span>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-[0.9]">
              GANA DINERO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                VIENDO VIDEOS
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-medium">
              Únete a la plataforma líder de micro-tareas de YouTube. 
              Completa tareas simples, ayuda a creadores a ser virales y recibe USDT directamente en tu billetera.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link 
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                >
                  Ir al Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button 
                  onClick={() => signIn()}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Empezar Ahora
                  <Play className="w-5 h-5 fill-current" />
                </button>
              )}
              <Link 
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all"
              >
                ¿Cómo funciona?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="w-full py-24 bg-zinc-950 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Play className="w-8 h-8 text-red-600" />}
              title="Mira Videos"
              description="Selecciona tareas de nuestra lista de videos virales de YouTube."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
              title="Completa Tareas"
              description="Sigue las instrucciones: dale like, suscríbete o comenta para validar la tarea."
            />
            <FeatureCard 
              icon={<DollarSign className="w-8 h-8 text-yellow-500" />}
              title="Recibe USDT"
              description="Una vez verificada, tu recompensa se acredita instantáneamente en tu balance."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 border-y border-white/5 bg-black px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-12 text-center">
          <div>
            <p className="text-4xl font-black text-white mb-1">50K+</p>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Usuarios</p>
          </div>
          <div>
            <p className="text-4xl font-black text-white mb-1">$120K+</p>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Pagados</p>
          </div>
          <div>
            <p className="text-4xl font-black text-white mb-1">1M+</p>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Tareas</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}
