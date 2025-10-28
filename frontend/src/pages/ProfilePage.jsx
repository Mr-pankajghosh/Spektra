import React, { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import { MapPinIcon, ShuffleIcon, CameraIcon, SearchIcon } from "lucide-react";
import { LANGUAGES } from "../constants";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: "",
    bio: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
    profilePic: "",
    skillsHave: "",
    skillsLearn: "",
    secretAboutYou: "",
    gender: "",
    occupation: "",
  });

  const [searchNative, setSearchNative] = useState("");
  const [searchLearning, setSearchLearning] = useState("");
  const [showNative, setShowNative] = useState(false);
  const [showLearning, setShowLearning] = useState(false);

  useEffect(() => {
    if (authUser) {
      setFormState({
        ...authUser,
        skillsHave: Array.isArray(authUser.skillsHave)
          ? authUser.skillsHave.join(", ")
          : authUser.skillsHave || "",
        skillsLearn: Array.isArray(authUser.skillsLearn)
          ? authUser.skillsLearn.join(", ")
          : authUser.skillsLearn || "",
      });
    }
  }, [authUser]);

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation({
      ...formState,
      skillsHave: formState.skillsHave
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skillsLearn: formState.skillsLearn
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState({ ...formState, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const filteredNative = LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(searchNative.toLowerCase())
  );

  const filteredLearning = LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(searchLearning.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Edit Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-base-300 overflow-hidden cursor-pointer">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="w-12 h-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="w-4 h-4 mr-2" />
                  Random Avatar
                </button>
                <label className="btn btn-secondary cursor-pointer">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your goals"
              />
            </div>

            {/* 🔍 Searchable Language Select */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Native Language */}
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <div
                  className="input input-bordered flex justify-between items-center cursor-pointer"
                  onClick={() => setShowNative(!showNative)}
                >
                  {formState.nativeLanguage
                    ? formState.nativeLanguage.charAt(0).toUpperCase() +
                      formState.nativeLanguage.slice(1)
                    : "Select your native language"}
                </div>

                {showNative && (
                  <div className="absolute z-10 bg-base-100 shadow-lg border border-base-300 mt-1 rounded-lg w-full max-h-56 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-base-100">
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={searchNative}
                        onChange={(e) => setSearchNative(e.target.value)}
                        className="input input-sm input-bordered w-full"
                      />
                    </div>
                    {filteredNative.length ? (
                      filteredNative.map((lang) => (
                        <div
                          key={lang}
                          onClick={() => {
                            setFormState({
                              ...formState,
                              nativeLanguage: lang.toLowerCase(),
                            });
                            setShowNative(false);
                            setSearchNative("");
                          }}
                          className="px-3 py-2 hover:bg-base-200 cursor-pointer"
                        >
                          {lang}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center opacity-60">
                        No language found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Learning Language */}
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <div
                  className="input input-bordered flex justify-between items-center cursor-pointer"
                  onClick={() => setShowLearning(!showLearning)}
                >
                  {formState.learningLanguage
                    ? formState.learningLanguage.charAt(0).toUpperCase() +
                      formState.learningLanguage.slice(1)
                    : "Select language you're learning"}
                </div>

                {showLearning && (
                  <div className="absolute z-10 bg-base-100 shadow-lg border border-base-300 mt-1 rounded-lg w-full max-h-56 overflow-y-auto">
                    <div className="p-2 sticky top-0 bg-base-100">
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={searchLearning}
                        onChange={(e) => setSearchLearning(e.target.value)}
                        className="input input-sm input-bordered w-full"
                      />
                    </div>
                    {filteredLearning.length ? (
                      filteredLearning.map((lang) => (
                        <div
                          key={lang}
                          onClick={() => {
                            setFormState({
                              ...formState,
                              learningLanguage: lang.toLowerCase(),
                            });
                            setShowLearning(false);
                            setSearchLearning("");
                          }}
                          className="px-3 py-2 hover:bg-base-200 cursor-pointer"
                        >
                          {lang}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center opacity-60">
                        No language found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-5 h-5 text-base-content opacity-70" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Skills You Have</span>
                </label>
                <input
                  type="text"
                  value={formState.skillsHave}
                  onChange={(e) =>
                    setFormState({ ...formState, skillsHave: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="E.g., Cooking, JavaScript"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Skills You Want to Learn</span>
                </label>
                <input
                  type="text"
                  value={formState.skillsLearn}
                  onChange={(e) =>
                    setFormState({ ...formState, skillsLearn: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="E.g., Spanish, Guitar"
                />
              </div>
            </div>

            {/* Secret */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Something People Don’t Know About You
                </span>
              </label>
              <textarea
                value={formState.secretAboutYou}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    secretAboutYou: e.target.value,
                  })
                }
                className="textarea textarea-bordered h-20"
                placeholder="Any fun fact or interesting info about you"
              />
            </div>

            {/* Gender & Occupation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  value={formState.gender}
                  onChange={(e) =>
                    setFormState({ ...formState, gender: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Occupation</span>
                </label>
                <input
                  type="text"
                  value={formState.occupation}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      occupation: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="Your occupation"
                />
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? "Update Profile" : "Updating..."}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
