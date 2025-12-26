/**
 * Export Manager Component
 * 
 * UI for exporting templates as .ffpack.json files
 */

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import type { Asset, BrandKit } from '@/types/flashfusion';
import { exportFFPack, downloadFFPack, importFFPack } from '@/utils/ffpack-export';

export function ExportManager() {
  const [packName, setPackName] = useState('');
  const [packDescription, setPackDescription] = useState('');
  const [selectedAssets] = useState<Asset[]>([
    {
      id: 'asset_1',
      type: 'text',
      name: 'Sample Text Asset',
      content: 'This is a sample text content',
      orgId: 'demo-org-id',
      provenance: {
        model: 'gpt-4',
        provider: 'openai',
        promptHash: 'abc123',
        createdAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleExport = () => {
    if (!packName) {
      alert('Please enter a pack name');
      return;
    }

    const ffpack = exportFFPack(
      packName,
      selectedAssets,
      undefined,
      [],
      packDescription,
    );

    downloadFFPack(ffpack);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const ffpack = await importFFPack(file);
      console.log('Imported FFPack:', ffpack);
      alert(`Successfully imported: ${ffpack.name}\nAssets: ${ffpack.assets.length}`);
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import FFPack file');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-6 bg-default-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Export Manager</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Export as .ffpack.json</h3>
            
            <Input
              label="Pack Name"
              placeholder="My Awesome Pack"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              fullWidth
              className="mb-2"
            />
            
            <Input
              label="Description"
              placeholder="Pack description..."
              value={packDescription}
              onChange={(e) => setPackDescription(e.target.value)}
              fullWidth
              className="mb-2"
            />

            <div className="p-3 bg-default-100 rounded mb-2">
              <p className="text-sm font-medium mb-1">Selected Assets:</p>
              <ul className="text-sm text-default-500">
                {selectedAssets.map((asset) => (
                  <li key={asset.id}>• {asset.name} ({asset.type})</li>
                ))}
              </ul>
            </div>

            <Button
              color="primary"
              onClick={handleExport}
              fullWidth
            >
              Export as .ffpack.json
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Import .ffpack.json</h3>
            
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept=".json,.ffpack.json"
                onChange={handleImport}
                className="block w-full text-sm text-default-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90
                  cursor-pointer"
              />
              <p className="text-xs text-default-400">
                Select a .ffpack.json file to import
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">FFPack Format Info</h3>
            <div className="p-3 bg-default-100 rounded text-sm space-y-1">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Format:</strong> JSON</p>
              <p><strong>Includes:</strong> Assets, Brand Kits, Presets, Provenance Metadata</p>
              <p><strong>Use Cases:</strong> Template sharing, Asset backup, Team collaboration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
