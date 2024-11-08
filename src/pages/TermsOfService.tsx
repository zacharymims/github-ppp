import React from 'react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>

        <h2>2. Subscription and Payments</h2>
        <ul>
          <li>Subscription fees are billed monthly or annually</li>
          <li>All payments are processed securely through Stripe</li>
          <li>Refunds are handled on a case-by-case basis</li>
        </ul>

        <h2>3. Usage Limits</h2>
        <p>
          Each subscription plan has specific usage limits. Exceeding these limits may result in temporary service restrictions.
        </p>

        <h2>4. User Responsibilities</h2>
        <ul>
          <li>Maintain accurate account information</li>
          <li>Protect your account credentials</li>
          <li>Use the service in compliance with all applicable laws</li>
        </ul>

        <h2>5. Service Availability</h2>
        <p>
          While we strive for 100% uptime, we cannot guarantee uninterrupted access to our services.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All content and functionality of our services are protected by intellectual property rights.
        </p>

        <h2>7. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to our services for violations of these terms.
        </p>

        <h2>8. Contact</h2>
        <p>
          For questions about these terms, please contact: legal@yourdomain.com
        </p>
      </div>
    </div>
  );
}