'use client';

import { motion } from 'motion/react';
import { TrendingUp, CheckCircle2, Zap, BarChart3, Users, ShieldCheck, ArrowRight, Star, Rocket, Globe } from 'lucide-react';

export default function ClientDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero / Header Section */}
      <header className="mb-16 text-center lg:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black tracking-widest uppercase mb-6"
        >
          <Rocket className="w-4 h-4" />
          Panel de Creadores & Marcas
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[0.9]">
          Impulsa tu <span className="text-red-600">Crecimiento Viral</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl font-medium leading-relaxed">
          Garantizamos un &quot;piso&quot; mínimo de interacción real en cada publicación para que el algoritmo la detecte como contenido de interés y la impulse a nuevas audiencias.
        </p>
      </header>

      {/* Main Plan Section */}
      <section className="mb-24">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <Zap className="w-8 h-8 text-red-600" />
                Plan de Crecimiento Orgánico Acelerado
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Distribución en Red de Usuarios Reales</h4>
                    <p className="text-sm text-zinc-400">Una cuota mensual de visualizaciones, &quot;likes&quot; y comentarios provenientes de cuentas verificadas, no bots.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Acciones Verificables</h4>
                    <p className="text-sm text-zinc-400">Los usuarios realizan acciones específicas (compartir, guardar, ver el video completo) que son las que más pesan en el posicionamiento.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Panel de Control</h4>
                    <p className="text-sm text-zinc-400">Acceso a métricas en tiempo real para que veas el origen y comportamiento de la interacción de tus campañas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
              <div className="mb-8">
                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Modelo de Suscripción</span>
                <h3 className="text-2xl font-black mt-2">Elige tu Nivel de Impulso</h3>
              </div>

              <div className="space-y-6">
                {/* Basic Plan */}
                <div className="p-6 bg-zinc-800/50 border border-white/5 rounded-3xl hover:border-red-600/50 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-black">Básico</h4>
                      <p className="text-xs text-zinc-500">Ideal para creadores emergentes</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">$250</span>
                      <span className="text-xs text-zinc-500 block">/mes</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="text-sm text-zinc-400 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-red-500" /> Soporte para 1 red social
                    </li>
                    <li className="text-sm text-zinc-400 flex items-center gap-2">
                      <Star className="w-4 h-4 text-red-500" /> Hasta 4 piezas de contenido al mes
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-white text-black rounded-xl font-black text-sm hover:bg-red-600 hover:text-white transition-all">
                    SELECCIONAR PLAN
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="p-6 bg-red-600/10 border border-red-600/30 rounded-3xl hover:border-red-600 transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter">
                    Recomendado
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-black">Pro</h4>
                      <p className="text-xs text-zinc-500">Para crecimiento multicanal</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">$600</span>
                      <span className="text-xs text-zinc-500 block">/mes</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="text-sm text-zinc-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-red-500" /> Soporte multicanal (YT/IG/TK)
                    </li>
                    <li className="text-sm text-zinc-400 flex items-center gap-2">
                      <Star className="w-4 h-4 text-red-500" /> Hasta 16 piezas de contenido
                    </li>
                    <li className="text-sm text-zinc-400 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-500" /> Comentarios personalizados
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-sm hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    SELECCIONAR PLAN PRO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Info / CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <ShieldCheck className="w-10 h-10 text-red-600 mb-6" />
          <h3 className="text-xl font-black mb-4 uppercase">Seguridad y Transparencia</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Nuestro sistema utiliza una red de usuarios reales verificados. No utilizamos bots ni métodos automatizados que pongan en riesgo tu cuenta. Cada interacción es orgánica y cumple con los términos de servicio de las plataformas.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 flex flex-col justify-between">
          <div>
            <BarChart3 className="w-10 h-10 text-red-600 mb-6" />
            <h3 className="text-xl font-black mb-4 uppercase">Métricas Avanzadas</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Obtén reportes detallados sobre el impacto de tus campañas. Analiza la retención, el origen geográfico de las interacciones y cómo el algoritmo empieza a favorecer tu contenido.
            </p>
          </div>
          <button className="mt-8 flex items-center gap-2 text-red-500 font-black text-sm hover:gap-4 transition-all uppercase tracking-widest">
            Ver demo del panel <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
