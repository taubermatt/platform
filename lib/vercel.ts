import { VercelCore as Vercel } from '@vercel/sdk/core.js';
import { projectsAddProjectDomain } from '@vercel/sdk/funcs/projectsAddProjectDomain.js';
import { projectsGetProjectDomain } from '@vercel/sdk/funcs/projectsGetProjectDomain.js';
import { projectsVerifyProjectDomain } from '@vercel/sdk/funcs/projectsVerifyProjectDomain.js';
import { projectsRemoveProjectDomain } from '@vercel/sdk/funcs/projectsRemoveProjectDomain.js';
import { domainsDeleteDomain } from '@vercel/sdk/funcs/domainsDeleteDomain.js';

export const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

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