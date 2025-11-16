
import { useEffect, useMemo, useState } from "react";
import useAuthUser from "../hooks/useAuthUser";

const categories = [
  { id: "all", name: "All Categories" },
  { id: 9, name: "General Knowledge" },
  { id: 17, name: "Science & Nature" },
  { id: 21, name: "Sports" },
  { id: 23, name: "History" },
  { id: 22, name: "Geography" },
  { id: 24, name: "Politics" },
  { id: 27, name: "Animals" },
  { id: 18, name: "Computers" },
  { id: 11, name: "Movies" },
];

const difficulties = [
  { id: "all", name: "All Levels" },
  { id: "easy", name: "Easy", seconds: 120 },
  { id: "medium", name: "Medium", seconds: 180 },
  { id: "hard", name: "Hard", seconds: 300 },
];

const LB_KEY = "spektra_quiz_leaderboard";
function getLB() {
  try {
    return JSON.parse(localStorage.getItem(LB_KEY) || "[]");
  } catch {
    return [];
  }
}
function addLB(entry) {
  const list = getLB();
  list.push(entry);
  list.sort((a, b) => b.score - a.score || a.timeMs - b.timeMs);
  localStorage.setItem(LB_KEY, JSON.stringify(list.slice(0, 20)));
}

function formatMMSS(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

const ContestPage = () => {
  const { authUser } = useAuthUser() || {};
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

 
  const QUIZ_SECONDS = difficulties.find((d) => d.id === difficulty)?.seconds || 120;

  const [timeLeft, setTimeLeft] = useState(QUIZ_SECONDS);
  const [startedAt, setStartedAt] = useState(null);
  const [finished, setFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState(getLB());

  const fetchContests = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      setContests([]);
      setFinished(false);
      setTimeLeft(QUIZ_SECONDS);
      setStartedAt(Date.now());

      const params = new URLSearchParams({ amount: 5, type: "multiple" });
      if (category && category !== "all") params.append("category", category);
      if (difficulty && difficulty !== "all") params.append("difficulty", difficulty);

      const res = await fetch(`https://opentdb.com/api.php?${params.toString()}`);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setErrorMsg("⚠️ No questions found for this category/difficulty.");
        setLoading(false);
        return;
      }

      const formatted = data.results.map((q, idx) => ({
        id: idx + 1,
        question: q.question,
        options: [...q.incorrect_answers, q.correct_answer].sort(() => 0.5 - Math.random()),
        correct: q.correct_answer,
        selected: null,
        feedback: null,
      }));

      setContests(formatted);
    } catch (e) {
      console.error(e);
      setErrorMsg("❌ Failed to load questions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchContests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, difficulty]);

  useEffect(() => {
    if (loading || finished || contests.length === 0) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, loading, finished, contests.length]);

  const score = useMemo(
    () => contests.filter((q) => q.feedback === "correct").length,
    [contests]
  );
  const answeredCount = useMemo(
    () => contests.filter((q) => q.selected !== null).length,
    [contests]
  );

  useEffect(() => {
    if (contests.length === 0) return;
    const allAnswered = answeredCount === contests.length;
    if ((finished || allAnswered) && startedAt) {
      setFinished(true);
      const alreadySaved = sessionStorage.getItem("quiz_saved") === "1";
      if (!alreadySaved) {
        const elapsed = Date.now() - startedAt;
        addLB({
          user: authUser?.fullName || "Guest",
          score,
          total: contests.length,
          category: categories.find((c) => `${c.id}` === `${category}`)?.name || "All",
          difficulty: difficulties.find((d) => `${d.id}` === `${difficulty}`)?.name || "All",
          timeMs: elapsed,
          at: new Date().toISOString(),
        });
        sessionStorage.setItem("quiz_saved", "1");
        setLeaderboard(getLB());
      }
    }
  }, [finished, answeredCount, contests.length, startedAt, score, category, difficulty, authUser]);

  const handleAnswer = (id, option) => {
    if (finished || timeLeft <= 0) return;
    setContests((prev) =>
      prev.map((q) =>
        q.id === id && q.selected === null
          ? { ...q, selected: option, feedback: option === q.correct ? "correct" : "incorrect" }
          : q
      )
    );
  };

  const handlePlayAgain = () => {
    sessionStorage.removeItem("quiz_saved");
    fetchContests();
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-3xl mx-auto">
      {/* Header + Timer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Contests & Quizzes</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="text-sm">
            ⏱{" "}
            <span className={timeLeft <= 10 ? "text-error font-semibold" : ""}>
              {formatMMSS(timeLeft)}
            </span>
          </div>
          <progress
            className="progress progress-primary w-full sm:w-40"
            value={answeredCount}
            max={Math.max(contests.length, 1)}
          />
          <div className="text-sm">
            {answeredCount}/{contests.length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-full sm:w-auto"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="select select-bordered w-full sm:w-auto"
        >
          {difficulties.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} {d.seconds ? `(${d.seconds / 60} min)` : ""}
            </option>
          ))}
        </select>

        <button className="btn btn-primary w-full sm:w-auto" onClick={fetchContests}>
          🎮 Play Again
        </button>
      </div>

      {/* Loading & Errors */}
      {loading && (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}
      {errorMsg && <p className="text-red-500 font-medium text-center">{errorMsg}</p>}

      {!loading && !errorMsg && contests.length === 0 && (
        <p className="text-center opacity-70">No contests available</p>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {contests.map((q) => (
          <div key={q.id} className="p-3 sm:p-4 border rounded-lg bg-base-200">
            <p className="font-semibold" dangerouslySetInnerHTML={{ __html: `${q.id}. ${q.question}` }} />
            <div className="mt-2 space-y-2">
              {q.options.map((opt, idx) => {
                const isSelected = q.selected === opt;
                const isCorrect = q.feedback === "correct" && isSelected;
                const isWrong = q.feedback === "incorrect" && isSelected;

                let cls = "btn btn-sm w-full text-left btn-outline";
                if (isCorrect) cls = "btn btn-sm w-full text-left btn-success";
                else if (isWrong) cls = "btn btn-sm w-full text-left btn-error";
                else if (!finished && !q.feedback && isSelected) cls = "btn btn-sm w-full text-left btn-primary";

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(q.id, opt)}
                    disabled={finished || timeLeft <= 0 || q.selected !== null}
                    className={cls}
                    dangerouslySetInnerHTML={{ __html: opt }}
                  />
                );
              })}
            </div>
{q.feedback && (
  <div className="mt-2 font-medium">
    {q.feedback === "correct" ? (
      <p className="text-green-600">✅ Correct!</p>
    ) : (
      <>
        <p className="text-red-600">❌ Incorrect</p>
        <p className="text-blue-600">
          ✅ Correct Answer:{" "}
          <span dangerouslySetInnerHTML={{ __html: q.correct }} />
        </p>
      </>
    )}
  </div>
)}

          </div>
        ))}
      </div>

      {/* Live Score */}
      {contests.length > 0 && (
        <div className="mt-6 p-4 bg-base-300 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <p className="text-lg font-bold">
            Score: {score} / {contests.length}
          </p>
          {(finished || answeredCount === contests.length || timeLeft <= 0) && (
            <button className="btn btn-primary w-full sm:w-auto" onClick={handlePlayAgain}>
              🔄 Play Again
            </button>
          )}
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">🏆 Leaderboard (Local)</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm sm:text-base">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Score</th>
                  <th>Cat / Diff</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 10).map((e, i) => (
                  <tr key={e.at + i}>
                    <td>{i + 1}</td>
                    <td>{e.user}</td>
                    <td>
                      {e.score}/{e.total}
                    </td>
                    <td>
                      {e.category} / {e.difficulty}
                    </td>
                    <td>{Math.round(e.timeMs / 1000)}s</td>
                    <td>{new Date(e.at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-outline btn-sm mt-3"
            onClick={() => {
              localStorage.removeItem(LB_KEY);
              setLeaderboard([]);
            }}
          >
            Clear Leaderboard
          </button>
        </div>
      )}
    </div>
  );
};

export default ContestPage;
