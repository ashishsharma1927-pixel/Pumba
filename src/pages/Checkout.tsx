import React, { useState, useId, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  CreditCard,
  Truck,
  User,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Copy,
  Printer,
} from 'lucide-react';
import { cn } from '../utils/cn';

type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'confirmation';

interface FormData {
  // Contact
  email: string;
  phone: string;
  newsletter: boolean;
  // Shipping
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shippingMethod: 'express' | 'priority';
  // Payment
  paymentMethod: 'card' | 'apple' | 'crypto';
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cvv: string;
}

interface FormErrors {
  [key: string]: string;
}

export const Checkout: React.FC = () => {
  const { items, subtotal, shipping, discount, total, appliedPromo, clearCart } = useCart();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [orderDate, setOrderDate] = useState<string>('');

  useEffect(() => {
    document.title = 'Secure Checkout | PUMBA';
    return () => {
      document.title = 'PUMBA — Next-Generation 3D E-Commerce & Hardware Architecture';
    };
  }, []);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState<boolean>(false);
  const [completedOrderSnapshot, setCompletedOrderSnapshot] = useState<{
    items: typeof items;
    total: number;
    subtotal: number;
    shipping: number;
    discount: number;
    shippingMethod: string;
    shippingAddress: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    newsletter: true,
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    shippingMethod: 'express',
    paymentMethod: 'card',
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const emailId = useId();
  const phoneId = useId();
  const fullNameId = useId();
  const addressId = useId();
  const cityId = useId();
  const stateId = useId();
  const postalCodeId = useId();
  const countryId = useId();
  const cardholderNameId = useId();
  const cardNumberId = useId();
  const expiryId = useId();
  const cvvId = useId();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Card Number Auto-Formatter
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: '' }));
    }
  };

  // Expiry Auto-Formatter (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleaned = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length >= 3) {
      cleaned = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    setFormData((prev) => ({ ...prev, expiry: cleaned }));
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: '' }));
    }
  };

  // CVV Formatter (max 4 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '').substring(0, 4);
    setFormData((prev) => ({ ...prev, cvv: cleaned }));
    if (errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: '' }));
    }
  };

  // Step Validations
  const validateContact = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for delivery notifications';
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateShipping = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full legal name is required';
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State / Region is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal / ZIP code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean => {
    if (formData.paymentMethod !== 'card') {
      return true; // Express wallets validated via native sheet
    }

    const newErrors: FormErrors = {};
    const cleanCard = formData.cardNumber.replace(/\s/g, '');

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!cleanCard) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanCard.length < 15) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }

    if (!formData.expiry) {
      newErrors.expiry = 'MM/YY required';
    } else {
      const parts = formData.expiry.split('/');
      if (parts.length !== 2 || Number(parts[0]) < 1 || Number(parts[0]) > 12) {
        newErrors.expiry = 'Invalid month';
      }
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = '3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 'contact') {
      if (validateContact()) {
        setCurrentStep('shipping');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (currentStep === 'shipping') {
      if (validateShipping()) {
        setCurrentStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 'shipping') setCurrentStep('contact');
    if (currentStep === 'payment') setCurrentStep('shipping');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit mock checkout
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setIsProcessing(true);

    // Save snapshot of order before clearing cart
    const generatedId = `PMB-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateFormatted = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    setCompletedOrderSnapshot({
      items: [...items],
      total,
      subtotal,
      shipping,
      discount,
      shippingMethod:
        formData.shippingMethod === 'express'
          ? 'Worldwide Carbon-Neutral Express'
          : 'Priority Dedicated Courier',
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country}`,
    });

    setOrderNumber(generatedId);
    setOrderDate(dateFormatted);

    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      setCurrentStep('confirmation');
      showToast('Order Confirmed!', `Order #${generatedId} placed successfully.`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1800);
  };

  // Steps definition for progress bar
  const STEPS = [
    { id: 'contact', label: 'Contact', icon: User },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: Check },
  ];

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  // If user navigates with empty cart and not confirmation step, show warning
  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white/40">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Add items to your shopping cart before proceeding to checkout.
        </p>
        <Link to="/shop">
          <Button size="lg" withArrow>
            Explore Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 pt-6 sm:pt-10">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-6"
        >
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-white transition-colors">
            Cart
          </Link>
          <span>/</span>
          <span className="text-accent">Checkout</span>
        </nav>

        {/* Visual Multi-Step Progress Indicator */}
        <div className="mb-12">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
            {/* Connecting Progress Line */}
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: '0%' }}
                animate={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            {/* Step Nodes */}
            {STEPS.map((s, idx) => {
              const isPassed = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              const StepIcon = s.icon;

              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    disabled={idx > stepIndex || currentStep === 'confirmation'}
                    onClick={() => {
                      if (idx < stepIndex) setCurrentStep(s.id as CheckoutStep);
                    }}
                    className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-mono text-xs sm:text-sm font-bold transition-all duration-300 border shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                      isPassed
                        ? 'bg-accent text-white border-accent cursor-pointer'
                        : isCurrent
                        ? 'bg-[#121217] text-white border-accent ring-4 ring-accent/20 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                        : 'bg-[#121216] text-white/40 border-white/10 cursor-not-allowed'
                    )}
                  >
                    {isPassed ? <Check className="w-5 h-5 text-white" /> : <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                  <span
                    className={cn(
                      'absolute -bottom-6 text-[11px] font-medium tracking-wider uppercase whitespace-nowrap hidden sm:block transition-colors',
                      isCurrent
                        ? 'text-white font-semibold'
                        : isPassed
                        ? 'text-white/80'
                        : 'text-white/30'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Accordion Toggle for Order Summary */}
        {currentStep !== 'confirmation' && (
          <div className="lg:hidden mb-6">
            <button
              type="button"
              onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-sm font-medium"
            >
              <div className="flex items-center gap-2 text-white">
                <ShoppingBag className="w-4 h-4 text-accent" />
                <span>{isMobileSummaryOpen ? 'Hide Order Summary' : 'Show Order Summary'}</span>
                {isMobileSummaryOpen ? (
                  <ChevronUp className="w-4 h-4 text-white/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/50" />
                )}
              </div>
              <span className="font-mono font-bold text-white">${total}</span>
            </button>

            <AnimatePresence>
              {isMobileSummaryOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mt-3 p-5 rounded-2xl bg-[#121216] border border-white/10 flex flex-col gap-4"
                >
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor || ''}`}
                      className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-white">{item.product.name}</p>
                          <p className="text-white/50">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono text-white font-medium">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between text-sm font-bold text-white border-t border-white/10">
                    <span>Total</span>
                    <span className="font-mono">${total}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* STEP 4: CONFIRMATION SUCCESS VIEW */}
        {currentStep === 'confirmation' && completedOrderSnapshot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto flex flex-col items-center text-center p-8 sm:p-14 rounded-3xl bg-[#121217] border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Celebration Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-24 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />

            {/* Checkmark Icon with Spring Pulse */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative z-10"
            >
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14" />
            </motion.div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Order Confirmed & Logged
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
              Thank you for choosing PUMBA.
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
              We have received your order. An encrypted dispatch receipt and GPS tracking link has been
              sent to <span className="text-white font-medium">{formData.email}</span>.
            </p>

            {/* Receipt Summary Card */}
            <div className="w-full text-left p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col gap-6 mb-8 backdrop-blur-md">
              {/* Order Meta Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-white/10 text-xs">
                <div>
                  <span className="text-white/40 uppercase block mb-1">Order Number</span>
                  <span className="font-mono font-bold text-white flex items-center gap-1">
                    {orderNumber}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(orderNumber);
                        showToast('Copied', 'Order number copied to clipboard', 'info');
                      }}
                      className="text-white/40 hover:text-white"
                      title="Copy order number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </div>
                <div>
                  <span className="text-white/40 uppercase block mb-1">Date</span>
                  <span className="font-medium text-white">{orderDate}</span>
                </div>
                <div>
                  <span className="text-white/40 uppercase block mb-1">Payment</span>
                  <span className="font-medium text-white">
                    {formData.paymentMethod === 'card'
                      ? `Card ending in ${formData.cardNumber.slice(-4) || '4242'}`
                      : formData.paymentMethod === 'apple'
                      ? 'Apple Pay'
                      : 'Web3 Crypto'}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 uppercase block mb-1">Total Paid</span>
                  <span className="font-mono font-bold text-accent text-sm">
                    ${completedOrderSnapshot.total}
                  </span>
                </div>
              </div>

              {/* Items Purchased List */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Items in Dispatch
                </span>
                <div className="divide-y divide-white/5">
                  {completedOrderSnapshot.items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor || ''}`}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-white/50">
                            Qty: {item.quantity}{' '}
                            {item.selectedColor && `• Finish: ${item.selectedColor}`}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-white text-sm">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-white/40 uppercase block mb-1">Shipping Destination</span>
                  <p className="text-white leading-relaxed font-medium">
                    {formData.fullName}
                    <br />
                    {completedOrderSnapshot.shippingAddress}
                  </p>
                </div>
                <div>
                  <span className="text-white/40 uppercase block mb-1">Estimated Arrival</span>
                  <p className="text-emerald-400 font-semibold text-sm">
                    2 — 4 Business Days
                  </p>
                  <p className="text-white/50 mt-0.5">
                    {completedOrderSnapshot.shippingMethod}
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link to="/shop" className="w-full sm:w-auto">
                <Button size="lg" withArrow className="w-full px-8">
                  Continue Shopping
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto h-12 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4 text-white/70" />
                Print Order Receipt
              </button>
            </div>
          </motion.div>
        )}

        {/* STEPS 1, 2 & 3: FORMS AND SIDEBAR SUMMARY */}
        {currentStep !== 'confirmation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* LEFT FORM COLUMN (Steps 1, 2, 3) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* STEP 1: CONTACT INFORMATION */}
              {currentStep === 'contact' && (
                <motion.div
                  key="contact-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.35 }}
                  className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <User className="w-4 h-4" />
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Contact Information
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-white/40">Step 1 of 3</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Email Input */}
                    <div>
                      <label htmlFor={emailId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <input
                        id={emailId}
                        type="email"
                        name="email"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={cn(
                          'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none transition-all',
                          errors.email
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                            : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                        )}
                      />
                      {errors.email && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.email}</span>
                      )}
                    </div>

                    {/* Phone Input */}
                    <div>
                      <label htmlFor={phoneId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Phone Number (SMS Dispatch Tracking) <span className="text-accent">*</span>
                      </label>
                      <input
                        id={phoneId}
                        type="tel"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={cn(
                          'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none transition-all',
                          errors.phone
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500'
                            : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                        )}
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.phone}</span>
                      )}
                    </div>

                    {/* Newsletter Checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={formData.newsletter}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent accent-accent cursor-pointer"
                      />
                      <span className="text-xs text-white/70 select-none">
                        Keep me informed of next-generation hardware drops and firmware releases
                      </span>
                    </label>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <Link
                      to="/cart"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Cart
                    </Link>
                    <Button size="lg" withArrow onClick={nextStep}>
                      Continue to Shipping
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SHIPPING INFORMATION */}
              {currentStep === 'shipping' && (
                <motion.div
                  key="shipping-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.35 }}
                  className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <Truck className="w-4 h-4" />
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Shipping Address
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-white/40">Step 2 of 3</span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor={fullNameId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Recipient Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        id={fullNameId}
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={cn(
                          'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none transition-all',
                          errors.fullName
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                        )}
                      />
                      {errors.fullName && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.fullName}</span>
                      )}
                    </div>

                    {/* Street Address */}
                    <div>
                      <label htmlFor={addressId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Street Address <span className="text-accent">*</span>
                      </label>
                      <input
                        id={addressId}
                        type="text"
                        name="address"
                        placeholder="742 Evergreen Terrace, Apt 4B"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={cn(
                          'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none transition-all',
                          errors.address
                            ? 'border-red-500 ring-1 ring-red-500'
                            : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                        )}
                      />
                      {errors.address && (
                        <span className="text-xs text-red-400 mt-1 block">{errors.address}</span>
                      )}
                    </div>

                    {/* City, State, Postal Code Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor={cityId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                          City <span className="text-accent">*</span>
                        </label>
                        <input
                          id={cityId}
                          type="text"
                          name="city"
                          placeholder="San Francisco"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={cn(
                            'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none transition-all',
                            errors.city
                              ? 'border-red-500 ring-1 ring-red-500'
                              : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                          )}
                        />
                        {errors.city && (
                          <span className="text-xs text-red-400 mt-1 block">{errors.city}</span>
                        )}
                      </div>

                      <div>
                        <label htmlFor={stateId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                          State / Region <span className="text-accent">*</span>
                        </label>
                        <input
                          id={stateId}
                          type="text"
                          name="state"
                          placeholder="California"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={cn(
                            'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none transition-all',
                            errors.state
                              ? 'border-red-500 ring-1 ring-red-500'
                              : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                          )}
                        />
                        {errors.state && (
                          <span className="text-xs text-red-400 mt-1 block">{errors.state}</span>
                        )}
                      </div>

                      <div>
                        <label htmlFor={postalCodeId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                          Postal / ZIP <span className="text-accent">*</span>
                        </label>
                        <input
                          id={postalCodeId}
                          type="text"
                          name="postalCode"
                          placeholder="94107"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className={cn(
                            'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none transition-all',
                            errors.postalCode
                              ? 'border-red-500 ring-1 ring-red-500'
                              : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                          )}
                        />
                        {errors.postalCode && (
                          <span className="text-xs text-red-400 mt-1 block">{errors.postalCode}</span>
                        )}
                      </div>
                    </div>

                    {/* Country Selector */}
                    <div>
                      <label htmlFor={countryId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Country / Territory <span className="text-accent">*</span>
                      </label>
                      <select
                        id={countryId}
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 rounded-2xl bg-[#141418] border border-white/10 text-white text-sm focus:outline-none focus:border-accent"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="Canada">Canada</option>
                        <option value="Japan">Japan</option>
                        <option value="Australia">Australia</option>
                        <option value="Singapore">Singapore</option>
                      </select>
                    </div>

                    {/* Shipping Method Options */}
                    <div className="pt-3">
                      <span className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                        Delivery Method
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={cn(
                            'flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all',
                            formData.shippingMethod === 'express'
                              ? 'bg-accent/10 border-accent text-white'
                              : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20'
                          )}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="express"
                            checked={formData.shippingMethod === 'express'}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, shippingMethod: 'express' }))
                            }
                            className="mt-1 accent-accent"
                          />
                          <div>
                            <span className="font-bold text-sm block text-white">
                              Worldwide Carbon Express
                            </span>
                            <span className="text-xs text-white/50 block">2-4 Business Days</span>
                            <span className="text-xs font-mono font-bold text-emerald-400 mt-1 block">
                              {shipping === 0 ? 'FREE' : `$${shipping}`}
                            </span>
                          </div>
                        </label>

                        <label
                          className={cn(
                            'flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all',
                            formData.shippingMethod === 'priority'
                              ? 'bg-accent/10 border-accent text-white'
                              : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20'
                          )}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="priority"
                            checked={formData.shippingMethod === 'priority'}
                            onChange={() =>
                              setFormData((prev) => ({ ...prev, shippingMethod: 'priority' }))
                            }
                            className="mt-1 accent-accent"
                          />
                          <div>
                            <span className="font-bold text-sm block text-white">
                              Priority Dedicated Courier
                            </span>
                            <span className="text-xs text-white/50 block">Next-Day White Glove</span>
                            <span className="text-xs font-mono font-bold text-white mt-1 block">
                              $25.00
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Contact
                    </button>
                    <Button size="lg" withArrow onClick={nextStep}>
                      Continue to Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {currentStep === 'payment' && (
                <motion.form
                  key="payment-step"
                  onSubmit={handleCompleteOrder}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.35 }}
                  className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-white/10 shadow-xl flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Payment Details
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-white/40">Step 3 of 3</span>
                  </div>

                  {/* Realistic Demo Notice Badge */}
                  <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Demo Mode: Simulated 256-bit checkout environment. No real funds will be charged.
                    </span>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
                    {[
                      { id: 'card', label: 'Credit Card', icon: CreditCard },
                      { id: 'apple', label: 'Apple Pay', icon: Lock },
                      { id: 'crypto', label: 'Web3 / Crypto', icon: Sparkles },
                    ].map((method) => {
                      const isSelected = formData.paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: method.id as FormData['paymentMethod'],
                            }))
                          }
                          className={cn(
                            'py-2.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                            isSelected
                              ? 'bg-white text-black font-semibold shadow-md'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          )}
                        >
                          <method.icon className="w-3.5 h-3.5" />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {formData.paymentMethod === 'card' ? (
                    <div className="flex flex-col gap-4">
                      {/* Cardholder Name */}
                      <div>
                        <label htmlFor={cardholderNameId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                          Cardholder Name <span className="text-accent">*</span>
                        </label>
                        <input
                          id={cardholderNameId}
                          type="text"
                          name="cardholderName"
                          placeholder="John Doe"
                          value={formData.cardholderName}
                          onChange={handleInputChange}
                          className={cn(
                            'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm placeholder:text-white/30 focus:outline-none transition-all',
                            errors.cardholderName
                              ? 'border-red-500 ring-1 ring-red-500'
                              : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                          )}
                        />
                        {errors.cardholderName && (
                          <span className="text-xs text-red-400 mt-1 block">
                            {errors.cardholderName}
                          </span>
                        )}
                      </div>

                      {/* Card Number */}
                      <div>
                        <label htmlFor={cardNumberId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                          Card Number <span className="text-accent">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id={cardNumberId}
                            type="text"
                            placeholder="4000 1234 5678 9010"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className={cn(
                              'w-full h-12 pl-4 pr-12 rounded-2xl bg-white/[0.04] border text-white text-sm font-mono placeholder:text-white/30 focus:outline-none transition-all',
                              errors.cardNumber
                                ? 'border-red-500 ring-1 ring-red-500'
                                : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                            )}
                          />
                          <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        </div>
                        {errors.cardNumber && (
                          <span className="text-xs text-red-400 mt-1 block">
                            {errors.cardNumber}
                          </span>
                        )}
                      </div>

                      {/* Expiry & CVV Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={expiryId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                            Expiration (MM/YY) <span className="text-accent">*</span>
                          </label>
                          <input
                            id={expiryId}
                            type="text"
                            placeholder="12/28"
                            value={formData.expiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className={cn(
                              'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm font-mono placeholder:text-white/30 focus:outline-none transition-all',
                              errors.expiry
                                ? 'border-red-500 ring-1 ring-red-500'
                                : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                            )}
                          />
                          {errors.expiry && (
                            <span className="text-xs text-red-400 mt-1 block">{errors.expiry}</span>
                          )}
                        </div>

                        <div>
                          <label htmlFor={cvvId} className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                            CVV / CVC <span className="text-accent">*</span>
                          </label>
                          <input
                            id={cvvId}
                            type="password"
                            placeholder="•••"
                            value={formData.cvv}
                            onChange={handleCvvChange}
                            maxLength={4}
                            className={cn(
                              'w-full h-12 px-4 rounded-2xl bg-white/[0.04] border text-white text-sm font-mono placeholder:text-white/30 focus:outline-none transition-all',
                              errors.cvv
                                ? 'border-red-500 ring-1 ring-red-500'
                                : 'border-white/10 focus:border-accent focus:ring-1 focus:ring-accent'
                            )}
                          />
                          {errors.cvv && (
                            <span className="text-xs text-red-400 mt-1 block">{errors.cvv}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center flex flex-col items-center gap-3">
                      <Lock className="w-8 h-8 text-accent" />
                      <h3 className="text-base font-bold text-white">
                        {formData.paymentMethod === 'apple'
                          ? 'Apple Pay Ready'
                          : 'Web3 Wallet Connect'}
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        You will be prompted to authenticate seamlessly using your biometric key or
                        browser wallet once you submit the order.
                      </p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Shipping
                    </button>
                    <Button
                      size="lg"
                      variant="primary"
                      type="submit"
                      disabled={isProcessing}
                      className="px-8 font-semibold shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
                    >
                      {isProcessing ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                          Authorizing...
                        </span>
                      ) : (
                        `Pay $${formData.shippingMethod === 'priority' ? total + 10 : total}`
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
            <div className="hidden lg:block lg:col-span-5 sticky top-28">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#121217]/90 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white tracking-tight">Order Summary</h3>
                  <span className="text-xs font-mono text-white/50">
                    {items.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 divide-y divide-white/5">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor || ''}`}
                      className="py-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.product.imageUrl}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-white/10"
                          />
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black text-white text-[10px] font-mono font-bold flex items-center justify-center border border-white/20">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {item.product.name}
                          </p>
                          <p className="text-[11px] text-white/40">
                            {item.selectedColor || item.product.category}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-semibold text-white">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Breakdown */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">${subtotal}</span>
                  </div>

                  <div className="flex items-center justify-between text-white/70">
                    <span>Shipping</span>
                    <span className="font-mono text-white">
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        `$${shipping}`
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Promo Discount ({appliedPromo})</span>
                      <span className="font-mono font-semibold">-${discount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-white/70">
                    <span>Carbon-Neutral Offset</span>
                    <span className="font-mono text-white/50">$0.00 (Included)</span>
                  </div>

                  {/* Grand Total */}
                  <div className="flex items-baseline justify-between pt-4 border-t border-white/10 text-white">
                    <span className="text-base font-bold">Total Amount</span>
                    <span className="text-2xl font-bold font-mono text-white">
                      ${formData.shippingMethod === 'priority' ? total + 10 : total}
                    </span>
                  </div>
                </div>

                {/* Trust & Guarantee */}
                <div className="pt-2 border-t border-white/5 flex flex-col gap-2 text-[11px] text-white/50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>256-bit TLS Encrypted Transaction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-accent" />
                    <span>30-Day Risk-Free Audition with Free Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
