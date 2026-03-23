'use client';

import { useState } from 'react';
import { useAuth } from '@/components/FirebaseProvider';
import { db, doc, updateDoc } from '@/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { User, ShieldCheck, Camera, Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function KYC() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.displayName || '',
    idNumber: '',
    address: '',
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // In a real app, we would upload files to Storage
      // For now, we'll simulate the process and update the user's kycStatus
      await updateDoc(doc(db, 'users', user!.uid), {
        kycStatus: 'pending'
      });
      setStep(4); // Success step
    } catch (error) {
      console.error("KYC Error", error);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.kycStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
        </div>
        <h1 className="text-3xl font-black mb-4">Verificación en Proceso</h1>
        <p className="text-gray-400 text-lg mb-8">
          Tus documentos están siendo revisados por nuestro equipo. 
          Este proceso suele tardar entre 24 y 48 horas.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-yellow-500 font-bold">
          <AlertCircle className="w-4 h-4" />
          Pendiente de Verificación
        </div>
      </div>
    );
  }

  if (profile?.kycStatus === 'verified') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black mb-4">¡Cuenta Verificada!</h1>
        <p className="text-gray-400 text-lg mb-8">
          Ya eres un usuario verificado. Ahora puedes realizar hasta 10 tareas diarias y retirar desde $50.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-500 font-bold">
          <ShieldCheck className="w-4 h-4" />
          Usuario Verificado
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black mb-4">Verificación de Identidad (KYC)</h1>
        <p className="text-gray-400 font-medium">Completa tu verificación para aumentar tus límites y reducir el mínimo de retiro.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
              step >= s ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-500'
            }`}>
              {s}
            </div>
            <span className={`text-xs mt-2 font-bold ${step >= s ? 'text-white' : 'text-gray-500'}`}>
              {s === 1 ? 'Datos' : s === 2 ? 'Documentos' : 'Selfie'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="text-red-600" />
                Datos Personales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Nombre Completo (como en ID)</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Número de Documento</label>
                  <input 
                    type="text" 
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Dirección de Residencia</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>
              <button 
                onClick={handleNext}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 mt-8"
              >
                Siguiente Paso
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Upload className="text-red-600" />
                Carga de Documento
              </h2>
              <p className="text-gray-400 text-sm">Sube fotos claras del frente y dorso de tu documento de identidad.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Dropzone label="Frente del ID" onFile={(f) => setFormData({...formData, idFront: f})} />
                <Dropzone label="Dorso del ID" onFile={(f) => setFormData({...formData, idBack: f})} />
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={handleBack}
                  className="flex-1 bg-zinc-800 text-white py-4 rounded-xl font-bold hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-[2] bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  Siguiente Paso
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Camera className="text-red-600" />
                Selfie con Documento
              </h2>
              <div className="bg-zinc-800/50 p-6 rounded-2xl flex items-start gap-4 border border-zinc-700">
                <AlertCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                <p className="text-sm text-gray-300">
                  Sostén tu documento junto a tu rostro. Asegúrate de que tanto tu cara como los datos del ID sean legibles y no haya reflejos.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-3xl p-12 hover:border-red-600/50 transition-colors cursor-pointer group">
                <Camera className="w-12 h-12 text-gray-500 group-hover:text-red-600 transition-colors mb-4" />
                <p className="text-white font-bold mb-1">Activar Cámara</p>
                <p className="text-gray-500 text-sm">O arrastra tu foto aquí</p>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={handleBack}
                  className="flex-1 bg-zinc-800 text-white py-4 rounded-xl font-bold hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Finalizar Verificación
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-black mb-4">¡Solicitud Enviada!</h2>
              <p className="text-gray-400 text-lg mb-8">
                Hemos recibido tus documentos correctamente. Te notificaremos por correo una vez que tu cuenta sea verificada.
              </p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Volver al Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Dropzone({ label, onFile }: { label: string, onFile: (f: File) => void }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-400 ml-1">{label}</label>
      <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-red-600/50 transition-colors cursor-pointer group">
        <Upload className="w-8 h-8 text-gray-500 group-hover:text-red-600 transition-colors mb-2" />
        <p className="text-xs text-gray-500 font-bold">Subir archivo</p>
      </div>
    </div>
  );
}
