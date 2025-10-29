import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";

// const requestOtp = async ({ email, fullName, password }) => {
//   const res = await axios.post(
//     `${import.meta.env.VITE_API_URL}/auth/request-otp`,
//     { email, fullName, password }
//   );
//   return res.data;
// };
import { axiosInstance } from "../lib/api";

const requestOtp = async ({ email, fullName, password }) => {
  const res = await axiosInstance.post("/auth/request-otp", {
    email,
    fullName,
    password,
  });
  return res.data;
};

const useSignUp = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: (data, variables) => {
      console.log("OTP request success:", data);
      queryClient.setQueryData(["pendingSignup", variables.email], variables);
    },
  });

  return {
    signupMutation: mutation.mutate,    
    isLoading: mutation.isLoading,       
    error: mutation.error,             
    isSuccess: mutation.isSuccess,      
    data: mutation.data,                 
  };
};

export default useSignUp;
