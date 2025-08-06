import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth/dal';
import { UserMenu } from '@/features/auth/components/user-menu';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { ChangePasswordForm } from '@/features/profile/components/change-password-form';
import { DangerZone } from '@/features/profile/components/danger-zone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Profile | Gym Tracker',
  description: 'Manage your profile and account settings',
};

export default async function ProfilePage() {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Gym Tracker</h1>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Profile Settings</h2>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="max-w-4xl">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="danger">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and email address</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm user={session.user} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChangePasswordForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="danger">
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DangerZone />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
