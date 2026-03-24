'use client';

import { motion } from 'motion/react';
import { Play, TrendingUp, DollarSign, ShieldCheck, ArrowRight, Youtube, Instagram, Music } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/FirebaseProvider';

export default function Home() {
  const { user, signIn } = useAuth();

  // Hardcoded values for animations to avoid impurity errors with Math.random()
  const coins = [
    { id: 0, top: 25, left: 30, duration: 6, delay: 0 },
    { id: 1, top: 65, left: 20, duration: 7, delay: 0.5 },
    { id: 2, top: 40, left: 70, duration: 5.5, delay: 1 },
    { id: 3, top: 75, left: 60, duration: 8, delay: 1.5 },
    { id: 4, top: 30, left: 50, duration: 6.5, delay: 2 },
  ];

  const streams = [
    { id: 0, duration: 3.2, delay: 0.5, top: 15, width: 150, rotate: 45 },
    { id: 1, duration: 4.5, delay: 1.2, top: 45, width: 220, rotate: 120 },
    { id: 2, duration: 3.8, delay: 2.5, top: 75, width: 180, rotate: 210 },
    { id: 3, duration: 4.1, delay: 0.8, top: 30, width: 250, rotate: 300 },
    { id: 4, duration: 3.5, delay: 3.2, top: 60, width: 130, rotate: 15 },
    { id: 5, duration: 4.8, delay: 1.5, top: 85, width: 200, rotate: 160 },
    { id: 6, duration: 3.9, delay: 4.1, top: 10, width: 170, rotate: 280 },
    { id: 7, duration: 4.2, delay: 2.8, top: 55, width: 240, rotate: 90 },
    { id: 8, duration: 3.6, delay: 0.2, top: 25, width: 160, rotate: 190 },
    { id: 9, duration: 4.7, delay: 3.5, top: 95, width: 210, rotate: 340 },
  ];

  return (
    <div className="flex flex-col items-center bg-[#050505] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          
          {/* Animated Data Streams / Glows */}
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              scale: [1.2, 1, 1.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]" 
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-bold tracking-[0.2em] text-orange-500 uppercase mb-8"
            >
              <TrendingUp className="w-4 h-4" />
              Recompensas en USDT en tiempo real
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] mb-8">
              Convierte tus <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                minutos en recompensas
              </span> <br />
              digitales
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl mb-12 leading-relaxed font-medium">
              Únete a la plataforma líder de micro-tareas. 
              Ayuda a las marcas a mejorar sus videos, impulsa el crecimiento viral y recibe pagos instantáneos en USDT.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {user ? (
                <Link 
                  href="/dashboard"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
                >
                  IR AL DASHBOARD
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              ) : (
                <button 
                  onClick={() => signIn()}
                  className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
                >
                  EMPEZAR AHORA
                  <Play className="w-6 h-6 fill-current" />
                </button>
              )}
              <Link 
                href="#how-it-works"
                className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
              >
                ¿CÓMO FUNCIONA?
              </Link>
            </div>
          </motion.div>

          {/* Visual Element: Floating Coins / Data Streams */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Main Visual Placeholder with Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-[100px]" />
              
              {/* Floating USDT Coins (Simulated with Icons and Motion) */}
              {coins.map((coin) => (
                <motion.div
                  key={coin.id}
                  animate={{ 
                    y: [0, -40, 0],
                    rotate: [0, 10, -10, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ 
                    duration: coin.duration, 
                    repeat: Infinity, 
                    delay: coin.delay,
                    ease: "easeInOut" 
                  }}
                  className="absolute"
                  style={{
                    top: `${coin.top}%`,
                    left: `${coin.left}%`,
                  }}
                >
                  <div className="w-16 h-16 bg-zinc-900 border border-orange-500/30 rounded-full flex items-center justify-center backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                    <DollarSign className="w-8 h-8 text-orange-500" />
                  </div>
                </motion.div>
              ))}

              {/* Central Visual Element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-orange-500/10 rounded-full border border-orange-500/20 flex items-center justify-center backdrop-blur-3xl">
                  <Play className="w-24 h-24 text-orange-500 fill-current opacity-50" />
                </div>
              </div>

              {/* Data Streams (Simulated with lines) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {streams.map((stream) => (
                  <motion.div
                    key={stream.id}
                    animate={{ 
                      x: [-100, 500],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: stream.duration, 
                      repeat: Infinity, 
                      delay: stream.delay 
                    }}
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"
                    style={{
                      top: `${stream.top}%`,
                      width: `${stream.width}px`,
                      transform: `rotate(${stream.rotate}deg)`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="w-full py-32 bg-[#080808] px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">SISTEMA DE TRES PASOS</h2>
            <p className="text-zinc-500 font-medium max-w-xl mx-auto">Diseñado para la máxima eficiencia y transparencia en cada interacción.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Play className="w-10 h-10 text-orange-500" />}
              title="Explora y Disfruta"
              description="Sumérgete en nuestra selección de videos virales. ¡Entretenerte nunca fue tan rentable!"
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-10 h-10 text-orange-500" />}
              title="Interactúa en un Clic"
              description="Dale like, suscríbete o deja un comentario. Tu opinión es lo que nos hace crecer."
            />
            <FeatureCard 
              icon={<DollarSign className="w-10 h-10 text-orange-500" />}
              title="Cobra al Instante"
              description="Sin esperas ni letras chiquitas. Mira cómo tu balance en USDT crece en tiempo real"
            />
          </div>
        </div>
      </section>

      {/* Creators Section */}
      <section className="w-full py-40 bg-black px-6 border-t border-white/5 relative overflow-hidden">
        {/* Animated background glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" 
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-20 items-center mb-24">
            <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-xs font-black tracking-[0.4em] text-red-500 uppercase mb-10"
              >
                IMPULSO ESTRATÉGICO
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-7xl xl:text-8xl font-black tracking-tighter mb-10 leading-[0.9] text-white"
              >
                ¿Eres creador de Contenido y <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                  las vistas no aumentan?
                </span>
              </motion.h2 >
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-2xl md:text-3xl text-zinc-300 font-bold leading-tight mb-8"
              >
                ClipsVideo es la solución real que estabas buscando.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-lg text-zinc-500 font-medium max-w-2xl leading-relaxed"
              >
                En ClipsVideo no creemos en números vacíos, sino en crecimiento estratégico. 
                Diseñamos campañas personalizadas donde usuarios reales consumen tu contenido de principio a fin, 
                impulsando tus métricas de retención, interacción y posicionamiento orgánico. 
                Olvídate del engagement artificial; aquí cada clic es una acción verificable que le dice a los algoritmos que tu contenido merece estar en la cima.
              </motion.p>
            </div>

            <div className="lg:col-span-2 hidden lg:block">
               {/* Visual element for creators */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 className="relative aspect-square bg-zinc-900 rounded-[3rem] border border-white/5 flex items-center justify-center overflow-hidden group"
               >
                 <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <TrendingUp className="w-40 h-40 text-red-600 opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse" />
                 </div>
               </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CreatorCard 
              icon={<Youtube className="w-8 h-8 text-white" />}
              platform="YouTube"
              title="Domina el Algoritmo con Retención Real"
              description="¿Cansado de que el algoritmo ignore tus videos? En ClipsVideo impulsamos tu canal con audiencia auténtica. No vendemos números, generamos retención real: usuarios que ven tu contenido y realizan acciones verificables que disparan tu posicionamiento. Haz que YouTube trabaje para ti con engagement que sí cuenta."
            />
            <CreatorCard 
              icon={<Instagram className="w-8 h-8 text-white" />}
              platform="Instagram"
              title="Reels que se vuelven Virales"
              description="El alcance orgánico es difícil, pero no imposible. Con ClipsVideo, tus Reels e historias reciben el empuje de usuarios reales. Aumentamos tu interacción y guardados mediante campañas transparentes, logrando que Instagram detecte interés genuino y te posicione en la sección de Explorar. Crecimiento sólido, sin trucos."
            />
            <CreatorCard 
              icon={<Music className="w-8 h-8 text-white" />}
              platform="TikTok"
              title="De 'Para Ti' a Comunidad Real"
              description="En TikTok, los primeros segundos lo son todo. ClipsVideo conecta tu contenido con personas reales que consumen, comentan y comparten, elevando tus métricas de interacción desde el primer momento. Olvídate del 'engagement vacío'; construye una presencia relevante basada en comportamiento humano verificable."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-24 bg-black px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-12 text-center">
          <div>
            <p className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">50K+</p>
            <p className="text-orange-500 text-xs font-black uppercase tracking-[0.3em]">Usuarios Activos</p>
          </div>
          <div>
            <p className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">$120K+</p>
            <p className="text-orange-500 text-xs font-black uppercase tracking-[0.3em]">Pagos Realizados</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">1M+</p>
            <p className="text-orange-500 text-xs font-black uppercase tracking-[0.3em]">Tareas Completadas</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10, backgroundColor: "rgba(255,255,255,0.02)" }}
      className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem] transition-all duration-300 backdrop-blur-sm group"
    >
      <div className="mb-8 p-4 bg-black rounded-2xl inline-block group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">{title}</h3>
      <p className="text-zinc-400 leading-relaxed font-medium text-lg">{description}</p>
    </motion.div>
  );
}

function CreatorCard({ icon, platform, title, description }: { icon: React.ReactNode, platform: string, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="p-8 bg-zinc-900/50 border border-white/5 rounded-[2rem] transition-all duration-300 backdrop-blur-md relative group overflow-hidden"
    >
      {/* Platform Badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-orange-500 transition-colors duration-300">
          {icon}
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">{platform}</span>
      </div>
      
      <h3 className="text-xl font-black text-white mb-4 tracking-tight leading-tight">{title}</h3>
      <p className="text-zinc-400 leading-relaxed font-medium text-sm">{description}</p>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all" />
    </motion.div>
  );
}
