'use server';

import { redis } from '@/lib/redis';
import { isValidIcon } from '@/lib/subdomains';
import { isValidDomain, createDomain, deleteDomain, updateDomainVerification } from '@/lib/domains';
import { addDomainToProject, verifyDomain, removeDomainFromProject, getDomainVerificationDetails, getProjectDnsRecords } from '@/lib/vercel';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

// Subdomain actions (kept for reference)
export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  const icon = formData.get('icon') as string;

  if (!subdomain || !icon) {
    return { success: false, error: 'Subdomain and icon are required' };
  }

  if (!isValidIcon(icon)) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'Please enter a valid emoji (maximum 10 characters)'
    };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      icon,
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
    };
  }

  const subdomainAlreadyExists = await redis.get(
    `subdomain:${sanitizedSubdomain}`
  );
  if (subdomainAlreadyExists) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'This subdomain is already taken'
    };
  }

  await redis.set(`subdomain:${sanitizedSubdomain}`, {
    emoji: icon,
    createdAt: Date.now()
  });

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain');
  await redis.del(`subdomain:${subdomain}`);
  revalidatePath('/admin');
  return { success: 'Domain deleted successfully' };
}

// Domain actions (new implementation)
export async function createDomainAction(
  prevState: any,
  formData: FormData
) {
  const domain = formData.get('domain') as string;
  const icon = formData.get('icon') as string;

  if (!domain || !icon) {
    return { success: false, error: 'Domain and icon are required' };
  }

  if (!isValidDomain(domain)) {
    return {
      domain,
      icon,
      success: false,
      error: 'Please enter a valid domain name (e.g., myapp.com)'
    };
  }

  if (!isValidIcon(icon)) {
    return {
      domain,
      icon,
      success: false,
      error: 'Please enter a valid emoji (maximum 10 characters)'
    };
  }

  const sanitizedDomain = domain.toLowerCase().trim();

  // Check if domain already exists
  const domainAlreadyExists = await redis.get(`domain:${sanitizedDomain}`);
  if (domainAlreadyExists) {
    return {
      domain,
      icon,
      success: false,
      error: 'This domain is already registered'
    };
  }

  // Add domain to Vercel project
  const vercelResult = await addDomainToProject(sanitizedDomain);
  if (!vercelResult.success) {
    return {
      domain,
      icon,
      success: false,
      error: `Failed to add domain to Vercel: ${vercelResult.error}`
    };
  }

  // Create domain in our database
  await createDomain(sanitizedDomain, icon);

  // Return success state for multi-step flow
  return {
    success: true,
    domain: sanitizedDomain,
    icon,
    step: 'dns' as const
  };
}

export async function deleteDomainAction(
  prevState: any,
  formData: FormData
) {
  const domain = formData.get('domain') as string;
  
  if (!domain) {
    return { error: 'Domain is required' };
  }

  const sanitizedDomain = domain.toLowerCase().trim();

  // Remove from Vercel
  const vercelResult = await removeDomainFromProject(sanitizedDomain);
  if (!vercelResult.success) {
    console.error('Failed to remove domain from Vercel:', vercelResult.error);
  }

  // Remove from our database
  await deleteDomain(sanitizedDomain);
  
  revalidatePath('/admin');
  return { success: 'Domain deleted successfully' };
}

export async function verifyDomainAction(
  prevState: any,
  formData: FormData
) {
  const domain = formData.get('domain') as string;
  
  if (!domain) {
    return { error: 'Domain is required' };
  }

  const sanitizedDomain = domain.toLowerCase().trim();

  // Verify domain with Vercel
  const vercelResult = await verifyDomain(sanitizedDomain);
  if (!vercelResult.success) {
    return { error: `Failed to verify domain: ${vercelResult.error}` };
  }

  // Update verification status in our database
  await updateDomainVerification(sanitizedDomain, vercelResult.verified || false);
  
  revalidatePath('/admin');
  return { 
    success: vercelResult.verified 
      ? 'Domain verified successfully' 
      : 'Domain verification failed. Please check your DNS settings.'
  };
}

export async function getDomainVerificationDetailsAction(
  prevState: any,
  formData: FormData
) {
  const domain = formData.get('domain') as string;
  
  if (!domain) {
    return { error: 'Domain is required' };
  }

  const sanitizedDomain = domain.toLowerCase().trim();
  const vercelResult = await getDomainVerificationDetails(sanitizedDomain);
  
  if (!vercelResult.success) {
    return { error: `Failed to get verification details: ${vercelResult.error}` };
  }

  return {
    success: true,
    verified: vercelResult.verified,
    verification: vercelResult.verification,
  };
}

export async function getProjectDnsRecordsAction() {
  const vercelResult = await getProjectDnsRecords();
  
  if (!vercelResult.success) {
    return { error: `Failed to get DNS records: ${vercelResult.error}` };
  }

  return {
    success: true,
    records: vercelResult.records,
  };
}
