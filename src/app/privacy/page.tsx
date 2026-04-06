import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - SafeCheck AI',
  description: 'Privacy policy for SafeCheck AI scam detection service'
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Shield size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>1. Information We Collect</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            SafeCheck AI is designed to protect your privacy. We collect minimal data:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Input data</strong> - The SMS or URL you paste for analysis (processed locally or temporarily)</li>
            <li><strong>Scan history</strong> - Stored locally on your device (not synced to servers)</li>
            <li><strong>Basic analytics</strong> - Anonymous usage statistics to improve our service</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>2. How We Use Your Information</h2>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>To provide scam detection and analysis services</li>
            <li>To improve our AI detection accuracy</li>
            <li>To store your scan history locally (with your permission)</li>
            <li>To respond to scam reports you submit</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>3. Data Storage & Security</h2>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Local storage</strong> - Your scan history is stored locally on your device</li>
            <li><strong>Auto-expiring data</strong> - Session data automatically expires after 1 hour</li>
            <li><strong>Tamper protection</strong> - Data is signed to prevent modification</li>
            <li><strong>No cloud sync</strong> - We do not store your data on external servers</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>4. Information We Do NOT Collect</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            We are committed to privacy. We do NOT collect:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Passwords or login credentials</li>
            <li>Financial information or banking details</li>
            <li>OTPs or verification codes</li>
            <li>Personal identification documents</li>
            <li>Device identifiers for tracking</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>5. Third-Party Services</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            We may use the following third-party services:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>OpenRouter AI</strong> - Optional AI analysis (your input is not stored)</li>
            <li><strong>Analytics</strong> - Anonymous usage statistics</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            These services act as data processors and are bound by confidentiality agreements.
          </p>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>6. Your Rights</h2>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Access</strong> - Request a copy of your data</li>
            <li><strong>Deletion</strong> - Request removal of your scan history</li>
            <li><strong>Opt-out</strong> - Use the service without creating an account</li>
            <li><strong>Logout</strong> - Clear all session data instantly</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>7. Contact Us</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            If you have questions about this Privacy Policy, please contact us through the app feedback form.
          </p>
        </section>
      </div>
    </div>
  );
}