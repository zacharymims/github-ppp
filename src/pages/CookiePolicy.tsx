import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      
      <div className="prose prose-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device when you visit our website. They help us provide and improve our services.
        </p>

        <h2>2. Cookies We Use</h2>
        <h3>Essential Cookies</h3>
        <ul>
          <li>Authentication cookies</li>
          <li>Security cookies</li>
          <li>Session management</li>
        </ul>

        <h3>Analytics Cookies</h3>
        <ul>
          <li>Usage patterns</li>
          <li>Performance monitoring</li>
        </ul>

        <h2>3. Managing Cookies</h2>
        <p>
          You can control cookies through your browser settings. However, disabling certain cookies may limit functionality.
        </p>

        <h2>4. Third-Party Cookies</h2>
        <p>We use cookies from:</p>
        <ul>
          <li>Firebase (Authentication)</li>
          <li>Stripe (Payments)</li>
          <li>Analytics services</li>
        </ul>

        <h2>5. Updates to This Policy</h2>
        <p>
          We may update this policy periodically. Continue checking this page for the latest information.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          Questions about our cookie policy? Contact: privacy@yourdomain.com
        </p>
      </div>
    </div>
  );
}