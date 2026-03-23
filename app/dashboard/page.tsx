'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/FirebaseProvider';
import { db, collection, query, onSnapshot, where } from '@/firebase';
import TaskCard from '@/components/TaskCard';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, Play, Info, DollarSign, Send } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const q = query(collection(db, 'tasks'), where('status', '==', 'active'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tasks", error);
      // If no tasks exist yet, we'll show some mock ones for the demo
      setTasks([
        {
          id: '1',
          title: 'Like y Comentario en Video Viral',
          description: 'Ayuda a este video a llegar a tendencias dándole like y dejando un comentario positivo.',
          reward: 0.50,
          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          status: 'active',
          instructions: '1. Mira al menos 30 segundos del video. 2. Dale Like. 3. Deja un comentario de al menos 5 palabras.'
        },
        {
          id: '2',
          title: 'Suscripción a Canal de Gaming',
          description: 'Suscríbete al canal y activa la campana de notificaciones.',
          reward: 0.30,
          youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
          status: 'active',
          instructions: '1. Suscríbete al canal. 2. Activa todas las notificaciones. 3. Toma una captura de pantalla como prueba.'
        },
        {
          id: '3',
          title: 'Compartir Video en Redes',
          description: 'Comparte el video en tu perfil de Twitter o Facebook.',
          reward: 0.75,
          youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          status: 'active',
          instructions: '1. Comparte el video públicamente. 2. Envía el link de tu publicación como prueba.'
        }
      ]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authLoading]);

  // Mock tasks data if Firebase is empty or failing
  const tasksData = tasks.length > 0 ? tasks : [
    {
      id: '1',
      title: 'Like y Comentario en Video Viral',
      description: 'Ayuda a este video a llegar a tendencias dándole like y dejando un comentario positivo.',
      reward: 0.50,
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      status: 'active',
      instructions: '1. Mira al menos 30 segundos del video. 2. Dale Like. 3. Deja un comentario de al menos 5 palabras.'
    },
    {
      id: '2',
      title: 'Suscripción a Canal de Gaming',
      description: 'Suscríbete al canal y activa la campana de notificaciones.',
      reward: 0.30,
      youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      status: 'active',
      instructions: '1. Suscríbete al canal. 2. Activa todas las notificaciones. 3. Toma una captura de pantalla como prueba.'
    },
    {
      id: '3',
      title: 'Compartir Video en Redes',
      description: 'Comparte el video en tu perfil de Twitter o Facebook.',
      reward: 0.75,
      youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      status: 'active',
      instructions: '1. Comparte el video públicamente. 2. Envía el link de tu publicación como prueba.'
    }
  ];

  const handleSubmitTask = async () => {
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSelectedTask(null);
      alert("¡Tarea enviada con éxito! Será revisada pronto.");
    }, 1500);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Inicia sesión para ver las tareas</h2>
        <p className="text-gray-400 mb-8">Debes estar autenticado para poder ganar USDT.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-2">Tareas Disponibles</h1>
        <p className="text-gray-400 font-medium">Completa micro-tareas y acumula USDT en tu balance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasksData.map((task) => (
          <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
        ))}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedTask(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto bg-black">
                  <iframe 
                    src={`https://www.youtube.com/embed/${selectedTask.youtubeUrl.split('v=')[1]?.split('&')[0]}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                
                <div className="p-8 flex flex-col h-full max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-red-600/20 text-red-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      Micro-Tarea
                    </span>
                    <div className="flex items-center gap-1 text-emerald-500 font-bold">
                      <DollarSign className="w-4 h-4" />
                      {selectedTask.reward.toFixed(2)} USDT
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
                  
                  <div className="bg-zinc-800/50 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-white font-bold mb-2">
                      <Info className="w-4 h-4 text-red-500" />
                      Instrucciones
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {selectedTask.instructions}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <label className="block text-sm font-bold text-gray-400 mb-2">
                      Prueba de realización (Link o Screenshot)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Pega el link de tu comentario o captura aquí..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 mb-4 transition-colors"
                    />
                    
                    <button 
                      onClick={handleSubmitTask}
                      disabled={submitting}
                      className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Enviar para Revisión
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
