export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const r = await fetch('https://esignal.co.kr/kospi200-futures-night/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await r.text();

    // 현재 선물가 - SPAN 태그에서 4자리 이상 숫자 추출
    const priceM = html.match(/<SPAN[^>]*>([\d,]+\.\d{2})<\/SPAN>/i);
    const price = priceM ? +priceM[1].replace(/,/g, '') : null;

    // 시가
    const openM = html.match(/class="opend"[^>]*>([\d,]+\.\d{2})/);
    const open = openM ? +openM[1].replace(/,/g, '') : null;

    // 고가
    const highM = html.match(/class="highd"[^>]*>([\d,]+\.\d{2})/);
    const high = highM ? +highM[1].replace(/,/g, '') : null;

    // 저가
    const lowM = html.match(/class="lowd"[^>]*>([\d,]+\.\d{2})/);
    const low = lowM ? +lowM[1].replace(/,/g, '') : null;

    // 전일종가 (주간 종가)
    const closeM = html.match(/class="closesd"[^>]*>([\d,]+\.\d{2})/);
    const close = closeM ? +closeM[1].replace(/,/g, '') : null;

    res.json({ price, open, high, low, close, source: 'esignal' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
