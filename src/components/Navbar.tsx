import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, MessageCircle, X } from 'lucide-react';

const links = [
  { href: '#expertise', label: 'Expertise' },
  { href: '#platforms', label: 'Platforms' },
  { href: '#work', label: 'Work' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappHref =
    'https://wa.me/917595045107?text=Hello%20Exacta%20Web%20Solution,%20I%E2%80%99d%20like%20to%20know%20more%20about%20your%20services.';

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-white/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-tight flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <img
            src="/Logo/logo1.png"
            alt="Exacta Web Solution logo"
            className="h-10 md:h-12 lg:h-14 w-auto object-contain origin-left scale-[1.75] md:scale-[2] lg:scale-[2.2] drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] drop-shadow-[0_0_22px_rgba(255,255,255,0.18)] saturate-110 contrast-105 transition-transform duration-300"
            loading="eager"
          />
        </div>

        <nav className="hidden items-center gap-8 text-sm text-white/70 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="relative px-1 py-1 transition hover:text-white">
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 scale-x-0 rounded-full bg-gradient-to-r from-primaryNeon to-secondaryNeon transition-all duration-200 hover:scale-x-100" />
            </a>
          ))}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base"
            aria-label="Chat with Exacta Web Solution on WhatsApp"
          >
            <MessageCircle size={16} />
            Chat With Us
          </a>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white/80 lg:hidden"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/5 bg-surface/90 px-6 pb-6 pt-3 lg:hidden">
          <div className="flex flex-col gap-4 text-sm text-white/80">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="py-1" onClick={() => setIsOpen(false)}>
                {link.label}
              </a>
            ))}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full justify-center"
              aria-label="Chat with Exacta Web Solution on WhatsApp"
            >
              <MessageCircle size={16} />
              Chat With Us
            </a>
          </div>
        </div>
      )}
    </motion.header>
  );
}
