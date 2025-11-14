// server.js
import express from "express";
import cors from "cors";
import Parser from "rss-parser";

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

app.get("/news", async (req, res) => {
  try {
    let articles = [];

    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl);
      const feedArticles = feed.items.slice(0, 5).map((item) => ({
        title: item.title,
        description: item.contentSnippet || "",
        url: item.link,
        urlToImage: "", // RSS обычно не содержит картинок, можно вставить дефолтную
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

app.listen(PORT, () => {
  console.log(`RSS news proxy running at http://localhost:${PORT}/news`);
});
