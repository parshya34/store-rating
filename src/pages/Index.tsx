
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { UserDashboard } from '@/components/dashboards/UserDashboard';
import { StoreOwnerDashboard } from '@/components/dashboards/StoreOwnerDashboard';
import { Star, Store, Users, BarChart3 } from 'lucide-react';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowSignup(false);
  };

  if (currentUser) {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
      case 'user':
        return <UserDashboard user={currentUser} onLogout={handleLogout} />;
      case 'store_owner':
        return <StoreOwnerDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <UserDashboard user={currentUser} onLogout={handleLogout} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Store className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">StoreRate</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and rate the best stores in your area. Join our community of reviewers and help others make informed decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle>Rate & Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Share your experiences and help others discover great stores.</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Join a community of reviewers making shopping better for everyone.</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Store Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Store owners get insights into customer feedback and ratings.</p>
            </CardContent>
          </Card>
        </div>

        {/* Auth Section */}
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {showSignup ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription>
                {showSignup 
                  ? 'Join our community and start rating stores' 
                  : 'Sign in to access your dashboard'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showSignup ? (
                <SignupForm onSignup={handleLogin} />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )}
              
              <div className="mt-6 text-center">
                {showSignup ? (
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Button 
                      variant="link" 
                      onClick={() => setShowSignup(false)}
                      className="p-0 h-auto text-blue-600"
                    >
                      Sign in
                    </Button>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Button 
                      variant="link" 
                      onClick={() => setShowSignup(true)}
                      className="p-0 h-auto text-blue-600"
                    >
                      Sign up
                    </Button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
