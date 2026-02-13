import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OutcomeValueSection from './components/OutcomeValueSection';
import PerformancePodsSection from './components/PerformancePodsSection';
import SelectedWorkProofSection from './components/SelectedWorkProofSection';
import TestimonialsCarouselSection from './components/TestimonialsCarouselSection';
import AmbientPillars from './components/AmbientPillars';
import Contact from './components/Contact';
import FinalCTASection from './components/FinalCTASection';
import FeedbackButton from './components/FeedbackButton';
import CTAmodal from './components/CTAmodal';
import Footer from './components/Footer';

export default function App() {
  const [ctaOpen, setCtaOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const whatsappHref =
    'https://wa.me/917595045107?text=Hello%20Exacta%20Web%20Solution,%20I%E2%80%99d%20like%20to%20know%20more%20about%20your%20services.';

  return (
    <div className="relative min-h-screen overflow-hidden bg-base text-white">
      <Navbar />
      <main className="space-y-2 pb-12">
        <Hero onCTA={() => setCtaOpen(true)} />
        <section className="relative isolate">
          <AmbientPillars />
          <div className="relative z-10 space-y-2">
            <OutcomeValueSection />
            <PerformancePodsSection />
            <SelectedWorkProofSection />
            <TestimonialsCarouselSection />
            <FinalCTASection onCTA={() => setCtaOpen(true)} />
            <Contact />
          </div>
        </section>
      </main>
      <Footer />

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Exacta Web Solution on WhatsApp"
        className="fixed bottom-[5rem] right-6 z-40 inline-flex items-center gap-2 rounded-full border border-yellow-500/35 bg-black/70 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-200 hover:border-primaryNeon/55 hover:text-primaryNeon hover:shadow-[0_14px_34px_rgba(109,220,255,0.22)]"
      >
        <MessageCircle size={18} />
        Chat With Us
      </a>
      <FeedbackButton open={feedbackOpen} onToggle={() => setFeedbackOpen((value) => !value)} />
      <CTAmodal open={ctaOpen} onClose={() => setCtaOpen(false)} />
    </div>
  );
}
