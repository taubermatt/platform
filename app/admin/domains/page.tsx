import { getAllDomains } from "@/lib/domains";
import type { Metadata } from "next";
import { DomainDashboard } from "./dashboard";
import { rootDomain } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Domain Management | ${rootDomain}`,
  description: `Manage custom domains for ${rootDomain}`,
};

export default async function DomainAdminPage() {
  // TODO: You can add authentication here with your preferred auth provider
  const domains = await getAllDomains();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <DomainDashboard domains={domains} />
    </div>
  );
}
