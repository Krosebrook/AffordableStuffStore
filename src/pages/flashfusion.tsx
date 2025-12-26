/**
 * FlashFusion Content Studio Page
 * 
 * Main page integrating all FlashFusion features:
 * - Asset generation (text, image, video, music)
 * - Brand kit validation and linting
 * - Provenance logging
 * - Campaign wizard and scheduler
 * - Marketplace for packs and presets
 * - Export as .ffpack.json
 */

import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@heroui/button';
import DefaultLayout from '@/layouts/default';
import { title } from '@/components/primitives';
import { AssetGenerator } from '@/components/flashfusion/asset-generator';
import { BrandKitEditor } from '@/components/flashfusion/brandkit-editor';
import { CampaignWizard } from '@/components/flashfusion/campaign-wizard';
import { Marketplace } from '@/components/flashfusion/marketplace';
import { ExportManager } from '@/components/flashfusion/export-manager';

type TabKey = 'generate' | 'brandkit' | 'campaign' | 'marketplace' | 'export';

export default function FlashFusionPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('generate');

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'generate', label: 'Generate Assets', icon: '✨' },
    { key: 'brandkit', label: 'Brand Kit', icon: '🎨' },
    { key: 'campaign', label: 'Campaigns', icon: '📅' },
    { key: 'marketplace', label: 'Marketplace', icon: '🏪' },
    { key: 'export', label: 'Export', icon: '📦' },
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center mb-8">
          <h1 className={title({ color: 'violet' })}>
            <Trans t={t}>FlashFusion Content Studio</Trans>
          </h1>
          <p className="text-lg text-default-600 mt-4">
            Generate text, images, videos, and music with AI. Manage brand kits,
            create campaigns, and share your templates.
          </p>
        </div>

        <div className="w-full max-w-6xl">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                color={activeTab === tab.key ? 'primary' : 'default'}
                variant={activeTab === tab.key ? 'solid' : 'bordered'}
                onClick={() => setActiveTab(tab.key)}
                startContent={<span className="text-xl">{tab.icon}</span>}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'generate' && <AssetGenerator />}
            {activeTab === 'brandkit' && <BrandKitEditor />}
            {activeTab === 'campaign' && <CampaignWizard />}
            {activeTab === 'marketplace' && <Marketplace />}
            {activeTab === 'export' && <ExportManager />}
          </div>
        </div>

        {/* Features Overview */}
        <div className="w-full max-w-6xl mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-default-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🔒 Provenance Logging</h3>
            <p className="text-sm text-default-600">
              Every asset includes model, provider, prompt hash, and dataset information
              for full traceability.
            </p>
          </div>

          <div className="p-6 bg-default-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">⚡ Async Workers</h3>
            <p className="text-sm text-default-600">
              Background job processing with automatic retry logic ensures reliable
              asset generation.
            </p>
          </div>

          <div className="p-6 bg-default-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🔐 RLS Security</h3>
            <p className="text-sm text-default-600">
              Row-level security with org_id scoping ensures your assets are protected
              and isolated.
            </p>
          </div>

          <div className="p-6 bg-default-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">✅ Brand Validation</h3>
            <p className="text-sm text-default-600">
              Automated linting and validation ensures brand consistency across all
              your assets.
            </p>
          </div>

          <div className="p-6 bg-default-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">📦 FFPack Export</h3>
            <p className="text-sm text-default-600">
              Export and share your templates, brand kits, and presets as portable
              .ffpack.json files.
            </p>
          </div>

          <div className="p-6 bg-default-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">☁️ Cloud Storage</h3>
            <p className="text-sm text-default-600">
              Assets are stored securely in Supabase buckets with automatic backup
              and versioning.
            </p>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
