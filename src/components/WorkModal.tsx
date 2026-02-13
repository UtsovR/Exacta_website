import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { WorkTile } from '../content/data';
import { fadeUp } from '../utils/motion';

interface WorkModalProps {
  item: WorkTile;
  onClose: () => void;
}

export default function WorkModal({ item, onClose }: WorkModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: 8 }}
        className="w-[520px] max-w-[92vw] rounded-2xl border border-white/10 bg-surface/90 p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Project</p>
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close work modal">
            <X size={18} />
          </button>
        </div>
        <img src={item.image} alt="work detail" className="mt-4 h-56 w-full rounded-xl object-cover" />
        <div className="mt-3 flex items-center gap-2 text-sm text-white/70">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primaryNeon">
            {item.category}
          </span>
          <span className="text-white">{item.metric}</span>
        </div>
        <p className="mt-3 text-sm text-white/70">{item.summary}</p>
      </motion.div>
    </motion.div>
  );
}
