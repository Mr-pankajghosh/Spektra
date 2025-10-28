import Layout from "../components/Layout";
import communitiesData from "../data/communitiesData";
import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const CommunitiesPage = () => {
  const [loadingCommunity, setLoadingCommunity] = useState(null);
  const [joinedCommunityIds, setJoinedCommunityIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("joinedCommunities");
    if (saved) setJoinedCommunityIds(JSON.parse(saved));
  }, []);

  const handleJoin = async (communityId) => {
    setLoadingCommunity(communityId);
    try {
      await axiosInstance.post(`/communities/join/${communityId}`);
      toast.success("🎉 Joined successfully!");
      const updated = [...joinedCommunityIds, communityId];
      setJoinedCommunityIds(updated);
      localStorage.setItem("joinedCommunities", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to join community");
    } finally {
      setLoadingCommunity(null);
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {communitiesData.map((community) => {
          const isJoined = joinedCommunityIds.includes(community.id);
          return (
            <div key={community.id} className="card bg-base-200 shadow-md">
              <figure>
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{community.name}</h2>
                <p className="line-clamp-3">{community.description}</p>
                <div className="card-actions justify-end">
                  <button
                    className={`btn btn-sm ${
                      isJoined ? "btn-success cursor-not-allowed" : "btn-primary"
                    }`}
                    onClick={() => handleJoin(community.id)}
                    disabled={loadingCommunity === community.id || isJoined}
                  >
                    {isJoined
                      ? "Joined"
                      : loadingCommunity === community.id
                      ? "Joining..."
                      : "Join"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default CommunitiesPage;
