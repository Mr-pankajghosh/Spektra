import { useState } from "react";

const ReadMore = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const text = children;
  const preview = text.slice(0, 250); // first 250 chars

  return (
    <div className="mt-4 max-w-3xl mx-auto text-gray-300 text-lg">
      <p>
        {expanded ? text : preview + "..."}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-primary font-semibold hover:underline"
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

export default ReadMore;
