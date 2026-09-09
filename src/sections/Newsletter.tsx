import React, { useState } from 'react';
import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useToast } from '../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid email address');
      return;
    }

    setIsSubmitted(true);
    showToast('Subscribed', 'Welcome to the PUMBA Vanguard.', 'success');
  };

  return (
    <Section className="relative z-10 py-24 sm:py-32 bg-background overflow-hidden border-t border-white/5">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px]" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto rounded-3xl sm:rounded-[36px] bg-[#111116] border border-white/10 p-8 sm:p-14 lg:p-16 text-center shadow-2xl overflow-hidden"
        >
          {/* Subtle Grid Accent */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* Tag */}
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              The PUMBA Vanguard
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
              Stay ahead of the next.
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Receive confidential drop alerts, invitations to prototype auditions, and private batch
              reservations.
            </p>

            {/* Email Form */}
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">
                    You're on the list. We'll be in touch before the next drop.
                  </span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="w-full max-w-md flex flex-col sm:flex-row items-stretch gap-3 mb-6"
                >
                  <div className="relative flex-grow">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                    <input
                      type="email"
                      aria-label="Email address for newsletter"
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      className="w-full h-14 pl-11 pr-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    variant="primary"
                    withArrow
                    className="h-14 px-8 font-semibold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] flex-shrink-0"
                  >
                    Join PUMBA
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {error && <span className="text-xs text-rose-400 mb-4">{error}</span>}

            {/* Guarantees row */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/40 pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Zero Spam Guarantee
              </span>
              <span>•</span>
              <span>1-Click Unsubscribe Anytime</span>
              <span>•</span>
              <span>Bi-weekly Dispatch</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
};
