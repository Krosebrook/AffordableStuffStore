/**
 * Asset Generator Component
 * 
 * UI for generating text, image, video, and music assets
 */

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import type { AssetType } from '@/types/flashfusion';
import { getWorkerService } from '@/services/worker-service';

const workerService = getWorkerService();

export function AssetGenerator() {
  const [selectedType, setSelectedType] = useState<AssetType>('text');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJobId, setGeneratedJobId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      // Create a worker job
      const job = workerService.createJob(
        selectedType,
        'demo-org-id', // In production, get from auth context
        'demo-user-id',
        prompt,
        {},
      );

      setGeneratedJobId(job.id);
      
      // Poll for job completion
      const pollInterval = setInterval(() => {
        const updatedJob = workerService.getJob(job.id);
        if (updatedJob && (updatedJob.status === 'completed' || updatedJob.status === 'failed')) {
          clearInterval(pollInterval);
          setIsGenerating(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
    }
  };

  const assetTypes: { key: AssetType; label: string }[] = [
    { key: 'text', label: 'Text' },
    { key: 'image', label: 'Image' },
    { key: 'video', label: 'Video' },
    { key: 'music', label: 'Music' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="p-6 bg-default-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Generate Assets</h2>
        
        <div className="flex gap-2 mb-4">
          {assetTypes.map((type) => (
            <Button
              key={type.key}
              color={selectedType === type.key ? 'primary' : 'default'}
              variant={selectedType === type.key ? 'solid' : 'bordered'}
              onClick={() => setSelectedType(type.key)}
            >
              {type.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          <Input
            label="Prompt"
            placeholder={`Describe the ${selectedType} you want to generate...`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
          />

          <Button
            color="primary"
            onClick={handleGenerate}
            isLoading={isGenerating}
            isDisabled={!prompt.trim()}
            fullWidth
          >
            {isGenerating ? 'Generating...' : `Generate ${selectedType}`}
          </Button>

          {generatedJobId && (
            <div className="mt-4 p-4 bg-default-100 rounded-lg">
              <p className="text-sm">
                Job ID: <code className="text-primary">{generatedJobId}</code>
              </p>
              <p className="text-sm mt-2">
                Status: {workerService.getJob(generatedJobId)?.status || 'unknown'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
