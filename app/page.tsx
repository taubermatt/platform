import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Link as LinkIcon } from "lucide-react";
import { rootDomain } from "@/lib/utils";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Multi-Tenant Example
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This platform demonstrates multi-tenancy with both subdomain and
            custom domain support. Create subdomains like{" "}
            <code className="bg-gray-100 px-1 rounded">
              tenant.{rootDomain}
            </code>{" "}
            or connect your own domains like{" "}
            <code className="bg-gray-100 px-1 rounded">yourdomain.com</code>.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Subdomains Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Subdomain Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Create and manage subdomains like{" "}
                <code className="bg-gray-100 px-1 rounded">
                  tenant.{rootDomain}
                </code>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Quick setup with no domain verification</li>
                <li>• Automatic routing and SSL</li>
                <li>• Custom emoji icons</li>
                <li>• Perfect for testing and development</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/subdomains">Manage Subdomains</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Custom Domains Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-green-600" />
                Custom Domain Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Connect and manage your own domains like{" "}
                <code className="bg-gray-100 px-1 rounded">yourdomain.com</code>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Connect your own domains</li>
                <li>• Automatic SSL certificates</li>
                <li>• Domain verification required</li>
                <li>• Professional production setup</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/domains">Manage Custom Domains</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Info */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Subdomains</h4>
                <p>
                  Create a subdomain and it's immediately available. No DNS
                  configuration needed - just add an emoji and you're ready to
                  go!
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Custom Domains
                </h4>
                <p>
                  Connect your own domain with DNS configuration and
                  verification. Perfect for production applications with your
                  own branding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
