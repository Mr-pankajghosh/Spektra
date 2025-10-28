import { useQuery } from "@tanstack/react-query";
import { UserIcon, MessageSquareIcon } from "lucide-react";
import { getUserFriends } from "../lib/api"; 
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Friends</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : friends && friends.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-primary" />
              Your Friends
              <span className="badge badge-primary ml-2">{friends.length}</span>
            </h2>

            <div className="space-y-3">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="card bg-base-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="card-body p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="avatar w-14 h-14 rounded-full bg-base-300 overflow-hidden border-2 border-primary">
                          <img src={friend.profilePic} alt={friend.fullName} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{friend.fullName}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            <span className="badge badge-secondary badge-sm rounded-2xl">
                              Native: {friend.nativeLanguage}
                            </span>
                            <span className="badge badge-outline badge-sm rounded-2xl">
                              Learning: {friend.learningLanguage}
                            </span>
                          </div>
                          {/* Skills */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {friend.skillsHave?.length > 0 && (
                              <span className="badge badge-info badge-sm rounded-2xl">
                                Skills Have: {friend.skillsHave.join(', ')}
                              </span>
                            )}
                            {friend.skillsLearn?.length > 0 && (
                              <span className="badge badge-success badge-sm rounded-2xl">
                                Skills Learn: {friend.skillsLearn.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="badge badge-success flex items-center gap-1 rounded-2xl">
                        <MessageSquareIcon className="h-3 w-3" />
                        Friend
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <NoFriendsFound message="You don’t have any friends yet." />
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
