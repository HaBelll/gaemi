export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint, symbol } = req.query;
  if (!endpoint || !symbol) return res.status(400).json({ error: 'endpoint and symbol required' });

  // 허용된 endpoint만
  const allowed = ['ticker/24hr', 'premiumIndex'];
  if (!allowed.includes(endpoint)) return res.status(400).json({ error: 'invalid endpoint' });

  try {
    const url = `https://fapi.binance.com/fapi/v1/${endpoint}?symbol=${encodeURIComponent(symbol)}`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'Binance API error' });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
