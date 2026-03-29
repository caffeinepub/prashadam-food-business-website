import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Copy, ExternalLink, Server, Globe, Shield, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { DeploymentStatus } from '../backend';

export function useDeploymentStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<DeploymentStatus>({
    queryKey: ['deploymentStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDeploymentStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export default function DeploymentPage() {
  const { data: deploymentStatus, isLoading } = useDeploymentStatus();
  const [copied, setCopied] = useState(false);
  const [copiedCanisterId, setCopiedCanisterId] = useState(false);
  const [copiedCurl1, setCopiedCurl1] = useState(false);
  const [copiedCurl2, setCopiedCurl2] = useState(false);

  const canisterId = 'klp5p-hyaaa-aaaal-acrmq-cai';
  const customDomain = 'prashadamfood.com';
  const wwwDomain = 'www.prashadamfood.com';

  const curlCommand1 = `curl -sLv -X POST \\
  -H 'Content-Type: application/json' \\
  https://icp0.io/registrations \\
  --data @- <<EOF
{
  "name": "${customDomain}"
}
EOF`;

  const curlCommand2 = `curl -sLv -X POST \\
  -H 'Content-Type: application/json' \\
  https://icp0.io/registrations \\
  --data @- <<EOF
{
  "name": "${wwwDomain}"
}
EOF`;

  const handleCopyURL = async () => {
    if (!deploymentStatus?.canisterURL) return;
    
    try {
      await navigator.clipboard.writeText(deploymentStatus.canisterURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleCopyCanisterId = async () => {
    try {
      await navigator.clipboard.writeText(canisterId);
      setCopiedCanisterId(true);
      setTimeout(() => setCopiedCanisterId(false), 2000);
    } catch (err) {
      console.error('Failed to copy canister ID:', err);
    }
  };

  const handleCopyCurl1 = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand1);
      setCopiedCurl1(true);
      setTimeout(() => setCopiedCurl1(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  const handleCopyCurl2 = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand2);
      setCopiedCurl2(true);
      setTimeout(() => setCopiedCurl2(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-96" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Server className="w-8 h-8 text-primary" />
            Deployment Status & Domain Setup
          </h1>
          <p className="text-lg text-muted-foreground">
            Your Prashadam Food website is permanently deployed on the Internet Computer
          </p>
        </div>

        {/* Deployment Status Card */}
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="w-6 h-6" />
              Deployment Successful
            </CardTitle>
            <CardDescription className="text-green-700">
              Your application is live and accessible on the Internet Computer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Permanent Canister</span>
              <span className="text-green-700">• Stable and production-ready</span>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Alert className="border-blue-500 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Important:</strong> For custom domains {customDomain} and {wwwDomain} to work correctly, follow all the steps below carefully. The <code className="bg-blue-100 px-1 py-0.5 rounded">.well-known/ic-domains</code> file is already configured in your canister. After DNS configuration and boundary node registration, changes may take 24-48 hours to propagate.
          </AlertDescription>
        </Alert>

        {/* Canister Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Canister Information
            </CardTitle>
            <CardDescription>
              Use this information to configure your custom domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Canister ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Canister ID:</label>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm break-all flex items-center justify-between">
                <span>{canisterId}</span>
                <Button
                  onClick={handleCopyCanisterId}
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {copiedCanisterId && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Copied!
                </p>
              )}
            </div>

            {/* Canister URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Permanent Canister URL:</label>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm break-all">
                {deploymentStatus?.canisterURL || 'Loading...'}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleCopyURL}
                variant="outline"
                className="flex-1"
                disabled={!deploymentStatus?.canisterURL}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1"
                disabled={!deploymentStatus?.canisterURL}
              >
                <a
                  href={deploymentStatus?.canisterURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Site
                </a>
              </Button>
            </div>

            {/* ic-domains file status */}
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900">
                <strong>✓ ic-domains file configured:</strong> The <code className="bg-green-100 px-1 py-0.5 rounded">.well-known/ic-domains</code> file is already deployed in your canister with both domains listed.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Separator />

        {/* DNS Configuration Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Domain Configuration Guide</CardTitle>
            <CardDescription>
              Follow these steps to connect {customDomain} and {wwwDomain} to your canister
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <strong>Prerequisites:</strong> You need access to your domain's DNS settings (GoDaddy or Cloudflare) and a terminal to run curl commands.
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Step-by-Step Configuration:</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">Verify ic-domains File (Already Done ✓)</h4>
                    <p className="text-sm text-muted-foreground">
                      The <code className="bg-muted px-1 py-0.5 rounded">.well-known/ic-domains</code> file is already configured in your canister with the following content:
                    </p>
                    <div className="bg-muted rounded-lg p-4 space-y-1 text-sm font-mono">
                      <div>{customDomain}</div>
                      <div>{wwwDomain}</div>
                    </div>
                    <Alert className="mt-2 bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-xs text-green-900">
                        <strong>Status:</strong> This file is already deployed and accessible at <code className="bg-green-100 px-1 py-0.5 rounded">https://{canisterId}.icp0.io/.well-known/ic-domains</code>
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">Configure DNS Records</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Go to your DNS provider (GoDaddy or Cloudflare) and add the following records:
                    </p>
                    
                    <div className="space-y-4">
                      {/* CNAME for apex domain */}
                      <div className="border rounded-lg p-4 bg-background">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">A</span>
                          CNAME for apex domain (prashadamfood.com):
                        </p>
                        <div className="bg-muted rounded-lg p-3 space-y-2 text-sm font-mono">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-semibold">CNAME</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">@</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold">icp1.io</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">TTL:</span>
                            <span className="font-semibold">600</span>
                          </div>
                        </div>
                        <Alert className="mt-2 bg-amber-50 border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-xs text-amber-900">
                            <strong>GoDaddy Note:</strong> GoDaddy may not allow CNAME for @ (apex). If so, use Cloudflare instead (free and supports CNAME flattening).
                          </AlertDescription>
                        </Alert>
                      </div>

                      {/* CNAME for www */}
                      <div className="border rounded-lg p-4 bg-background">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">B</span>
                          CNAME for www subdomain:
                        </p>
                        <div className="bg-muted rounded-lg p-3 space-y-2 text-sm font-mono">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-semibold">CNAME</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">www</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold">icp1.io</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">TTL:</span>
                            <span className="font-semibold">600</span>
                          </div>
                        </div>
                      </div>

                      {/* TXT for canister ID - apex */}
                      <div className="border rounded-lg p-4 bg-background">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">C</span>
                          TXT record for apex domain:
                        </p>
                        <div className="bg-muted rounded-lg p-3 space-y-2 text-sm font-mono">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-semibold">TXT</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">_canister-id</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold break-all">{canisterId}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">TTL:</span>
                            <span className="font-semibold">600</span>
                          </div>
                        </div>
                      </div>

                      {/* TXT for canister ID - www */}
                      <div className="border rounded-lg p-4 bg-background">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">D</span>
                          TXT record for www subdomain:
                        </p>
                        <div className="bg-muted rounded-lg p-3 space-y-2 text-sm font-mono">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-semibold">TXT</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">_canister-id.www</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold break-all">{canisterId}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">TTL:</span>
                            <span className="font-semibold">600</span>
                          </div>
                        </div>
                      </div>

                      {/* ACME challenge - apex */}
                      <div className="border rounded-lg p-4 bg-background">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">E</span>
                          ACME challenge for apex domain (SSL):
                        </p>
                        <div className="bg-muted rounded-lg p-3 space-y-2 text-sm font-mono">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-semibold">CNAME</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">_acme-challenge</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold break-all">_acme-challenge.{customDomain}.icp2.io</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">TTL:</span>
                            <span className="font-semibold">600</span>
                          </div>
                        </div>
                      </div>

                      {/* ACME challenge - www */}
                      <div className="border rounded-lg p-4 bg-background">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">F</span>
                          ACME challenge for www subdomain (SSL):
                        </p>
                        <div className="bg-muted rounded-lg p-3 space-y-2 text-sm font-mono">
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-semibold">CNAME</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-semibold">_acme-challenge.www</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Value:</span>
                            <span className="font-semibold break-all">_acme-challenge.{wwwDomain}.icp2.io</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">TTL:</span>
                            <span className="font-semibold">600</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">Wait for DNS Propagation</h4>
                    <p className="text-sm text-muted-foreground">
                      After adding DNS records, wait 5-10 minutes for initial propagation. You can check DNS status at <a href="https://www.whatsmydns.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">whatsmydns.net</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1 space-y-3">
                    <h4 className="font-semibold">Register Domains with Boundary Nodes</h4>
                    <p className="text-sm text-muted-foreground">
                      After DNS records are set, run these curl commands to register your domains with Internet Computer boundary nodes. This triggers SSL certificate acquisition.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-background">
                        <p className="text-sm font-medium mb-2">Register apex domain ({customDomain}):</p>
                        <div className="bg-muted rounded-lg p-3 relative">
                          <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto">
{curlCommand1}
                          </pre>
                          <Button
                            onClick={handleCopyCurl1}
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        {copiedCurl1 && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Copied to clipboard!
                          </p>
                        )}
                      </div>

                      <div className="border rounded-lg p-4 bg-background">
                        <p className="text-sm font-medium mb-2">Register www subdomain ({wwwDomain}):</p>
                        <div className="bg-muted rounded-lg p-3 relative">
                          <pre className="text-xs font-mono whitespace-pre-wrap break-all overflow-x-auto">
{curlCommand2}
                          </pre>
                          <Button
                            onClick={handleCopyCurl2}
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        {copiedCurl2 && (
                          <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Copied to clipboard!
                          </p>
                        )}
                      </div>
                    </div>

                    <Alert className="mt-3">
                      <AlertDescription className="text-xs">
                        <strong>Important:</strong> Run both commands. You should receive a response indicating the registration was successful. SSL certificate acquisition may take a few minutes to several hours.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">Wait for SSL Certificate</h4>
                    <p className="text-sm text-muted-foreground">
                      SSL certificate acquisition can take anywhere from a few minutes to several hours. The boundary nodes will automatically obtain Let's Encrypt certificates for your domains.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    6
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">Verify Your Domains</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Once everything is configured, test your domains:
                    </p>
                    <div className="space-y-2">
                      <a
                        href={`https://${customDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded border hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        https://{customDomain}
                      </a>
                      <a
                        href={`https://${wwwDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded border hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        https://{wwwDomain}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-amber-900">Troubleshooting Common Issues</CardTitle>
            <CardDescription className="text-amber-800">
              Solutions to common domain verification problems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-amber-900">
            <div className="space-y-4">
              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-semibold mb-2">Error: "The requested domain is not saved by this HTTP gateway"</h4>
                <p className="text-sm mb-2">This error means the boundary nodes don't recognize your domain. Check:</p>
                <ul className="text-sm list-disc list-inside ml-2 space-y-1">
                  <li>The <code className="bg-amber-100 px-1 py-0.5 rounded">.well-known/ic-domains</code> file is accessible at <code className="bg-amber-100 px-1 py-0.5 rounded">https://{canisterId}.icp0.io/.well-known/ic-domains</code></li>
                  <li>Both domains are listed in the file (one per line, no extra spaces)</li>
                  <li>All DNS records are configured correctly</li>
                  <li>You've run both curl registration commands successfully</li>
                  <li>DNS has propagated (check at whatsmydns.net)</li>
                </ul>
              </div>

              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-semibold mb-2">Error: "Unknown Domain"</h4>
                <p className="text-sm mb-2">Similar to above, ensure:</p>
                <ul className="text-sm list-disc list-inside ml-2 space-y-1">
                  <li>DNS records point to <code className="bg-amber-100 px-1 py-0.5 rounded">icp1.io</code> (not the canister ID)</li>
                  <li>TXT records with <code className="bg-amber-100 px-1 py-0.5 rounded">_canister-id</code> are set correctly</li>
                  <li>You've registered the domains with boundary nodes using curl</li>
                  <li>Wait 24-48 hours for full DNS propagation</li>
                </ul>
              </div>

              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-semibold mb-2">SSL Certificate Issues</h4>
                <p className="text-sm mb-2">If you see SSL/HTTPS errors:</p>
                <ul className="text-sm list-disc list-inside ml-2 space-y-1">
                  <li>Verify ACME challenge CNAME records are set correctly</li>
                  <li>Wait longer - certificate acquisition can take several hours</li>
                  <li>Try re-running the curl registration commands</li>
                  <li>Check that your domain resolves correctly with <code className="bg-amber-100 px-1 py-0.5 rounded">nslookup</code> or <code className="bg-amber-100 px-1 py-0.5 rounded">dig</code></li>
                </ul>
              </div>

              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-semibold mb-2">GoDaddy CNAME Limitations</h4>
                <p className="text-sm mb-2">GoDaddy doesn't allow CNAME for apex domains (@). Solutions:</p>
                <ul className="text-sm list-disc list-inside ml-2 space-y-1">
                  <li><strong>Recommended:</strong> Transfer DNS to Cloudflare (free, supports CNAME flattening)</li>
                  <li>Use only www.prashadamfood.com and redirect apex to www</li>
                  <li>Use Cloudflare's proxy feature for the apex domain</li>
                </ul>
              </div>

              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-semibold mb-2">Verify DNS Propagation</h4>
                <p className="text-sm">
                  Use <a href="https://www.whatsmydns.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">whatsmydns.net</a> to check if your DNS records have propagated globally. Enter your domain and check for CNAME and TXT records.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
            <CardDescription>
              Helpful documentation and guides
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="https://internetcomputer.org/docs/current/developer-docs/web-apps/custom-domains/using-custom-domains"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="font-medium">Internet Computer Custom Domain Documentation</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://support.godaddy.com/help/add-a-cname-record-19236"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="font-medium">GoDaddy CNAME Setup Guide</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://www.cloudflare.com/learning/dns/dns-records/dns-cname-record/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="font-medium">Understanding CNAME Records</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://www.cloudflare.com/learning/dns/glossary/cname-flattening/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="font-medium">Cloudflare CNAME Flattening</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
