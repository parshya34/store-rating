import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Store, Star, LogOut, Plus, Search } from 'lucide-react';
import { AddStoreForm } from '@/components/forms/AddStoreForm';

export const AdminDashboard = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load stores from localStorage
    const savedStores = JSON.parse(localStorage.getItem('stores') || '[]');
    setStores(savedStores);

    // Load users from localStorage
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setUsers(savedUsers);

    // Load ratings from localStorage
    const savedRatings = JSON.parse(localStorage.getItem('ratings') || '[]');
    setTotalRatings(savedRatings.length);
  };

  const handleStoreAdded = () => {
    loadData();
  };

  // Calculate stats dynamically
  const stats = {
    totalUsers: users.length,
    totalStores: stores.length,
    totalRatings: totalRatings
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  // Filter stores based on search term
  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <Button onClick={onLogout} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Users registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStores}</div>
              <p className="text-xs text-muted-foreground">Stores registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRatings}</div>
              <p className="text-xs text-muted-foreground">Ratings submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="stores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stores">Stores</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="add-user">Add User</TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Store Management</CardTitle>
                    <CardDescription>View and manage all registered stores</CardDescription>
                  </div>
                  <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Store
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Store</DialogTitle>
                        <DialogDescription>
                          Create a new store and store owner account on the platform.
                        </DialogDescription>
                      </DialogHeader>
                      <AddStoreForm 
                        onClose={() => setIsAddStoreOpen(false)}
                        onStoreAdded={handleStoreAdded}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search stores by name, email, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredStores.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? 'No stores found matching your search.' : 'No stores registered yet.'}
                    </p>
                    {!searchTerm && (
                      <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
                        <DialogTrigger asChild>
                          <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add First Store
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add New Store</DialogTitle>
                            <DialogDescription>
                              Create a new store and store owner account on the platform.
                            </DialogDescription>
                          </DialogHeader>
                          <AddStoreForm 
                            onClose={() => setIsAddStoreOpen(false)}
                            onStoreAdded={handleStoreAdded}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredStores.map((store) => (
                      <div key={store.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{store.name}</h3>
                            <p className="text-sm text-gray-600">{store.email}</p>
                            <p className="text-sm text-gray-600">{store.address}</p>
                            <StarRating rating={store.overallRating || 0} />
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all platform users</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users by name, email, address, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? 'No users found matching your search.' : 'No users registered yet.'}
                    </p>
                    {!searchTerm && (
                      <p className="text-sm text-gray-500">Users will appear here when they sign up or are added by administrators.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{user.name}</h3>
                              <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'store_owner' ? 'secondary' : 'default'}>
                                {user.role.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">{user.address}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-user" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Add new users, store owners, or administrators to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">User creation functionality will be implemented when connected to Supabase backend.</p>
                  <Button disabled>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
