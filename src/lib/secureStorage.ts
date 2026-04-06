const STORAGE_PREFIX = 'sc_';
const TTL = 3600000;
const SECRET_KEY = 'safecheck_v1_secure_key';

interface SecureStorageItem<T> {
  value: T;
  expiry: number;
  signature: string;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateSignature<T>(value: T, expiry: number): Promise<string> {
  const data = JSON.stringify(value) + expiry + SECRET_KEY;
  return sha256(data);
}

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export async function setSecureData<T>(key: string, value: T): Promise<void> {
  const safeKey = STORAGE_PREFIX + sanitizeInput(key);
  
  const safeValue = sanitizObject(value);
  const expiry = Date.now() + TTL;
  const signature = await generateSignature(safeValue, expiry);
  
  const item: SecureStorageItem<T> = {
    value: safeValue,
    expiry,
    signature
  };
  
  try {
    localStorage.setItem(safeKey, JSON.stringify(item));
  } catch (e) {
    console.error('Failed to store secure data:', e);
  }
}

export async function getSecureData<T>(key: string): Promise<T | null> {
  const safeKey = STORAGE_PREFIX + sanitizeInput(key);
  
  try {
    const stored = localStorage.getItem(safeKey);
    if (!stored) return null;
    
    const item: SecureStorageItem<T> = JSON.parse(stored);
    const currentTime = Date.now();
    
    if (currentTime > item.expiry) {
      localStorage.removeItem(safeKey);
      return null;
    }
    
    const expectedSignature = await generateSignature(item.value, item.expiry);
    if (expectedSignature !== item.signature) {
      localStorage.removeItem(safeKey);
      return null;
    }
    
    return item.value;
  } catch {
    localStorage.removeItem(safeKey);
    return null;
  }
}

export function removeSecureData(key: string): void {
  const safeKey = STORAGE_PREFIX + sanitizeInput(key);
  localStorage.removeItem(safeKey);
}

export function clearAllSecureData(): void {
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

export async function cleanupSecureStorage(): Promise<void> {
  const keysToRemove: string[] = [];
  const currentTime = Date.now();
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
    
    try {
      const stored = localStorage.getItem(key);
      if (!stored) continue;
      
      const item = JSON.parse(stored);
      
      if (currentTime > item.expiry) {
        keysToRemove.push(key);
        continue;
      }
      
      const expectedSignature = await generateSignature(item.value, item.expiry);
      if (expectedSignature !== item.signature) {
        keysToRemove.push(key);
      }
    } catch {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

function sanitizObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeInput(obj) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizObject(item)) as unknown as T;
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizObject(value);
    }
    return sanitized as T;
  }
  
  return obj;
}

export async function isSessionValid(): Promise<boolean> {
  const session = await getSecureData<{ id: string }>('session');
  return session !== null;
}

export async function logout(): Promise<void> {
  removeSecureData('session');
  removeSecureData('user');
}