"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bookmark, 
  BookmarkPlus, 
  Star, 
  Folder, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Share,
  ExternalLink,
  Clock,
  Tag,
  FolderPlus,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Archive,
  Heart,
  Eye,
  Link,
  FileText,
  BarChart3,
  Users,
  Target,
  Calendar,
  DollarSign,
  Settings,
  Download
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Bookmark Types
export interface BookmarkItem {
  id: string
  title: string
  description?: string
  url: string
  icon: React.ReactNode
  category: BookmarkCategory
  tags: string[]
  isStarred: boolean
  isFavorite: boolean
  accessCount: number
  lastAccessedAt: Date
  createdAt: Date
  updatedAt: Date
  folder?: string
  isPublic?: boolean
  color?: string
}

export type BookmarkCategory = 
  | 'campaigns' 
  | 'reports' 
  | 'tools' 
  | 'pages' 
  | 'external' 
  | 'custom'

export interface BookmarkFolder {
  id: string
  name: string
  description?: string
  color: string
  icon: React.ReactNode
  bookmarks: string[] // bookmark IDs
  isPublic: boolean
  createdAt: Date
}

export type ViewMode = 'grid' | 'list'
export type SortMode = 'recent' | 'alphabetical' | 'mostUsed' | 'created'

// Predefined bookmark categories with icons
const BOOKMARK_CATEGORIES = {
  campaigns: { label: 'Campaigns', icon: <Target className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' },
  reports: { label: 'Reports', icon: <BarChart3 className="h-4 w-4" />, color: 'bg-green-100 text-green-800' },
  tools: { label: 'Tools', icon: <Settings className="h-4 w-4" />, color: 'bg-purple-100 text-purple-800' },
  pages: { label: 'Pages', icon: <FileText className="h-4 w-4" />, color: 'bg-orange-100 text-orange-800' },
  external: { label: 'External', icon: <ExternalLink className="h-4 w-4" />, color: 'bg-gray-100 text-gray-800' },
  custom: { label: 'Custom', icon: <Bookmark className="h-4 w-4" />, color: 'bg-pink-100 text-pink-800' }
}

// Sample bookmarks data
const SAMPLE_BOOKMARKS: BookmarkItem[] = [
  {
    id: '1',
    title: 'Summer Fashion Campaign',
    description: 'High-performing fashion affiliate campaign with 3.2% conversion rate',
    url: '/campaigns/summer-fashion',
    icon: <Target className="h-4 w-4" />,
    category: 'campaigns',
    tags: ['fashion', 'summer', 'high-conversion'],
    isStarred: true,
    isFavorite: true,
    accessCount: 45,
    lastAccessedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    folder: 'top-campaigns',
    color: '#3b82f6'
  },
  {
    id: '2',
    title: 'Monthly Revenue Report',
    description: 'Comprehensive revenue analytics and performance metrics',
    url: '/reports/revenue?period=monthly',
    icon: <BarChart3 className="h-4 w-4" />,
    category: 'reports',
    tags: ['revenue', 'monthly', 'analytics'],
    isStarred: true,
    isFavorite: false,
    accessCount: 32,
    lastAccessedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    folder: 'reports',
    color: '#10b981'
  },
  {
    id: '3',
    title: 'Deep Link Generator',
    description: 'Advanced tool for generating trackable affiliate links',
    url: '/tools/deep-link-generator',
    icon: <Link className="h-4 w-4" />,
    category: 'tools',
    tags: ['links', 'tracking', 'generator'],
    isStarred: false,
    isFavorite: true,
    accessCount: 28,
    lastAccessedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    color: '#8b5cf6'
  },
  {
    id: '4',
    title: 'Payout Schedule',
    description: 'View upcoming payments and payout calendar',
    url: '/payments/schedule',
    icon: <Calendar className="h-4 w-4" />,
    category: 'pages',
    tags: ['payments', 'schedule', 'calendar'],
    isStarred: false,
    isFavorite: false,
    accessCount: 18,
    lastAccessedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    color: '#f59e0b'
  },
  {
    id: '5',
    title: 'Google Analytics',
    description: 'External link to Google Analytics dashboard for traffic analysis',
    url: 'https://analytics.google.com',
    icon: <ExternalLink className="h-4 w-4" />,
    category: 'external',
    tags: ['analytics', 'external', 'traffic'],
    isStarred: false,
    isFavorite: false,
    accessCount: 12,
    lastAccessedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    isPublic: false,
    color: '#ef4444'
  },
  {
    id: '6',
    title: 'Commission Calculator',
    description: 'Calculate potential earnings and commission rates',
    url: '/tools/commission-calculator',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'tools',
    tags: ['commission', 'calculator', 'earnings'],
    isStarred: true,
    isFavorite: true,
    accessCount: 67,
    lastAccessedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    folder: 'frequently-used',
    color: '#059669'
  }
]

// Sample folders
const SAMPLE_FOLDERS: BookmarkFolder[] = [
  {
    id: 'top-campaigns',
    name: 'Top Campaigns',
    description: 'Best performing affiliate campaigns',
    color: '#3b82f6',
    icon: <Star className="h-4 w-4" />,
    bookmarks: ['1'],
    isPublic: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Analytics and performance reports',
    color: '#10b981',
    icon: <BarChart3 className="h-4 w-4" />,
    bookmarks: ['2'],
    isPublic: false,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'frequently-used',
    name: 'Frequently Used',
    description: 'Most accessed bookmarks',
    color: '#f59e0b',
    icon: <Clock className="h-4 w-4" />,
    bookmarks: ['6'],
    isPublic: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
]

interface BookmarkSystemProps {
  initialBookmarks?: BookmarkItem[]
  initialFolders?: BookmarkFolder[]
  onBookmarkClick?: (bookmark: BookmarkItem) => void
}

export function BookmarkSystem({ 
  initialBookmarks = SAMPLE_BOOKMARKS, 
  initialFolders = SAMPLE_FOLDERS,
  onBookmarkClick 
}: BookmarkSystemProps) {
  const { toast } = useToast()

  // State management
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [folders, setFolders] = useState(initialFolders)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<BookmarkCategory | 'all'>('all')
  const [selectedFolder, setSelectedFolder] = useState<string | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortMode, setSortMode] = useState<SortMode>('recent')
  const [showStarredOnly, setShowStarredOnly] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  
  // Dialog states
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false)
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<BookmarkItem | null>(null)
  const [editingFolder, setEditingFolder] = useState<BookmarkFolder | null>(null)

  // Form states
  const [bookmarkForm, setBookmarkForm] = useState({
    title: '',
    description: '',
    url: '',
    category: 'custom' as BookmarkCategory,
    tags: '',
    folder: '',
    color: '#3b82f6',
    isPublic: false
  })

  const [folderForm, setFolderForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    isPublic: false
  })

  // Filtered and sorted bookmarks
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks.filter(bookmark => {
      const matchesSearch = !searchTerm || 
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory
      const matchesFolder = selectedFolder === 'all' || bookmark.folder === selectedFolder
      const matchesStarred = !showStarredOnly || bookmark.isStarred
      const matchesFavorites = !showFavoritesOnly || bookmark.isFavorite

      return matchesSearch && matchesCategory && matchesFolder && matchesStarred && matchesFavorites
    })

    // Sort bookmarks
    switch (sortMode) {
      case 'recent':
        filtered.sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())
        break
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'mostUsed':
        filtered.sort((a, b) => b.accessCount - a.accessCount)
        break
      case 'created':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    return filtered
  }, [bookmarks, searchTerm, selectedCategory, selectedFolder, sortMode, showStarredOnly, showFavoritesOnly])

  // Bookmark actions
  const handleBookmarkClick = useCallback((bookmark: BookmarkItem) => {
    // Update access count and last accessed time
    setBookmarks(prev => prev.map(b => 
      b.id === bookmark.id 
        ? { ...b, accessCount: b.accessCount + 1, lastAccessedAt: new Date() }
        : b
    ))

    // Call external handler
    onBookmarkClick?.(bookmark)

    // Navigate to URL (if internal) or open external link
    if (bookmark.url.startsWith('/')) {
      // Internal navigation would go here
      toast({
        title: "Navigating",
        description: `Opening ${bookmark.title}...`
      })
    } else {
      window.open(bookmark.url, '_blank', 'noopener,noreferrer')
    }
  }, [onBookmarkClick, toast])

  const toggleStar = useCallback((bookmarkId: string) => {
    setBookmarks(prev => prev.map(b => 
      b.id === bookmarkId ? { ...b, isStarred: !b.isStarred } : b
    ))
  }, [])

  const toggleFavorite = useCallback((bookmarkId: string) => {
    setBookmarks(prev => prev.map(b => 
      b.id === bookmarkId ? { ...b, isFavorite: !b.isFavorite } : b
    ))
  }, [])

  const deleteBookmark = useCallback((bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
    
    // Remove from folders
    setFolders(prev => prev.map(folder => ({
      ...folder,
      bookmarks: folder.bookmarks.filter(id => id !== bookmarkId)
    })))

    toast({
      title: "Bookmark Deleted",
      description: "Bookmark has been removed successfully."
    })
  }, [toast])

  const addBookmark = useCallback(() => {
    const newBookmark: BookmarkItem = {
      id: `bookmark-${Date.now()}`,
      title: bookmarkForm.title,
      description: bookmarkForm.description,
      url: bookmarkForm.url,
      icon: BOOKMARK_CATEGORIES[bookmarkForm.category].icon,
      category: bookmarkForm.category,
      tags: bookmarkForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isStarred: false,
      isFavorite: false,
      accessCount: 0,
      lastAccessedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      folder: bookmarkForm.folder || undefined,
      isPublic: bookmarkForm.isPublic,
      color: bookmarkForm.color
    }

    setBookmarks(prev => [...prev, newBookmark])

    // Add to folder if specified
    if (bookmarkForm.folder) {
      setFolders(prev => prev.map(folder => 
        folder.id === bookmarkForm.folder 
          ? { ...folder, bookmarks: [...folder.bookmarks, newBookmark.id] }
          : folder
      ))
    }

    // Reset form
    setBookmarkForm({
      title: '',
      description: '',
      url: '',
      category: 'custom',
      tags: '',
      folder: '',
      color: '#3b82f6',
      isPublic: false
    })
    
    setIsAddBookmarkOpen(false)

    toast({
      title: "Bookmark Added",
      description: `"${newBookmark.title}" has been added to your bookmarks.`
    })
  }, [bookmarkForm, toast])

  const addFolder = useCallback(() => {
    const newFolder: BookmarkFolder = {
      id: `folder-${Date.now()}`,
      name: folderForm.name,
      description: folderForm.description,
      color: folderForm.color,
      icon: <Folder className="h-4 w-4" />,
      bookmarks: [],
      isPublic: folderForm.isPublic,
      createdAt: new Date()
    }

    setFolders(prev => [...prev, newFolder])

    // Reset form
    setFolderForm({
      name: '',
      description: '',
      color: '#3b82f6',
      isPublic: false
    })
    
    setIsAddFolderOpen(false)

    toast({
      title: "Folder Created",
      description: `Folder "${newFolder.name}" has been created.`
    })
  }, [folderForm, toast])

  const deleteFolder = useCallback((folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (!folder) return

    // Remove folder reference from bookmarks
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.folder === folderId ? { ...bookmark, folder: undefined } : bookmark
    ))

    // Remove folder
    setFolders(prev => prev.filter(f => f.id !== folderId))

    toast({
      title: "Folder Deleted",
      description: `Folder "${folder.name}" has been deleted.`
    })
  }, [folders, toast])

  const exportBookmarks = useCallback(() => {
    const exportData = {
      bookmarks,
      folders,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)

    toast({
      title: "Bookmarks Exported",
      description: "Your bookmarks have been exported successfully."
    })
  }, [bookmarks, folders, toast])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bookmarks</h2>
          <p className="text-muted-foreground">
            {filteredBookmarks.length} of {bookmarks.length} bookmarks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportBookmarks}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Dialog open={isAddFolderOpen} onOpenChange={setIsAddFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FolderPlus className="h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="folderName">Folder Name</Label>
                  <Input
                    id="folderName"
                    value={folderForm.name}
                    onChange={(e) => setFolderForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter folder name..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="folderDescription">Description (Optional)</Label>
                  <Textarea
                    id="folderDescription"
                    value={folderForm.description}
                    onChange={(e) => setFolderForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter folder description..."
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="folderColor">Color</Label>
                  <Input
                    id="folderColor"
                    type="color"
                    value={folderForm.color}
                    onChange={(e) => setFolderForm(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFolderOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addFolder} disabled={!folderForm.name}>
                  Create Folder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddBookmarkOpen} onOpenChange={setIsAddBookmarkOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <BookmarkPlus className="h-4 w-4" />
                Add Bookmark
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Bookmark</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={bookmarkForm.title}
                    onChange={(e) => setBookmarkForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter bookmark title..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={bookmarkForm.url}
                    onChange={(e) => setBookmarkForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com or /internal/path"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={bookmarkForm.description}
                    onChange={(e) => setBookmarkForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter bookmark description..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={bookmarkForm.category}
                      onChange={(e) => setBookmarkForm(prev => ({ ...prev, category: e.target.value as BookmarkCategory }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {Object.entries(BOOKMARK_CATEGORIES).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="folder">Folder (Optional)</Label>
                    <select
                      id="folder"
                      value={bookmarkForm.folder}
                      onChange={(e) => setBookmarkForm(prev => ({ ...prev, folder: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">No folder</option>
                      {folders.map(folder => (
                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={bookmarkForm.tags}
                    onChange={(e) => setBookmarkForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddBookmarkOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addBookmark} disabled={!bookmarkForm.title || !bookmarkForm.url}>
                  Add Bookmark
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Filters</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className="justify-between"
              >
                Starred Only
                {showStarredOnly && <Star className="h-4 w-4 fill-current" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="justify-between"
              >
                Favorites Only
                {showFavoritesOnly && <Heart className="h-4 w-4 fill-current" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>View Mode</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setViewMode('grid')}>
                <Grid3X3 className="h-4 w-4 mr-2" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('list')}>
                <List className="h-4 w-4 mr-2" />
                List View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {sortMode === 'recent' && <Clock className="h-4 w-4" />}
                {sortMode === 'alphabetical' && <SortAsc className="h-4 w-4" />}
                {sortMode === 'mostUsed' && <Eye className="h-4 w-4" />}
                {sortMode === 'created' && <Calendar className="h-4 w-4" />}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortMode('recent')}>
                <Clock className="h-4 w-4 mr-2" />
                Recently Accessed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortMode('alphabetical')}>
                <SortAsc className="h-4 w-4 mr-2" />
                Alphabetical
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortMode('mostUsed')}>
                <Eye className="h-4 w-4 mr-2" />
                Most Used
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortMode('created')}>
                <Calendar className="h-4 w-4 mr-2" />
                Recently Created
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category and Folder Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as BookmarkCategory | 'all')}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All ({bookmarks.length})</TabsTrigger>
          {Object.entries(BOOKMARK_CATEGORIES).map(([key, { label, icon }]) => {
            const count = bookmarks.filter(b => b.category === key).length
            return (
              <TabsTrigger key={key} value={key} className="gap-1">
                {icon}
                {label} ({count})
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Folders Filter */}
      {folders.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedFolder === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFolder('all')}
          >
            All Folders
          </Button>
          {folders.map(folder => (
            <div key={folder.id} className="flex items-center gap-1">
              <Button
                variant={selectedFolder === folder.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFolder(folder.id)}
                className="gap-1"
                style={{ borderColor: folder.color }}
              >
                {folder.icon}
                {folder.name} ({folder.bookmarks.length})
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingFolder(folder)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteFolder(folder.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Bookmarks Display */}
      {filteredBookmarks.length === 0 ? (
        <Card className="flex items-center justify-center py-12">
          <div className="text-center">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookmarks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first bookmark to get started'}
            </p>
            <Button onClick={() => setIsAddBookmarkOpen(true)} className="gap-2">
              <BookmarkPlus className="h-4 w-4" />
              Add Bookmark
            </Button>
          </div>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'space-y-2'
        }>
          {filteredBookmarks.map(bookmark => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              viewMode={viewMode}
              onClick={() => handleBookmarkClick(bookmark)}
              onToggleStar={() => toggleStar(bookmark.id)}
              onToggleFavorite={() => toggleFavorite(bookmark.id)}
              onEdit={() => setEditingBookmark(bookmark)}
              onDelete={() => deleteBookmark(bookmark.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Bookmark Card Component
interface BookmarkCardProps {
  bookmark: BookmarkItem
  viewMode: ViewMode
  onClick: () => void
  onToggleStar: () => void
  onToggleFavorite: () => void
  onEdit: () => void
  onDelete: () => void
}

function BookmarkCard({ 
  bookmark, 
  viewMode, 
  onClick, 
  onToggleStar, 
  onToggleFavorite, 
  onEdit, 
  onDelete 
}: BookmarkCardProps) {
  const categoryInfo = BOOKMARK_CATEGORIES[bookmark.category]
  const isExternal = bookmark.url.startsWith('http')

  if (viewMode === 'list') {
    return (
      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0" onClick={onClick}>
            <div 
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${bookmark.color}20`, color: bookmark.color }}
            >
              {bookmark.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{bookmark.title}</h3>
                {isExternal && <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
                {bookmark.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
                {bookmark.isFavorite && <Heart className="h-3 w-3 fill-red-500 text-red-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {bookmark.description || bookmark.url}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={categoryInfo.color} variant="secondary">
                  {categoryInfo.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {bookmark.accessCount} uses • {bookmark.lastAccessedAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleStar()
              }}
              className="h-8 w-8 p-0"
            >
              <Star className={`h-4 w-4 ${bookmark.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              className="h-8 w-8 p-0"
            >
              <Heart className={`h-4 w-4 ${bookmark.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bookmark.url)}>
                  <Share className="h-4 w-4 mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${bookmark.color}20`, color: bookmark.color }}
          >
            {bookmark.icon}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onToggleStar()
              }}
              className="h-8 w-8 p-0"
            >
              <Star className={`h-4 w-4 ${bookmark.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(bookmark.url)}>
                  <Share className="h-4 w-4 mr-2" />
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div onClick={onClick} className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{bookmark.title}</h3>
            {isExternal && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
            {bookmark.isFavorite && <Heart className="h-3 w-3 fill-red-500 text-red-500" />}
          </div>
          
          {bookmark.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {bookmark.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <Badge className={categoryInfo.color} variant="secondary">
              {categoryInfo.label}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {bookmark.accessCount} uses
            </div>
          </div>
          
          {bookmark.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {bookmark.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </Badge>
              ))}
              {bookmark.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{bookmark.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default BookmarkSystem
