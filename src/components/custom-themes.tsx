"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Eye,
  Contrast,
  Type,
  Layout,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

interface CustomTheme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  card: string
  border: string
  isCustom: boolean
  preview?: string
}

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system'
  colorScheme: string
  fontSize: number
  borderRadius: number
  density: 'compact' | 'comfortable' | 'spacious'
  animations: boolean
  highContrast: boolean
  reducedMotion: boolean
}

export default function CustomThemes() {
  const [currentTheme, setCurrentTheme] = useState('default')
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    mode: 'light',
    colorScheme: 'blue',
    fontSize: 14,
    borderRadius: 6,
    density: 'comfortable',
    animations: true,
    highContrast: false,
    reducedMotion: false
  })

  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([
    {
      id: 'default',
      name: 'Default',
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#0F172A',
      muted: '#F1F5F9',
      card: '#FFFFFF',
      border: '#E2E8F0',
      isCustom: false
    },
    {
      id: 'dark',
      name: 'Dark',
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#F59E0B',
      background: '#0F172A',
      foreground: '#F8FAFC',
      muted: '#1E293B',
      card: '#1E293B',
      border: '#334155',
      isCustom: false
    },
    {
      id: 'ocean',
      name: 'Ocean',
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      accent: '#10B981',
      background: '#F0F9FF',
      foreground: '#0C4A6E',
      muted: '#E0F2FE',
      card: '#FFFFFF',
      border: '#BAE6FD',
      isCustom: false
    },
    {
      id: 'sunset',
      name: 'Sunset',
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#EC4899',
      background: '#FFFBEB',
      foreground: '#92400E',
      muted: '#FEF3C7',
      card: '#FFFFFF',
      border: '#FDE68A',
      isCustom: false
    }
  ])

  const colorSchemes = [
    { id: 'blue', name: 'Blue', color: '#3B82F6' },
    { id: 'green', name: 'Green', color: '#10B981' },
    { id: 'purple', name: 'Purple', color: '#8B5CF6' },
    { id: 'pink', name: 'Pink', color: '#EC4899' },
    { id: 'orange', name: 'Orange', color: '#F59E0B' },
    { id: 'red', name: 'Red', color: '#EF4444' }
  ]

  useEffect(() => {
    // Load saved theme settings
    const savedSettings = localStorage.getItem('theme-settings')
    if (savedSettings) {
      setThemeSettings(JSON.parse(savedSettings))
    }

    const savedTheme = localStorage.getItem('current-theme')
    if (savedTheme) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const saveSettings = () => {
    localStorage.setItem('theme-settings', JSON.stringify(themeSettings))
    localStorage.setItem('current-theme', currentTheme)
    
    // Apply theme to document
    applyTheme()
    
    toast.success('Theme settings saved!')
  }

  const applyTheme = () => {
    const theme = customThemes.find(t => t.id === currentTheme)
    if (!theme) return

    const root = document.documentElement
    
    // Apply color variables
    root.style.setProperty('--primary', theme.primary)
    root.style.setProperty('--secondary', theme.secondary)
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--background', theme.background)
    root.style.setProperty('--foreground', theme.foreground)
    root.style.setProperty('--muted', theme.muted)
    root.style.setProperty('--card', theme.card)
    root.style.setProperty('--border', theme.border)
    
    // Apply theme mode
    root.classList.remove('light', 'dark')
    if (themeSettings.mode === 'system') {
      root.classList.add(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    } else {
      root.classList.add(themeSettings.mode)
    }
    
    // Apply font size
    root.style.setProperty('--font-size-base', `${themeSettings.fontSize}px`)
    
    // Apply border radius
    root.style.setProperty('--border-radius', `${themeSettings.borderRadius}px`)
    
    // Apply density
    const densityMap = {
      compact: '0.75',
      comfortable: '1',
      spacious: '1.25'
    }
    root.style.setProperty('--spacing-scale', densityMap[themeSettings.density])
    
    // Apply accessibility settings
    if (themeSettings.reducedMotion) {
      root.style.setProperty('--motion-reduce', 'reduce')
    } else {
      root.style.setProperty('--motion-reduce', 'no-preference')
    }
  }

  const createCustomTheme = () => {
    const newTheme: CustomTheme = {
      id: `custom-${Date.now()}`,
      name: 'My Custom Theme',
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#0F172A',
      muted: '#F1F5F9',
      card: '#FFFFFF',
      border: '#E2E8F0',
      isCustom: true
    }
    
    setCustomThemes([...customThemes, newTheme])
    setCurrentTheme(newTheme.id)
    toast.success('Custom theme created!')
  }

  const duplicateTheme = (themeId: string) => {
    const originalTheme = customThemes.find(t => t.id === themeId)
    if (!originalTheme) return
    
    const duplicatedTheme: CustomTheme = {
      ...originalTheme,
      id: `custom-${Date.now()}`,
      name: `${originalTheme.name} Copy`,
      isCustom: true
    }
    
    setCustomThemes([...customThemes, duplicatedTheme])
    toast.success('Theme duplicated!')
  }

  const deleteTheme = (themeId: string) => {
    if (!customThemes.find(t => t.id === themeId)?.isCustom) {
      toast.error('Cannot delete default themes')
      return
    }
    
    setCustomThemes(customThemes.filter(t => t.id !== themeId))
    if (currentTheme === themeId) {
      setCurrentTheme('default')
    }
    toast.success('Custom theme deleted!')
  }

  const updateCustomTheme = (themeId: string, updates: Partial<CustomTheme>) => {
    setCustomThemes(themes =>
      themes.map(theme =>
        theme.id === themeId ? { ...theme, ...updates } : theme
      )
    )
  }

  const exportTheme = (themeId: string) => {
    const theme = customThemes.find(t => t.id === themeId)
    if (!theme) return
    
    const exportData = {
      theme,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Theme exported!')
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string)
        const importedTheme: CustomTheme = {
          ...importData.theme,
          id: `imported-${Date.now()}`,
          isCustom: true
        }
        
        setCustomThemes([...customThemes, importedTheme])
        toast.success('Theme imported successfully!')
      } catch (error) {
        toast.error('Invalid theme file')
      }
    }
    reader.readAsText(file)
  }

  const resetToDefaults = () => {
    setThemeSettings({
      mode: 'light',
      colorScheme: 'blue',
      fontSize: 14,
      borderRadius: 6,
      density: 'comfortable',
      animations: true,
      highContrast: false,
      reducedMotion: false
    })
    setCurrentTheme('default')
    toast.success('Settings reset to defaults!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
          <Palette className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Themes</h1>
          <p className="text-gray-600">Personalize your interface with custom themes and settings</p>
        </div>
      </div>

      <Tabs defaultValue="themes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="themes">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Available Themes</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={createCustomTheme}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Theme
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customThemes.map((theme) => (
                <Card 
                  key={theme.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    currentTheme === theme.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setCurrentTheme(theme.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{theme.name}</CardTitle>
                      {currentTheme === theme.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    {theme.isCustom && (
                      <Badge variant="secondary" className="w-fit">Custom</Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Color Preview */}
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.background }}
                      />
                    </div>

                    {/* Theme Preview */}
                    <div 
                      className="h-20 rounded border p-2 text-xs"
                      style={{ 
                        backgroundColor: theme.background,
                        color: theme.foreground,
                        borderColor: theme.border
                      }}
                    >
                      <div 
                        className="h-2 rounded mb-1"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div 
                        className="h-1 rounded mb-1 w-3/4"
                        style={{ backgroundColor: theme.muted }}
                      />
                      <div 
                        className="h-1 rounded w-1/2"
                        style={{ backgroundColor: theme.secondary }}
                      />
                    </div>

                    {theme.isCustom && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            duplicateTheme(theme.id)
                          }}
                        >
                          Duplicate
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            exportTheme(theme.id)
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTheme(theme.id)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Configure the overall look and feel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <Select
                    value={themeSettings.mode}
                    onValueChange={(value: any) => 
                      setThemeSettings({ ...themeSettings, mode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.id}
                        className={`flex items-center gap-2 p-2 rounded border text-left transition-colors ${
                          themeSettings.colorScheme === scheme.id 
                            ? 'border-primary bg-primary/10' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => 
                          setThemeSettings({ ...themeSettings, colorScheme: scheme.id })
                        }
                      >
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: scheme.color }}
                        />
                        <span className="text-sm">{scheme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interface Density</Label>
                  <Select
                    value={themeSettings.density}
                    onValueChange={(value: any) => 
                      setThemeSettings({ ...themeSettings, density: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography & Layout</CardTitle>
                <CardDescription>
                  Fine-tune text and spacing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Font Size: {themeSettings.fontSize}px</Label>
                  <Slider
                    value={[themeSettings.fontSize]}
                    onValueChange={([value]) => 
                      setThemeSettings({ ...themeSettings, fontSize: value })
                    }
                    min={12}
                    max={18}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Border Radius: {themeSettings.borderRadius}px</Label>
                  <Slider
                    value={[themeSettings.borderRadius]}
                    onValueChange={([value]) => 
                      setThemeSettings({ ...themeSettings, borderRadius: value })
                    }
                    min={0}
                    max={16}
                    step={2}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Animations</Label>
                    <p className="text-sm text-gray-600">
                      Enable smooth transitions and animations
                    </p>
                  </div>
                  <Switch
                    checked={themeSettings.animations}
                    onCheckedChange={(checked) => 
                      setThemeSettings({ ...themeSettings, animations: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Options</CardTitle>
              <CardDescription>
                Configure accessibility features for better usability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Contrast className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="text-base font-medium">High Contrast</Label>
                    <p className="text-sm text-gray-600">
                      Increase contrast for better visibility
                    </p>
                  </div>
                </div>
                <Switch
                  checked={themeSettings.highContrast}
                  onCheckedChange={(checked) => 
                    setThemeSettings({ ...themeSettings, highContrast: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label className="text-base font-medium">Reduced Motion</Label>
                    <p className="text-sm text-gray-600">
                      Minimize animations and transitions
                    </p>
                  </div>
                </div>
                <Switch
                  checked={themeSettings.reducedMotion}
                  onCheckedChange={(checked) => 
                    setThemeSettings({ ...themeSettings, reducedMotion: checked })
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Keyboard Navigation</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Use Tab to navigate between elements</p>
                  <p>• Use Enter or Space to activate buttons</p>
                  <p>• Use arrow keys in dropdowns and lists</p>
                  <p>• Press Escape to close modals and dropdowns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
              <CardDescription>
                Advanced theme customization and management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Button onClick={saveSettings} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Apply Settings
                </Button>
                
                <Button variant="outline" onClick={resetToDefaults}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Theme Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-1">Total Themes</p>
                    <p className="text-gray-600">{customThemes.length} themes available</p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-1">Custom Themes</p>
                    <p className="text-gray-600">
                      {customThemes.filter(t => t.isCustom).length} custom themes
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Create custom themes to match your brand</li>
                    <li>• Export themes to share with your team</li>
                    <li>• Use system mode for automatic dark/light switching</li>
                    <li>• Enable high contrast for better accessibility</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
