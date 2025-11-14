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

// RSS ленты
const RSS_FEEDS = [
  "https://www.pravda.com.ua/rss",
  "https://www.unian.ua/rss",
  "https://www.ukrinform.ua/rss",
];

app.get("/news", async (req, res) => {
  try {
    let articles = [];
    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl);
      const feedArticles = feed.items.slice(0, 5).map((item) => ({
        title: item.title,
        description: item.contentSnippet || "",
        url: item.link,
        urlToImage: "",
        source: { name: feed.title || "Unknown" },
        publishedAt: item.pubDate,
      }));
      articles = articles.concat(feedArticles);
    }
    articles = articles.slice(0, 6);
    res.json({ articles });
  } catch (err) {
    console.error("RSS news error", err);
    res.json({ articles: [] });
  }
});

// Отдаём React фронтенд
app.use(express.static(path.join(__dirname, "dist"))); // или "build"

// Для всех остальных маршрутов — RegExp вместо '*'
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html")); // или "build/index.html"
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
