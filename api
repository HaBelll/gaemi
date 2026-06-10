export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'code required' });

  try {
    const url = 'https://finance.naver.com/item/main.naver?code=' + code;
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await r.text();

    const priceM = html.match(/class="no_today".*?<span class="blind">([\d,]+)/s);
    const prevM = html.match(/class="no_exday".*?<em.*?<span class="blind">([\d,]+)/s);

    const price = priceM ? +priceM[1].replace(/,/g, '') : null;
    const prev = prevM ? +prevM[1].replace(/,/g, '') : null;

    res.json({ price, prev, cur: 'KRW', source: 'naver' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
