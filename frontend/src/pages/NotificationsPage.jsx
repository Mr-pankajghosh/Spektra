
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { useAuth } from "../context/AuthContext";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Logged-in user
  const userId = user?._id;

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const sentRequests = friendRequests?.sentReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* INCOMING REQUESTS */}
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((req) => {
                    if (!req.sender) return null; // Null check

                    return (
                      <div
                        key={req._id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                <img
                                  src={req.sender.profilePic || "/default-avatar.png"}
                                  alt={req.sender.fullName || "Unknown"}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold">{req.sender.fullName || "Unknown User"}</h3>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="badge badge-secondary badge-sm">
                                    Native: {req.sender.nativeLanguage || "-"}
                                  </span>
                                  <span className="badge badge-outline badge-sm">
                                    Learning: {req.sender.learningLanguage || "-"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptRequestMutation(req._id)}
                              disabled={isPending}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* SENT REQUESTS */}
            {sentRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-info" />
                  Sent Friend Requests
                </h2>

                <div className="space-y-3">
                  {sentRequests.map((req) => {
                    if (!req.recipient) return null; // Null check

                    return (
                      <div key={req._id} className="card bg-base-200 shadow-sm">
                        <div className="card-body flex gap-3 items-center">
                          <div className="avatar w-14 h-14 rounded-full bg-base-300">
                            <img
                              src={req.recipient.profilePic || "/default-avatar.png"}
                              alt={req.recipient.fullName || "Unknown"}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{req.recipient.fullName || "Unknown User"}</h3>
                            <p className="text-sm">You sent a friend request</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ACCEPTED REQUESTS / NEW CONNECTIONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((req) => {
                    const isSender = req.sender?._id === userId;
                    const otherUser = isSender ? req.recipient : req.sender;

                    if (!otherUser) return null; // Null check

                    const actionText = isSender
                      ? `You accepted ${otherUser.fullName || "Unknown"}'s friend request`
                      : `${otherUser.fullName || "Unknown"} accepted your friend request`;

                    return (
                      <div key={req._id} className="card bg-base-200 shadow-sm">
                        <div className="card-body flex gap-3 items-start">
                          <div className="avatar w-14 h-14 rounded-full mt-1">
                            <img
                              src={otherUser.profilePic || "/default-avatar.png"}
                              alt={otherUser.fullName || "Unknown"}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{otherUser.fullName || "Unknown User"}</h3>
                            <p className="text-sm my-1">{actionText}</p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" /> Recently
                            </p>
                          </div>
                          <div className="badge badge-success flex items-center gap-1">
                            <MessageSquareIcon className="h-3 w-3" /> New Friend
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* NO NOTIFICATIONS */}
            {incomingRequests.length === 0 &&
              sentRequests.length === 0 &&
              acceptedRequests.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
