import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '100mb',
  },
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const size = parseInt(req.query.size) || 1; // Size in MB
  const bytes = size * 1024 * 1024;

  // Generate random data
  const data = crypto.randomBytes(bytes);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', bytes);
  res.status(200).send(data);
}
