export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol, range = '5d', interval = '1d' } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}`;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'Yahoo API error' });

    const d = await r.json();
    const m = d.chart.result[0].meta;
    const prices = d.chart.result[0].indicators?.quote?.[0]?.close?.filter(Boolean) || [];
    const prev = prices.length >= 2 ? prices[prices.length - 2] : m.chartPreviousClose || m.previousClose;

    res.json({
      price: m.regularMarketPrice,
      prev: prev,
      ms: m.marketState,
      cur: m.currency,
      prices: prices
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
