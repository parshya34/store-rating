
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Star, LogOut, Search, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const UserDashboard = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Load stores from localStorage
    const savedStores = JSON.parse(localStorage.getItem('stores') || '[]');
    setStores(savedStores);
  }, []);

  const StarRating = ({ rating, interactive = false, onRatingChange = null, size = "h-4 w-4" }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= (interactive ? (hoveredRating || rating) : rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
        {!interactive && <span className="text-sm text-gray-600 ml-1">{rating}</span>}
      </div>
    );
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Choose between 1 and 5 stars.",
        variant: "destructive",
      });
      return;
    }

    // Save rating to localStorage
    const existingRatings = JSON.parse(localStorage.getItem('ratings') || '[]');
    const newRating = {
      id: Date.now(),
      userId: user.id,
      storeId: selectedStore.id,
      rating: rating,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Remove existing rating if any
    const filteredRatings = existingRatings.filter(r => !(r.userId === user.id && r.storeId === selectedStore.id));
    filteredRatings.push(newRating);
    localStorage.setItem('ratings', JSON.stringify(filteredRatings));

    // Update stores with new ratings
    const allRatings = filteredRatings;
    const updatedStores = stores.map(store => {
      const storeRatings = allRatings.filter(r => r.storeId === store.id);
      const averageRating = storeRatings.length > 0 
        ? storeRatings.reduce((sum, r) => sum + r.rating, 0) / storeRatings.length 
        : 0;
      
      const userRating = storeRatings.find(r => r.userId === user.id);
      
      return {
        ...store,
        overallRating: Number(averageRating.toFixed(1)),
        totalRatings: storeRatings.length,
        userRating: userRating ? userRating.rating : null
      };
    });
    
    setStores(updatedStores);
    localStorage.setItem('stores', JSON.stringify(updatedStores));

    toast({
      title: "Rating submitted!",
      description: `You rated ${selectedStore.name} ${rating} star${rating !== 1 ? 's' : ''}.`,
    });

    setSelectedStore(null);
    setRating(0);
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Update Password</Button>
              <Button onClick={onLogout} variant="outline" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Find Stores</CardTitle>
            <CardDescription>Search for stores by name or address to view ratings and submit your own</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stores by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stores Grid */}
        {filteredStores.length > 0 ? (
          <div className="grid gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-600">{store.address}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">Overall Rating:</span>
                          <StarRating rating={store.overallRating || 0} />
                          <span className="text-sm text-gray-500">({store.totalRatings || 0} reviews)</span>
                        </div>

                        {store.userRating && (
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-blue-700">Your Rating:</span>
                            <StarRating rating={store.userRating} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            onClick={() => {
                              setSelectedStore(store);
                              setRating(store.userRating || 0);
                            }}
                            className="whitespace-nowrap"
                          >
                            {store.userRating ? 'Update Rating' : 'Rate Store'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Rate {selectedStore?.name}</DialogTitle>
                            <DialogDescription>
                              Share your experience with other customers by rating this store from 1 to 5 stars.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center gap-4">
                              <Label htmlFor="rating" className="text-center">
                                How would you rate your experience?
                              </Label>
                              <StarRating 
                                rating={rating} 
                                interactive={true} 
                                onRatingChange={setRating}
                                size="h-8 w-8"
                              />
                              {rating > 0 && (
                                <p className="text-sm text-gray-600 text-center">
                                  You selected {rating} star{rating !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleRatingSubmit}>
                              Submit Rating
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No stores found matching your search.' : 'No stores available yet.'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-gray-500">
                  Stores will appear here when administrators add them to the platform.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
