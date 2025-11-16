
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { fetchNews } from "../lib/api";

const countries = [
  { code: "us", name: "United States" },
  { code: "in", name: "India" },
  { code: "gb", name: "United Kingdom" },
  { code: "au", name: "Australia" },
  { code: "ca", name: "Canada" },
];

const categories = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

const dummyNews = [
  {
    title: "India launches new space mission",
    description: "India's space agency has successfully launched a new satellite mission.",
    url: "https://en.wikipedia.org/wiki/List_of_ISRO_missions",
    urlToImage: "/space.jpg",
  },
  {
    title: "Bollywood actor announces new movie",
    description: "A popular Bollywood actor has announced his upcoming film release.",
    url: "https://en.wikipedia.org/wiki/List_of_Hindi_films_of_2025",
    urlToImage: "/bollywood.jpg",},
  {
    title: "Cricket: India wins the series",
    description: "India wins the cricket series in a thrilling final match.",
    url: "https://www.bbc.com/sport/cricket/articles/cx279ylegeyo",
    urlToImage: "/cricket.jpg",
  },
  {
    title: "New tech startup rises in India",
    description: "A new startup in India is revolutionizing fintech solutions.",
    url: "#",
    urlToImage: "/strtup.jpg",
  },
  {
    title: "Health awareness campaign launched",
    description: "Government launches a nationwide health awareness campaign.",
    url: "#",
    urlToImage: "/health.jpg",
  },
  {
    title: "Startup ecosystem booming in Bengaluru",
    description: "Bengaluru continues to be the hub for India's growing tech startups.",
    url: "https://yourstory.com",
    urlToImage: "benluru.jpg",
  },
  {
    title: "Delhi launches green transport initiative",
    description: "The Delhi government has launched electric buses to cut down pollution.",
    url: "https://www.ndtv.com",
    urlToImage: "/green.jpg",
  },
  {
    title: "New metro line inaugurated in Mumbai",
    description: "Mumbai commuters get relief with the inauguration of a new metro route.",
    url: "https://timesofindia.indiatimes.com",
    urlToImage: "/metro.jpg",
  },
  {
    title: "Chennai hosts international cultural fest",
    description: "Artists from across the globe gather in Chennai for a cultural celebration.",
    url: "https://www.thehindu.com",
    urlToImage: "/cultural.jpg",
  },
  {
    title: "Kerala promotes eco-tourism",
    description: "Kerala launches new eco-tourism projects to attract global travelers.",
    url: "https://www.keralatourism.org",
    urlToImage: "/kerala.jpg",
  },
  {
    title: "Government pushes Digital India campaign",
    description: "New initiatives launched to strengthen the Digital India movement.",
    url: "https://www.digitalindia.gov.in",
    urlToImage: "/digital.jpg",
  },
  {
    title: "AI in education: Indian schools adapt",
    description: "Schools in India are beginning to integrate AI-based learning platforms.",
    url: "https://www.educationtimes.com",
    urlToImage: "/ai.jpg",
  },
  {
    title: "New highways to boost trade in Northeast",
    description: "Infrastructure push expected to improve connectivity in India's Northeast.",
    url: "https://www.livemint.com",
    urlToImage: "/highways.jpg",
  },
  {
    title: "Hyderabad hosts IT summit 2025",
    description: "Hyderabad welcomes global leaders for its annual IT summit.",
    url: "https://www.business-standard.com",
    urlToImage: "/hyderabad.jpg",
  },
  {
    title: "Indian Navy commissions new warship",
    description: "A new state-of-the-art warship strengthens India's naval power.",
    url: "https://www.indiatoday.in",
    urlToImage: "/navy.jpg",
  },
  {
    title: "Jaipur Literature Festival attracts global authors",
    description: "The world’s largest literary festival returns with diverse voices.",
    url: "https://jaipurliteraturefestival.org",
    urlToImage: "/jaipur.jpg",
  },
  {
    title: "Farmers adopt modern irrigation methods",
    description: "New irrigation technologies boost agricultural productivity in Punjab.",
    url: "https://www.thehindubusinessline.com",
    urlToImage: "/farmer.jpg",
  },

];

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("in");
  const [category, setCategory] = useState("general");

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const data = await fetchNews({ country, category });
        if (data && data.length > 0) {
          setNews(data);
        } else {
          setNews(dummyNews); // fallback if API returns empty
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews(dummyNews); // fallback if API fails
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [country, category]);

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="text-2xl font-bold"> 📰 Latest News</div>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="select select-bordered"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="text-center">Loading news...</p>}

      {/* No news */}
      {!loading && !news.length && (
        <p className="text-center">No news available</p>
      )}

      {/* Carousel - Featured top 3 */}
      {!loading && news.length > 0 && (
        <div className="carousel w-full rounded-xl shadow-lg overflow-hidden">
          {news.slice(0, 3).map((article, idx) => (
            <div
              key={idx}
              id={`slide${idx}`}
              className="carousel-item relative w-full"
            >
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
                <h2 className="text-2xl font-bold">{article.title}</h2>
                <p className="mt-2 text-sm line-clamp-2">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary mt-3"
                >
                  Read More <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
              {/* Carousel nav */}
              <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href={`#slide${(idx + 2) % 3}`} className="btn btn-circle btn-sm">
                  ❮
                </a>
                <a href={`#slide${(idx + 1) % 3}`} className="btn btn-circle btn-sm">
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid - Rest of the news */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.slice(3).map((article, idx) => (
          <div key={idx} className="card bg-base-200 shadow-md">
            <figure>
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title">{article.title}</h3>
              <p className="line-clamp-3">{article.description}</p>
              <div className="card-actions justify-end">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
