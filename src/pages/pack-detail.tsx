import { useParams } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@heroui/button";
import { Code } from "@heroui/code";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { FFPackWithStats, FFPack } from "@/types";

// Mock data - in real app, this would fetch from API
const mockPacks: FFPackWithStats[] = [
  {
    id: "1",
    name: "E-commerce Starter",
    version: "1.2.0",
    templates: [
      { id: "t1", name: "Product Page", content: "Product template content", variables: ["title", "price"] },
      { id: "t2", name: "Cart Page", content: "Cart template content", variables: ["items"] },
    ],
    brand_kit: {
      colors: { primary: "#4F46E5", secondary: "#10B981", accent: "#F59E0B" },
      fonts: { heading: "Inter", body: "Roboto" },
    },
    assets: [
      { id: "a1", name: "Logo", type: "image/png", url: "/assets/logo.png" },
    ],
    metadata: {
      author: "John Doe",
      tags: ["e-commerce", "starter", "templates"],
      license: "MIT",
      createdAt: "2025-01-15T10:00:00Z",
      updatedAt: "2025-03-20T14:30:00Z",
    },
    isPublic: true,
    upvotes: 42,
    downvotes: 3,
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    versionHistory: [
      { 
        version: "1.2.0", 
        timestamp: "2025-03-20T14:30:00Z", 
        changes: "Added cart page template", 
        pack: {
          name: "E-commerce Starter",
          version: "1.2.0",
          templates: [
            { id: "t1", name: "Product Page", content: "Product template content", variables: ["title", "price"] },
            { id: "t2", name: "Cart Page", content: "Cart template content", variables: ["items"] },
          ],
          brand_kit: {
            colors: { primary: "#4F46E5", secondary: "#10B981", accent: "#F59E0B" },
            fonts: { heading: "Inter", body: "Roboto" },
          },
          assets: [
            { id: "a1", name: "Logo", type: "image/png", url: "/assets/logo.png" },
          ],
          metadata: {
            author: "John Doe",
            tags: ["e-commerce", "starter", "templates"],
            license: "MIT",
            createdAt: "2025-01-15T10:00:00Z",
            updatedAt: "2025-03-20T14:30:00Z",
          },
        }
      },
      { 
        version: "1.1.0", 
        timestamp: "2025-02-10T09:15:00Z", 
        changes: "Updated brand kit colors", 
        pack: {
          name: "E-commerce Starter",
          version: "1.1.0",
          templates: [
            { id: "t1", name: "Product Page", content: "Product template content", variables: ["title", "price"] },
          ],
          brand_kit: {
            colors: { primary: "#3B82F6", secondary: "#10B981", accent: "#F59E0B" },
            fonts: { heading: "Inter", body: "Roboto" },
          },
          assets: [
            { id: "a1", name: "Logo", type: "image/png", url: "/assets/logo.png" },
          ],
          metadata: {
            author: "John Doe",
            tags: ["e-commerce", "starter", "templates"],
            license: "MIT",
            createdAt: "2025-01-15T10:00:00Z",
            updatedAt: "2025-02-10T09:15:00Z",
          },
        }
      },
      { 
        version: "1.0.0", 
        timestamp: "2025-01-15T10:00:00Z", 
        changes: "Initial release", 
        pack: {
          name: "E-commerce Starter",
          version: "1.0.0",
          templates: [
            { id: "t1", name: "Product Page", content: "Product template content", variables: ["title", "price"] },
          ],
          brand_kit: {
            colors: { primary: "#3B82F6", secondary: "#10B981" },
            fonts: { heading: "Inter", body: "Roboto" },
          },
          assets: [],
          metadata: {
            author: "John Doe",
            tags: ["e-commerce", "starter"],
            license: "MIT",
            createdAt: "2025-01-15T10:00:00Z",
            updatedAt: "2025-01-15T10:00:00Z",
          },
        }
      },
    ],
  },
];

