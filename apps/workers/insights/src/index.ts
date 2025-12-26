import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

async function generateInsights() {
  console.log('Insights Worker: Generating insights...');
  
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  // Fetch recent analytics events
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', oneDayAgo);

  if (error) {
    console.error('Error fetching analytics events:', error);
    return;
  }

  // Process events and generate insights
  const insights = processEvents(events || []);
  
  // Store insights in database
  for (const insight of insights) {
    await supabase
      .from('insights')
      .insert({
        type: insight.type,
        data: insight.data,
        generated_at: new Date().toISOString()
      });
  }
  
  console.log(`Generated ${insights.length} insights`);
}

function processEvents(events: AnalyticsEvent[]) {
  const insights: Array<{ type: string; data: any }> = [];
  
  // Count events by type
  const eventCounts: Record<string, number> = {};
  events.forEach(event => {
    eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;
  });
  
  insights.push({
    type: 'event_counts',
    data: eventCounts
  });
  
  // Count unique users
  const uniqueUsers = new Set(
    events.filter(e => e.user_id).map(e => e.user_id)
  ).size;
  
  insights.push({
    type: 'unique_users',
    data: { count: uniqueUsers }
  });
  
  return insights;
}

async function main() {
  console.log('Insights Worker started');
  
  // Generate insights every 5 minutes
  setInterval(generateInsights, 5 * 60 * 1000);
  
  // Run once on startup
  await generateInsights();
}

main().catch(console.error);
