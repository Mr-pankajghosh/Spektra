
import { useState } from "react";
import { Mail, Phone, AlertCircle } from "lucide-react";

const HelpPage = () => {
  const [selected, setSelected] = useState(null);

  const faqs = [
    { title: "Terms & Conditions", content: "Spektra's terms and conditions ensure a safe and fair experience for all users. Read them carefully to understand your rights and responsibilities." },
    { title: "Privacy Policy", content: "Your privacy is our priority. We only use your data to improve your experience. All chats, video calls, and contests are encrypted and secure." },
    { title: "Contact Us", content: "Have questions or feedback? Reach out to us via email or phone. We are here to help and respond as quickly as possible." },
    { title: "Community Guidelines", content: "Respect all members, avoid spamming, and follow community rules. Violations may lead to restrictions." },
    { title: "Feedback", content: "We love hearing from users! Share your thoughts and suggestions about Spektra to help us improve." },
  ];

  const handleClick = (index) => {
    setSelected(selected === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black/80 text-white flex flex-col items-center px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-bold mb-12">Help & Support</h1>

      <div className="w-full max-w-3xl space-y-4">
        {faqs.map((item, i) => (
          <div key={i} className="bg-black/50 rounded-xl p-6 hover:bg-primary/20 transition cursor-pointer">
            <div
              className="flex justify-between items-center"
              onClick={() => handleClick(i)}
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <span>{selected === i ? "−" : "+"}</span>
            </div>
            {selected === i && (
              <p className="mt-3 text-gray-300">{item.content}</p>
            )}
          </div>
        ))}
      </div>


      <div className="mt-16 w-full max-w-3xl bg-black/50 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex gap-4 items-center">
          <Mail className="w-6 h-6 text-primary" />
          <a href="mailto:support@spektra.com" className="hover:text-primary transition">support@spektra.com</a>
        </div>
        <div className="flex gap-4 items-center">
          <Phone className="w-6 h-6 text-primary" />
          <span>+91 98765 43210</span>
        </div>
        <div className="flex gap-4 items-center">
          <AlertCircle className="w-6 h-6 text-primary" />
          <span>We respond within 24 hours</span>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
