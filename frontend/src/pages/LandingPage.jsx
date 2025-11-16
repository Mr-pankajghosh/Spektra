
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileVideo2Icon,
  MenuIcon,
  XIcon,
  UsersIcon,
  Globe2Icon,
  MessageCircleIcon,
  TrophyIcon,
  NewspaperIcon,
  VideoIcon,
  Github,
  Linkedin,
  Mail,
  MailCheck,
  Twitter,
} from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AnimatedBackground from "../components/AnimatedBackground";
import ThemeSelector from "../components/ThemeSelector";
import ReadMore from "../components/ReadMore";
import PublicFooter from "../components/PublicFooter";
import Modal from "../components/Modal";
import { toast } from "react-hot-toast";


  import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext"; 

gsap.registerPlugin(ScrollTrigger);

const features = [
  { title: "Global Friends", desc: "Make friends across the globe and share experiences.", icon: <UsersIcon className="w-6 h-6" />, more: "Connect with thousands worldwide in real-time." },
  { title: "Language Exchange", desc: "Learn & practice languages with native speakers.", icon: <Globe2Icon className="w-6 h-6" />, more: "Improve your skills via chats, calls, and groups." },
  { title: "Skill Swap", desc: "Teach what you know, learn new skills in return.", icon: <MessageCircleIcon className="w-6 h-6" />, more: "Exchange knowledge with like-minded people." },
  { title: "Contests", desc: "Join weekly contests & showcase your talent.", icon: <TrophyIcon className="w-6 h-6" />, more: "Win prizes and recognition in global contests." },
  { title: "Global News", desc: "Stay updated with global & local communities.", icon: <NewspaperIcon className="w-6 h-6" />, more: "Personalized news feed from communities worldwide." },
  { title: "Chats & Calls", desc: "Seamless chat and HD video calling built-in.", icon: <VideoIcon className="w-6 h-6" />, more: "Secure and fast messaging & video experience." },
  { title: "Communities", desc: "Join and create communities for your interests.", icon: <UsersIcon className="w-6 h-6" />, more: "Share, discuss, and connect with passionate people." },
  { title: "Custom Themes", desc: "Choose from 30+ themes to personalize your app.", icon: <Globe2Icon className="w-6 h-6" />, more: "Make the app truly yours with theme options." },];

const faqs = [
  { q: "What is Spektra?", a: "A global platform for chatting, learning, contests, and community.It brings together local communities — like fitness, foodies, tech, fashion, students, teachers, and more — all in one place. Users can join their favorite communities, share posts and make chats , calls and video calls." },
  { q: "Do I need to pay?", a: "Most features are free. Premium features may come later." },
  { q: "Is signup required?", a: "Yes, you need an account to join communities & contests." },
  { q: "Can I use it on mobile?", a: "Yes! It’s fully responsive for all devices." },
  { q: "Can I host contests?", a: "Yes, community admins can create contests for engagement." },
  { q: "Is video calling secure?", a: "Yes, all calls are encrypted for privacy and safety." },
  { q: "Can I switch themes?", a: "Yes! Choose from 30+ themes using the theme selector." },
];

const LandingPage = () => {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (!user.isOnboarded) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    
  };

  const closeModal = () => {
    setModalTitle("");
    setModalContent("");
  };

  const handleFeedback = () => {
    toast.success("Thanks for your feedback!");
  };

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden">
      <AnimatedBackground />

      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-black/30 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <FileVideo2Icon className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Spektra
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#about" className="hover:text-primary transition">About</a>
          <a href="#features" className="hover:text-primary transition">Features</a>
          <a href="#faq" className="hover:text-primary transition">FAQ</a>
          <Link to="/login" className="hover:text-primary transition">Login</Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg shadow hover:opacity-90 transition"
          >
            Sign Up
          </Link>
          <ThemeSelector />
        </div>

        <button className="md:hidden z-50" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="absolute top-16 right-0 w-full bg-black/70 backdrop-blur-md flex flex-col items-center gap-4 py-6 md:hidden z-40">
          <a href="#about" className="hover:text-primary transition" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#features" className="hover:text-primary transition" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#faq" className="hover:text-primary transition" onClick={() => setMenuOpen(false)}>FAQ</a>
          <Link to="/login" className="hover:text-primary transition" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg shadow hover:opacity-90 transition"
            onClick={() => setMenuOpen(false)}
          >
            Sign Up
          </Link>
          <ThemeSelector />
        </div>
      )}

     
      <section className="relative flex flex-col md:flex-row justify-center items-center text-center md:text-left min-h-screen px-6 md:px-20 gap-10 pt-28 md:pt-36 reveal bg-transparent z-10">
