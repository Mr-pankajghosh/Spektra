
import { useState } from "react";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const PublicFooter = ({ addReview, openModal }) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email!");
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  const handleFeedbackClick = () => {
    addReview && addReview("User shared feedback via footer!");
  };

  return (
    <footer className="relative z-10 bg-black/60 backdrop-blur-lg py-12 text-gray-300">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 px-6 text-center md:text-left">

        {/* Column 1: About + Social */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-primary">Spektra</h3>
          <p className="mb-4">Connecting people across the globe with communities, contests, and conversations.</p>
          <div className="flex gap-3 justify-center md:justify-start">
            <a
              href="https://twitter.com/YourTwitterHandle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
            </a>

            <a
              href="https://github.com/YourGithubProfile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5 hover:text-gray-300 cursor-pointer" />
            </a>

            <a
              href="https://www.linkedin.com/in/YourLinkedInProfile"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5 hover:text-blue-500 cursor-pointer" />
            </a>

            <a
              href="mailto:yourmail@example.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="w-5 h-5 hover:text-red-400 cursor-pointer" />
            </a>
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/#about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-primary">&nbsp;</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/signup" className="hover:text-white">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <button onClick={handleFeedbackClick} className="hover:text-white">
                  Feedback
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-primary">Help & Legal</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() =>
                  openModal &&
                  openModal("Help", `
                   <div class="p-6 w-full max-w-4xl">
      <h1 class="text-3xl font-bold mb-4 text-white">How can we help?</h1>
      
      <!-- Search -->
      <div class="mb-6">
        <input type="text" placeholder="Search articles..." class="w-full p-3 rounded-lg text-black" />
      </div>

      <!-- Featured Article -->
      <div class="mb-6 bg-primary/30 p-4 rounded-lg shadow hover:bg-primary/50 cursor-pointer transition">
        <h2 class="font-semibold text-lg mb-1">Featured Article</h2>
        <p class="text-gray-200">How to Create Surveys Using AI</p>
      </div>

      <!-- Categories -->
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
          <h3 class="font-semibold text-white mb-2">Getting Started</h3>
          <ul class="text-gray-300 list-disc list-inside text-sm">
            <li>Create an account</li>
            <li>Complete your profile</li>
            <li>Verify your email</li>
          </ul>
        </div>
        <div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
          <h3 class="font-semibold text-white mb-2">Communities</h3>
          <ul class="text-gray-300 list-disc list-inside text-sm">
            <li>Join communities</li>
            <li>Create your own</li>
            <li>Manage roles & rules</li>
          </ul>
        </div>
        <div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
          <h3 class="font-semibold text-white mb-2">Contests</h3>
          <ul class="text-gray-300 list-disc list-inside text-sm">
            <li>View ongoing contests</li>
            <li>Submit entries</li>
            <li>Check leaderboards</li>
          </ul>
        </div>
        <div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
          <h3 class="font-semibold text-white mb-2">Profile & Privacy</h3>
          <ul class="text-gray-300 list-disc list-inside text-sm">
            <li>Edit profile</li>
            <li>Privacy settings</li>
            <li>Security & 2FA</li>
          </ul>

        </div>
        
      </div>
    </div>
    <!-- Communities -->
<div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
  <h3 class="font-semibold text-white mb-2">Communities</h3>
  <ul class="text-gray-300 list-disc list-inside text-sm">
    <li>How to join and leave communities</li>
    <li>Creating your own community</li>
    <li>Community guidelines</li>
  </ul>
</div>

<!-- Messaging & Chats -->
<div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
  <h3 class="font-semibold text-white mb-2">Messaging & Chats</h3>
  <ul class="text-gray-300 list-disc list-inside text-sm">
    <li>Start a private chat</li>
    <li>Send media and files</li>
    <li>Block or report a user</li>
  </ul>
</div>

<!-- Notifications -->
<div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
  <h3 class="font-semibold text-white mb-2">Notifications</h3>
  <ul class="text-gray-300 list-disc list-inside text-sm">
    <li>Manage push & email alerts</li>
    <li>Mute/unmute conversations</li>
    <li>Set reminder preferences</li>
  </ul>
</div>

<!-- Support & Contact -->
<div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
  <h3 class="font-semibold text-white mb-2">Support & Contact</h3>
  <ul class="text-gray-300 list-disc list-inside text-sm">
    <li>Report bugs or technical issues</li>
    <li>Contact our support team</li>
    <li>FAQs & Troubleshooting</li>
  </ul>
</div>

<!-- Security & Safety -->
<div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
  <h3 class="font-semibold text-white mb-2">Security & Safety</h3>
  <ul class="text-gray-300 list-disc list-inside text-sm">
    <li>Two-factor authentication</li>
    <li>Protect your account</li>
    <li>Report suspicious activity</li>
  </ul>
</div>

<!-- Getting Started -->
<div class="bg-black/40 p-4 rounded-lg shadow hover:scale-105 transition cursor-pointer">
  <h3 class="font-semibold text-white mb-2">Getting Started</h3>
  <ul class="text-gray-300 list-disc list-inside text-sm">
    <li>Create your account</li>
    <li>Verify your email</li>
    <li>Explore key features</li>
  </ul>
</div>



                  `)
                }
                className="hover:text-white"
              >
                Help
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  openModal &&
                  openModal("Privacy Policy", `
                    <div class="p-6 w-full max-w-3xl text-left">
      <h1 class="text-3xl font-bold mb-4 text-primary">Privacy Policy</h1>
      <p class="text-gray-300 mb-6">
        Effective: January 1, 2025 <br/>
        Spektra is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.
      </p>

      <!-- Table of Contents -->
      <div class="bg-black/40 p-4 rounded-lg shadow mb-6">
        <h2 class="text-lg font-semibold mb-2 text-primary">Table of Contents</h2>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          <li><a href="#introduction" class="hover:text-white">Introduction</a></li>
          <li><a href="#data" class="hover:text-white">Data We Collect</a></li>
          <li><a href="#usage" class="hover:text-white">How We Use Your Data</a></li>
          <li><a href="#share" class="hover:text-white">How We Share Information</a></li>
          <li><a href="#choices" class="hover:text-white">Your Choices & Rights</a></li>
          <li><a href="#important" class="hover:text-white">Other Important Information</a></li>
        </ul>
      </div>

      <!-- Sections -->
      <section id="introduction" class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Introduction</h2>
        <p class="text-gray-300">
          Spektra’s mission is to connect people safely through communities, contests, and conversations. 
          Transparency is key: we want you to understand what data we collect and how we use it.
        </p>
      </section>

      <section id="data" class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Data We Collect</h2>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          <li>Account details (name, email, city)</li>
          <li>Community interactions & posts</li>
          <li>Contest participation details</li>
          <li>Technical data (browser, device type)</li>
        </ul>
      </section>

      <section id="usage" class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">How We Use Your Data</h2>
        <p class="text-gray-300">We use your data to improve your experience:</p>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          <li>Personalize community and contest recommendations</li>
          <li>Secure login and authentication</li>
          <li>Send important updates (with your consent)</li>
          <li>Improve platform performance</li>
        </ul>
      </section>

      <section id="share" class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">How We Share Information</h2>
        <p class="text-gray-300">
          Spektra does not sell or rent your personal data. Information is only shared:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          <li>With your consent</li>
          <li>To comply with legal obligations</li>
          <li>To prevent fraud or security risks</li>
        </ul>
      </section>

      <section id="choices" class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Your Choices & Rights</h2>
        <p class="text-gray-300">
          You are in control of your data:
        </p>
        <ul class="list-disc list-inside text-gray-300 space-y-1">
          <li>Access and download your data</li>
          <li>Delete or deactivate your account</li>
          <li>Manage privacy settings anytime</li>
        </ul>
      </section>

      <section id="important" class="mb-6">
        <h2 class="text-2xl font-semibold mb-2">Other Important Information</h2>
        <p class="text-gray-300">
          We use end-to-end encryption for chats. Photos and sensitive personal data are not stored on our servers 
          to ensure maximum privacy for users.
        </p>
      </section>

      <p class="text-gray-400 text-sm mt-8">© ${new Date().getFullYear()} Spektra. All rights reserved.</p>
    </div>
                  `)
                }
                className="hover:text-white"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  openModal &&
                  openModal("Terms & Services", `
                    <h1 class="text-2xl font-bold mb-4">Terms & Services</h1>
  <p class="mb-4 text-gray-300">
    Welcome to Spektra! By using our platform, you agree to the following terms and conditions. 
    Please read them carefully to understand your rights and responsibilities as a user of Spektra.
  </p>

  <section class="mb-6">
    <h2 class="text-xl font-semibold mb-2">1. Account Responsibilities</h2>
    <p class="text-gray-300">Users are responsible for maintaining the security of their accounts. 
    You must provide accurate information during registration and keep your login credentials private.</p>
  </section>

  <section class="mb-6">
    <h2 class="text-xl font-semibold mb-2">2. Community Rules</h2>
    <ul class="list-disc list-inside ml-4 text-gray-300">
      <li>Respect all members and avoid abusive or offensive language.</li>
      <li>Do not share illegal or harmful content.</li>
      <li>Follow the guidelines set for each community you join.</li>
    </ul>
  </section>

  <section class="mb-6">
    <h2 class="text-xl font-semibold mb-2">3. Contests Participation Rules</h2>
    <ul class="list-disc list-inside ml-4 text-gray-300">
      <li>Entries must be original and created by you.</li>
      <li>Do not plagiarize or copy content from others.</li>
      <li>Respect contest deadlines and rules shared by organizers.</li>
    </ul>
  </section>

  <section class="mb-6">
    <h2 class="text-xl font-semibold mb-2">4. Prohibited Activities</h2>
    <p class="text-gray-300">The following activities are strictly prohibited:</p>
    <ul class="list-disc list-inside ml-4 text-gray-300">
      <li>Spamming or phishing attempts.</li>
      <li>Uploading viruses or malicious software.</li>
      <li>Harassing, bullying, or threatening other users.</li>
      <li>Impersonating another user or entity.</li>
    </ul>
  </section>

  <section class="mb-6">
    <h2 class="text-xl font-semibold mb-2">5. Data & Privacy</h2>
    <p class="text-gray-300">We value your privacy. All user data is secured and encrypted. 
    Please refer to our <strong>Privacy Policy</strong> for more details on how we handle data.</p>
  </section>

  <section class="mb-6">
    <h2 class="text-xl font-semibold mb-2">6. Termination of Service</h2>
    <p class="text-gray-300">Spektra reserves the right to suspend or terminate accounts that 
    violate these terms or engage in harmful activities.</p>
  </section>

  <section class="mb-6">
    <h2 class="text-xl font-semibold mb-2">7. Changes to Terms</h2>
    <p class="text-gray-300">We may update these Terms & Services from time to time. 
    Continued use of the platform means you accept any changes made.</p>
  </section>

  <p class="mt-6 text-gray-400 italic">
    By using Spektra, you agree to abide by these terms. 
    If you have any questions, please contact our support team.
  </p>
                  `)
                }
                className="hover:text-white"
              >
                Terms & Services
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-primary">Stay Updated</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-lg text-black w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition">
              Subscribe
            </button>
          </form>
          <p className="text-gray-400 text-sm mb-2">Contact: info@spektra.com</p>
          <p className="text-gray-400 text-sm">Phone: +91 78549 62134</p>
        </div>

      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        © {new Date().getFullYear()} Spektra — Built with ❤️ by{" "}
        <a
          href="https://github.com/Mr-pankajghosh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Pankaj
        </a>
      </p>

    </footer>
  );
};

export default PublicFooter;
