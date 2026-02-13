import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Sparkles, X, ArrowRight } from 'lucide-react';
import { PodId, pods } from '../../content/pods';
import { fadeUp, softEase, usePrefersReducedMotion } from '../../utils/motion';

export default function PodsMapping() {
  const [activeId, setActiveId] = useState<PodId>('conversion');
  const [showPackages, setShowPackages] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activePod = pods.find((p) => p.id === activeId) ?? pods[0];

  return (
    <section id="pods" className="section-shell pt-6">
      <div className="container-tight">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">Pods to Services mapping</p>
            <h3 className="text-xl font-semibold text-white">Pods that ship results</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
            <Sparkles size={14} className="text-primaryNeon" /> Performance Pods
          </span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/8 bg-surface/75 shadow-card backdrop-blur-2xl">
          <div className="flex items-center gap-2 overflow-x-auto border-b border-white/5 px-4 py-3 md:px-6">
            {pods.map((pod) => (
              <button
                key={pod.id}
                onClick={() => setActiveId(pod.id)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  pod.id === activeId
                    ? 'text-white'
                    : 'text-white/65 hover:text-white hover:bg-white/5'
                }`}
              >
                {pod.title}
                {pod.id === activeId && (
                  <motion.span
                    layoutId="podTab"
                    className="absolute inset-0 -z-10 rounded-full bg-white/8 ring-1 ring-inset ring-white/10"
                    transition={{ type: 'spring', stiffness: 240, damping: 26 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePod.id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: softEase }}
                className="grid gap-4 md:grid-cols-[1.05fr,0.95fr]"
              >
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-white">{activePod.title}</p>
                  <p className="text-sm text-white/70">{activePod.outcome}</p>
                  <div className="flex flex-wrap gap-2">
                    {activePod.bullets.map((b) => (
                      <span key={b} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                        {b}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/55">
                    Best for: <span className="rounded-full bg-white/5 px-2.5 py-1 text-white/75">{activePod.bestFor}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/5 p-4 shadow-glowSoft backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">Services inside</p>
                    <button
                      className="text-xs font-semibold text-primaryNeon underline-offset-4 hover:underline"
                      onClick={() => setShowPackages(true)}
                    >
                      See packages
                    </button>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {activePod.services.slice(0, 4).map((svc) => (
                      <li key={svc} className="flex items-start gap-2 text-sm text-white/80">
                        <Check size={16} className="mt-0.5 text-primaryNeon" />
                        {svc}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showPackages && (
            <motion.div
              className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, ease: softEase }}
                className="w-full max-w-lg rounded-3xl border border-white/10 bg-surface/90 p-6 shadow-card backdrop-blur-2xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/60">Packages</p>
                    <p className="text-lg font-semibold text-white">{activePod.title}</p>
                  </div>
                  <button
                    className="rounded-full bg-white/10 p-2 text-white/70 hover:text-white"
                    onClick={() => setShowPackages(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-3 text-sm text-white/75">
                  <p>{activePod.outcome}</p>
                  {activePod.startingFrom && (
                    <p className="rounded-2xl border border-primaryNeon/30 bg-primaryNeon/10 px-4 py-3 font-semibold text-primaryNeon">
                      Starting from: {activePod.startingFrom}
                    </p>
                  )}
                  <div className="space-y-2">
                    {activePod.services.map((svc) => (
                      <div key={svc} className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-2">
                        <ArrowRight size={14} className="mt-0.5 text-secondaryNeon" />
                        <span>{svc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

