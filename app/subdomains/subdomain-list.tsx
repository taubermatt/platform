"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { deleteSubdomainAction } from "@/app/actions";
import { rootDomain, protocol } from "@/lib/utils";

type Subdomain = {
  subdomain: string;
  emoji: string;
  createdAt: number;
};

type DeleteState = {
  error?: string;
  success?: string;
};

export function SubdomainList({ subdomains }: { subdomains: Subdomain[] }) {
  const [deleteState, deleteAction, isDeletePending] = useActionState<
    DeleteState,
    FormData
  >(deleteSubdomainAction, {});

  const handleDelete = (subdomain: string) => {
    if (
      confirm(`Are you sure you want to delete ${subdomain}.${rootDomain}?`)
    ) {
      const formData = new FormData();
      formData.append("subdomain", subdomain);
      deleteAction(formData);
    }
  };

  if (subdomains.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No subdomains created yet.</p>
        <p className="text-sm text-gray-400 mt-1">
          Create your first subdomain using the form on the left.
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

      <div className="grid gap-3">
        {subdomains.map((subdomain) => (
          <Card key={subdomain.subdomain} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{subdomain.emoji}</div>
                <div>
                  <div className="font-medium">
                    {subdomain.subdomain}.{rootDomain}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created {new Date(subdomain.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`${protocol}://${subdomain.subdomain}.${rootDomain}`}
                    target="_blank"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(subdomain.subdomain)}
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
