import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Introduction</h2>
        <p>
          We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our SEO analysis tools.
        </p>

        <h2>2. Data We Collect</h2>
        <ul>
          <li>Email address for account creation</li>
          <li>Usage data and analytics</li>
          <li>Payment information (processed securely by Stripe)</li>
          <li>Website URLs and content submitted for analysis</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <ul>
          <li>To provide and maintain our services</li>
          <li>To process your payments</li>
          <li>To send you important updates about our services</li>
          <li>To improve our services</li>
        </ul>

        <h2>4. Data Storage</h2>
        <p>
          We use Firebase for secure data storage. Your data is stored in accordance with industry-standard security practices.
        </p>

        <h2>5. Your Rights (GDPR)</h2>
        <p>Under GDPR, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to data processing</li>
          <li>Data portability</li>
        </ul>

        <h2>6. Contact Us</h2>
        <p>
          For any privacy-related questions, please contact us at: privacy@yourdomain.com
        </p>
      </div>
    </div>
  );
}