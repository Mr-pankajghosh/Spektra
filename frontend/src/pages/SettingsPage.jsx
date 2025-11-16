
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    BellIcon,
    ShieldIcon,
    UserIcon,
    MoonIcon,
    LogOutIcon,
    SearchIcon,
    UsersIcon,
    SettingsIcon,
    HomeIcon,
} from "lucide-react";
import { FileVideoCamera } from "lucide-react";
import useLogout from "../hooks/useLogout";
import useAuthUser from "../hooks/useAuthUser";
import Modal from "../components/Modal";
import ThemeSelector from "../components/ThemeSelector";
import AnimatedBackground from "../components/AnimatedBackground";

const SettingsPage = () => {
    const { authUser } = useAuthUser();
    const { logoutMutation } = useLogout();
    const [theme, setTheme] = useState("light");
    const [searchQuery, setSearchQuery] = useState("");
    const [modalData, setModalData] = useState({ title: "", content: "" });
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleThemeChange = (value) => {
        setTheme(value);
        if (typeof document !== "undefined") {
            document.documentElement.setAttribute("data-theme", value);
        }
    };

    const openModal = (title, content) => setModalData({ title, content });
    const closeModal = () => setModalData({ title: "", content: "" });

    const filterSetting = (text) =>
        !searchQuery || text.toLowerCase().includes(searchQuery.toLowerCase());

    return (
        <div className="min-h-screen relative">
            <AnimatedBackground />

            <nav className="bg-base-100 shadow-md py-3 px-4 flex items-center justify-between sticky top-0 z-20 rounded-b-2xl backdrop-blur-sm">
               
                <div className="flex items-center gap-3">
                    <FileVideoCamera className="w-7 h-7 text-primary" />
                    <span className="font-bold text-xl text-primary">Spektra</span>
                    <div className="relative ml-4 flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-sm pl-10 pr-4 rounded-full bg-base-200 border border-base-300 text-sm w-full"
                        />
                        <SearchIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Home Link */}
                    <Link
                        to="/"
                        className="btn btn-ghost btn-sm hidden sm:flex"
                    >
                        Home
                    </Link>

                    {/* Profile Avatar */}
                    <button
                        className="avatar btn-ghost btn-circle"
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    >
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-base-300">
                            <img
                                src={authUser?.profilePic || "/default-avatar.png"}
                                alt="User Avatar"
                            />
                        </div>
                    </button>
                </div>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                    <div className="absolute top-16 right-4 sm:right-6 bg-base-100 rounded-xl p-4 shadow-lg w-60 flex flex-col gap-3 z-30">
                        <Link
                            to="/myprofile"
                            className="btn btn-outline w-full"
                            onClick={() => setProfileMenuOpen(false)}
                        >
                            My Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="btn btn-outline w-full flex items-center gap-2"
                            onClick={() => setProfileMenuOpen(false)}
                        >
                            <SettingsIcon className="h-4 w-4" /> Settings
                        </Link>
                        <Link
                            to="/"
                            className="btn btn-outline w-full flex items-center gap-2"
                            onClick={() => setProfileMenuOpen(false)}
                        >
                            <HomeIcon className="h-4 w-4" /> Home
                        </Link>
                        <button
                            className="btn btn-error w-full flex items-center gap-2"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to logout?")) {
                                    logoutMutation?.();
                                }
                                setProfileMenuOpen(false);
                            }}
                        >
                            <LogOutIcon className="h-4 w-4" /> Logout
                        </button>
                    </div>
                )}
            </nav>


            {/* Settings Container */}
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="bg-base-100 shadow-2xl rounded-2xl p-6 max-w-4xl mx-auto border border-base-300">
                    <h1 className="text-3xl font-bold mb-6 text-center text-primary">
                        <SettingsIcon className="w-8 h-8 inline-block mr-2" />
                        Settings
                    </h1>

                    <div className="divide-y divide-base-300">
                        {/* Account */}
                        {filterSetting("Account") && (
                            <div className="py-5">
                                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-secondary">
                                    <UserIcon className="w-5 h-5" /> Account
                                </h2>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        to="/edit-profile"
                                        className="btn btn-outline justify-start rounded-xl"
                                    >
                                        Edit Profile
                                    </Link>
                                    <Link
                                        to="/myprofile"
                                        className="btn btn-outline justify-start rounded-xl"
                                    >
                                        View Profile
                                    </Link>
                                    <button className="btn btn-outline justify-start rounded-xl">
                                        Change Password
                                    </button>
                                    <button
                                        className="btn btn-outline justify-start rounded-xl"
                                        onClick={() =>
                                            openModal(
                                                "Account Info",
                                                `<h3 class="font-bold mb-2">Account Details</h3>
                         <ul class="list-disc ml-5 space-y-1">
                           <li>Email: ${authUser?.email || "N/A"}</li>
                           <li>Username: ${authUser?.fullName || "N/A"}</li>
                           <li>Joined: ${authUser?.createdAt || "N/A"}</li>
                           <li>Bio: ${authUser?.bio || "N/A"}</li>
                           <li>Native Language: ${authUser?.nativeLanguage || "N/A"}</li>
                           <li>Learning Language: ${authUser?.learningLanguage || "N/A"}</li>
                           <li>Location: ${authUser?.location || "N/A"}</li>
                           <li>Skills Have: ${authUser?.skillsHave || "N/A"}</li>
                           <li>SkillsLearn: ${authUser?.skillsLearn || "N/A"}</li>
                         </ul>`
                                            )
                                        }
                                    >
                                        Account Info
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Privacy & Security */}
                        {filterSetting("Privacy") && (
                            <div className="py-5">
                                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-secondary">
                                    <ShieldIcon className="w-5 h-5" /> Privacy & Security
                                </h2>
                                <div className="flex flex-col gap-3">
                                    <button
                                        className="btn btn-outline justify-start rounded-xl"
                                        onClick={() =>
                                            openModal(
                                                "Manage Blocked Users",
                                                `
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Here you can view all users you have blocked. If you unblock a user, they will be able to interact with you again in the app.
      </p>

      <h3 class="font-bold text-md">Blocked Users List:</h3>
      <ul class="list-disc ml-5 space-y-1">
        <li><strong>User1:</strong> Blocked on 10 Sep 2025. Reason: Spam messages.</li>
        <li><strong>User2:</strong> Blocked on 12 Sep 2025. Reason: Offensive content.</li>
        <li><strong>User3:</strong> Blocked on 15 Sep 2025. Reason: Harassment.</li>
      </ul>

      <h3 class="font-bold text-md">What happens if you unblock a user?</h3>
      <p class="text-sm text-gray-600">
        Once unblocked, the user can view your posts, send messages, and interact with you as before. You can block them again anytime from this page.
      </p>

      <h3 class="font-bold text-md">Tips:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li>Review users carefully before unblocking.</li>
        <li>You can block users instantly from their profile page.</li>
        <li>Maintain your privacy settings to avoid unwanted interactions.</li>
      </ul>
    </div>
    `
                                            )
                                        }

                                    >
                                        Manage Blocked Users
                                    </button>
                                    <button
                                        className="btn btn-outline justify-start rounded-xl"
                                        onClick={() =>
                                            openModal(
                                                "Two-Factor Authentication",
                                                `
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Two-Factor Authentication (2FA) adds an extra layer of security to your account. 
        Even if someone knows your password, they won't be able to access your account without the second verification step.
      </p>

      <h3 class="font-bold text-md">Available 2FA Methods:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li><strong>SMS Verification:</strong> Receive a code via SMS each time you log in from a new device.</li>
        <li><strong>Authenticator App:</strong> Use an app like Google Authenticator or Authy to generate time-based codes.</li>
        <li><strong>Backup Codes:</strong> Keep a set of one-time backup codes in case you lose access to your device.</li>
      </ul>

      <h3 class="font-bold text-md">How to Enable 2FA:</h3>
      <ol class="list-decimal ml-5 space-y-1 text-sm text-gray-600">
        <li>Go to your account security settings.</li>
        <li>Choose your preferred 2FA method.</li>
        <li>Follow the on-screen instructions to verify your device.</li>
        <li>Save backup codes in a secure place.</li>
      </ol>

      <h3 class="font-bold text-md">Tips for Security:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li>Always use an authenticator app over SMS for better security.</li>
        <li>Never share your backup codes with anyone.</li>
        <li>Update your recovery phone number and email regularly.</li>
      </ul>

      <p class="text-sm text-gray-500 italic">
        Note: Enabling 2FA helps prevent unauthorized access even if your password is compromised.
      </p>
    </div>
    `
                                            )
                                        }

                                    >
                                        Two-Factor Authentication
                                    </button>
                                    <button
                                        className="btn btn-outline justify-start rounded-xl"
                                        onClick={() =>
                                            openModal(
                                                "Account Activity",
                                                `
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Here you can review all recent actions on your account. Monitoring account activity helps you detect any suspicious behavior early and secure your account if needed.
      </p>

      <h3 class="font-bold text-md">Recent Logins:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li><strong>Today:</strong> Login from Chrome on Windows, Location: New York, USA</li>
        <li><strong>Yesterday:</strong> Login from Safari on iPhone, Location: London, UK</li>
        <li><strong>2 days ago:</strong> Login from Edge on Windows, Location: Mumbai, India</li>
      </ul>

      <h3 class="font-bold text-md">Recent Account Changes:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li>Password changed - Yesterday</li>
        <li>Email address updated - 5 days ago</li>
        <li>Profile information updated - 1 week ago</li>
      </ul>

      <h3 class="font-bold text-md">Security Tips:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li>Check for any unknown devices and sign them out immediately.</li>
        <li>Enable Two-Factor Authentication (2FA) to add an extra layer of security.</li>
        <li>Do not share your password with anyone.</li>
        <li>Regularly review your account activity.</li>
      </ul>

      <p class="text-sm text-gray-500 italic">
        If you notice any activity that you do not recognize, please secure your account immediately by changing your password and reviewing connected devices.
      </p>
    </div>
    `
                                            )
                                        }

                                    >
                                        Account Activity
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Notifications */}
                        {filterSetting("Notifications") && (
                            <div className="py-5">
                                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-secondary">
                                    <BellIcon className="w-5 h-5" /> Notifications
                                </h2>
                                <div className="flex flex-col gap-3">
                                    <button
                                        className="btn btn-outline justify-start rounded-xl"
                                        onClick={() =>
                                            openModal(
                                                "Push Notifications",
                                                `
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Push notifications keep you updated in real-time about important events, messages, and updates on your account. You can customize which notifications you want to receive and how frequently.
      </p>

      <h3 class="font-bold text-md">Notification Categories:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li><strong>Messages:</strong> Receive alerts when you get new messages.</li>
        <li><strong>Friend Requests:</strong> Be notified when someone sends a friend request.</li>
        <li><strong>Activity Updates:</strong> Updates from communities, posts, or contests you follow.</li>
        <li><strong>Promotions:</strong> Optional notifications about new offers and promotions.</li>
      </ul>

      <h3 class="font-bold text-md">Tips:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li>Enable only the notifications that are important to you to avoid distractions.</li>
        <li>Check your device settings to make sure push notifications are allowed.</li>
        <li>You can change these settings anytime from this page.</li>
      </ul>

      <p class="text-sm text-gray-500 italic">
        Remember: Disabling push notifications will not stop important account alerts like security notices.
      </p>
    </div>
    `
                                            )
                                        }

                                    >
                                        Push Notifications
                                    </button>
                                    <button
                                        className="btn btn-outline justify-start rounded-xl"
                                        onClick={() =>
                                            openModal(
                                                "Email Notifications",
                                                `
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Email notifications help you stay informed about important updates, messages, and activity related to your account. You can choose which types of emails you want to receive.
      </p>

      <h3 class="font-bold text-md">Notification Categories:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li><strong>Messages:</strong> Get an email when you receive a new message.</li>
        <li><strong>Friend Requests:</strong> Be notified of pending friend requests.</li>
        <li><strong>Activity Updates:</strong> Updates from communities, posts, or contests you follow.</li>
        <li><strong>Promotions & Offers:</strong> Optional emails about new offers, promotions, or app updates.</li>
        <li><strong>Security Alerts:</strong> Important account notifications such as login attempts or password changes.</li>
      </ul>

      <h3 class="font-bold text-md">Tips:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li>You can turn off categories you don't want to receive emails for.</li>
        <li>Check your spam/junk folder if you are missing emails.</li>
        <li>Keep your email address updated to ensure you receive critical alerts.</li>
      </ul>

      <p class="text-sm text-gray-500 italic">
        Note: Disabling all email notifications may prevent you from receiving important security alerts.
      </p>
    </div>
    `
                                            )
                                        }

                                    >
                                        Email Notifications
                                    </button>
                                    <button
                                        className="btn btn-outline justify-start rounded-xl"
                                        onClick={() =>
                                            openModal(
                                                "Notification Sounds",
                                                `
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Notification sounds help you know when new activity occurs in your account. You can customize which types of events trigger sounds and adjust their volume or tone.
      </p>

      <h3 class="font-bold text-md">Sound Settings:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li><strong>Messages:</strong> Play a sound when a new message is received.</li>
        <li><strong>Friend Requests:</strong> Receive a notification tone when someone sends you a friend request.</li>
        <li><strong>App Alerts:</strong> Sounds for updates, contests, or activity in communities you follow.</li>
        <li><strong>Reminders:</strong> Optional sound alerts for reminders or scheduled events.</li>
      </ul>

      <h3 class="font-bold text-md">Tips:</h3>
      <ul class="list-disc ml-5 space-y-1 text-sm text-gray-600">
        <li>You can turn off specific notification sounds without disabling the notifications themselves.</li>
        <li>Adjust your device’s volume settings to control how loud the notifications play.</li>
        <li>Use “Do Not Disturb” mode if you want temporary silence for all notifications.</li>
      </ul>

      <p class="text-sm text-gray-500 italic">
        Note: Some notifications may still appear silently even if sounds are disabled.
      </p>
    </div>
    `
                                            )
                                        }

                                    >
                                        Notification Sounds
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Appearance */}
                        {filterSetting("Appearance") && (
                            <div className="py-5">
                                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-secondary">
                                    <MoonIcon className="w-5 h-5" /> Appearance
                                </h2>
                                <div className="flex flex-wrap gap-3 items-center">
                                    <button
                                        className={`btn rounded-xl ${theme === "light" ? "btn-primary" : "btn-outline"
                                            }`}
                                        onClick={() => handleThemeChange("light")}
                                    >
                                        Light
                                    </button>
                                    <button
                                        className={`btn rounded-xl ${theme === "dark" ? "btn-primary" : "btn-outline"
                                            }`}
                                        onClick={() => handleThemeChange("dark")}
                                    >
                                        Dark
                                    </button>
                                    <ThemeSelector
                                        theme={theme}
                                        onChange={(t) => handleThemeChange(t)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Logout */}
                        {filterSetting("Logout") && (
                            <div className="py-5">
                                <button
                                    className="btn btn-error w-full rounded-xl"
                                    onClick={() => logoutMutation?.()}
                                >
                                    <LogOutIcon /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalData.title && modalData.content && (
                <Modal
                    title={modalData.title}
                    content={modalData.content}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default SettingsPage;
