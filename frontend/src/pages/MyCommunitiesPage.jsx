
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Layout from "../components/Layout";
import { axiosInstance } from "../lib/axios";
import communitiesData from "../data/communitiesData";

const MyCommunitiesPage = () => {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCommunities = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/communities/my");

        let joinedIds = [];
        if (res.data.success && res.data.data) {
          joinedIds = res.data.data;
          localStorage.setItem("joinedCommunities", JSON.stringify(joinedIds));
        } else {
          const saved = localStorage.getItem("joinedCommunities");
          if (saved) joinedIds = JSON.parse(saved);
        }

        const joined = communitiesData.filter((c) => joinedIds.includes(c.id));
        setJoinedCommunities(joined);
      } catch (err) {
        console.error("Fetch failed:", err);
        const saved = localStorage.getItem("joinedCommunities");
        if (saved) {
          const joinedIds = JSON.parse(saved);
          const joined = communitiesData.filter((c) =>
            joinedIds.includes(c.id)
          );
          setJoinedCommunities(joined);
        }
        setError("Failed to load communities");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCommunities();
  }, []);

  const handleLeaveCommunity = async (communityId) => {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this community?"
    );
    if (!confirmLeave) return;

    const updated = joinedCommunities.filter((c) => c.id !== communityId);
    setJoinedCommunities(updated);
    const updatedIds = updated.map((c) => c.id);
    localStorage.setItem("joinedCommunities", JSON.stringify(updatedIds));

    try {
      await axiosInstance.post(`/communities/${communityId}/leave`);
    } catch (err) {
      console.error("Failed to leave community:", err);
      alert("Failed to leave community on the server. Local changes only.");
      setJoinedCommunities(
        communitiesData.filter((c) => [...updatedIds, communityId].includes(c.id))
      );
      localStorage.setItem(
        "joinedCommunities",
        JSON.stringify([...updatedIds, communityId])
      );
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Communities</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {joinedCommunities.length === 0 ? (
              <p>You haven’t joined any communities yet.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {joinedCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="card bg-base-200 shadow-md flex flex-col"
                  >
                    <figure>
                      <img
                        src={community.image}
                        alt={community.name}
                        className="w-full h-48 object-cover"
                      />
                    </figure>
                    <div className="card-body flex flex-col flex-1">
                      <h2 className="card-title">{community.name}</h2>
                      <p className="line-clamp-3">{community.description}</p>
                      <div className="card-actions justify-between mt-auto">
                        <Link
                          to={`/communities/${community.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleLeaveCommunity(community.id)}
                          className="btn btn-outline btn-sm text-red-500 hover:text-white hover:bg-red-500"
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default MyCommunitiesPage;
