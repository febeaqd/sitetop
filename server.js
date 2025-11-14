// server.js
import express from "express";
import cors from "cors";
import Parser from "rss-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const parser = new Parser();

// Список RSS-лент Украины
const RSS_FEEDS = [
  "https://www.pravda.com.ua/rss",
  "https://www.unian.ua/rss",
  "https://www.ukrinform.ua/rss",
];

// --- Новости ---
app.get("/news", async (req, res) => {
  try {
    let articles = [];

    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl);
      const feedArticles = feed.items.slice(0, 5).map((item) => ({
        title: item.title,
        description: item.contentSnippet || "",
        url: item.link,
        urlToImage: "", // RSS обычно не содержит картинок
        source: { name: feed.title || "Unknown" },
        publishedAt: item.pubDate,
      }));

      articles = articles.concat(feedArticles);
    }

    // Ограничим до 6 новостей
    articles = articles.slice(0, 6);

    res.json({ articles });
  } catch (err) {
    console.error("RSS news error", err);
    res.json({ articles: [] });
  }
});

// --- Статика React фронтенда ---
app.use(express.static(path.join(__dirname, "dist"))); // если Vite — dist, если create-react-app — build

// Для всех остальных маршрутов отдаём index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- Запуск сервера ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
