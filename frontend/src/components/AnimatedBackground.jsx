import { useEffect } from "react";
import gsap from "gsap";

const AnimatedBackground = () => {
  useEffect(() => {
    const container = document.querySelector(".bubbles-container");

    const createBubble = () => {
      const bubble = document.createElement("div");
      bubble.classList.add("absolute", "rounded-full", "opacity-70");

      const size = Math.random() * 65 + 15;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.top = `${100 + Math.random() * 20}vh`;

      const colors = ["#06b6d4", "#7e22ce", "#f43f5e", "#22c55e", "#eab308"];
      bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
      bubble.style.filter = "blur(1px)";

      container.appendChild(bubble);

      gsap.to(bubble, {
        y: () => `-${120 + Math.random() * 50}vh`,
        x: () => `${Math.random() * 300 - 150}px`,
        duration: () => 15 + Math.random() * 20,
        ease: "linear",
        onComplete: () => bubble.remove(),
      });
    };
    const bubbleInterval = setInterval(createBubble, 250);

    const createRocket = () => {
      const rocket = document.createElement("div");
      rocket.innerHTML = "🚀";
      rocket.classList.add("absolute", "text-3xl");
      rocket.style.left = "-60px";
      rocket.style.top = `${20 + Math.random() * 20}vh`;
      container.appendChild(rocket);

      gsap.to(rocket, {
        x: "110vw",
        duration: 12,
        ease: "power2.inOut",
        onUpdate: () => {
          const smoke = document.createElement("div");
          smoke.classList.add("absolute", "rounded-full");
          smoke.style.width = "20px";
          smoke.style.height = "20px";
          const smokeColors = [
            "rgba(236,72,153,0.5)",
            "rgba(59,130,246,0.5)",
            "rgba(139,92,246,0.5)",
            "rgba(34,197,94,0.5)",
            "rgba(250,204,21,0.5)",
          ];
          smoke.style.background = smokeColors[Math.floor(Math.random() * smokeColors.length)];
          smoke.style.left = rocket.offsetLeft + "px";
          smoke.style.top = rocket.offsetTop + 20 + "px";
          smoke.style.filter = "blur(4px)";
          container.appendChild(smoke);

          gsap.to(smoke, {
            y: "+=80",
            x: () => `${Math.random() * 60 - 30}px`,
            opacity: 0,
            scale: 2,
            duration: 4,
            ease: "power1.out",
            onComplete: () => smoke.remove(),
          });
        },
        onComplete: () => rocket.remove(),
      });
    };
    const rocketInterval = setInterval(createRocket, 15000);

    const createStar = () => {
      const star = document.createElement("div");
      star.classList.add("absolute", "rounded-full");
      const size = Math.random() * 3 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.background = "white";
      star.style.boxShadow = "0 0 6px white";
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      container.appendChild(star);

      gsap.to(star, {
        x: `+=${Math.random() * 200 - 100}px`,
        y: `+=${Math.random() * 200 - 100}px`,
        opacity: 0,
        duration: 3 + Math.random() * 2,
        ease: "power1.out",
        onComplete: () => star.remove(),
      });
    };
    const starInterval = setInterval(createStar, 500);

    const createOrb = () => {
      const orb = document.createElement("div");
      orb.classList.add("absolute", "rounded-full");
      const size = Math.random() * 60 + 40;
      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.background = `radial-gradient(circle, rgba(255,255,255,0.2), rgba(255,255,255,0))`;
      orb.style.left = `${Math.random() * 100}vw`;
      orb.style.top = `${Math.random() * 100}vh`;
      orb.style.filter = "blur(10px)";
      container.appendChild(orb);

      gsap.to(orb, {
        x: `+=${Math.random() * 100 - 50}px`,
        y: `+=${Math.random() * 100 - 50}px`,
        duration: 20 + Math.random() * 20,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    };
    for (let i = 0; i < 5; i++) createOrb();

    const createGlow = () => {
      const glow = document.createElement("div");
      glow.classList.add("absolute", "rounded-full");
      const size = Math.random() * 6 + 4;
      glow.style.width = `${size}px`;
      glow.style.height = `${size}px`;
      glow.style.background = "rgba(255,255,100,0.6)";
      glow.style.filter = "blur(2px)";
      glow.style.left = `${Math.random() * 100}vw`;
      glow.style.top = `${Math.random() * 100}vh`;
      container.appendChild(glow);

      gsap.to(glow, {
        x: `+=${Math.random() * 50 - 25}px`,
        y: `+=${Math.random() * 50 - 25}px`,
        opacity: 0,
        duration: 5 + Math.random() * 3,
        ease: "sine.inOut",
        onComplete: () => glow.remove(),
      });
    };
    const glowInterval = setInterval(createGlow, 400);

  
    const createComet = () => {
      const comet = document.createElement("div");
      comet.classList.add("absolute");
      comet.style.width = "2px";
      comet.style.height = "80px";
      comet.style.background = "linear-gradient(to bottom, white, transparent)";
      comet.style.left = "-10px";
      comet.style.top = `${Math.random() * 50}vh`;
      comet.style.rotate = `${Math.random() * 30}deg`;
      container.appendChild(comet);

      gsap.to(comet, {
        x: "110vw",
        y: "+=100px",
        opacity: 0,
        duration: 5 + Math.random() * 3,
        ease: "power2.out",
        onComplete: () => comet.remove(),
      });
    };
    const cometInterval = setInterval(createComet, 8000);


    return () => {
      clearInterval(bubbleInterval);
      clearInterval(rocketInterval);
      clearInterval(starInterval);
      clearInterval(glowInterval);
      clearInterval(cometInterval);
    };
  }, []);

  return (
    <div className="bubbles-container fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 drop-shadow-lg">
        Developed By: Pankaj 🚀
      </div>
    </div>
  );
};

export default AnimatedBackground;
