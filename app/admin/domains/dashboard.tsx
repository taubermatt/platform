"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { deleteDomainAction, verifyDomainAction } from "@/app/actions";
import { rootDomain, protocol } from "@/lib/utils";

type Domain = {
  domain: string;
  emoji: string;
  createdAt: number;
  verified: boolean;
  sslStatus: "pending" | "valid" | "error";
};

type DeleteState = {
  error?: string;
  success?: string;
};

type VerifyState = {
  error?: string;
  success?: string;
};

function DashboardHeader() {
  // TODO: You can add authentication here with your preferred auth provider

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Custom Domain Management</h1>
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Admin Home
        </Link>
        <Link
          href="/admin/subdomains"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Subdomains
        </Link>
        <Link
          href={`${protocol}://${rootDomain}`}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {rootDomain}
        </Link>
      </div>
    </div>
  );
}

function DomainGrid({
  domains,
  deleteAction,
  verifyAction,
  isDeletePending,
  isVerifyPending,
}: {
  domains: Domain[];
  deleteAction: (formData: FormData) => void;
  verifyAction: (formData: FormData) => void;
  isDeletePending: boolean;
  isVerifyPending: boolean;
}) {
  if (domains.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-gray-500">
            No custom domains have been created yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain) => (
        <Card key={domain.domain}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{domain.domain}</CardTitle>
              <div className="flex items-center gap-2">
                <form action={verifyAction}>
                  <input type="hidden" name="domain" value={domain.domain} />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="submit"
                    disabled={isVerifyPending}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    title="Verify domain"
                  >
                    {isVerifyPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                <form action={deleteAction}>
                  <input type="hidden" name="domain" value={domain.domain} />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="submit"
                    disabled={isDeletePending}
                    className="text-gray-500 hover:text-red-700 hover:bg-red-50"
                    title="Delete domain"
                  >
                    {isDeletePending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl">{domain.emoji}</div>
              <div className="text-sm text-gray-500">
                Created: {new Date(domain.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Status indicators */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {domain.verified ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-700">Domain verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-yellow-700">
                      Verification pending
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                {domain.sslStatus === "valid" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-700">SSL active</span>
                  </>
                ) : domain.sslStatus === "error" ? (
                  <>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-700">SSL error</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-blue-700">SSL pending</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4">
              <a
                href={`${protocol}://${domain.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                Visit domain →
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DomainDashboard({ domains }: { domains: Domain[] }) {
  const [deleteState, deleteAction, isDeletePending] = useActionState<
    DeleteState,
    FormData
  >(deleteDomainAction, {});

  const [verifyState, verifyAction, isVerifyPending] = useActionState<
    VerifyState,
    FormData
  >(verifyDomainAction, {});

  return (
    <div className="space-y-6 relative p-4 md:p-8">
      <DashboardHeader />
      <DomainGrid
        domains={domains}
        deleteAction={deleteAction}
        verifyAction={verifyAction}
        isDeletePending={isDeletePending}
        isVerifyPending={isVerifyPending}
      />

      {deleteState.error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
          {deleteState.error}
        </div>
      )}

      {deleteState.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          {deleteState.success}
        </div>
      )}

      {verifyState.error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
          {verifyState.error}
        </div>
      )}

      {verifyState.success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md">
          {verifyState.success}
        </div>
      )}
    </div>
  );
}
