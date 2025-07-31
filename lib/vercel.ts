import { VercelCore as Vercel } from '@vercel/sdk/core.js';
import { projectsAddProjectDomain } from '@vercel/sdk/funcs/projectsAddProjectDomain.js';
import { projectsGetProjectDomain } from '@vercel/sdk/funcs/projectsGetProjectDomain.js';
import { projectsVerifyProjectDomain } from '@vercel/sdk/funcs/projectsVerifyProjectDomain.js';
import { projectsRemoveProjectDomain } from '@vercel/sdk/funcs/projectsRemoveProjectDomain.js';
import { domainsDeleteDomain } from '@vercel/sdk/funcs/domainsDeleteDomain.js';

export const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

type DnsRecord = {
  type: 'A' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  description?: string;
};

export async function addDomainToProject(domain: string) {
  try {
    await projectsAddProjectDomain(vercel, {
      idOrName: process.env.VERCEL_PROJECT_ID || 'platforms',
      teamId: process.env.VERCEL_TEAM_ID,
      requestBody: {
        name: domain,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding domain to project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getProjectDnsRecords(domain: string) {
  try {
    // Get the domain details from Vercel to get the actual DNS records
    const domainResponse = await projectsGetProjectDomain(vercel, {
      idOrName: process.env.VERCEL_PROJECT_ID || 'platforms',
      teamId: process.env.VERCEL_TEAM_ID,
      domain,
    });

    const { value: result } = domainResponse;
    
    if (!result) {
      throw new Error('Domain not found in Vercel project');
    }

    // Build the DNS records based on Vercel's current recommendations
    const records: DnsRecord[] = [
      {
        type: 'A',
        name: '@',
        value: '216.150.1.1', // Vercel's current recommended A record
        description: 'Apex domain record'
      }
    ];

    // Add verification TXT record if available
    if (result.verification && result.verification.length > 0) {
      const txtRecord = result.verification.find((v: any) => v.type === 'TXT');
      if (txtRecord) {
        records.push({
          type: 'TXT',
          name: '_vercel',
          value: txtRecord.value,
          description: 'Domain verification record'
        });
      }
    }
    
    return { success: true, records };
  } catch (error) {
    console.error('Error getting DNS records:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      records: []
    };
  }
}

export async function getDomainVerificationDetails(domain: string) {
  try {
    const domainResponse = await projectsGetProjectDomain(vercel, {
      idOrName: process.env.VERCEL_PROJECT_ID || 'platforms',
      teamId: process.env.VERCEL_TEAM_ID,
      domain,
    });

    const { value: result } = domainResponse;
    
    return {
      success: true,
      verified: result?.verified || false,
      verification: result?.verification || null,
    };
  } catch (error) {
    console.error('Error getting domain verification details:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      verified: false,
      verification: null,
    };
  }
}

export async function verifyDomain(domain: string) {
  try {
    const [domainResponse, verifyResponse] = await Promise.all([
      projectsGetProjectDomain(vercel, {
        idOrName: process.env.VERCEL_PROJECT_ID || 'platforms',
        teamId: process.env.VERCEL_TEAM_ID,
        domain,
      }),
      projectsVerifyProjectDomain(vercel, {
        idOrName: process.env.VERCEL_PROJECT_ID || 'platforms',
        teamId: process.env.VERCEL_TEAM_ID,
        domain,
      }),
    ]);

    const { value: result } = verifyResponse;
    return { success: true, verified: result?.verified || false };
  } catch (error) {
    console.error('Error verifying domain:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function removeDomainFromProject(domain: string) {
  try {
    await Promise.all([
      projectsRemoveProjectDomain(vercel, {
        idOrName: process.env.VERCEL_PROJECT_ID || 'platforms',
        teamId: process.env.VERCEL_TEAM_ID,
        domain,
      }),
      domainsDeleteDomain(vercel, {
        domain,
      }),
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error removing domain from project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 