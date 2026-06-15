'use client';

import { useState } from 'react';
import { X, TrendingUp, CheckCircle2, AlertCircle, Loader2, User, Mail, Phone } from 'lucide-react';
import { invest } from '@/lib/api';
import { useAuth } from '@/components/session-provider';

interface InvestmentModalProps {
  projectId: string;
  projectTitle: string;
  minimumInvestment: number;
  currency: string;
  onClose: () => void;
}

export function InvestmentModal({
  projectId,
  projectTitle,
  minimumInvestment,
  currency,
  onClose,
}: InvestmentModalProps) {
  const { user } = useAuth();
  const minAmt = minimumInvestment || 100;

  const [amount, setAmount] = useState<string>(String(minAmt));
  const selectedCurrency = currency || 'USD';
  const [notes, setNotes] = useState('');
  const [contactName, setContactName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : '',
  );
  const [contactEmail, setContactEmail] = useState(user?.email ?? '');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fmt = (n: number) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: selectedCurrency, maximumFractionDigits: 0 }).format(n);
    } catch {
      return `${selectedCurrency} ${n.toLocaleString()}`;
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < minAmt) {
      setError(`Minimum investment is ${fmt(minAmt)}`);
      return;
    }
    if (!contactName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!contactEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await invest({
        projectId,
        amount: amt,
        currency: selectedCurrency,
        notes: notes || undefined,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Investment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#111111] border border-black/10 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 flex items-center justify-between px-6 pt-6 pb-4 bg-white dark:bg-[#111111] border-b border-black/5 dark:border-white/5 z-10">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: '#22c55e' }} />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Invest in {projectTitle}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-6 text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: 'rgba(13,87,48,0.15)' }}
              >
                <CheckCircle2 size={28} style={{ color: '#22c55e' }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Investment Submitted!
              </h3>
              <p className="text-sm text-gray-500 dark:text-white/50 mb-2">
                Your investment in <strong>{projectTitle}</strong> has been submitted for review.
              </p>
              <p className="text-xs text-gray-400 dark:text-white/30 mb-6">
                The project team will review and approve it shortly. You&apos;ll be contacted at <strong>{contactEmail}</strong>.
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-xs text-gray-500 dark:text-white/40">
                Minimum investment: {fmt(minAmt)} · Your investment will be reviewed by the project team before confirmation.
              </p>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide">
                  Your Contact Information
                </h4>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-white/60 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-8 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-white/60 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-8 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-white/60 mb-1.5">
                    Phone Number <span className="text-gray-400 dark:text-white/30">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+243 xxx xxx xxx"
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-8 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                    />
                  </div>
                </div>
              </div>

              {/* Investment amount */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wide mb-3">
                  Investment Amount
                </h4>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-white/30">$</span>
                    <input
                      type="number"
                      min={minAmt}
                      step="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-7 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                      placeholder={String(minAmt)}
                    />
                  </div>
                  <div className="flex items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 text-sm font-semibold text-gray-700 dark:text-white/70 w-20">
                    {selectedCurrency}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-white/60 mb-1.5">
                  Notes <span className="text-gray-400 dark:text-white/30">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 resize-none"
                  placeholder="Any notes for this investment…"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle size={13} className="shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-60 transition-all"
                style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 4px 20px rgba(13,87,48,0.3)' }}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                ) : (
                  <><TrendingUp size={16} /> Submit Investment Request</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 dark:text-white/25">
                Your investment will be confirmed after team review
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
