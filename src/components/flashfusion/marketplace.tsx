/**
 * Marketplace Component
 * 
 * Browse and download packs and presets
 */

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import type { Pack } from '@/types/flashfusion';

// Mock marketplace data
const mockPacks: Pack[] = [
  {
    id: 'pack_1',
    name: 'Social Media Starter Pack',
    description: 'Complete set of templates for social media posts',
    authorId: 'user_1',
    assets: ['asset_1', 'asset_2', 'asset_3'],
    presets: [],
    price: 29.99,
    currency: 'USD',
    downloads: 1234,
    rating: 4.8,
    tags: ['social-media', 'templates', 'marketing'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'pack_2',
    name: 'Brand Identity Bundle',
    description: 'Professional brand identity assets including logos and guidelines',
    authorId: 'user_2',
    assets: ['asset_4', 'asset_5'],
    presets: [],
    price: 49.99,
    currency: 'USD',
    downloads: 567,
    rating: 4.9,
    tags: ['branding', 'identity', 'professional'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'pack_3',
    name: 'Music & Audio Collection',
    description: 'Royalty-free music tracks and sound effects',
    authorId: 'user_3',
    assets: ['asset_6', 'asset_7', 'asset_8'],
    presets: [],
    price: 39.99,
    currency: 'USD',
    downloads: 890,
    rating: 4.7,
    tags: ['music', 'audio', 'sound-effects'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  const filteredPacks = mockPacks.filter(pack =>
    pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pack.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pack.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDownload = (pack: Pack) => {
    console.log('Downloading pack:', pack.id);
    alert(`Downloaded: ${pack.name}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="p-6 bg-default-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Marketplace</h2>
        
        <Input
          label="Search Packs"
          placeholder="Search by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          className="mb-6"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPacks.map((pack) => (
            <div
              key={pack.id}
              className="p-4 bg-default-100 rounded-lg hover:bg-default-200 transition-colors cursor-pointer"
              onClick={() => setSelectedPack(pack)}
            >
              <div className="aspect-video bg-default-300 rounded mb-3 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              
              <h3 className="font-semibold text-lg mb-1">{pack.name}</h3>
              <p className="text-sm text-default-500 mb-2 line-clamp-2">
                {pack.description}
              </p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-primary">
                  ${pack.price}
                </span>
                <div className="flex items-center gap-1 text-sm">
                  <span>⭐</span>
                  <span>{pack.rating}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {pack.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-default-200 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="text-xs text-default-400">
                {pack.downloads} downloads
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPack && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
             onClick={() => setSelectedPack(null)}>
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full"
               onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-2">{selectedPack.name}</h2>
            <p className="text-default-500 mb-4">{selectedPack.description}</p>
            
            <div className="space-y-2 mb-4">
              <p><strong>Price:</strong> ${selectedPack.price}</p>
              <p><strong>Rating:</strong> ⭐ {selectedPack.rating}</p>
              <p><strong>Downloads:</strong> {selectedPack.downloads}</p>
              <p><strong>Assets:</strong> {selectedPack.assets.length}</p>
              <div>
                <strong>Tags:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedPack.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-default-100 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                color="primary"
                onClick={() => handleDownload(selectedPack)}
                className="flex-1"
              >
                Download Pack
              </Button>
              <Button
                color="default"
                onClick={() => setSelectedPack(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
