import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className=" backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border border-white/20">
      <div className="p-5 space-y-4">
        
        <div className="flex items-center gap-4 mb-2">
          <div className="avatar w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold text-lg truncate">{friend.fullName}</h3>
        </div>

    
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="badge badge-secondary text-xs rounded-full">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs rounded-full">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        
        <div className="flex flex-wrap gap-2 mb-2">
          {friend.skillsHave?.length > 0 && (
            <span className="badge badge-info text-xs rounded-full">
              Skills Have: {friend.skillsHave.join(", ")}
            </span>
          )}
          {friend.skillsLearn?.length > 0 && (
            <span className="badge badge-success text-xs rounded-full">
              Skills Learn: {friend.skillsLearn.join(", ")}
            </span>
          )}
        </div>

       
        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline w-full rounded-2xl hover:bg-primary/10 transition-all"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
