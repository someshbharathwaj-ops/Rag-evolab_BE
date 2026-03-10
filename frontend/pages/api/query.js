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
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      'https://rag-evolab-be.onrender.com';
    const normalizedBackendUrl = BACKEND_URL.replace(/\/+$/, '');
    const controller = new AbortController();
    const timeoutMs = Number(process.env.BACKEND_TIMEOUT_MS || 25000);
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    let backendRes;
    try {
      backendRes = await fetch(`${normalizedBackendUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!backendRes.ok) {
      let backendError = `Backend responded with status ${backendRes.status}`;
      try {
        const errJson = await backendRes.json();
        backendError = errJson?.detail || errJson?.message || backendError;
      } catch (_) {
        // Ignore parse errors and keep the status-based fallback error.
      }
      return res.status(backendRes.status).json({ message: backendError });
    }

    const data = await backendRes.json();
    
    res.status(200).json({ response: data.response });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({
        message: 'Backend request timed out. Please try again.',
      });
    }

    console.error('Error querying backend:', error);
    res.status(500).json({ 
      message: 'Error processing query', 
      error: error.message 
    });
  }
}
