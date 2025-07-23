'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Star, TrendingUp, Users, Eye } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  description: string
  image?: string
  category: string
  commission: number
  currency: string
  status: string
  url: string
  createdAt: string
}

interface FavoriteCampaign {
  id: string
  campaignId: string
  createdAt: string
  campaign: Campaign
}

export default function FavoriteCampaigns() {
  const [favorites, setFavorites] = useState<FavoriteCampaign[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/favorites?campaignId=${campaignId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.campaignId !== campaignId))
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const formatCurrency = (amount: number, currency: string = 'VND') => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Favorite Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading favorites...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Favorite Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Favorite Campaigns Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start adding campaigns to your favorites to see them here
              </p>
              <Button
                onClick={() => window.location.href = '/campaigns'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Campaigns
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Favorite Campaigns
            </div>
            <Badge variant="secondary">
              {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                    {favorite.campaign.name}
                  </h3>
                  <Badge 
                    variant={favorite.campaign.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className="mb-2"
                  >
                    {favorite.campaign.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFavorite(favorite.campaignId)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {favorite.campaign.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Category</span>
                  <Badge variant="outline">{favorite.campaign.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Commission</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(favorite.campaign.commission, favorite.campaign.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Added to favorites</span>
                  <span className="text-sm text-gray-700">
                    {formatDate(favorite.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(favorite.campaign.url, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Campaign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `/campaigns/${favorite.campaignId}`}
                >
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">
            Favorites Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {favorites.length}
              </div>
              <div className="text-sm text-gray-500">Total Favorites</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {favorites.filter(f => f.campaign.status === 'ACTIVE').length}
              </div>
              <div className="text-sm text-gray-500">Active Campaigns</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {[...new Set(favorites.map(f => f.campaign.category))].length}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(
                  favorites.reduce((sum, f) => sum + f.campaign.commission, 0),
                  'VND'
                ).replace(/[₫,]/g, '')}
              </div>
              <div className="text-sm text-gray-500">Total Commission</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
