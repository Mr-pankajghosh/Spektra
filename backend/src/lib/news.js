import axios from "axios";

export async function getLocalNews(query) {
  const res = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      q: query || "India",
      language: "en",
      apiKey: process.env.NEWS_API_KEY,
    },
  });
  return res.data.articles;
}
