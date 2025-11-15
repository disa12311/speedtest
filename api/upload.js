export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read the body
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    chunks.push(chunk);
    totalBytes += chunk.length;
  }

  res.status(200).json({
    received: totalBytes,
    timestamp: Date.now(),
    status: 'success'
  });
}export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read the body
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    chunks.push(chunk);
    totalBytes += chunk.length;
  }

  res.status(200).json({
    received: totalBytes,
    timestamp: Date.now(),
    status: 'success'
  });
}
