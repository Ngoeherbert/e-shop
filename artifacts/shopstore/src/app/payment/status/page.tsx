'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentStatus } from '@/types/nowpayments';
import { Card } from '@/components/ui/card';

interface PaymentStatusData {
  payment_status: PaymentStatus;
  order_id: string;
  price_amount: number;
  pay_amount: number;
  pay_currency: string;
}

const STATUS_ICONS: Record<PaymentStatus, string> = {
  [PaymentStatus.Waiting]: '⏳',
  [PaymentStatus.Confirming]: '⏳',
  [PaymentStatus.Confirmed]: '✅',
  [PaymentStatus.Sending]: '⏳',
  [PaymentStatus.PartiallyPaid]: '⚠️',
  [PaymentStatus.Finished]: '✅',
  [PaymentStatus.Failed]: '❌',
  [PaymentStatus.Refunded]: '↩️',
  [PaymentStatus.Expired]: '❌',
};

const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.Waiting]: 'bg-yellow-50 border-yellow-200',
  [PaymentStatus.Confirming]: 'bg-yellow-50 border-yellow-200',
  [PaymentStatus.Confirmed]: 'bg-green-50 border-green-200',
  [PaymentStatus.Sending]: 'bg-blue-50 border-blue-200',
  [PaymentStatus.PartiallyPaid]: 'bg-orange-50 border-orange-200',
  [PaymentStatus.Finished]: 'bg-green-50 border-green-200',
  [PaymentStatus.Failed]: 'bg-red-50 border-red-200',
  [PaymentStatus.Refunded]: 'bg-gray-50 border-gray-200',
  [PaymentStatus.Expired]: 'bg-red-50 border-red-200',
};

const STATUS_TEXT_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.Waiting]: 'text-yellow-700',
  [PaymentStatus.Confirming]: 'text-yellow-700',
  [PaymentStatus.Confirmed]: 'text-green-700',
  [PaymentStatus.Sending]: 'text-blue-700',
  [PaymentStatus.PartiallyPaid]: 'text-orange-700',
  [PaymentStatus.Finished]: 'text-green-700',
  [PaymentStatus.Failed]: 'text-red-700',
  [PaymentStatus.Refunded]: 'text-gray-700',
  [PaymentStatus.Expired]: 'text-red-700',
};

const TERMINAL_STATUSES = [
  PaymentStatus.Finished,
  PaymentStatus.Failed,
  PaymentStatus.Expired,
  PaymentStatus.Refunded,
];

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  const [status, setStatus] = useState<PaymentStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTerminal, setIsTerminal] = useState(false);

  useEffect(() => {
    if (!paymentId) {
      setError('No payment ID provided');
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/pay/status?payment_id=${paymentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }
        const data: PaymentStatusData = await response.json();
        setStatus(data);

        if (TERMINAL_STATUSES.includes(data.payment_status)) {
          setIsTerminal(true);
        }
      } catch (err) {
        console.error('Failed to fetch payment status:', err);
        setError('Failed to fetch payment status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Poll every 5 seconds if not in terminal state
    if (!isTerminal) {
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [paymentId, isTerminal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment status...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-8 text-center">
          <p className="text-red-600 font-semibold mb-4">Error</p>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-8 text-center">
          <p className="text-gray-600">No payment data available</p>
        </Card>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[status.payment_status];
  const statusTextColor = STATUS_TEXT_COLORS[status.payment_status];
  const statusIcon = STATUS_ICONS[status.payment_status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className={`w-full max-w-md p-8 border-2 ${statusColor}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">{statusIcon}</div>
          <h1 className={`text-2xl font-bold mb-2 ${statusTextColor}`}>
            {status.payment_status.charAt(0).toUpperCase() +
              status.payment_status.slice(1).replace(/_/g, ' ')}
          </h1>

          <div className="bg-white rounded-lg p-4 my-6 space-y-3">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono text-sm font-semibold">{status.order_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-lg font-semibold">
                ${status.price_amount.toFixed(2)} USD
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid Amount</p>
              <p className="text-lg font-semibold">
                {status.pay_amount} {status.pay_currency.toUpperCase()}
              </p>
            </div>
          </div>

          {!isTerminal && (
            <div className="flex justify-center mb-4">
              <div className="animate-pulse flex gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          )}

          {status.payment_status === PaymentStatus.Finished && (
            <p className="text-green-600 text-sm font-medium">
              Your payment has been successfully processed!
            </p>
          )}

          {status.payment_status === PaymentStatus.Failed && (
            <p className="text-red-600 text-sm font-medium">
              Payment failed. Please try again.
            </p>
          )}

          {status.payment_status === PaymentStatus.Expired && (
            <p className="text-red-600 text-sm font-medium">
              Payment has expired. Please create a new payment.
            </p>
          )}

          {status.payment_status === PaymentStatus.PartiallyPaid && (
            <p className="text-orange-600 text-sm font-medium">
              Partial payment received. Please review your order.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
