export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch('https://m.stock.naver.com/domestic/index/FUT/total', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await r.text();

    // 현재 선물가 - StickyStockInfo_price 클래스에서 추출
    const priceM = html.match(/StickyStockInfo_price[^>]*>([\d,.]+)/);
    const price = priceM ? +priceM[1].replace(/,/g, '') : null;

    // 전일대비 변동률 - Fluctuation 클래스에서 추출
    const chgM = html.match(/Fluctuation_article[^>]*>[\s\S]*?([\d,.]+)([-+][\d.]+%)/);
    const chg = chgM ? chgM[2] : null;

    // 일별 시세에서 종가 (첫 번째 행)
    const closeM = html.match(/06\.10[\s\S]*?<td[^>]*>([\d,.]+)[\s\S]*?<td[^>]*>([\d,.]+)[\s\S]*?<td[^>]*>([-\d.]+%)/);
    const close = closeM ? +closeM[1].replace(/,/g, '') : null;
    const closeChg = closeM ? closeM[3] : null;

    res.json({ price, chg, close, closeChg, source: 'naver_futures' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
