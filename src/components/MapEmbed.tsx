import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Expand, X } from 'lucide-react';

const mapQuery = '4/36A,+Chanditala+Lane,+Tollygunge,+Kolkata,+West+Bengal';
const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

export default function MapEmbed() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsExpanded(false);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        aria-expanded={isExpanded}
        aria-haspopup="dialog"
        aria-controls="contact-map-dialog"
        className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryNeon/70 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-card transition duration-300 group-hover:border-primaryNeon/35 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_30px_rgba(109,220,255,0.2)]">
          <iframe
            title="Exacta Web Solution Map Preview"
            src={mapSrc}
            loading="lazy"
            allowFullScreen
            className="h-60 w-full pointer-events-none sm:h-64"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/75 via-base/20 to-transparent" />
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-xs text-white/80 backdrop-blur-sm">
            <span>Open interactive map</span>
            <span className="inline-flex items-center gap-1 text-primaryNeon">
              Expand <Expand size={14} />
            </span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="contact-map-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Exacta Web Solution location map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/12 bg-surface shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_36px_rgba(109,220,255,0.18)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/80 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryNeon/70"
                aria-label="Close expanded map"
              >
                <X size={16} />
              </button>

              <iframe
                title="Exacta Web Solution Map Expanded"
                src={mapSrc}
                loading="lazy"
                allowFullScreen
                className="h-[70vh] min-h-[420px] w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
