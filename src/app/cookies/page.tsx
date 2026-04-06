import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy - SafeCheck AI',
  description: 'Cookie policy for SafeCheck AI scam detection service'
};

export default function CookiePolicyPage() {
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Cookie Policy</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>1. What Are Cookies</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Cookies are small text files stored on your device when you visit websites. They help remember your preferences and improve your browsing experience.
          </p>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>2. How We Use Cookies</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            SafeCheck AI uses minimal cookies:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Authentication</strong> - To keep you signed in (session cookie, expires in 1 hour)</li>
            <li><strong>Preferences</strong> - To remember your settings</li>
            <li><strong>Analytics</strong> - Anonymous usage statistics to improve our service</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>3. Types of Cookies We Use</h2>
          
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem' }}>Essential Cookies</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Required for the service to function. These cannot be disabled.
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Session authentication (NextAuth.js)</li>
            <li>CSRF protection tokens</li>
          </ul>

          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', marginTop: '1rem' }}>Analytics Cookies</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Help us understand how the service is used.
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Page views and navigation patterns</li>
            <li>Feature usage statistics</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>4. What We Do NOT Use</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            We believe in privacy. We do NOT use:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Tracking cookies for advertising</li>
            <li>Cross-site tracking cookies</li>
            <li>Third-party advertising cookies</li>
            <li>Cookies for profiling or personalization</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>5. Managing Cookies</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            You can control or delete cookies:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Browser settings</strong> - Most browsers let you manage cookies</li>
            <li><strong>Incognito mode</strong> - Use for no cookie storage</li>
            <li><strong>Logout</strong> - Clears session cookies</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>6. Cookie Durations</h2>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Session cookies</strong> - Deleted when you close the browser</li>
            <li><strong>Authentication</strong> - Expires after 1 hour of inactivity</li>
            <li><strong>Remember me</strong> - Up to 30 days (if enabled)</li>
            <li><strong>Analytics</strong> - Typically 6-12 months</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>7. Third-Party Cookies</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            We may use minimal third-party services:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>NextAuth.js</strong> - Authentication provider (session management)</li>
            <li><strong>OpenRouter</strong> - Optional AI analysis (no cookies on our domain)</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>8. Updates to This Policy</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            We may update this cookie policy. Check this page periodically for changes. Your continued use constitutes acceptance.
          </p>
        </section>
      </div>
    </div>
  );
}