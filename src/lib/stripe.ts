import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Base payment link URLs - using test mode links
const BASE_PAYMENT_LINKS = {
  basic: 'https://buy.stripe.com/28o6r74Oi2sxagUeUX',
  plus: 'https://buy.stripe.com/eVa9Dj3KeaZ3bkYfZ0',
  pro: 'https://buy.stripe.com/fZe9Dj3Ke5EJcp2aEF'
} as const;

// Store signup data in session storage
export function storeSignupData(email: string, password: string, plan: string) {
  sessionStorage.setItem('pendingSignup', JSON.stringify({ 
    email, 
    password, 
    plan,
    timestamp: Date.now()
  }));
}

// Clear signup data
export function clearSignupData() {
  sessionStorage.removeItem('pendingSignup');
}

// Get stored signup data
export function getStoredSignupData() {
  const data = sessionStorage.getItem('pendingSignup');
  if (!data) return null;

  const signupData = JSON.parse(data);
  
  // Check if data is less than 1 hour old
  const ONE_HOUR = 60 * 60 * 1000;
  if (Date.now() - signupData.timestamp > ONE_HOUR) {
    clearSignupData();
    return null;
  }

  return signupData;
}

export async function redirectToPaymentLink(plan: keyof typeof BASE_PAYMENT_LINKS) {
  try {
    const signupData = getStoredSignupData();
    if (!signupData) {
      throw new Error('No signup data found');
    }

    // Get the base payment link URL
    const baseUrl = BASE_PAYMENT_LINKS[plan];
    
    // Add success and cancel URL parameters
    // Include a success parameter that will trigger account creation
    const successUrl = `https://ezseobasics.com?success=true&email=${encodeURIComponent(signupData.email)}`;
    const cancelUrl = `${window.location.origin}/?canceled=true`;
    
    // Construct the full URL with parameters
    const paymentUrl = `${baseUrl}?success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
    
    // Open in new tab to avoid browser blocking
    window.open(paymentUrl, '_blank');
  } catch (error) {
    console.error('Payment redirect error:', error);
    throw error;
  }
}

export function verifyPaymentSuccess(ref: string) {
  try {
    const signupData = getStoredSignupData();
    if (!signupData) {
      return null;
    }

    // Return the data and clear storage
    clearSignupData();
    return signupData;
  } catch (error) {
    console.error('Payment verification error:', error);
    return null;
  }
}