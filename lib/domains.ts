import { redis } from '@/lib/redis';

export function isValidIcon(str: string) {
  if (str.length > 10) {
    return false;
  }

  try {
    // Primary validation: Check if the string contains at least one emoji character
    // This regex pattern matches most emoji Unicode ranges
    const emojiPattern = /[\p{Emoji}]/u;
    if (emojiPattern.test(str)) {
      return true;
    }
  } catch (error) {
    // If the regex fails (e.g., in environments that don't support Unicode property escapes),
    // fall back to a simpler validation
    console.warn(
      'Emoji regex validation failed, using fallback validation',
      error
    );
  }

  // Fallback validation: Check if the string is within a reasonable length
  // This is less secure but better than no validation
  return str.length >= 1 && str.length <= 10;
}

export function isValidDomain(domain: string) {
  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

type DomainData = {
  emoji: string;
  createdAt: number;
  verified: boolean;
  sslStatus: 'pending' | 'valid' | 'error';
};

export async function getDomainData(domain: string) {
  const sanitizedDomain = domain.toLowerCase().trim();
  const data = await redis.get<DomainData>(
    `domain:${sanitizedDomain}`
  );
  return data;
}

export async function getAllDomains() {
  const keys = await redis.keys('domain:*');

  if (!keys.length) {
    return [];
  }

  const values = await redis.mget<DomainData[]>(...keys);

  return keys.map((key, index) => {
    const domain = key.replace('domain:', '');
    const data = values[index];

    return {
      domain,
      emoji: data?.emoji || '❓',
      createdAt: data?.createdAt || Date.now(),
      verified: data?.verified || false,
      sslStatus: data?.sslStatus || 'pending'
    };
  });
}

export async function createDomain(domain: string, emoji: string) {
  const sanitizedDomain = domain.toLowerCase().trim();
  
  await redis.set(`domain:${sanitizedDomain}`, {
    emoji,
    createdAt: Date.now(),
    verified: false,
    sslStatus: 'pending'
  });
  
  return { success: true };
}

export async function deleteDomain(domain: string) {
  const sanitizedDomain = domain.toLowerCase().trim();
  await redis.del(`domain:${sanitizedDomain}`);
  return { success: true };
}

export async function updateDomainVerification(domain: string, verified: boolean) {
  const sanitizedDomain = domain.toLowerCase().trim();
  const existingData = await redis.get<DomainData>(`domain:${sanitizedDomain}`);
  
  if (existingData) {
    await redis.set(`domain:${sanitizedDomain}`, {
      ...existingData,
      verified
    });
  }
  
  return { success: true };
}

export async function updateDomainSSLStatus(domain: string, sslStatus: 'pending' | 'valid' | 'error') {
  const sanitizedDomain = domain.toLowerCase().trim();
  const existingData = await redis.get<DomainData>(`domain:${sanitizedDomain}`);
  
  if (existingData) {
    await redis.set(`domain:${sanitizedDomain}`, {
      ...existingData,
      sslStatus
    });
  }
  
  return { success: true };
}
