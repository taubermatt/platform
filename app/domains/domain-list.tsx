"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { deleteDomainAction, verifyDomainAction } from "@/app/actions";
import { protocol } from "@/lib/utils";

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

export function DomainList({ domains }: { domains: Domain[] }) {
  const [deleteState, deleteAction, isDeletePending] = useActionState<
    DeleteState,
    FormData
  >(deleteDomainAction, {});
  const [verifyState, verifyAction, isVerifyPending] = useActionState<
    VerifyState,
    FormData
  >(verifyDomainAction, {});

  const handleDelete = (domain: string) => {
    if (
      confirm(
        `Are you sure you want to delete ${domain}? This will remove it from Vercel as well.`
      )
    ) {
      const formData = new FormData();
      formData.append("domain", domain);
      deleteAction(formData);
    }
  };

  const handleVerify = (domain: string) => {
    const formData = new FormData();
    formData.append("domain", domain);
    verifyAction(formData);
  };

  const getStatusIcon = (domain: Domain) => {
    if (!domain.verified) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (domain.sslStatus === "valid") {
      return <Shield className="h-4 w-4 text-green-500" />;
    }
    if (domain.sslStatus === "pending") {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (domain: Domain) => {
    if (!domain.verified) {
      return "Verification needed";
    }
    if (domain.sslStatus === "valid") {
      return "SSL active";
    }
    if (domain.sslStatus === "pending") {
      return "SSL pending";
    }
    return "SSL error";
  };

  if (domains.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No custom domains connected yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Connect your first domain using the form on the left.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deleteState.error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
          {deleteState.error}
        </div>
      )}
      {deleteState.success && (
        <div className="text-sm text-green-500 bg-green-50 p-3 rounded">
          {deleteState.success}
        </div>
      )}
      {verifyState.error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
          {verifyState.error}
        </div>
      )}
      {verifyState.success && (
        <div className="text-sm text-green-500 bg-green-50 p-3 rounded">
          {verifyState.success}
        </div>
      )}

      <div className="grid gap-3">
        {domains.map((domain) => (
          <Card key={domain.domain} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{domain.emoji}</div>
                <div>
                  <div className="font-medium">{domain.domain}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {getStatusIcon(domain)}
                    <span>{getStatusText(domain)}</span>
                    <span>•</span>
                    <span>
                      Created {new Date(domain.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {domain.verified ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`${protocol}://${domain.domain}`}
                      target="_blank"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit
                    </Link>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="text-gray-400"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Verify First
                  </Button>
                )}
                {!domain.verified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(domain.domain)}
                    disabled={isVerifyPending}
                  >
                    <CheckCircle className="h-3 w-3" />
                    Verify
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(domain.domain)}
                  disabled={isDeletePending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
