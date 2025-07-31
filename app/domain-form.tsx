"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Smile,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import {
  createDomainAction,
  verifyDomainAction,
  getDomainVerificationDetailsAction,
  getProjectDnsRecordsAction,
} from "@/app/actions";
import { rootDomain } from "@/lib/utils";

type CreateState = {
  error?: string;
  success?: boolean;
  domain?: string;
  icon?: string;
  step?: "input" | "dns" | "verifying" | "complete";
  dnsRecords?: {
    type: string;
    name: string;
    value: string;
  }[];
};

type VerifyState = {
  error?: string;
  success?: string;
  verified?: boolean;
};

function DomainInput({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="domain">Custom Domain</Label>
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            id="domain"
            name="domain"
            placeholder="yourdomain.com"
            defaultValue={defaultValue}
            className="w-full focus:z-10"
            required
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Enter your custom domain (e.g., myapp.com, blog.example.com)
      </p>
    </div>
  );
}

function IconPicker({
  icon,
  setIcon,
  defaultValue,
}: {
  icon: string;
  setIcon: (icon: string) => void;
  defaultValue?: string;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleEmojiSelect = ({ emoji }: { emoji: string }) => {
    setIcon(emoji);
    setIsPickerOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="icon">Icon</Label>
      <div className="flex flex-col gap-2">
        <input type="hidden" name="icon" value={icon} required />
        <div className="flex items-center gap-2">
          <Card className="flex-1 flex flex-row items-center justify-between p-2 border border-input rounded-md">
            <div className="min-w-[40px] min-h-[40px] flex items-center pl-[14px] select-none">
              {icon ? (
                <span className="text-3xl">{icon}</span>
              ) : (
                <span className="text-gray-400 text-sm font-normal">
                  No icon selected
                </span>
              )}
            </div>
            <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-auto rounded-sm"
                  onClick={() => setIsPickerOpen(!isPickerOpen)}
                >
                  <Smile className="h-4 w-4 mr-2" />
                  Select Emoji
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[256px]"
                align="end"
                sideOffset={5}
              >
                <EmojiPicker
                  className="h-[300px] w-[256px]"
                  defaultValue={defaultValue}
                  onEmojiSelect={handleEmojiSelect}
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                  <EmojiPickerFooter />
                </EmojiPicker>
              </PopoverContent>
            </Popover>
          </Card>
        </div>
        <p className="text-xs text-gray-500">
          Select an emoji to represent your custom domain
        </p>
      </div>
    </div>
  );
}

function DnsInstructions({ domain }: { domain: string }) {
  const [verificationDetails, getVerificationDetails, isGettingDetails] =
    useActionState<any, FormData>(getDomainVerificationDetailsAction, {});
  const [dnsRecords, getDnsRecords, isGettingDnsRecords] = useActionState<
    any,
    FormData
  >(getProjectDnsRecordsAction, {});

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Get verification details and DNS records when component mounts
  useEffect(() => {
    const formData = new FormData();
    formData.append("domain", domain);
    getVerificationDetails(formData);
    getDnsRecords(new FormData());
  }, [domain, getVerificationDetails, getDnsRecords]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Configure DNS Records
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Add the following DNS records to your domain's DNS settings:
        </p>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {isGettingDnsRecords ? (
            <div className="text-center py-4">
              <span className="text-sm text-gray-500">
                Loading DNS records...
              </span>
            </div>
          ) : dnsRecords?.records && dnsRecords.records.length > 0 ? (
            dnsRecords.records.map((record: any, index: number) => (
              <div key={index} className="space-y-2">
                <h4 className="text-sm font-medium">
                  {record.type} Record{" "}
                  {record.name !== "@" ? `(${record.name})` : ""}:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type:</span>
                    <span className="text-sm bg-white px-2 py-1 rounded border">
                      {record.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-white px-2 py-1 rounded border">
                        {record.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(record.name)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Value:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-white px-2 py-1 rounded border font-mono text-xs">
                        {record.value}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(record.value)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <span className="text-sm text-gray-500">
                Unable to load DNS records
              </span>
            </div>
          )}

          {/* TXT Record for verification */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              TXT Record (for verification):
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm bg-white px-2 py-1 rounded border">
                  TXT
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-white px-2 py-1 rounded border">
                    _vercel
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("_vercel")}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Value:</span>
                <div className="flex items-center gap-2">
                  {isGettingDetails ? (
                    <span className="text-sm text-gray-500">Loading...</span>
                  ) : verificationDetails?.verification?.expectedTxtRecord ? (
                    <>
                      <span className="text-sm bg-white px-2 py-1 rounded border font-mono text-xs">
                        {verificationDetails.verification.expectedTxtRecord}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            verificationDetails.verification.expectedTxtRecord
                          )
                        }
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">
                      Unable to load verification code
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            <strong>Note:</strong> DNS changes can take up to 24 hours to
            propagate.
          </p>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://vercel.com/docs/concepts/projects/custom-domains"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              Learn more about DNS configuration
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function VerificationStep({ domain }: { domain: string }) {
  const [verifyState, verifyAction, isVerifyPending] = useActionState<
    VerifyState,
    FormData
  >(verifyDomainAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-500" />
          Verify Domain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          After adding the DNS records, click the button below to verify your
          domain:
        </p>

        <form action={verifyAction}>
          <input type="hidden" name="domain" value={domain} />
          <Button type="submit" className="w-full" disabled={isVerifyPending}>
            {isVerifyPending ? "Verifying..." : "Verify Domain"}
          </Button>
        </form>

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
      </CardContent>
    </Card>
  );
}

export function DomainForm() {
  const [icon, setIcon] = useState("");
  const [currentStep, setCurrentStep] = useState<
    "input" | "dns" | "verifying" | "complete"
  >("input");

  const [state, action, isPending] = useActionState<CreateState, FormData>(
    createDomainAction,
    {}
  );

  // Handle step progression
  useEffect(() => {
    if (state?.step) {
      setCurrentStep(state.step);
    }
  }, [state?.step]);

  // Check if we should show DNS instructions
  const shouldShowDns = state?.success && state?.domain;

  if (shouldShowDns) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Domain Added Successfully!
          </h3>
          <p className="text-sm text-gray-600">
            Your domain <strong>{state.domain}</strong> has been added to our
            system.
          </p>
        </div>

        <DnsInstructions domain={state.domain!} />
        <VerificationStep domain={state.domain!} />

        <Button
          variant="outline"
          onClick={() => setCurrentStep("input")}
          className="w-full"
        >
          Add Another Domain
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <DomainInput defaultValue={state?.domain} />
      <IconPicker icon={icon} setIcon={setIcon} defaultValue={state?.icon} />

      {state?.error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
          {state.error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending || !icon}>
        {isPending ? "Adding Domain..." : "Add Custom Domain"}
      </Button>
    </form>
  );
}
