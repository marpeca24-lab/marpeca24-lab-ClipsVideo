'use client';

import { useState } from 'react';
import { useAuth } from '@/components/FirebaseProvider';
import { db, collection, addDoc, serverTimestamp } from '@/firebase';
import { motion } from 'motion/react';
import { DollarSign, Wallet, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Withdraw() {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount < (profile?.withdrawalMin || 80)) {
      alert(`El mínimo de retiro es $${profile?.withdrawalMin || 80} USDT`);
      return;
    }

    if (withdrawAmount > (profile?.balance || 0)) {
      alert("Balance insuficiente.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'withdrawals'), {
        userId: user!.uid,
        amount: withdrawAmount,
        network,
        address,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (error) {
      console.error("Withdrawal Error", error);
      alert("Error al procesar el retiro.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black mb-4">¡Retiro Solicitado!</h1>
        <p className="text-gray-400 text-lg mb-8">
          Tu solicitud de retiro de {amount} USDT ha sido enviada. 
          Será procesada en las próximas 24-72 horas hábiles.
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const canWithdraw = (profile?.balance || 0) >= (profile?.withdrawalMin || 80);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black mb-4">Retirar USDT</h1>
        <p className="text-gray-400 font-medium">Retira tus ganancias directamente a tu billetera cripto.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <form onSubmit={handleWithdraw} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Monto a Retirar (USDT)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Mínimo: ${profile?.withdrawalMin || 80} USDT</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Red de Retiro</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setNetwork('TRC20')}
                  className={`py-3 rounded-xl font-bold border transition-all ${
                    network === 'TRC20' ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600'
                  }`}
                >
                  TRC20 (Tron)
                </button>
                <button 
                  type="button"
                  onClick={() => setNetwork('BEP20')}
                  className={`py-3 rounded-xl font-bold border transition-all ${
                    network === 'BEP20' ? 'bg-yellow-600 border-yellow-600 text-white' : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600'
                  }`}
                >
                  BEP20 (BSC)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">Dirección de Billetera USDT ({network})</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Pega tu dirección aquí..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !canWithdraw}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Solicitar Retiro
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4">Tu Balance</h3>
            <p className="text-3xl font-black text-white mb-2">{profile?.balance?.toFixed(2) || "0.00"} USDT</p>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${canWithdraw ? 'bg-emerald-500' : 'bg-red-600'}`}
                style={{ width: `${Math.min(((profile?.balance || 0) / (profile?.withdrawalMin || 80)) * 100, 100)}%` }}
              />
            </div>
            {!canWithdraw && (
              <p className="text-xs text-red-500 mt-2 font-bold">
                Faltan ${(profile?.withdrawalMin || 80) - (profile?.balance || 0)} USDT para retirar.
              </p>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-start gap-3 text-yellow-500 mb-4">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold">Importante</h3>
            </div>
            <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
              <li>Asegúrate de que la red seleccionada coincida con tu billetera.</li>
              <li>Los retiros a redes incorrectas resultarán en la pérdida de fondos.</li>
              <li>El proceso de verificación puede tardar hasta 72 horas.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
