import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100 min-h-screen">
      <div className="container mx-auto space-y-12">

        {/* Friends Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link
            to="/notifications"
            className="btn btn-outline btn-sm flex items-center gap-2 rounded-xl transition-all hover:shadow-lg"
          >
            <UsersIcon className="size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <FriendCard
                key={friend._id}
                friend={friend}
                className="rounded-xl hover:shadow-xl transition-all duration-300 border border-base-300"
              />
            ))}
          </div>
        )}

        {/* Recommended Users Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="opacity-70 mt-1">
                Discover perfect language exchange partners based on your profile and they match your skills or learn new skills !
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center rounded-xl border border-base-300 shadow-md">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language and skills Swapping partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 rounded-xl border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="card-body p-5 space-y-4">

                      {/* Avatar & Name */}
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full border-2 border-primary overflow-hidden">
                          {user?.profilePic ? (
                            <img src={user.profilePic} alt={user.fullName} />
                          ) : (
                            <img src="/avatar.jpeg" alt={user.fullName} />
                          )}

                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1 gap-1">
                              <MapPinIcon className="size-3" />
                              <span>{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-2">
                        <span className="badge badge-secondary rounded-full">
                          {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline rounded-full">
                          {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skillsHave?.length > 0 && (
                          <span className="badge badge-info rounded-full">
                            Skills Have: {user.skillsHave.join(', ')}
                          </span>
                        )}
                        {user.skillsLearn?.length > 0 && (
                          <span className="badge badge-success rounded-full">
                            Skills Learn: {user.skillsLearn.join(', ')}
                          </span>
                        )}
                      </div>

                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Action Button */}
                      <button
                        className={`btn w-full mt-2 rounded-xl ${hasRequestBeenSent ? 'btn-disabled' : 'btn-primary'
                          }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
