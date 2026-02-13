import { ctaCopy, feedbackChips } from '../content/data';

export default function CTA({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="section-shell pt-4">
      <div className="container-tight">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-surface via-surface2 to-surface p-8 shadow-neon">
          <div className="absolute inset-0 bg-gradient-to-r from-primaryNeon/12 via-secondaryNeon/10 to-transparent" />
          <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-white/60">Let’s move</p>
              <h3 className="text-2xl font-semibold text-white">{ctaCopy.headline}</h3>
              <p className="text-sm text-white/70">{ctaCopy.sub}</p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-white/70">
                {feedbackChips.slice(0, 4).map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <button className="btn-primary text-base" onClick={onCTA}>
              Book Free Strategy Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
