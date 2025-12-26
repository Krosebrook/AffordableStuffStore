import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function processRenderJob() {
  console.log('Render Worker: Processing render jobs...');
  
  // Poll for pending render jobs from Supabase
  const { data: jobs, error } = await supabase
    .from('render_jobs')
    .select('*')
    .eq('status', 'pending')
    .limit(10);

  if (error) {
    console.error('Error fetching render jobs:', error);
    return;
  }

  for (const job of jobs || []) {
    console.log(`Processing job ${job.id}...`);
    
    try {
      // Update job status to processing
      await supabase
        .from('render_jobs')
        .update({ status: 'processing' })
        .eq('id', job.id);

      // Simulate render processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update job status to completed
      await supabase
        .from('render_jobs')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);

      console.log(`Job ${job.id} completed`);
    } catch (err) {
      console.error(`Error processing job ${job.id}:`, err);
      await supabase
        .from('render_jobs')
        .update({ status: 'failed' })
        .eq('id', job.id);
    }
  }
}

async function main() {
  console.log('Render Worker started');
  
  // Process jobs every 5 seconds
  setInterval(processRenderJob, 5000);
}

main().catch(console.error);
