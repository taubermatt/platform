import Link from "next/link";
import { SubdomainForm } from "./subdomain-form";
import { DomainForm } from "./domain-form";
import { rootDomain } from "@/lib/utils";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative">
      <div className="absolute top-4 right-4">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors mr-4"
        >
          Admin Dashboard
        </Link>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {rootDomain}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Multi-tenant platform with subdomain and custom domain support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subdomain Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Subdomain Example
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Create a subdomain like{" "}
              <code className="bg-gray-100 px-1 rounded">
                yourname.{rootDomain}
              </code>
            </p>
            <SubdomainForm />
          </div>

          {/* Domain Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Custom Domain Example
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Connect your own domain like{" "}
              <code className="bg-gray-100 px-1 rounded">yourdomain.com</code>
            </p>
            <DomainForm />
          </div>
        </div>
      </div>
    </div>
  );
}
