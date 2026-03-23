'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/FirebaseProvider';
import { db, collection, query, onSnapshot, where, addDoc, updateDoc, doc, serverTimestamp, orderBy, increment } from '@/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Plus, Check, X, ExternalLink, DollarSign, Play, Users, LayoutDashboard, Send, Trash2 } from 'lucide-react';

export default function AdminPanel() {
  const { user, profile, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'tasks' | 'submissions' | 'withdrawals'>('tasks');
  const [tasks, setTasks] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Task Form State
  const [newTask, setNewTask] = useState({ title: '', youtubeUrl: '', reward: 0.10, timeLimit: 15 });
  const [submittingTask, setSubmittingTask] = useState(false);

  useEffect(() => {
    if (authLoading || !profile || profile.role !== 'admin') return;

    const unsubTasks = onSnapshot(query(collection(db, 'tasks'), orderBy('createdAt', 'desc')), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubSubmissions = onSnapshot(query(collection(db, 'submissions'), where('status', '==', 'pending')), (snapshot) => {
      setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubWithdrawals = onSnapshot(query(collection(db, 'withdrawals'), where('status', '==', 'pending')), (snapshot) => {
      setWithdrawals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    setLoading(false);

    return () => {
      unsubTasks();
      unsubSubmissions();
      unsubWithdrawals();
    };
  }, [authLoading, profile]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingTask(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        status: 'active',
        createdAt: serverTimestamp()
      });
      setNewTask({ title: '', youtubeUrl: '', reward: 0.10, timeLimit: 15 });
      alert("Tarea creada con éxito.");
    } catch (error) {
      console.error("Task Creation Error", error);
      alert("Error al crear la tarea.");
    } finally {
      setSubmittingTask(false);
    }
  };

  const handleApproveSubmission = async (submission: any) => {
    try {
      // 1. Update submission status
      await updateDoc(doc(db, 'submissions', submission.id), {
        status: 'approved',
        reviewedAt: serverTimestamp()
      });

      // 2. Update user balance and tasksCompleted using increment
      const userRef = doc(db, 'users', submission.userId);
      await updateDoc(userRef, {
        balance: increment(0.10),
        tasksCompleted: increment(1)
      });

      alert("Tarea aprobada.");
    } catch (error) {
      console.error("Approval Error", error);
    }
  };

  const handleRejectSubmission = async (id: string) => {
    try {
      await updateDoc(doc(db, 'submissions', id), {
        status: 'rejected',
        reviewedAt: serverTimestamp()
      });
      alert("Tarea rechazada.");
    } catch (error) {
      console.error("Rejection Error", error);
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    try {
      await updateDoc(doc(db, 'withdrawals', id), {
        status: 'approved',
        processedAt: serverTimestamp()
      });
      alert("Retiro aprobado.");
    } catch (error) {
      console.error("Withdrawal Approval Error", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black mb-4">Acceso Denegado</h1>
        <p className="text-gray-400">No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">Panel de Administración</h1>
          <p className="text-gray-400 font-medium">Gestiona tareas, revisa pruebas y procesa retiros.</p>
        </div>
        
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            <Play className="w-4 h-4" />
            Tareas
          </button>
          <button 
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'submissions' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            <Check className="w-4 h-4" />
            Revisiones
            {submissions.length > 0 && (
              <span className="bg-white text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {submissions.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('withdrawals')}
            className={`px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'withdrawals' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            <DollarSign className="w-4 h-4" />
            Retiros
            {withdrawals.length > 0 && (
              <span className="bg-white text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {withdrawals.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tasks' && (
          <motion.div 
            key="tasks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sticky top-24">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-red-600" />
                  Nueva Tarea
                </h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Título del Video</label>
                    <input 
                      type="text" 
                      required
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">URL de YouTube</label>
                    <input 
                      type="url" 
                      required
                      value={newTask.youtubeUrl}
                      onChange={(e) => setNewTask({...newTask, youtubeUrl: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Recompensa (USDT)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={newTask.reward}
                      onChange={(e) => setNewTask({...newTask, reward: parseFloat(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tiempo Límite (Minutos)</label>
                    <input 
                      type="number" 
                      required
                      value={newTask.timeLimit}
                      onChange={(e) => setNewTask({...newTask, timeLimit: parseInt(e.target.value)})}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingTask}
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submittingTask ? <Loader2 className="w-5 h-5 animate-spin" /> : "Crear Tarea"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold mb-6">Tareas Activas</h3>
              {tasks.map((task) => (
                <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 bg-black rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={`https://img.youtube.com/vi/${task.youtubeUrl.split('v=')[1]?.split('&')[0]}/default.jpg`} 
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{task.title}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{task.reward.toFixed(2)} USDT</p>
                        <span className="text-gray-700">•</span>
                        <p className="text-xs text-gray-500">{task.timeLimit || 15} min</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={task.youtubeUrl} 
                      target="_blank" 
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button className="p-2 bg-zinc-800 hover:bg-red-600/20 text-red-500 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'submissions' && (
          <motion.div 
            key="submissions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {submissions.length === 0 ? (
              <div className="py-20 text-center bg-zinc-900 border border-zinc-800 rounded-3xl">
                <p className="text-gray-500 font-bold">No hay revisiones pendientes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.map((sub) => (
                  <div key={sub.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Usuario: {sub.userId.slice(0, 8)}...</span>
                      <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Pendiente</span>
                    </div>
                    
                    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 relative group">
                      <img 
                        src={sub.proofUrl} 
                        alt="Prueba"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <a 
                        href={sub.proofUrl} 
                        target="_blank"
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="w-8 h-8" />
                      </a>
                    </div>

                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => handleApproveSubmission(sub)}
                        className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Aprobar
                      </button>
                      <button 
                        onClick={() => handleRejectSubmission(sub.id)}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'withdrawals' && (
          <motion.div 
            key="withdrawals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {withdrawals.length === 0 ? (
              <div className="py-20 text-center bg-zinc-900 border border-zinc-800 rounded-3xl">
                <p className="text-gray-500 font-bold">No hay solicitudes de retiro pendientes.</p>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-800/50 border-bottom border-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Usuario</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Monto</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Red</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Dirección</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {withdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-white">{w.userId.slice(0, 8)}...</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-500">{w.amount.toFixed(2)} USDT</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{w.network}</td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-500 truncate max-w-[200px]">{w.address}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleApproveWithdrawal(w.id)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-700 transition-all"
                          >
                            Procesar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