export default function PackDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  
  const pack = mockPacks.find(p => p.id === id);

  if (!pack) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <h1 className={title()}>Pack not found</h1>
        </section>
      </DefaultLayout>
    );
  }

  const handleExport = () => {
    const packJson: FFPack = {
      name: pack.name,
      version: pack.version,
      templates: pack.templates,
      brand_kit: pack.brand_kit,
      assets: pack.assets,
      metadata: pack.metadata,
    };
    const dataStr = JSON.stringify(packJson, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${pack.name.toLowerCase().replace(/\s+/g, '-')}.ffpack.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = () => {
    // In a real implementation, this would open a file picker and load the pack for editing
    window.location.href = `/pack-editor?pack=${pack.id}`;
  };

  const handleRemix = () => {
    // In a real implementation, this would create a copy and redirect to editor
    window.location.href = `/pack-editor?remix=${pack.id}`;
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col gap-8 py-8 md:py-10 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className={title()}>{pack.name}</h1>
              <p className="text-lg text-default-600 mt-2">
                <Trans t={t}>version</Trans>: {pack.version}
              </p>
            </div>
            <div className="flex gap-2">
              <Button color="primary" onClick={handleRemix}>
                <Trans t={t}>remix</Trans>
              </Button>
              <Button variant="bordered" onClick={handleExport}>
                <Trans t={t}>export</Trans>
              </Button>
              <Button variant="bordered" onClick={handleImport}>
                <Trans t={t}>import</Trans>
              </Button>
            </div>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 mb-4">
            {pack.authorAvatar && (
              <img 
                src={pack.authorAvatar} 
                alt={pack.metadata.author}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">{pack.metadata.author}</p>
              <p className="text-sm text-default-500">{pack.metadata.license}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {pack.metadata.tags.map((tag, index) => (
              <span key={index} className="text-sm bg-default-100 px-3 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Voting */}
          <div className="flex items-center gap-4">
            <Button size="sm" variant="flat" color="success">
              ▲ {pack.upvotes}
            </Button>
            <Button size="sm" variant="flat" color="danger">
              ▼ {pack.downvotes}
            </Button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Templates */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              <Trans t={t}>templates</Trans>
            </h2>
            <div className="space-y-4">
              {pack.templates.map((template) => (
                <div key={template.id} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <Code className="text-sm">{template.content}</Code>
                  {template.variables && template.variables.length > 0 && (
                    <p className="text-sm text-default-500 mt-2">
                      Variables: {template.variables.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brand Kit */}
          {pack.brand_kit && (
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">
                <Trans t={t}>brand-kit</Trans>
              </h2>
              {pack.brand_kit.colors && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Colors</h3>
                  <div className="space-y-2">
                    {pack.brand_kit.colors.primary && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: pack.brand_kit.colors.primary }}
                        />
                        <span className="text-sm">Primary: {pack.brand_kit.colors.primary}</span>
                      </div>
                    )}
                    {pack.brand_kit.colors.secondary && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: pack.brand_kit.colors.secondary }}
                        />
                        <span className="text-sm">Secondary: {pack.brand_kit.colors.secondary}</span>
                      </div>
                    )}
                    {pack.brand_kit.colors.accent && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: pack.brand_kit.colors.accent }}
                        />
                        <span className="text-sm">Accent: {pack.brand_kit.colors.accent}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {pack.brand_kit.fonts && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Fonts</h3>
                  <div className="space-y-1">
                    {pack.brand_kit.fonts.heading && (
                      <p className="text-sm">Heading: {pack.brand_kit.fonts.heading}</p>
                    )}
                    {pack.brand_kit.fonts.body && (
                      <p className="text-sm">Body: {pack.brand_kit.fonts.body}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assets */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              <Trans t={t}>assets</Trans>
            </h2>
            <div className="space-y-3">
              {pack.assets.length > 0 ? (
                pack.assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <p className="font-semibold">{asset.name}</p>
                      <p className="text-sm text-default-500">{asset.type}</p>
                    </div>
                    <a href={asset.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="flat">View</Button>
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-default-500 text-sm">No assets in this pack</p>
              )}
            </div>
          </div>

          {/* Version History */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              <Trans t={t}>version-history</Trans>
            </h2>
            <div className="space-y-4">
              {pack.versionHistory.map((version, index) => (
                <div key={index} className="border-l-2 border-primary pl-4 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{version.version}</span>
                    <span className="text-xs text-default-500">
                      {new Date(version.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-default-600">{version.changes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            <Trans t={t}>metadata</Trans>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-default-500">
                <Trans t={t}>created-at</Trans>
              </p>
              <p className="font-semibold">{new Date(pack.metadata.createdAt!).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-default-500">
                <Trans t={t}>updated-at</Trans>
              </p>
              <p className="font-semibold">{new Date(pack.metadata.updatedAt!).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
