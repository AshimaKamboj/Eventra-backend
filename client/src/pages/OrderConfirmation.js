import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// This page is the callback endpoint Razorpay redirects to after payment.
// It will call the backend 'update' endpoint so the server can verify the payment
// then redirect the user to /explore (or show an error briefly).

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OrderConfirmation() {
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const payment_id = query.get('razorpay_payment_id');
    const payment_link_id = query.get('razorpay_payment_link_id');
    const payment_link_status = query.get('razorpay_payment_link_status');
    const signature = query.get('razorpay_signature');
    const reference_id = query.get('razorpay_payment_link_reference_id') || query.get('reference_id');

    // Call backend to confirm and update booking/payment status
    (async () => {
      try {
        const params = new URLSearchParams();
        if (payment_id) params.append('payment_id', payment_id);
        if (payment_link_id) params.append('payment_link_id', payment_link_id);
        if (payment_link_status) params.append('payment_link_status', payment_link_status);
        if (signature) params.append('razorpay_signature', signature);
        if (reference_id) params.append('order_id', reference_id);

        // backend endpoint expects query params
        const res = await fetch(`/api/payment/update?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) {
          console.error('Payment update failed', data);
        }
      } catch (err) {
        console.error('Payment confirmation error', err);
      } finally {
        // Redirect to explore after a short delay so user sees the result briefly
        setTimeout(() => navigate('/explore'), 800);
      }
    })();
  }, [query, navigate]);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Thank you — processing your payment...</h2>
      <p>If everything is successful you will be redirected to Explore shortly.</p>
    </div>
  );
}
