import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Link as LinkIcon } from "lucide-react";
import { rootDomain } from "@/lib/utils";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your multi-tenant platform for {rootDomain}
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
                Manage subdomains like{" "}
                <code className="bg-gray-100 px-1 rounded">
                  tenant.{rootDomain}
                </code>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create and delete subdomains</li>
                <li>• Assign custom emojis</li>
                <li>• Automatic routing</li>
                <li>• No domain verification needed</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/admin/subdomains">Manage Subdomains</Link>
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
                Manage custom domains like{" "}
                <code className="bg-gray-100 px-1 rounded">
                  customdomain.com
                </code>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Connect your own domains</li>
                <li>• Automatic SSL certificates</li>
                <li>• Domain verification</li>
                <li>• Vercel integration</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/admin/domains">Manage Custom Domains</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <Link href="/">← Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
