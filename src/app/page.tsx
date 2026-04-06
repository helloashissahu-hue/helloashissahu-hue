"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Link2, 
  History,
  Flag,
  ChevronRight,
  Loader2,
  AlertTriangle as WarningIcon,
  Scissors,
  Lock,
  Globe,
  Info,
  LogOut
} from 'lucide-react';
import { 
  setSecureData, 
  getSecureData, 
  removeSecureData, 
  cleanupSecureStorage,
  logout 
} from '@/lib/secureStorage';

type ScanResult = {
  status: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  confidence: number;
  reasons: string[];
  riskyWords: string[];
  inputType: 'SMS' | 'URL';
};

type UrlCheckResult = {
  url: string;
  domain: string;
  isSecure: boolean;
  hasSsl: boolean;
  isShortened: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  details: string[];
};

type ScanHistoryItem = ScanResult & { id: string; inputText: string; createdAt: string };

type Page = 'home' | 'result' | 'url-check' | 'url-result' | 'report' | 'history';

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [input, setInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [urlResult, setUrlResult] = useState<UrlCheckResult | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [reportContent, setReportContent] = useState('');
  const [reportCategory, setReportCategory] = useState('loan_scam');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'SAFE' | 'SUSPICIOUS' | 'SCAM'>('all');

  useEffect(() => {
    const initStorage = async () => {
      await cleanupSecureStorage();
      try {
        const stored = await getSecureData<ScanHistoryItem[]>('history');
        if (stored) {
          setHistory(stored);
        } else {
          setHistory([]);
        }
      } catch {
        setHistory([]);
      }
    };
    initStorage();
  }, []);

  const saveToHistory = async (item: ScanHistoryItem) => {
    const newHistory = [item, ...history].slice(0, 50);
    setHistory(newHistory);
    await setSecureData('history', newHistory);
  };

  const handleScan = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
        
        const historyItem: ScanHistoryItem = {
          ...data,
          id: `scan_${Date.now()}`,
          inputText: input.trim(),
          createdAt: new Date().toISOString()
        };
        saveToHistory(historyItem);
        
        if (data.inputType === 'URL') {
          setUrlInput(input.trim());
          setCurrentPage('url-result');
        } else {
          setCurrentPage('result');
        }
      } else {
        alert(data.error || 'Failed to scan. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlCheck = async () => {
    if (!urlInput.trim()) return;
    
    setIsLoading(true);
    setUrlResult(null);
    
    try {
      const response = await fetch('/api/url-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUrlResult(data);
        setCurrentPage('url-result');
      } else {
        alert(data.error || 'Failed to check URL. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlereportSubmit = async () => {
    if (!reportContent.trim()) return;
    
    setIsLoading(true);
    
    try {
      await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: reportContent.trim(),
          category: reportCategory,
          description: reportDescription.trim()
        })
      });
      
      setReportSubmitted(true);
      setReportContent('');
      setReportDescription('');
    } catch {
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SAFE': return 'var(--safe)';
      case 'SUSPICIOUS': return 'var(--warning)';
      case 'SCAM': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'SAFE': return 'var(--safe-bg)';
      case 'SUSPICIOUS': return 'var(--warning-bg)';
      case 'SCAM': return 'var(--danger-bg)';
      default: return 'var(--surface)';
    }
  };

  const renderNav = () => (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ 
      background: 'rgba(10, 10, 10, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <nav className="nav-container">
        <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className="logo">
          SafeCheck <span className="logo-accent">AI</span>
        </a>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button onClick={() => setCurrentPage('home')} className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}>
            Home
          </button>
          <button onClick={() => setCurrentPage('url-check')} className={`nav-link ${currentPage === 'url-check' || currentPage === 'url-result' ? 'active' : ''}`}>
            URL Checker
          </button>
          <button onClick={() => setCurrentPage('report')} className={`nav-link ${currentPage === 'report' ? 'active' : ''}`}>
            Report
          </button>
          <button onClick={() => setCurrentPage('history')} className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}>
            History
          </button>
          <button 
            onClick={async () => {
              await cleanupSecureStorage();
              await logout();
              setHistory([]);
              setCurrentPage('home');
            }}
            className="nav-link"
            title="Clear session & logout"
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>
    </header>
  );

  const renderHome = () => (
    <>
      <section style={{ paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div className="animate-fade-in-up" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.375rem 1rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '2rem',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem'
          }}>
            <Shield size={14} style={{ color: 'var(--safe)' }} />
            AI-Powered Scam Detection
          </div>
          
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
            Detect Loan Scams &<br />
            <span style={{ color: 'var(--accent)' }}>Fraudulent Messages</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', marginBottom: '2rem' }}>
            Paste an SMS or link below to check if it's a scam. Our AI analyzes messages to keep you safe.
          </p>
          
          <div className="card" style={{ textAlign: 'left' }}>
            <textarea
              className="input-field"
              placeholder="Paste SMS message or URL here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleScan();
                }
              }}
              style={{ minHeight: '140px', marginBottom: '1rem' }}
            />
            <button
              className="btn-primary"
              onClick={handleScan}
              disabled={isLoading || !input.trim()}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Check Now
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>
            How It Works
          </h2>
          
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            <div className="card">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Search size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Paste Message
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                Copy any suspicious SMS, message, or link and paste it in the input box.
              </p>
            </div>
            
            <div className="card">
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--safe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Shield size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                AI Analysis
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                Our AI checks for scam patterns, suspicious keywords, and known fraud techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
            Common Scam Examples
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Learn to recognize these warning signs
          </p>
          
          <div style={{ textAlign: 'left' }}>
            <div className="card" style={{ marginBottom: '1rem', borderLeft: '3px solid var(--danger)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--danger)' }}>
                Loan Scam
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontFamily: 'monospace' }}>
                "Your loan of ₹5 lakh is approved. Instant cash, no collateral. Call now: 98765XXXXX"
              </p>
            </div>
            
            <div className="card" style={{ marginBottom: '1rem', borderLeft: '3px solid var(--danger)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--danger)' }}>
                OTP Fraud
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontFamily: 'monospace' }}>
                "Your Aadhaar has been suspended. Verify OTP 123456 to restore account immediately."
              </p>
            </div>
            
            <div className="card" style={{ borderLeft: '3px solid var(--warning)' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--warning)' }}>
                Phishing Link
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', fontFamily: 'monospace' }}>
                bit.ly/fake-bank Verify your account within 24 hours or lose access permanently."
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ padding: '2rem 1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          SafeCheck AI - Stay safe from online scams
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8125rem' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8125rem' }}>Terms</Link>
          <Link href="/cookies" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8125rem' }}>Cookie Policy</Link>
          <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8125rem' }}>Login</Link>
        </div>
      </footer>
    </>
  );

  const renderResult = () => (
    <section style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <button
          onClick={() => { setInput(''); setResult(null); setCurrentPage('home'); }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}
        >
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
          Back to Home
        </button>
        
        <div className="animate-fade-in-up">
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              {result?.status === 'SAFE' && <CheckCircle size={48} style={{ color: 'var(--safe)' }} />}
              {result?.status === 'SUSPICIOUS' && <WarningIcon size={48} style={{ color: 'var(--warning)' }} />}
              {result?.status === 'SCAM' && <XCircle size={48} style={{ color: 'var(--danger)' }} />}
              
              <div>
                <div className={`badge badge-${result?.status === 'SAFE' ? 'safe' : result?.status === 'SUSPICIOUS' ? 'warning' : 'danger'}`}>
                  {result?.status === 'SAFE' && '✅ Verified Safe'}
                  {result?.status === 'SUSPICIOUS' && '⚠️ Suspicious'}
                  {result?.status === 'SCAM' && '❌ Potential Scam'}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Confidence Score</span>
                <span style={{ fontWeight: 600 }}>{result?.confidence}%</span>
              </div>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${result?.confidence || 0}%`,
                    background: getStatusColor(result?.status || 'SAFE')
                  }} 
                />
              </div>
            </div>
          </div>
          
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Analysis</h3>
            {result?.reasons && result.reasons.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {result.reasons.map((reason, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }} />
                    {reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No specific concerns found in this message.</p>
            )}
          </div>
          
          {result?.riskyWords && result.riskyWords.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Flagged Keywords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.riskyWords.map((word, i) => (
                  <span key={i} className="risk-tag">{word}</span>
                ))}
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-danger" onClick={() => setCurrentPage('report')}>
              <Flag size={16} style={{ marginRight: '0.5rem' }} />
              Report This Scam
            </button>
            <button 
              className="btn-primary" 
              onClick={() => { setInput(''); setResult(null); setCurrentPage('home'); }}
            >
              <Search size={16} style={{ marginRight: '0.5rem' }} />
              Check Another
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderUrlCheck = () => (
    <section style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button
          onClick={() => { setUrlInput(''); setUrlResult(null); setCurrentPage('home'); }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}
        >
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
          Back
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          URL Safety Checker
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Enter a URL to check if it's safe to visit
        </p>
        
        <div className="card">
          <input
            type="url"
            className="input-field"
            placeholder="https://example.com or shortened URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
          <button
            className="btn-primary"
            onClick={handleUrlCheck}
            disabled={isLoading || !urlInput.trim()}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search size={18} />
                Check URL
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );

  const renderUrlResult = () => (
    <section style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button
          onClick={() => { setUrlInput(''); setUrlResult(null); setCurrentPage('url-check'); }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}
        >
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
          Back to URL Checker
        </button>
        
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            {urlResult?.riskLevel === 'LOW' && <CheckCircle size={40} style={{ color: 'var(--safe)' }} />}
            {urlResult?.riskLevel === 'MEDIUM' && <WarningIcon size={40} style={{ color: 'var(--warning)' }} />}
            {urlResult?.riskLevel === 'HIGH' && <XCircle size={40} style={{ color: 'var(--danger)' }} />}
            
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {urlResult?.riskLevel === 'LOW' && 'Low Risk'}
                {urlResult?.riskLevel === 'MEDIUM' && 'Medium Risk'}
                {urlResult?.riskLevel === 'HIGH' && 'High Risk'}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                URL Safety Analysis
              </div>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: urlResult?.hasSsl ? 'var(--safe-bg)' : 'var(--danger-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={20} style={{ color: urlResult?.hasSsl ? 'var(--safe)' : 'var(--danger)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Connection Security</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {urlResult?.hasSsl ? 'Secure (HTTPS)' : 'Not Secure (HTTP)'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: urlResult?.isShortened ? 'var(--warning-bg)' : 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Scissors size={20} style={{ color: urlResult?.isShortened ? 'var(--warning)' : 'var(--text-secondary)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>URL Type</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                {urlResult?.isShortened ? 'Shortened URL (original hidden)' : 'Direct URL'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px',
              background: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={20} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Domain</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                {urlResult?.domain}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Analysis Details</h3>
          {urlResult?.details && urlResult.details.map((detail, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: '3px', color: 'var(--accent)' }} />
              {detail}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-danger" onClick={() => setCurrentPage('report')}>
            <Flag size={16} style={{ marginRight: '0.5rem' }} />
            Report This URL
          </button>
          <button 
            className="btn-primary" 
            onClick={() => { setUrlInput(''); setUrlResult(null); setCurrentPage('url-check'); }}
          >
            <Search size={16} style={{ marginRight: '0.5rem' }} />
            Check Another URL
          </button>
        </div>
      </div>
    </section>
  );

  const renderReport = () => (
    <section style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button
          onClick={() => { setCurrentPage('home'); setReportSubmitted(false); }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9375rem' }}
        >
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
          Back
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Report a Scam
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Help others stay safe by reporting fraudulent messages
        </p>
        
        {reportSubmitted ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'var(--safe-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <CheckCircle size={32} style={{ color: 'var(--safe)' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Report Submitted!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Thank you for helping keep others safe.
            </p>
            <button className="btn-primary" onClick={() => { setReportSubmitted(false); setReportContent(''); setReportDescription(''); }}>
              Submit Another Report
            </button>
          </div>
        ) : (
          <div className="card">
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                SMS / URL Content *
              </label>
              <textarea
                className="input-field"
                placeholder="Paste the suspicious message or URL here..."
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
              />
            </div>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Category *
              </label>
              <select
                className="select-field"
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
              >
                <option value="loan_scam">Loan Scam</option>
                <option value="otp_fraud">OTP Fraud</option>
                <option value="phishing">Phishing</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Additional Details (Optional)
              </label>
              <textarea
                className="input-field"
                placeholder="Any other information you'd like to share..."
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>
            
            <button
              className="btn-danger"
              onClick={handlereportSubmit}
              disabled={isLoading || !reportContent.trim()}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag size={18} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );

  const renderHistory = () => {
    const filteredHistory = historyFilter === 'all' 
      ? history 
      : history.filter(item => item.status === historyFilter);
    
    return (
      <section style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Scan History
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            View your past scans and results
          </p>
          
          <div className="tab-nav">
            <button 
              className={`tab-btn ${historyFilter === 'all' ? 'active' : ''}`}
              onClick={() => setHistoryFilter('all')}
            >
              All
            </button>
            <button 
              className={`tab-btn ${historyFilter === 'SAFE' ? 'active' : ''}`}
              onClick={() => setHistoryFilter('SAFE')}
            >
              Safe
            </button>
            <button 
              className={`tab-btn ${historyFilter === 'SUSPICIOUS' ? 'active' : ''}`}
              onClick={() => setHistoryFilter('SUSPICIOUS')}
            >
              Suspicious
            </button>
            <button 
              className={`tab-btn ${historyFilter === 'SCAM' ? 'active' : ''}`}
              onClick={() => setHistoryFilter('SCAM')}
            >
              Scam
            </button>
          </div>
          
          {filteredHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="card card-interactive"
                  onClick={() => {
                    setInput(item.inputText);
                    setResult(item);
                    setCurrentPage('result');
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-secondary)', 
                        marginBottom: '0.5rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.inputType === 'URL' ? <Link2 size={14} style={{ marginRight: '0.5rem' }} /> : <FileText size={14} style={{ marginRight: '0.5rem' }} />}
                        {item.inputText}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className={`badge badge-${item.status === 'SAFE' ? 'safe' : item.status === 'SUSPICIOUS' ? 'warning' : 'danger'}`}>
                      {item.status === 'SAFE' && <CheckCircle size={14} />}
                      {item.status === 'SUSPICIOUS' && <WarningIcon size={14} />}
                      {item.status === 'SCAM' && <XCircle size={14} />}
                      {item.confidence}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <History size={48} className="empty-icon" />
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No scans yet</p>
              <p>Your scan history will appear here after you check messages.</p>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {renderNav()}
      {currentPage === 'home' && renderHome()}
      {currentPage === 'result' && renderResult()}
      {currentPage === 'url-check' && renderUrlCheck()}
      {currentPage === 'url-result' && renderUrlResult()}
      {currentPage === 'report' && renderReport()}
      {currentPage === 'history' && renderHistory()}
    </div>
  );
}