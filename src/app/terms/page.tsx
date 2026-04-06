import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions - SafeCheck AI',
  description: 'Terms and conditions for using SafeCheck AI service'
};

export default function TermsPage() {
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Terms & Conditions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            By accessing and using SafeCheck AI, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>2. Use License</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Permission is granted to temporarily use SafeCheck AI for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            You may NOT:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software contained in the service</li>
            <li>Remove any copyright or proprietary notations</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>3. Disclaimer of Service</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            SafeCheck AI is provided "as is". We make no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of the detection results.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            <strong>Important:</strong> This service is designed to assist with scam detection but should not be the sole basis for financial decisions. Always verify with official sources.
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>We do not guarantee 100% accuracy</li>
            <li>Results are based on AI analysis and rule-based detection</li>
            <li>New scam patterns may not be detected immediately</li>
            <li>False positives/negatives may occur</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>4. Limitation of Liability</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            In no event shall SafeCheck AI be liable for any damages arising out of or in connection with the use of this service. This includes:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Financial losses due to scams not detected</li>
            <li>Data loss or corruption</li>
            <li>Service interruption</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>5. User Responsibilities</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            When using SafeCheck AI, you agree to:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>Not use the service for illegal purposes</li>
            <li>Not attempt to harm or abuse the service</li>
            <li>Not submit false reports of scams</li>
            <li>Not try to bypass security measures</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>6. User Reports</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            When you report a scam, you confirm that:
          </p>
          <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
            <li>The information you provide is accurate</li>
            <li>You have the right to submit the report</li>
            <li>Your report helps improve scam detection for all users</li>
          </ul>
        </section>

        <section className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>7. Changes to Terms</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            We reserve the right to modify these terms at any time. Continued use of SafeCheck AI after changes constitutes acceptance of new terms.
          </p>
        </section>
      </div>
    </div>
  );
}