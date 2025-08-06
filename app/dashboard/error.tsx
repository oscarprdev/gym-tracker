'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Button } from '@/features/shared/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="border-red-200 bg-red-50 max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <CardTitle className="text-red-800">Something went wrong</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            We encountered an error while loading your dashboard. This might be a temporary issue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {process.env.NODE_ENV === 'development' && error && (
              <div className="p-3 bg-red-100 rounded-md border border-red-200">
                <h4 className="text-sm font-medium text-red-800 mb-2">Error Details:</h4>
                <p className="text-xs text-red-700 font-mono break-all">{error.message}</p>
                {error.digest && <p className="text-xs text-red-600 font-mono mt-1">Digest: {error.digest}</p>}
              </div>
            )}

            <div className="flex gap-2 flex-col sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                onClick={reset}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReload}
                className="text-red-700 border-red-300 hover:bg-red-100"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
