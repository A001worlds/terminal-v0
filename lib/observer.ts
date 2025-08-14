import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function handleObserverAPI(request: Request) {
  try {
    const body = await request.json();
    
    if (body.action === 'scan') {
      // Generate mock detections
      const detections = [
        {
          track_id: '123',
          platform: 'youtube',
          matched_title: 'Shape of You (AI Cover)',
          confidence: 0.85,
          rule_triggered: 'ai_detection',
          breach_type: 'ai_cover',
          url: 'https://youtube.com/watch/abc123',
          timestamp: new Date()
        },
        {
          track_id: '456',
          platform: 'tiktok',
          matched_title: 'Bad Guy Remix',
          confidence: 0.72,
          rule_triggered: 'unauthorized_remix',
          breach_type: 'remix',
          url: 'https://tiktok.com/@user/video123',
          timestamp: new Date()
        }
      ];
      
      // Try to save to Supabase (ignore errors for now)
      await supabase.from('detections').insert(detections).then(() => {
        console.log('Saved to Supabase');
      }).catch(err => {
        console.log('Supabase error (ignoring):', err);
      });
      
      return Response.json({ success: true, detections });
    }
    
    return Response.json({ success: true, message: 'API is working!' });
  } catch (error) {
    return Response.json({ error: 'Something went wrong', details: String(error) });
  }
}