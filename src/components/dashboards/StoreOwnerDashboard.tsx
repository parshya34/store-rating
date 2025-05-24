
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, LogOut, TrendingUp, Users } from 'lucide-react';

export const StoreOwnerDashboard = ({ user, onLogout }) => {
  // Mock store data for the logged-in store owner
  const storeData = {
    name: 'Downtown Coffee Shop',
    averageRating: 4.5,
    totalRatings: 142,
    recentRatings: [
      { id: 1, customerName: 'Alice Johnson Anderson', rating: 5, date: '2024-01-15', comment: 'Great coffee and excellent service!' },
      { id: 2, customerName: 'Bob Smith Wilson Brown', rating: 4, date: '2024-01-14', comment: 'Good atmosphere, will come back.' },
      { id: 3, customerName: 'Carol Davis Miller', rating: 5, date: '2024-01-13', comment: 'Best coffee in downtown!' },
      { id: 4, customerName: 'David Wilson Thompson', rating: 3, date: '2024-01-12', comment: 'Coffee was okay, service could be better.' },
      { id: 5, customerName: 'Emma Brown Garcia', rating: 5, date: '2024-01-11', comment: 'Love this place! Great staff and amazing pastries.' },
    ]
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

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadgeVariant = (rating) => {
    if (rating >= 4) return 'default';
    if (rating >= 3) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
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
        {/* Store Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{storeData.name}</CardTitle>
              <CardDescription>Your store performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className={`text-3xl font-bold ${getRatingColor(storeData.averageRating)}`}>
                    {storeData.averageRating}
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">
                    {storeData.totalRatings}
                  </div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-yellow-600">
                    {storeData.recentRatings.filter(r => r.rating >= 4).length}
                  </div>
                  <p className="text-sm text-gray-600">Recent Positive Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Customer Ratings</CardTitle>
            <CardDescription>
              See what customers are saying about your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {storeData.recentRatings.map((rating) => (
                <div key={rating.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {rating.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{rating.customerName}</h4>
                        <p className="text-sm text-gray-500">{rating.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={rating.rating} />
                      <Badge variant={getRatingBadgeVariant(rating.rating)}>
                        {rating.rating} Stars
                      </Badge>
                    </div>
                  </div>
                  
                  {rating.comment && (
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <p className="text-gray-700 italic">"{rating.comment}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {storeData.recentRatings.length === 0 && (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No ratings yet. Encourage customers to rate your store!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
