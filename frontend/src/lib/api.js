// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "http://localhost:5001/api",
//   withCredentials: true, 
// });

// export const signup = async (signupData) => {
//     const response = await axiosInstance.post('/auth/signup', signupData);
//     return response.data;
// };

// export const login = async (loginData) => {
//     const response = await axiosInstance.post('/auth/login', loginData);
//     return response.data;
// };

// export const logout = async () => {
//     const response = await axiosInstance.post('/auth/logout');
//     return response.data;
// };

// export const getAuthUser = async () => {
//     try {
//         const res = await axiosInstance.get("/auth/me");
//         return res.data;
//     } catch (error) {
//         console.log("Error in getAuthUser:", error);
//         return null;
//     }
// };

// export const completeOnboarding = async (userData) => {
//   const res = await axiosInstance.post("/auth/onboarding", userData);
//   return res.data;
// };

// export const verifyOTP = async (data) => {
//     const res = await axiosInstance.post("/auth/verify-otp", data);
//     return res.data;
// };

// export const forgotPassword = async (data) => {
//     const res = await axiosInstance.post("/auth/forgot-password", data);
//     return res.data;
// };

// export const resetPassword = async (token, newPassword) => {
//     const res = await axiosInstance.post(
//         `/auth/reset-password/${encodeURIComponent(token)}`,
//         { newPassword } 
//     );
//     return res.data;
// };

// export async function getUserFriends() {
//     const response = await axiosInstance.get("/users/friends");
//     return response.data;
// }

// export async function getRecommendedUsers() {
//     const response = await axiosInstance.get("/users");
//     return response.data;
// }

// export async function getOutgoingFriendReqs() {
//     const response = await axiosInstance.get("/users/outgoing-friend-requests");
//     return response.data;
// }

// export async function sendFriendRequest(userId) {
//     const response = await axiosInstance.post(`/users/friend-request/${userId}`);
//     return response.data;
// }

// export async function getFriendRequests() {
//     const response = await axiosInstance.get("/users/friend-requests");
//     return response.data;
// }

// export async function acceptFriendRequest(requestId) {
//     const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
//     return response.data;
// }

// export async function getStreamToken() {
//     const response = await axiosInstance.get("/chat/token");
//     return response.data;
// }

// export async function fetchContests() {
//     const res = await axiosInstance.get("/contests");
//     return res.data;
// }

// export const fetchNews = async ({ country = "in", category = "general" }) => {
//     const res = await axiosInstance.get("/news", { params: { country, category } });
//     return res.data;
// };

// export const fetchCommunities = async () => {
//     const res = await axiosInstance.get("/communities");
//     return res.data;
// };

// export const joinCommunity = async (id) => {
//     const res = await axiosInstance.post(`/communities/${id}/join`);
//     return res.data;
// };

// export const fetchMyCommunities = async () => {
//     const res = await axiosInstance.get("/communities/my");
//     return res.data;
// };

// export const updateProfile = async (profileData) => {
//     const { data } = await axiosInstance.put("/users/onboarding", profileData, {
//         withCredentials: true,
//     });
//     return data;
// };
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true, 
});

export const signup = async (signupData) => {
    const response = await axiosInstance.post('/auth/signup', signupData);
    return response.data;
};

export const login = async (loginData) => {
    const response = await axiosInstance.post('/auth/login', loginData);
    return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
};

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null;
    }
};

export const completeOnboarding = async (userData) => {
  const res = await axiosInstance.post("/auth/onboarding", userData);
  return res.data;
};

export const verifyOTP = async (data) => {
    const res = await axiosInstance.post("/auth/verify-otp", data);
    return res.data;
};

export const forgotPassword = async (data) => {
    const res = await axiosInstance.post("/auth/forgot-password", data);
    return res.data;
};

export const resetPassword = async (token, newPassword) => {
    const res = await axiosInstance.post(
        `/auth/reset-password/${encodeURIComponent(token)}`,
        { newPassword } 
    );
    return res.data;
};

export async function getUserFriends() {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
}

export async function getRecommendedUsers() {
    const response = await axiosInstance.get("/users");
    return response.data;
}

export async function getOutgoingFriendReqs() {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}

export async function sendFriendRequest(userId) {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export async function getFriendRequests() {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
}

export async function acceptFriendRequest(requestId) {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data;
}

export async function getStreamToken() {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
}

export async function fetchContests() {
    const res = await axiosInstance.get("/contests");
    return res.data;
}

export const fetchNews = async ({ country = "in", category = "general" }) => {
    const res = await axiosInstance.get("/news", { params: { country, category } });
    return res.data;
};

export const fetchCommunities = async () => {
    const res = await axiosInstance.get("/communities");
    return res.data;
};

export const joinCommunity = async (id) => {
    const res = await axiosInstance.post(`/communities/${id}/join`);
    return res.data;
};

export const fetchMyCommunities = async () => {
    const res = await axiosInstance.get("/communities/my");
    return res.data;
};

export const updateProfile = async (profileData) => {
    const { data } = await axiosInstance.put("/users/onboarding", profileData, {
        withCredentials: true,
    });
    return data;
};
