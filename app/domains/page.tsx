import Link from "next/link";
import { getAllDomains } from "@/lib/domains";
import { DomainForm } from "../domain-form";
import { DomainList } from "./domain-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { rootDomain } from "@/lib/utils";

export default async function DomainsPage() {
  const domains = await getAllDomains();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Custom Domain Management
            </h1>
            <p className="text-gray-600">Connect and manage your own domains</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <DomainForm />
              </CardContent>
            </Card>
          </div>

          {/* List Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Existing Domains ({domains.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <DomainList domains={domains} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
