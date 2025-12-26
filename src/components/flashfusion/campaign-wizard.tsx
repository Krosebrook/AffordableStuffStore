/**
 * Campaign Wizard Component
 * 
 * UI for creating campaigns with scheduler timeline
 */

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import type { Campaign, CampaignScheduleItem } from '@/types/flashfusion';

export function CampaignWizard() {
  const [campaign, setCampaign] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    assets: [],
    schedule: [],
    status: 'draft',
  });

  const [newScheduleItem, setNewScheduleItem] = useState({
    assetId: '',
    scheduledAt: '',
    platform: '',
  });

  const addScheduleItem = () => {
    if (newScheduleItem.assetId && newScheduleItem.scheduledAt) {
      const scheduleItem: CampaignScheduleItem = {
        id: `schedule_${Date.now()}`,
        assetId: newScheduleItem.assetId,
        scheduledAt: new Date(newScheduleItem.scheduledAt),
        platform: newScheduleItem.platform || undefined,
        status: 'pending',
      };
      
      setCampaign({
        ...campaign,
        schedule: [...(campaign.schedule || []), scheduleItem],
      });
      
      setNewScheduleItem({ assetId: '', scheduledAt: '', platform: '' });
    }
  };

  const createCampaign = () => {
    const newCampaign: Campaign = {
      id: `campaign_${Date.now()}`,
      name: campaign.name!,
      description: campaign.description,
      orgId: 'demo-org-id',
      assets: campaign.assets || [],
      schedule: campaign.schedule || [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('Campaign created:', newCampaign);
    alert('Campaign created successfully!');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="p-6 bg-default-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Campaign Wizard</h2>
        
        <div className="space-y-4">
          <Input
            label="Campaign Name"
            placeholder="Enter campaign name"
            value={campaign.name || ''}
            onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
            fullWidth
          />

          <Input
            label="Description"
            placeholder="Campaign description..."
            value={campaign.description || ''}
            onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
            fullWidth
          />

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Schedule Timeline</h3>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Input
                label="Asset ID"
                placeholder="asset_123"
                value={newScheduleItem.assetId}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, assetId: e.target.value })}
              />
              <Input
                label="Scheduled Date"
                type="datetime-local"
                value={newScheduleItem.scheduledAt}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, scheduledAt: e.target.value })}
              />
              <Input
                label="Platform"
                placeholder="Twitter, Instagram..."
                value={newScheduleItem.platform}
                onChange={(e) => setNewScheduleItem({ ...newScheduleItem, platform: e.target.value })}
              />
            </div>
            
            <Button size="sm" onClick={addScheduleItem}>Add Schedule Item</Button>
            
            <div className="mt-4 space-y-2">
              {campaign.schedule?.map((item, i) => (
                <div key={i} className="p-3 bg-default-100 rounded flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Asset: {item.assetId}</p>
                    <p className="text-xs text-default-500">
                      {new Date(item.scheduledAt).toLocaleString()}
                      {item.platform && ` • ${item.platform}`}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.status === 'pending' ? 'bg-warning text-warning-foreground' :
                    item.status === 'published' ? 'bg-success text-success-foreground' :
                    'bg-danger text-danger-foreground'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button
            color="primary"
            onClick={createCampaign}
            isDisabled={!campaign.name}
            fullWidth
          >
            Create Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
