export type PaymentMethodId = 'COD' | 'Razorpay' | 'UPI' | 'Card';

export interface PaymentDetails {
  orderId: string;
  amount: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  error?: string;
}

export interface PaymentProcessor {
  id: PaymentMethodId;
  name: string;
  description: string;
  isAvailable: boolean;
  comingSoonMessage?: string;
  processPayment: (details: PaymentDetails) => Promise<PaymentResult>;
}

export const CodProcessor: PaymentProcessor = {
  id: 'COD',
  name: 'Cash on Delivery',
  description: 'Pay with cash upon delivery.',
  isAvailable: true,
  processPayment: async (details: PaymentDetails): Promise<PaymentResult> => {
    // Cash on Delivery is processed automatically with a Pending status
    return {
      success: true,
      paymentStatus: 'Pending',
    };
  }
};

export const RazorpayProcessor: PaymentProcessor = {
  id: 'Razorpay',
  name: 'Online Payment',
  description: 'Credit Card, Debit Card, Netbanking, or UPI.',
  isAvailable: false,
  comingSoonMessage: 'Online Payments will be available soon.',
  processPayment: async (details: PaymentDetails): Promise<PaymentResult> => {
    // Razorpay Integration Placeholder
    console.log('Razorpay processor initialized for details:', details);
    return {
      success: false,
      paymentStatus: 'Failed',
      error: 'Razorpay payment gateway integration is currently pending activation.'
    };
  }
};

export const UpiProcessor: PaymentProcessor = {
  id: 'UPI',
  name: 'UPI Transfer',
  description: 'Instant transfer via UPI apps.',
  isAvailable: false,
  comingSoonMessage: 'UPI payments will be available soon.',
  processPayment: async (details: PaymentDetails): Promise<PaymentResult> => {
    return {
      success: false,
      paymentStatus: 'Failed',
      error: 'UPI payments are coming soon.'
    };
  }
};

export const CardProcessor: PaymentProcessor = {
  id: 'Card',
  name: 'Card Payment',
  description: 'Credit or Debit cards.',
  isAvailable: false,
  comingSoonMessage: 'Card payments will be available soon.',
  processPayment: async (details: PaymentDetails): Promise<PaymentResult> => {
    return {
      success: false,
      paymentStatus: 'Failed',
      error: 'Card payments are coming soon.'
    };
  }
};

export const PaymentProcessors: Record<PaymentMethodId, PaymentProcessor> = {
  COD: CodProcessor,
  Razorpay: RazorpayProcessor,
  UPI: UpiProcessor,
  Card: CardProcessor
};

export const getAvailableProcessors = (): PaymentProcessor[] => {
  return Object.values(PaymentProcessors);
};
