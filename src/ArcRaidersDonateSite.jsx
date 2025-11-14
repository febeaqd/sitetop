import React, { useEffect, useState } from "react";

/*
  Параметры — уже заполнены по твоему сообщению.
  Если хочешь заменить фон — поменяй BACKGROUND_IMAGE_URL.
  ARC_IMAGE_URL можно оставить или заменить.
  CRYPTO_ADDRESS — замени на реальный.
*/

const BACKGROUND_IMAGE_URL = "https://i.imgur.com/MqX3t4a.jpeg";
const ARC_IMAGE_URL = "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1808500/04baafaf64a5aa5f46ecda5d71889a4848dc0628/header.jpg?t=1762957298";
const CRYPTO_ADDRESS = "0xDEADBEEF0123456789ABCDEF0123456789ABCDEF";
const TARGET_USD = 39.99;
const PERCENT = 21;
const RAISED_USD = +(TARGET_USD * (PERCENT / 100)).toFixed(2);

export default function ArcRaidersDonateSite() {
  const [news, setNews] = useState([]);
  const [copied, setCopied] = useState(false);

  const donors = [
    { name: "лил влад", comment: "Удачи!" },
    { name: "данило", comment: "Поспешил на релиз" },
    { name: "алешенька", comment: "Немного, но от сердца" },
    { name: "анатолий жижовник", comment: "За хорошие стримы" },
    { name: "артур халтура", comment: "В топку ботов" },
  ];

useEffect(() => {
  fetch("https://sitetopdonationarcraiders.onrender.com/news")
    .then((r) => r.json())
    .then((data) => {
      if (data && data.articles) setNews(data.articles);
      else setNews([]);
    })
    .catch(() => setNews([]));
}, []);


  function copyAddress() {
    navigator.clipboard.writeText(CRYPTO_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  function openDonate() {
    // пример: если хочешь открыть внешний кошелёк — подставь url
    window.open(`https://wallet.example/send?to=${CRYPTO_ADDRESS}&amount=${TARGET_USD}`, "_blank");
  }

  // QR через внешний сервис (не нужен пакет)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    CRYPTO_ADDRESS
  )}`;

  return (
    <div
      className="page"
      style={{
        backgroundImage: `linear-gradient(rgba(6,6,8,0.45), rgba(6,6,8,0.45)), url(${BACKGROUND_IMAGE_URL})`,
      }}
    >
      <div className="wrap">
        <header className="header">
          <div className="brand">
            <img src={ARC_IMAGE_URL} alt="Arc Raiders" className="arc-cover" />
            <div>
              <h1>Arc Raiders — Помощь на покупку</h1>
              <p className="muted">Цель: <strong>${TARGET_USD.toFixed(2)}</strong></p>
            </div>
          </div>
          <div className="actions">
            <button className="btn ghost" onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}>
              Поддержать
            </button>
          </div>
        </header>

        <main className="main-grid">
          <section className="panel">
            <h2>Прогресс доната</h2>
            <div className="progress-row">
              <div className="meta">
                <div className="big">${RAISED_USD}</div>
                <div className="muted">{PERCENT}% от цели</div>
              </div>
              <div className="progress-bar" aria-hidden>
                <div className="fill" style={{ width: `${PERCENT}%` }} />
              </div>
            </div>

            <div className="donate-actions">
              <div className="address">
                <div className="label">Крипто-адрес</div>
                <div className="addr-box">
                  <code>{CRYPTO_ADDRESS}</code>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn" onClick={copyAddress}>{copied ? "Скопировано" : "Копировать"}</button>
                    <a className="btn outline" href={qrUrl} target="_blank" rel="noreferrer">Открыть QR</a>
                  </div>
                </div>
              </div>

              <div className="donate-cta">
                <button className="btn primary large" onClick={openDonate}>Донат ${TARGET_USD.toFixed(2)}</button>
                <div className="muted small">Или отправьте любую сумму на адрес выше</div>
              </div>
            </div>
          </section>

          <aside className="panel side">
            <h3>Последние донаты</h3>
            <ul className="donors">
              {donors.map((d, i) => (
                <li key={i}>
                  <div className="avatar">{d.name[0].toUpperCase()}</div>
                  <div>
                    <div className="donor-name">{d.name}</div>
                    <div className="muted small">{d.comment}</div>
                  </div>
                </li>
              ))}
            </ul>

            <h3 style={{ marginTop: 20 }}>Новости Украины</h3>
            {news.length === 0 ? (
              <div className="muted small">Новости не найдены или идут через proxy.</div>
            ) : (
              <ul className="news">
                {news.map((n, idx) => (
                  <li key={idx}>
                    <a href={n.url} target="_blank" rel="noreferrer">{n.title}</a>
                    <div className="muted tiny">{n.source?.name} • {new Date(n.publishedAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </main>

        <footer className="footer">
          <div>Made with ♥ — Modern 2025 UI</div>
          <div className="muted tiny">Images: use official assets for publishing.</div>
        </footer>
      </div>
    </div>
  );
}
