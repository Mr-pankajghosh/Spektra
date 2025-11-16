
import axios from "axios";

export const getContests = async (req, res) => {
  try {
    const { amount = 5, category, type = "multiple" } = req.query;

    const response = await axios.get("https://opentdb.com/api.php", {
      params: { amount, category, type },
    });

    const contests = response.data.results.map((q, idx) => ({
      id: idx + 1,
      question: q.question,
      options: [...q.incorrect_answers, q.correct_answer]
        .sort(() => Math.random() - 0.5),
      correct: q.correct_answer, // ⚠️ frontend shouldn't show this
    }));

    res.json(contests);
  } catch (error) {
    console.error("Error fetching contests:", error.message);
    res.status(500).json({ message: "Failed to fetch contests" });
  }
};
