"use client"

import { useTranslations } from 'next-intl'
import { SecurityDashboard } from '@/components/security-dashboard'
import { AuditTrail } from '@/components/audit-trail'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Activity, AlertTriangle, Eye } from 'lucide-react'

export default function SecurityPage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            {t('nav.security')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('security.subtitle')}
          </p>
        </div>

        {/* Security Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('security.dashboard')}
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t('security.threats')}
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {t('security.auditTrail')}
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('security.monitoring')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="threats">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="audit">
            <AuditTrail />
          </TabsContent>

          <TabsContent value="monitoring">
            <SecurityDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
