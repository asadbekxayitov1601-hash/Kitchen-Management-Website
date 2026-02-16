import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { authFetch } from "../auth/authFetch";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "sonner";
import { cn } from "./ui/utils";

interface SubscriptionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
    const { user, refresh } = useAuth();
    const [step, setStep] = useState<'plan' | 'payment' | 'otp'>('plan');
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'weekly' | 'monthly' | 'yearly' | null>('monthly');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [otp, setOtp] = useState('');

    // Reset state when closed
    useEffect(() => {
        if (!open) {
            setStep('plan');
            setCardNumber('');
            setExpiry('');
            setOtp('');
            setTransactionId('');
        }
    }, [open]);

    const handlePlanSelect = () => {
        if (!selectedPlan) return;
        // If user already has a card, maybe skip directly to subscribe? 
        // For now, let's always show payment method selection if we were to support multiple, 
        // but strictly following flow: "The user enters their 16-digit card..." implies new card entry.
        // However, if they have one linked, we should offer to use it.
        if (user?.cardLast4) {
            // Skip card input if user wants to use existing card (simple flow)
            // But let's give them a choice in the payment step? 
            // To keep it simple as per prompt "One click" after saving:
            setStep('payment');
        } else {
            setStep('payment');
        }
    };

    const handleVerifyCard = async () => {
        setLoading(true);
        try {
            // Validate input
            if (cardNumber.replace(/\s/g, '').length !== 16) {
                toast.error('Card number must be 16 digits');
                return;
            }
            // Mock API call to gateway
            const res = await authFetch('/api/payment/verify-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardNumber, expiry })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Verification failed');

            setTransactionId(data.transactionId);
            setStep('otp');
            toast.success(data.message);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmOtp = async () => {
        setLoading(true);
        try {
            // Confirm OTP and Subscribe
            const res = await authFetch('/api/payment/confirm-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId, otp, cardNumber })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'OTP Verification failed');

            // Token received, now subscribe
            await performSubscription({ cardToken: data.cardToken });

        } catch (e: any) {
            toast.error(e.message);
            setLoading(false);
        }
    };

    const performSubscription = async ({ cardToken }: { cardToken?: string } = {}) => {
        try {
            const res = await authFetch('/api/subscribe/pro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: selectedPlan, cardToken })
            });

            if (!res.ok) throw new Error('Subscription failed');

            await refresh();
            toast.success('Successfully subscribed to Pro!');
            onOpenChange(false);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUseSavedCard = async () => {
        setLoading(true);
        await performSubscription(); // uses existing token on backend or nothing if logic required token
    };

    // Formatters
    const formatCardNumber = (val: string) => {
        const v = val.replace(/\D/g, '').slice(0, 16);
        return v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    };

    const formatExpiry = (val: string) => {
        const v = val.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
        return v;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-4">
                        {step === 'plan' ? 'Upgrade to Pro' : step === 'payment' ? 'Payment Method' : 'Enter SMS Code'}
                    </DialogTitle>
                </DialogHeader>

                {step === 'plan' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Weekly */}
                            <div
                                onClick={() => setSelectedPlan('weekly')}
                                className={cn(
                                    "cursor-pointer border rounded-xl p-6 transition-all duration-200 flex flex-col gap-4 relative",
                                    selectedPlan === 'weekly'
                                        ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary ring-offset-2"
                                        : "hover:border-primary/50"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">Weekly</h3>
                                    {selectedPlan === 'weekly' && <Check className="w-5 h-5 text-primary" />}
                                </div>
                                <div className="text-2xl font-bold">15,000 UZS</div>
                                <ul className="text-sm space-y-2 text-gray-600 flex-1">
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Access all Pro recipes</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Smart Pantry access</li>
                                </ul>
                            </div>

                            {/* Monthly */}
                            <div
                                onClick={() => setSelectedPlan('monthly')}
                                className={cn(
                                    "cursor-pointer border rounded-xl p-6 transition-all duration-200 relative flex flex-col gap-4",
                                    selectedPlan === 'monthly'
                                        ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary ring-offset-2"
                                        : "border-primary/20 hover:border-primary/50"
                                )}
                            >
                                <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-xl">
                                    Popular
                                </div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg text-primary">Monthly</h3>
                                    {selectedPlan === 'monthly' && <Check className="w-5 h-5 text-primary" />}
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 line-through">60,000 UZS</div>
                                    <div className="text-3xl font-bold">50,000 UZS</div>
                                </div>
                                <ul className="text-sm space-y-2 text-gray-600 flex-1">
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-primary" /> All Weekly features</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-primary" /> Save 17%</li>
                                </ul>
                            </div>

                            {/* Yearly */}
                            <div
                                onClick={() => setSelectedPlan('yearly')}
                                className={cn(
                                    "cursor-pointer border rounded-xl p-6 transition-all duration-200 flex flex-col gap-4 relative",
                                    selectedPlan === 'yearly'
                                        ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary ring-offset-2"
                                        : "hover:border-primary/50"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-lg">Yearly</h3>
                                    {selectedPlan === 'yearly' && <Check className="w-5 h-5 text-primary" />}
                                </div>
                                <div>
                                    <div className="text-sm text-gray-400 line-through">600,000 UZS</div>
                                    <div className="text-2xl font-bold">500,000 UZS</div>
                                </div>
                                <ul className="text-sm space-y-2 text-gray-600 flex-1">
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> All Pro features</li>
                                    <li className="flex gap-2"><Check className="w-4 h-4 text-green-500" /> Best value</li>
                                </ul>
                            </div>
                        </div>
                        <Button
                            onClick={handlePlanSelect}
                            disabled={!selectedPlan}
                            className="w-full py-6 text-lg font-semibold shadow-lg shadow-primary/20"
                        >
                            Continue
                        </Button>
                    </div>
                )}

                {step === 'payment' && (
                    <div className="max-w-md mx-auto w-full space-y-6">
                        {user?.cardLast4 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Card</h3>
                                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-gray-300 rounded overflow-hidden relative">
                                            {/* Mock Card Icon */}
                                            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white opacity-50" />
                                        </div>
                                        <span className="font-mono text-gray-900">•••• •••• •••• {user.cardLast4}</span>
                                    </div>
                                    <Button onClick={handleUseSavedCard} disabled={loading} size="sm">
                                        Use this card
                                    </Button>
                                </div>
                                <div className="relative my-6 text-center">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                                    <span className="relative bg-white px-2 text-xs text-gray-500">OR PAY WITH NEW CARD</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="8600 0000 0000 0000"
                                    value={cardNumber}
                                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/50 outline-none font-mono text-lg"
                                    maxLength={19}
                                />
                                <p className="text-xs text-gray-500 mt-1">Uzum, Humo, or Visa</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary/50 outline-none font-mono text-lg"
                                    maxLength={5}
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                <Check className="w-4 h-4" />
                                No CVV required for local cards
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep('plan')} className="flex-1">
                                Back
                            </Button>
                            <Button onClick={handleVerifyCard} disabled={loading || cardNumber.length < 19 || expiry.length < 5} className="flex-1">
                                {loading ? 'Processing...' : 'Verify Card'}
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'otp' && (
                    <div className="max-w-md mx-auto w-full space-y-6 text-center">
                        <div>
                            <p className="text-gray-600 mb-1">We sent a verification code to your phone</p>
                            <p className="text-sm text-gray-500">Enter code <span className="font-mono font-bold">1111</span> to test</p>
                        </div>

                        <div className="flex justify-center">
                            <input
                                type="text"
                                value={otp}
                                onChange={e => setOtp(e.target.value.substring(0, 4))}
                                className="w-32 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                                maxLength={4}
                                placeholder="0000"
                            />
                        </div>

                        <Button onClick={handleConfirmOtp} disabled={loading || otp.length !== 4} className="w-full py-6 text-lg">
                            {loading ? 'Verifying...' : 'Confirm & Pay'}
                        </Button>

                        <button onClick={() => setStep('payment')} className="text-sm text-gray-500 hover:text-gray-900 underline">
                            Change payment method
                        </button>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}
