import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDomainData } from "@/lib/domains";
import { protocol, rootDomain } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const domainData = await getDomainData(domain);

  if (!domainData) {
    return {
      title: rootDomain,
    };
  }

  return {
    title: domain,
    description: `Custom domain page for ${domain}`,
  };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const domainData = await getDomainData(domain);

  if (!domainData) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="absolute top-4 left-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/domains" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Domains
          </Link>
        </Button>
      </div>
      <div className="absolute top-4 right-4">
        <Link
          href={`${protocol}://${rootDomain}`}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {rootDomain}
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-6">{domainData.emoji}</div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome to {domain}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            This is your custom domain page
          </p>
          {!domainData.verified && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Domain verification pending. SSL certificate will be issued
                once verified.
              </p>
            </div>
          )}
          {domainData.verified && domainData.sslStatus === "pending" && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-400 rounded-md">
              <p className="text-sm text-blue-800">
                🔒 SSL certificate is being generated...
              </p>
            </div>
          )}
          {domainData.verified && domainData.sslStatus === "valid" && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-md">
              <p className="text-sm text-green-800">
                ✅ SSL certificate is active
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
