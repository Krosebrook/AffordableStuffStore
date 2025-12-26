import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function processScheduledTasks() {
  console.log('Schedule Worker: Processing scheduled tasks...');
  
  const now = new Date().toISOString();
  
  // Poll for scheduled tasks from Supabase
  const { data: tasks, error } = await supabase
    .from('scheduled_tasks')
    .select('*')
    .lte('scheduled_at', now)
    .eq('status', 'pending')
    .limit(10);

  if (error) {
    console.error('Error fetching scheduled tasks:', error);
    return;
  }

  for (const task of tasks || []) {
    console.log(`Processing task ${task.id}...`);
    
    try {
      // Update task status to processing
      await supabase
        .from('scheduled_tasks')
        .update({ status: 'processing' })
        .eq('id', task.id);

      // Execute the scheduled task
      await executeTask(task);

      // Update task status to completed
      await supabase
        .from('scheduled_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', task.id);

      console.log(`Task ${task.id} completed`);
    } catch (err) {
      console.error(`Error processing task ${task.id}:`, err);
      await supabase
        .from('scheduled_tasks')
        .update({ status: 'failed' })
        .eq('id', task.id);
    }
  }
}

async function executeTask(task: any) {
  // Task execution logic
  console.log(`Executing task type: ${task.task_type}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function main() {
  console.log('Schedule Worker started');
  
  // Process tasks every 10 seconds
  setInterval(processScheduledTasks, 10000);
}

main().catch(console.error);