<div className="absolute inset-0 -z-10 bg-transparent backdrop-blur-sm rounded-xl" />
        <div className="max-w-xl reveal z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Connect. Learn. Share. Grow.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Spektra is your gateway to global communities — chat, video call, compete in contests, 
            exchange languages, and grow your network worldwide 🌍
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link
              to="/signup"
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              Get Started
            </Link>
            <a
              href="#about"
              className="px-6 py-3 border border-gray-300/30 rounded-xl shadow hover:bg-white/10 transition"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 reveal z-10">
          <img
            src="/VIDCALL.png"
            alt="Spektra illustration"
            className="rounded-2xl shadow-lg w-full h-auto object-contain"
          />
        </div>
      </section>

      <section id="about" className="relative z-10 py-20 px-6 text-center bg-black/40 backdrop-blur-lg reveal">
        <h2 className="text-3xl font-bold mb-6">About Spektra</h2>
        <p className="max-w-3xl mx-auto text-gray-200 text-lg">
          Spektra is more than just a platform. It’s a <strong>global hub</strong> where people
          learn languages, share skills, compete, and form lasting friendships. Built for everyone — from casual learners to global professionals.
        </p>

        <ReadMore>
          {`
            With Spektra, you can connect with people from all corners of the world, explore different cultures, and improve your communication skills. Participate in contests to showcase your talents and win rewards. Join communities to discuss your interests, exchange ideas, and collaborate on projects. Host or join skill swaps to teach what you know and learn new skills from others. Stay updated with global news and announcements. Enjoy seamless video calls and chat features, making networking effortless. Customize your experience with multiple themes. Spektra is your one-stop solution for learning, sharing, and growing globally.
          `}
        </ReadMore>
      </section>

      <section id="features" className="relative z-10 py-20 px-6 bg-black/20 backdrop-blur-md reveal">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 shadow cursor-pointer transition-transform hover:scale-105"
            >
              <div className="mb-4 text-primary">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-200">{f.desc}</p>
              <p className="mt-2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-all">
                {f.more}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="relative z-10 py-20 px-6 bg-black/40 backdrop-blur-lg reveal">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-black/40 p-6 rounded-lg">
              <summary className="cursor-pointer font-semibold">{faq.q}</summary>
              <p className="mt-3 text-gray-300">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="reviews" className="relative z-10 py-20 px-6 bg-black/20 backdrop-blur-md reveal">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="overflow-hidden relative max-w-6xl mx-auto">
          <div className="flex animate-slide gap-6">
            {[
              { name: "Alice", review: "Spektra helped me connect with amazing people worldwide! Loved the language exchange feature.", avatar: "/avatars/alice.png" },
              { name: "Rohan", review: "I improved my skills by teaching and learning in the Skill Swap section. Amazing community!", avatar: "/avatars/rohan.png" },
              { name: "Sara", review: "Contests are so fun and motivating. I even won my first global contest here!", avatar: "/avatars/sara.png" },
              { name: "John", review: "The communities are super interactive. I found friends who share my interests!", avatar: "/avatars/john.png" },
              { name: "Priya", review: "The games feature is amazing. Fun, engaging, and I love competing with others.", avatar: "/avatars/priya.png" },
              { name: "Leo", review: "HD video calls are smooth and secure. Truly a global platform.", avatar: "/avatars/leo.png" },
            ].map((user, i) => (
              <div
                key={i}
                className="min-w-[300px] sm:min-w-[350px] md:min-w-[400px] p-6 rounded-2xl bg-black/40 backdrop-blur-sm shadow-lg flex-shrink-0"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-primary" />
                  <h4 className="font-semibold text-lg">{user.name}</h4>
                </div>
                <p className="text-gray-200 text-sm">{user.review}</p>
              </div>
            ))}
          </div>
        </div>

        <style>
          {`
            @keyframes slide {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-slide {
              display: flex;
              animation: slide 40s linear infinite;
            }
            .animate-slide:hover {
              animation-play-state: paused;
            }
          `}
        </style>
      </section>

   
      <section id="feedback" className="relative z-10 py-20 px-6 bg-black/30 backdrop-blur-md reveal">
        <h2 className="text-3xl font-bold text-center mb-6">Share Your Feedback</h2>
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
          We’d love to hear from you! Let us know how we can improve Spektra and make your experience even better.
        </p>
        <form className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4" onSubmit={(e) => { e.preventDefault(); handleFeedback(); }}>
          <input type="text" placeholder="Your Name" className="px-4 py-2 rounded-lg w-full md:w-1/3 text-black" />
          <input type="email" placeholder="Your Email" className="px-4 py-2 rounded-lg w-full md:w-1/3 text-black" />
          <textarea placeholder="Your Feedback" className="px-4 py-2 rounded-lg w-full md:w-1/3 text-black resize-none" />
          <button type="submit" className="px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition">
            Submit
          </button>
        </form>
      </section>

      <div className="mt-auto">
        <PublicFooter openModal={openModal} addReview={handleFeedback} />
      </div>

      <Modal title={modalTitle} content={modalContent} onClose={closeModal} />
    </div>
  );
};

export default LandingPage;
