import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-white border-t mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/cookies')}
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="mailto:support@yourdomain.com" className="text-base text-gray-600 hover:text-gray-900">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
            <p className="mt-4 text-base text-gray-600">
              © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}