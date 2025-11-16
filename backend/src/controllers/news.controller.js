import axios from "axios";

export const getLocalNews = async (req, res) => {
  try {
    const { country = "in", category = "general" } = req.query;

    let response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country,
        category,
        apiKey: process.env.NEWS_API_KEY,
      },
    });

    let articles = response.data.articles || [];

    if (!articles.length && category !== "general") {
      response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country,
          category: "general",
          apiKey: process.env.NEWS_API_KEY,
        },
      });
      articles = response.data.articles || [];
    }

    res.json(articles);
  } catch (error) {
    console.error("News API Error:", error.message);
    res.status(500).json({ message: "Error fetching news" });
  }
};
