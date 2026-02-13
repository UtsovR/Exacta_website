import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { contactDetails } from '../content/data';

const quickLinks = [
  { href: '#expertise', label: 'Expertise' },
  { href: '#platforms', label: 'Platforms' },
  { href: '#work', label: 'Work' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' }
];

const socialLinks = [
  { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/exacta_web/' },
  { label: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61587365084047' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://in.linkedin.com/company/exactawebsolutions' }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-surface/90 py-6">
      <div className="container-tight space-y-8">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1.3fr,0.9fr,0.8fr]">
          <div className="space-y-3 text-sm text-white/72">
            <p className="text-lg font-semibold text-white">Exacta Web Solution</p>
            <p>{contactDetails.address}</p>
            <p>
              <span className="mr-1">Phone:</span>
              <a
                href="tel:+917595045107"
                aria-label="Call Exacta Web Solution"
                className="cursor-pointer transition-colors duration-200 hover:text-primaryNeon hover:underline"
              >
                7595 045 107
              </a>
            </p>
            <p>{contactDetails.email}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Quick links</p>
            <nav className="flex flex-wrap gap-3 text-sm text-white/72">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition hover:border-primaryNeon/45 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Social</p>
            <div className="flex items-center gap-3 text-white/75">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-primaryNeon/45 hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
              <a
                href="https://x.com/exacta_web"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="X"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:border-primaryNeon/45 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path d="M18.244 2H21l-6.54 7.47L22 22h-6.828l-5.34-6.98L3.9 22H1l7.02-8.02L2 2h6.828l4.86 6.42L18.244 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-5 text-sm text-white/58">
          &copy; 2025 Exacta Web Solution. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
