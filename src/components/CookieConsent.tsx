import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="text-sm text-gray-700">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              <button
                onClick={() => window.location.href = '/cookies'}
                className="text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Learn more
              </button>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Accept
            </button>
            <button
              onClick={() => setShow(false)}
              className="p-1 text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}