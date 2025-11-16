import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnboarding } from "../lib/api";
import {
  MapPinIcon,
  LoaderIcon,
  ShuffleIcon,
  FileVideoCamera,
  CameraIcon,
  SearchIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import AnimatedBackground from "../components/AnimatedBackground";
import PublicFooter from "../components/PublicFooter";
import Modal from "../components/Modal";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    skillsHave: (authUser?.skillsHave || []).join(", "),
    skillsLearn: (authUser?.skillsLearn || []).join(", "),
    secretAboutYou: authUser?.secretAboutYou || "",
    gender: authUser?.gender || "",
    occupation: authUser?.occupation || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success(
        authUser?.isOnboarded ? "Profile updated!" : "Onboarding completed!"
      );
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const [searchNative, setSearchNative] = useState("");
  const [searchLearning, setSearchLearning] = useState("");
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const filteredLanguages = (searchValue) =>
    LANGUAGES.filter((lang) =>
      lang.toLowerCase().includes(searchValue.toLowerCase())
    );

  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
  };
  const closeModal = () => {
    setModalTitle("");
    setModalContent("");
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <AnimatedBackground />

      <header className="w-full py-6 flex justify-center items-center relative z-10">
        <div className="flex items-center gap-2">
          <FileVideoCamera className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Spektra
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="card bg-base-200/90 backdrop-blur-md w-full max-w-3xl shadow-xl z-10">
          <div className="card-body p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              {authUser?.isOnboarded
                ? "Update Your Profile"
                : "Complete Your Profile"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
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
                    Generate Random Avatar
                  </button>

                  <label className="btn btn-secondary cursor-pointer">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormState({
                            ...formState,
                            profilePic: reader.result,
                          });
                          toast.success("Profile picture uploaded!");
                        };
                        reader.readAsDataURL(file);
                      }}
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
                  name="fullName"
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
                  name="bio"
                  value={formState.bio}
                  onChange={(e) =>
                    setFormState({ ...formState, bio: e.target.value })
                  }
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>

              {/* 🔹 Languages with Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Native */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60" />
                    <input
                      type="text"
                      placeholder="Search language..."
                      className="input input-bordered pl-9 mb-2 w-full"
                      value={searchNative}
                      onChange={(e) => setSearchNative(e.target.value)}
                    />
                  </div>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        nativeLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {(showAllLanguages
                      ? filteredLanguages(searchNative)
                      : filteredLanguages(searchNative).slice(0, 15)
                    ).map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  {filteredLanguages(searchNative).length > 15 && (
                    <button
                      type="button"
                      onClick={() => setShowAllLanguages(!showAllLanguages)}
                      className="text-sm text-primary mt-1"
                    >
                      {showAllLanguages ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>

                {/* Learning */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60" />
                    <input
                      type="text"
                      placeholder="Search language..."
                      className="input input-bordered pl-9 mb-2 w-full"
                      value={searchLearning}
                      onChange={(e) => setSearchLearning(e.target.value)}
                    />
                  </div>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        learningLanguage: e.target.value,
                      })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {(showAllLanguages
                      ? filteredLanguages(searchLearning)
                      : filteredLanguages(searchLearning).slice(0, 15)
                    ).map((lang) => (
                      <option
                        key={`learning-${lang}`}
                        value={lang.toLowerCase()}
                      >
                        {lang}
                      </option>
                    ))}
                  </select>
                  {filteredLanguages(searchLearning).length > 15 && (
                    <button
                      type="button"
                      onClick={() => setShowAllLanguages(!showAllLanguages)}
                      className="text-sm text-primary mt-1"
                    >
                      {showAllLanguages ? "Show Less" : "Show More"}
                    </button>
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
                    name="location"
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
                    name="skillsHave"
                    value={formState.skillsHave}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        skillsHave: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    placeholder="E.g., Cooking, JavaScript, Photography"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Skills You Want to Learn</span>
                  </label>
                  <input
                    type="text"
                    name="skillsLearn"
                    value={formState.skillsLearn}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        skillsLearn: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    placeholder="E.g., Spanish, Guitar, Graphic Design"
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
                  name="secretAboutYou"
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
                    name="gender"
                    value={formState.gender || ""}
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
                    name="occupation"
                    value={formState.occupation || ""}
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

              {/* Submit */}
              <button
                className="btn btn-primary w-full"
                disabled={isPending}
                type="submit"
              >
                {!isPending ? (
                  <>
                    <FileVideoCamera className="w-5 h-5 mr-2" />
                    {authUser?.isOnboarded
                      ? "Update Profile"
                      : "Complete Onboarding"}
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin w-5 h-5 mr-2" />
                    Onboarding...
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <PublicFooter openModal={openModal} />
      <Modal title={modalTitle} content={modalContent} onClose={closeModal} />
    </div>
  );
};

export default OnboardingPage;
