import { Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";

const MyProfile = () => {
  const { authUser } = useAuthUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-base-100 shadow-lg rounded-xl p-6 max-w-lg mx-auto border border-base-300">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full border border-base-300 overflow-hidden">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-3">{authUser?.fullName}</h2>
          <p className="text-base-content/70">{authUser?.email}</p>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-3">
          <p>
            <span className="font-semibold">Native Language:</span>{" "}
            {authUser?.nativeLanguage || "Not set"}
          </p>
          <p>
            <span className="font-semibold">Learning Language:</span>{" "}
            {authUser?.learningLanguage || "Not set"}
          </p>
          <p>
            <span className="font-semibold">Skills (Have):</span>{" "}
            {authUser?.skillsHave?.join(", ") || "Not set"}
          </p>
          <p>
            <span className="font-semibold">Skills (Want to Learn):</span>{" "}
            {authUser?.skillsLearn?.join(", ") || "Not set"}
          </p>
          <p>
            <span className="font-semibold">Location :</span>{" "}
            {authUser?.location || "Not set"}
          </p>
          <p>
            <span className="font-semibold">My Occupation :</span>{" "}
            {authUser?.occupation || "Not set"}
          </p>

        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link to="/edit-profile" className="btn btn-primary w-full">
            Edit Profile
          </Link>
          <Link to="/" className="btn btn-primary w-full">
            Home
          </Link>

          <Link to="/settings" className="btn btn-outline w-full">
            Settings
          </Link>
          <Link to="/friends" className="btn btn-outline w-full">
            Friends
          </Link>
          <Link to="/notifications" className="btn btn-outline w-full">
            Notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
