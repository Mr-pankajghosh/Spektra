import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutation, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      toast.success("Login successful!");

      const user = data?.user;
      if (user?.isOnboarded) {
        navigate("/");
      } else {
        navigate("/onboarding", { state: { user } });
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "An error occurred during login");
    },
  });

  return { error, isPending, loginMutation };
};

export default useLogin;
