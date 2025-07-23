"use client"

import { useAuth } from '@/lib/auth-context'
import FavoriteCampaigns from '@/components/favorite-campaigns'

export default function FavoritesPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Please log in to view your favorite campaigns.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Favorite Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and track your favorite affiliate campaigns
          </p>
        </div>

        {/* Favorites Component */}
        <FavoriteCampaigns />
      </div>
    </div>
  )
}
