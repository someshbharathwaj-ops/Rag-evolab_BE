export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    // Forward the query to the FastAPI backend
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const backendRes = await fetch(`${BACKEND_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!backendRes.ok) {
      throw new Error(`Backend responded with status ${backendRes.status}`);
    }

    const data = await backendRes.json();
    
    res.status(200).json({ response: data.response });
  } catch (error) {
    console.error('Error querying backend:', error);
    res.status(500).json({ 
      message: 'Error processing query', 
      error: error.message 
    });
  }
}