import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useAdminStatus } from '../../hooks/useAdminStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import LoginButton from '../../components/auth/LoginButton';

export default function AdminLoginPage() {
  const { identity, isLoggingIn } = useInternetIdentity();
  const { isAdmin, isLoading } = useAdminStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && !isLoading && isAdmin) {
      navigate({ to: '/admin' });
    }
  }, [identity, isAdmin, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full border-2 border-temple-accent">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-temple-light p-4 rounded-full">
              <Shield className="h-12 w-12 text-temple-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Portal</CardTitle>
          <CardDescription>
            Secure login for temple administrators only
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoggingIn || isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-temple-primary" />
              <p className="text-gray-600">Authenticating...</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <LoginButton />
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 leading-relaxed">
                  This area is restricted to authorized temple administrators. Please login with your
                  Internet Identity to access the admin portal.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
