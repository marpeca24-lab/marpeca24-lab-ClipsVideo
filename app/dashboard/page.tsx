'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/FirebaseProvider';
import { db, collection, query, onSnapshot, where, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '@/firebase';
import TaskCard from '@/components/TaskCard';
import ClientDashboard from '@/components/ClientDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X, Play, Info, DollarSign, Send, Users, ShieldCheck, AlertCircle, TrendingUp, Copy, Check, Clock, Upload, Image as ImageIcon } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1024 * 1024) { // 1MB limit for Firestore
        alert("La imagen es demasiado grande. El límite es 1MB.");
        return;
      }
      setProofFile(file);
      const reader = new FileReader();
      reader.onload = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (authLoading || !user || profile?.profileType === 'client') {
      if (profile?.profileType === 'client') setLoading(false);
      return;
    }

    const path = 'tasks';
    const q = query(collection(db, path), where('status', '==', 'active'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authLoading, user, profile?.profileType]);

  const copyReferral = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${profile.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmitTask = async () => {
    if (!proofFile) {
      alert("Por favor, sube una captura de pantalla de prueba.");
      return;
    }
    setSubmitting(true);
    try {
      const path = 'submissions';
      const base64Proof = await fileToBase64(proofFile);
      await addDoc(collection(db, path), {
        taskId: selectedTask.id,
        userId: user!.uid,
        proofUrl: base64Proof,
        status: 'pending',
        submittedAt: serverTimestamp()
      });
      setSelectedTask(null);
      setProofFile(null);
      setProofPreview(null);
      alert("¡Tarea enviada con éxito! Será revisada pronto.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'submissions');
      alert("Error al enviar la tarea.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // Render Client Dashboard if profileType is 'client'
  if (profile?.profileType === 'client') {
    return <ClientDashboard />;
  }

  // Filter tasks based on daily limit
  const dailyLimit = profile?.dailyTasksLimit || 4;
  const tasksToShow = tasks.slice(0, dailyLimit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Balance USDT</p>
            <p className="text-2xl font-black text-white">{profile?.balance?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center">
            <Play className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tareas Hoy</p>
            <p className="text-2xl font-black text-white">{profile?.tasksCompleted || 0} / {dailyLimit}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Referidos</p>
            <p className="text-2xl font-black text-white">{profile?.referralCount || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <header className="mb-8">
            <h1 className="text-4xl font-black mb-2">Tareas del Día</h1>
            <p className="text-gray-400 font-medium">Completa tus {dailyLimit} videos diarios para ganar recompensas.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasksToShow.length > 0 ? (
              tasksToShow.map((task) => (
                <TaskCard key={task.id} task={task} onSelect={setSelectedTask} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                <p className="text-gray-500 font-bold">No hay tareas disponibles en este momento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* KYC Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              Estado de Cuenta
            </h3>
            {profile?.kycStatus === 'none' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Verifica tu cuenta para aumentar tus ganancias.</p>
                <button 
                  onClick={() => window.location.href = '/kyc'}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all text-sm"
                >
                  Verificar Ahora
                </button>
              </div>
            ) : profile?.kycStatus === 'pending' ? (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-yellow-500 font-bold">Verificación Pendiente</span>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-emerald-500 font-bold">Usuario Verificado</span>
              </div>
            )}
          </div>

          {/* Referral Progress */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Meta de Referidos
            </h3>
            <p className="text-xs text-gray-400 mb-4">Invita a 3 amigos para reducir tu mínimo de retiro a $50.</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Progreso</span>
                <span className="text-white">{profile?.referralCount || 0} / 3</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${Math.min(((profile?.referralCount || 0) / 3) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="relative">
              <input 
                type="text" 
                readOnly
                value={profile?.referralCode || ""}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-xs font-mono text-gray-400 focus:outline-none"
              />
              <button 
                onClick={copyReferral}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Withdrawal Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Retiros
            </h3>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-gray-500">Mínimo de retiro:</span>
              <span className="text-white font-bold">${profile?.withdrawalMin || 80} USDT</span>
            </div>
            <button 
              onClick={() => window.location.href = '/withdraw'}
              disabled={(profile?.balance || 0) < (profile?.withdrawalMin || 80)}
              className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm disabled:opacity-50"
            >
              Retirar Fondos
            </button>
          </div>
        </div>
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-white font-bold">
                        <Info className="w-4 h-4 text-red-500" />
                        Instrucciones
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-bold">
                        <Clock className="w-3 h-3 text-red-500" />
                        Tiempo: {selectedTask.timeLimit || 15} min
                      </div>
                    </div>
                    <ul className="text-gray-400 text-sm space-y-2 list-disc pl-4">
                      <li>Visualiza todo el video.</li>
                      <li>Suscríbete al canal del creador.</li>
                      <li>Dale Like al video.</li>
                      <li>Sube una captura de pantalla donde se vea tu like y suscripción.</li>
                      <li>Tienes un máximo de {selectedTask.timeLimit || 15} minutos para completar esta tarea.</li>
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <label className="block text-sm font-bold text-gray-400 mb-2">
                      Subir Captura de Pantalla (Prueba)
                    </label>
                    
                    <div className="relative group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="proof-upload"
                      />
                      <label 
                        htmlFor="proof-upload"
                        className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${proofPreview ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-700 hover:border-red-600 bg-zinc-800/50'}`}
                      >
                        {proofPreview ? (
                          <div className="relative w-full h-full p-2">
                            <img src={proofPreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity rounded-xl">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-gray-500 mb-2" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Seleccionar Imagen</span>
                            <span className="text-[10px] text-gray-600 mt-1">Máximo 1MB</span>
                          </>
                        )}
                      </label>
                    </div>
                    
                    <button 
                      onClick={handleSubmitTask}
                      disabled={submitting}
                      className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
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
