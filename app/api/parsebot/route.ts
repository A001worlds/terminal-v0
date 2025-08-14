export async function POST(request: Request) {
  const { action, query } = await request.json();
  
  const API_KEY = process.env.PARSEBOT_API_KEY;
  
  // Check if API key exists
  if (!API_KEY) {
    return Response.json({ 
      error: 'ParseBot API key not found',
      details: 'Please add PARSEBOT_API_KEY to your .env.local file'
    });
  }
  
  try {
    // ParseBot API endpoint - we'll try a simple test first
    const response = await fetch('https://api.parsebot.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        platform: 'youtube',
        query: query || "Shape of You AI Cover",
        limit: 5
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return Response.json({ 
        error: 'ParseBot API error',
        status: response.status,
        details: errorText
      });
    }
    
    const data = await response.json();
    return Response.json({ success: true, results: data });
    
  } catch (error: any) {
    return Response.json({ 
      error: 'ParseBot connection failed',
      details: error.message || 'Unknown error'
    });
  }
}
