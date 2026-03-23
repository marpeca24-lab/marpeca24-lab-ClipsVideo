'use client';

import { Play, DollarSign, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    reward: number;
    timeLimit?: number;
    youtubeUrl: string;
    status: string;
  };
  onSelect: (task: any) => void;
}

export default function TaskCard({ task, onSelect }: TaskCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group cursor-pointer"
      onClick={() => onSelect(task)}
    >
      <div className="aspect-video bg-zinc-800 relative overflow-hidden">
        <img 
          src={`https://img.youtube.com/vi/${task.youtubeUrl.split('v=')[1]?.split('&')[0] || 'default'}/maxresdefault.jpg`} 
          alt={task.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
            <Play className="text-white fill-current w-6 h-6 ml-1" />
          </div>
        </div>
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-white/10">
          <Clock className="w-3 h-3 text-red-500" />
          {task.timeLimit || 15} MIN
        </div>
        <div className="absolute top-3 right-3 bg-emerald-500 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          {task.reward.toFixed(2)} USDT
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{task.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{task.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Verificación rápida</span>
          </div>
          <button className="text-white text-sm font-bold flex items-center gap-1 group-hover:text-red-500 transition-colors">
            Realizar Tarea
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
