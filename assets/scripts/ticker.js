/* ============================================
   UNIFIED MULTI-SOURCE JSON NEWS TICKER ENGINE
   ============================================ */

const ticker = document.getElementById("tickerMove");

// JSON sources
const sources = [
  "assets/data/american-legion.json",
  "assets/data/military.json",
  "assets/data/post200.json",
  "assets/data/scdva.json",
  "assets/data/va.json"
];

async function loadNews() {
  try {
    const allItems = [];

    // Fetch all JSON files in parallel
    const responses = await Promise.all(
      sources.map(src => fetch(src).then(r => r.ok ? r.json() : []))
    );

    // Merge arrays
    responses.forEach(arr => {
      if (Array.isArray(arr)) allItems.push(...arr);
    });

    // No items fallback
    if (!allItems.length) {
      ticker.innerHTML = `<div class="ticker-item"><span>No news items available.</span></div>`;
      return;
    }

    // Sort newest → oldest
    allItems.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    // Build ticker items
    allItems.forEach(news => {
      const item = document.createElement("div");
      item.className = "ticker-item";

      const title = news.title || "Untitled";
      const url = news.url || "#";
      const source = news.source ? `[${news.source}] ` : "";

      item.innerHTML = `<a href="${url}" target="_blank">${source}${title}</a>`;
      ticker.appendChild(item);
    });

    // Duplicate for seamless loop
    ticker.innerHTML += ticker.innerHTML;

    // Dynamic scroll speed
    const speed = 200; // pixels per second
    const totalDistance = ticker.scrollWidth * 2;
    const duration = totalDistance / speed;

    ticker.style.animation = `ticker-scroll ${duration}s linear infinite`;
    ticker.style.animationPlayState = "running";

  } catch (e) {
    console.error("Error loading unified ticker:", e);
    ticker.innerHTML = `<div class="ticker-item"><span>Unable to load news feed.</span></div>`;
  }
}

loadNews();