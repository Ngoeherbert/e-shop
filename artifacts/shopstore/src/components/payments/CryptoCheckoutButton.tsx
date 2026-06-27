'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CryptoCheckoutButtonProps {
  orderId: string;
  amount: number;
  description: string;
}

export function CryptoCheckoutButton({
  orderId,
  amount,
  description,
}: CryptoCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('btc');
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setCurrenciesLoading(true);
        const response = await fetch('/api/pay/currencies');
        if (!response.ok) throw new Error('Failed to fetch currencies');
        const currencies = await response.json();
        setAvailableCurrencies(currencies);
        if (currencies.length > 0) {
          setSelectedCurrency(currencies[0]);
        }
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
        setAvailableCurrencies(['btc', 'eth', 'xrp', 'ltc']);
        setSelectedCurrency('btc');
      } finally {
        setCurrenciesLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_amount: amount,
          price_currency: 'usd',
          pay_currency: selectedCurrency,
          order_id: orderId,
          order_description: description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create payment');
      }

      const { invoiceUrl } = await response.json();
      if (invoiceUrl) {
        window.location.href = invoiceUrl;
      } else {
        throw new Error('No invoice URL returned');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          disabled={loading || currenciesLoading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {availableCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency.toUpperCase()}
            </option>
          ))}
        </select>
        <Button
          onClick={handleCheckout}
          disabled={loading || currenciesLoading}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay with Crypto'
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
