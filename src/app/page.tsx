"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, RefObject } from "react";

export default function Home() {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  // Refs for scrolling
  const heroRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const howItWorksRef = useRef<HTMLElement | null>(null);
  const therapistsRef = useRef<HTMLElement | null>(null);
  const couplesRef = useRef<HTMLElement | null>(null);
  const clientsRef = useRef<HTMLElement | null>(null);

  const scrollTo = (ref: RefObject<HTMLElement | null>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Section visibility state
  const [visibleSection, setVisibleSection] = useState('hero');

  // Section refs for intersection observer
  const pricingRef = useRef(null);
  const faqRef = useRef(null);
  const sectionRefs = [
    { key: 'hero', ref: heroRef },
    { key: 'features', ref: featuresRef },
    { key: 'howItWorks', ref: howItWorksRef },
    { key: 'community', ref: therapistsRef },
    { key: 'whyUs', ref: couplesRef },
    { key: 'testimonials', ref: clientsRef },
    { key: 'pricing', ref: pricingRef },
    { key: 'faq', ref: faqRef },
  ];

  useEffect(() => {
    const handleScroll = () => {
      let found = 'hero';
      for (const { key, ref } of sectionRefs) {
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            found = key;
            break;
          }
        }
      }
      setVisibleSection(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-between px-6 py-3"
      >
        {/* Left: Icon and Name */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-3xl cursor-pointer select-none" onClick={() => scrollTo(heroRef)} aria-label="logo" role="img">🧠</span>
          <span className="font-extrabold text-sky-500 text-2xl cursor-pointer" onClick={() => scrollTo(heroRef)}>
            MindHeavenly
          </span>
        </div>
        {/* Center: Navigation Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-6 text-sky-700 font-semibold text-base">
            <button className={`hover:text-sky-400 transition ${visibleSection==='hero' ? 'text-sky-500 underline' : ''}`} onClick={() => scrollTo(heroRef)}>Home</button>
            <button className={`hover:text-sky-400 transition ${visibleSection==='features' ? 'text-sky-500 underline' : ''}`} onClick={() => scrollTo(featuresRef)}>Our Services</button>
            <button className={`hover:text-sky-400 transition ${visibleSection==='howItWorks' ? 'text-sky-500 underline' : ''}`} onClick={() => scrollTo(howItWorksRef)}>How It Works</button>
            <button className={`hover:text-sky-400 transition ${visibleSection==='community' ? 'text-sky-500 underline' : ''}`} onClick={() => scrollTo(therapistsRef)}>Community</button>
            <button className={`hover:text-sky-400 transition ${visibleSection==='whyUs' ? 'text-sky-500 underline' : ''}`} onClick={() => scrollTo(couplesRef)}>Why Us</button>
            <button className={`hover:text-sky-400 transition ${visibleSection==='testimonials' ? 'text-sky-500 underline' : ''}`} onClick={() => scrollTo(clientsRef)}>Testimonials</button>
            <button className={`hover:text-sky-400 transition ${visibleSection==='pricing' ? 'text-sky-500 underline' : ''}`} onClick={() => scrollTo(pricingRef)}>Pricing</button>
          </div>
        </div>
        {/* Right: Auth Buttons */}
        <div className="flex gap-3 min-w-[180px] justify-end">
          <button
            className="px-5 py-2 rounded-full border-2 border-sky-400 bg-white text-sky-500 font-semibold text-base shadow hover:bg-sky-50 hover:text-sky-600 transition"
            onClick={() => router.push('/auth/signin')}
          >
            Login
          </button>
          <button
            className="px-5 py-2 rounded-full bg-sky-400 text-white font-semibold text-base shadow hover:bg-sky-500 transition"
            onClick={() => router.push('/auth/signup')}
          >
            Get Started
          </button>
        </div>
      </motion.nav>

      <main className="min-h-screen bg-gradient-to-br from-white via-[#dbeafe] to-[#f0fdfa] flex flex-col items-center justify-start px-4">
      {/* Hero Section */}
      <section ref={heroRef} className="w-full max-w-5xl text-center py-20">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold font-display text-sky-500 drop-shadow-xl mb-6 text-center"
        >
          AI-Powered Therapy Matching<br />
          <span className="text-sky-700">Find Your Perfect Therapist</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-2xl md:text-3xl text-sky-700/90 mb-8 font-medium"
        >
          MindHeavenly connects you with the right therapist or support group using advanced AI matching.<br />
          Discover personalized care, resources, and a supportive community for your mental wellness journey.
        </motion.p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <button
            className="px-10 py-4 rounded-full bg-sky-400 text-white font-bold text-lg shadow-xl hover:bg-sky-500 hover:text-white transition"
            onClick={() => router.push("/auth/signup")}
          >
            Get Started
          </button>
          <button
            className="px-10 py-4 rounded-full border-2 border-sky-400 bg-white text-sky-500 font-bold text-lg shadow-xl hover:bg-sky-400 hover:text-white transition"
            onClick={() => router.push("/auth/signin")}
          >
            Login
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="text-sky-400 font-semibold text-lg">Trusted by</span>
          <div className="flex gap-6 justify-center text-sky-700/80 text-xl">
            <span className="font-bold">South African Therapy Association</span>
            <span className="font-bold">MindfulSA</span>
            <span className="font-bold">Wellness Network</span>
          </div>
        </div>
      </section>
      {/* Our Services Section */}
      <section ref={featuresRef} className="w-full mt-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-sky-500 mb-10 text-center"
        >
          Our Services
        </motion.h2>
        <div className="mb-8 text-lg text-sky-700 text-center max-w-3xl mx-auto">
          <p>MindHeavenly offers a holistic platform for mental wellness, connecting individuals, couples, and therapists with the right support and resources. Our AI-powered system ensures you get the best match for your needs, while our tools empower you to grow and thrive.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* For Individuals */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-sky-300 flex flex-col items-center"
          >
            <span className="text-4xl mb-2 block">💬</span>
            <h3 className="font-bold text-xl mb-2 text-sky-500">For Individuals</h3>
            <ul className="text-gray-700 text-base list-disc list-inside text-left">
              <li>Personalized therapist matching based on your unique needs and preferences</li>
              <li>1:1 and group therapy sessions with certified professionals</li>
              <li>24/7 AI-powered support chat for instant help</li>
              <li>Progress tracking and mood journaling</li>
              <li>Access to a library of self-help resources and exercises</li>
            </ul>
          </motion.div>
          {/* For Couples */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-emerald-200 flex flex-col items-center"
          >
            <span className="text-4xl mb-2 block">❤️</span>
            <h3 className="font-bold text-xl mb-2 text-emerald-400">For Couples</h3>
            <ul className="text-gray-700 text-base list-disc list-inside text-left">
              <li>Couples therapy for relationship growth and healing</li>
              <li>Personalized relationship resources and activities</li>
              <li>Confidential, secure sessions for you and your partner</li>
              <li>Progress tracking for couples goals</li>
            </ul>
          </motion.div>
          {/* For Therapists */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-pink-200 flex flex-col items-center"
          >
            <span className="text-4xl mb-2 block">🧑‍⚕️</span>
            <h3 className="font-bold text-xl mb-2 text-pink-400">For Therapists</h3>
            <ul className="text-gray-700 text-base list-disc list-inside text-left">
              <li>Grow your practice and reach new clients</li>
              <li>Advanced analytics and client management tools</li>
              <li>Secure, easy-to-use teletherapy platform</li>
              <li>Access to professional development resources</li>
              <li>Priority support and networking opportunities</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section (moved up) */}
      {visibleSection === 'howItWorks' && (
      <section ref={howItWorksRef} className="w-full max-w-5xl mx-auto py-16 px-4">
        <motion.h2
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold text-blue-700 mb-6 text-center"
        >
          How It Works
        </motion.h2>
        <div className="mb-8 text-lg text-blue-700 text-center max-w-3xl mx-auto">
          <p>Getting started with MindHeavenly is simple and secure. Our platform guides you every step of the way, from sign-up to ongoing support and growth.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1. Sign Up",
              color: "text-blue-600",
              border: "border-l-4 border-blue-200",
              desc: "Create your free account, set your wellness goals, and complete a brief assessment."
            },
            {
              step: "2. AI Match",
              color: "text-blue-500",
              border: "border-l-4 border-blue-300",
              desc: "Our AI matches you with the best therapist or group for your needs."
            },
            {
              step: "3. Connect & Grow",
              color: "text-blue-700",
              border: "border-l-4 border-blue-400",
              desc: "Book sessions, join support groups, and access personalized resources."
            },
            {
              step: "4. Track Progress",
              color: "text-blue-800",
              border: "border-l-4 border-blue-500",
              desc: "Monitor your growth, mood, and milestones with our easy-to-use dashboard."
            }
          ].map((card, i) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className={`bg-white rounded-xl p-6 shadow-md ${card.border}`}
            >
              <h4 className={`font-semibold text-lg mb-2 ${card.color}`}>{card.step}</h4>
              <p className="text-gray-700">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      )}
      {/* Community Section (moved down) */}
      {visibleSection === 'community' && (
      <section ref={therapistsRef} className="w-full max-w-5xl mx-auto py-16 px-4">
        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold text-sky-500 mb-6 text-center"
        >
          Our Caring Community
        </motion.h2>
        <div className="mb-8 text-lg text-sky-700 text-center max-w-3xl mx-auto">
          <p>Join a vibrant, supportive community. MindHeavenly offers group sessions, live events, and a rich resource library to help you connect, learn, and grow together.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Group Sessions",
              color: "text-sky-400",
              border: "border-b-4 border-sky-200",
              desc: "Join group therapy and support circles to connect, share, and grow together."
            },
            {
              title: "Workshops & Events",
              color: "text-emerald-400",
              border: "border-b-4 border-emerald-200",
              desc: "Participate in live workshops, webinars, and wellness events led by experts."
            },
            {
              title: "Resource Library",
              color: "text-pink-400",
              border: "border-b-4 border-pink-200",
              desc: "Access meditations, articles, and exercises to support your mental health journey."
            }
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className={`bg-white rounded-xl p-6 shadow-md ${card.border}`}
            >
              <h4 className={`font-semibold text-lg mb-2 ${card.color}`}>{card.title}</h4>
              <p className="text-gray-700">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="w-full max-w-5xl mx-auto py-16 px-4">
        <motion.h2
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold text-blue-700 mb-6 text-center"
        >
          How It Works
        </motion.h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1. Sign Up",
              color: "text-blue-600",
              border: "border-l-4 border-blue-200",
              desc: "Create your free account in seconds and set your wellness goals."
            },
            {
              step: "2. Match & Book",
              color: "text-blue-500",
              border: "border-l-4 border-blue-300",
              desc: "Get matched with a therapist or explore our directory. Book sessions at your convenience."
            },
            {
              step: "3. Start Your Journey",
              color: "text-blue-700",
              border: "border-l-4 border-blue-400",
              desc: "Attend secure video sessions, chat with our AI, and access personalized resources."
            },
            {
              step: "4. Track & Grow",
              color: "text-blue-800",
              border: "border-l-4 border-blue-500",
              desc: "Monitor your progress, mood, and milestones with our easy-to-use dashboard."
            }
          ].map((card, i) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className={`bg-white rounded-xl p-6 shadow-md ${card.border}`}
            >
              <h4 className={`font-semibold text-lg mb-2 ${card.color}`}>{card.step}</h4>
              <p className="text-gray-700">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Us Section */}
      {visibleSection === 'whyUs' && (
      <section ref={couplesRef} className="w-full max-w-5xl mx-auto py-16 px-4">
        <motion.h2
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold text-sky-500 mb-6 text-center"
        >
          Why Choose Us?
        </motion.h2>
        <div className="mb-8 text-lg text-sky-700 text-center max-w-3xl mx-auto">
          <p>Why do thousands trust MindHeavenly? We combine expert care, advanced technology, and a personal touch to deliver the best mental wellness experience in South Africa.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Expert Therapists",
              color: "text-sky-500",
              border: "border-b-4 border-sky-300",
              desc: "All our therapists are certified, experienced, and passionate about your mental health."
            },
            {
              title: "Confidential & Secure",
              color: "text-emerald-400",
              border: "border-b-4 border-emerald-200",
              desc: "Your privacy is our top priority. All sessions and data are encrypted and confidential."
            },
            {
              title: "Personalized Experience",
              color: "text-pink-400",
              border: "border-b-4 border-pink-200",
              desc: "Tailored recommendations, resources, and support for your unique journey."
            }
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className={`bg-white rounded-xl p-6 shadow-md ${card.border}`}
            >
              <h4 className={`font-semibold text-lg mb-2 ${card.color}`}>{card.title}</h4>
              <p className="text-gray-700">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* Testimonials Section */}
      {visibleSection === 'testimonials' && (
      <section ref={clientsRef} className="w-full max-w-5xl mx-auto py-16 px-4">
        <motion.h2
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-bold text-sky-500 mb-8 text-center"
        >
          Testimonials
        </motion.h2>
        <div className="mb-8 text-lg text-sky-700 text-center max-w-3xl mx-auto">
          <p>See how MindHeavenly has transformed the lives of individuals, couples, and therapists across South Africa.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              quote: "“MindHeavenly helped me find the right therapist and the AI chat is a lifesaver on tough days.”",
              name: "— Lerato, Johannesburg",
              color: "text-sky-500",
              border: "border-l-4 border-sky-200"
            },
            {
              quote: "“The progress tracking keeps me motivated. I love the beautiful, easy-to-use interface!”",
              name: "— Sipho, Cape Town",
              color: "text-emerald-400",
              border: "border-l-4 border-emerald-200"
            },
            {
              quote: "“As a therapist, MindHeavenly has helped me grow my practice and connect with amazing clients.”",
              name: "— Dr. Mpho, Pretoria",
              color: "text-pink-400",
              border: "border-l-4 border-pink-200"
            },
            {
              quote: "“The couples therapy resources brought us closer together. Highly recommended!”",
              name: "— The Ndlovus, Durban",
              color: "text-emerald-400",
              border: "border-l-4 border-emerald-200"
            }
          ].map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className={`bg-white rounded-xl p-6 shadow-md ${card.border}`}
            >
              <p className="text-gray-700 italic mb-4">{card.quote}</p>
              <div className={`font-bold ${card.color}`}>{card.name}</div>
            </motion.div>
          ))}
        </div>
      </section>
      )}

      {/* Pricing Section */}
      {visibleSection === 'pricing' && (
      <section ref={pricingRef} className="w-full max-w-5xl mx-auto py-16 px-4 animate-fade-in delay-600">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-500 mb-8 text-center">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-md border-t-4 border-sky-200 flex flex-col items-center">
            <h3 className="font-bold text-xl mb-2 text-sky-500">For Individuals</h3>
            <div className="text-3xl font-extrabold text-sky-500 mb-2">Free</div>
            <ul className="text-gray-700 text-base list-disc list-inside mb-4 text-left">
              <li>AI-powered therapist matching</li>
              <li>Basic support chat</li>
              <li>Progress tracking</li>
              <li>Access to group sessions</li>
            </ul>
            <button className="px-6 py-2 rounded-full bg-sky-400 text-white font-bold shadow hover:bg-sky-500 transition" onClick={() => router.push('/auth/signup')}>Get Started</button>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-md border-t-4 border-emerald-200 flex flex-col items-center">
            <h3 className="font-bold text-xl mb-2 text-emerald-400">For Couples</h3>
            <div className="text-3xl font-extrabold text-emerald-400 mb-2">R299/mo</div>
            <ul className="text-gray-700 text-base list-disc list-inside mb-4 text-left">
              <li>All individual features</li>
              <li>Couples therapy sessions</li>
              <li>Relationship resources</li>
              <li>Confidential support</li>
            </ul>
            <button className="px-6 py-2 rounded-full bg-emerald-400 text-white font-bold shadow hover:bg-emerald-500 transition" onClick={() => router.push('/auth/signup')}>Start Couples Plan</button>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-md border-t-4 border-pink-200 flex flex-col items-center">
            <h3 className="font-bold text-xl mb-2 text-pink-400">For Therapists</h3>
            <div className="text-3xl font-extrabold text-pink-400 mb-2">R499/mo</div>
            <ul className="text-gray-700 text-base list-disc list-inside mb-4 text-left">
              <li>Grow your practice</li>
              <li>Client management tools</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
            </ul>
            <button className="px-6 py-2 rounded-full bg-pink-400 text-white font-bold shadow hover:bg-pink-500 transition" onClick={() => router.push('/auth/signup')}>Join as Therapist</button>
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      {visibleSection === 'faq' && (
      <section ref={faqRef} className="w-full max-w-5xl mx-auto py-16 px-4 animate-fade-in delay-550">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-500 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="mb-8 text-lg text-sky-700 text-center max-w-3xl mx-auto">
          <p>Find answers to the most common questions about MindHeavenly, our services, and how to get the most out of your experience.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-sky-200">
            <h4 className="font-semibold text-lg mb-2 text-sky-500">Is MindHeavenly for me?</h4>
            <p className="text-gray-700">MindHeavenly is for anyone seeking support, growth, or guidance—whether you’re new to therapy or looking for a modern, digital experience. We welcome individuals, couples, and therapists.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-200">
            <h4 className="font-semibold text-lg mb-2 text-emerald-400">How do I know my data is safe?</h4>
            <p className="text-gray-700">We use industry-leading encryption, secure servers, and never share your data. Your privacy and trust are our top priorities.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-pink-200">
            <h4 className="font-semibold text-lg mb-2 text-pink-400">Can I use MindHeavenly on mobile?</h4>
            <p className="text-gray-700">Absolutely! MindHeavenly is fully responsive and works beautifully on any device, including smartphones and tablets.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-sky-300">
            <h4 className="font-semibold text-lg mb-2 text-sky-700">What if I need urgent help?</h4>
            <p className="text-gray-700">If you’re in crisis, we provide quick links to South African helplines and emergency resources right in the app. Our AI can also guide you to immediate support.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-300">
            <h4 className="font-semibold text-lg mb-2 text-emerald-500">How does the AI matching work?</h4>
            <p className="text-gray-700">Our AI analyzes your profile, preferences, and goals to match you with the best therapist or group. It considers experience, specialties, and your unique needs for optimal results.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-pink-300">
            <h4 className="font-semibold text-lg mb-2 text-pink-500">Can therapists join MindHeavenly?</h4>
            <p className="text-gray-700">Yes! Therapists can join to grow their practice, access new clients, and use our advanced tools for client management and analytics.</p>
          </div>
        </div>
      </section>
      )}

      {/* Call to Action Section */}
      {/* Call to Action Section */}
      <section className="w-full max-w-3xl mx-auto py-16 px-4 text-center animate-fade-in delay-600">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-500 mb-6">Ready to start your journey?</h2>
        <p className="text-lg text-sky-700/90 mb-8">Join thousands of South Africans who trust MindHeavenly for their mental wellness.</p>
        <button
          className="px-12 py-4 rounded-full bg-sky-400 text-white font-bold text-xl shadow-xl hover:bg-sky-500 hover:text-white transition"
          onClick={() => router.push("/auth/signup")}
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-sky-700/70 text-xs animate-fade-in delay-700">
        &copy; {new Date().getFullYear()} MindHeavenly. All rights reserved.
      </footer>

      {/* Floating AI Chat Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-sky-300"
        onClick={() => setChatOpen(true)}
        aria-label="Chat with AI Assistant"
      >
        <span role="img" aria-label="chat">💬</span> Chat with me
      </button>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-8 z-50 w-80 max-w-full bg-white rounded-2xl shadow-2xl border border-sky-100 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-sky-100 bg-sky-50 rounded-t-2xl">
              <span className="font-bold text-sky-500">AI Assistant</span>
              <button onClick={() => setChatOpen(false)} className="text-sky-400 hover:text-sky-600 text-xl font-bold">×</button>
            </div>
            <div className="flex-1 px-4 py-3 text-gray-700 text-sm overflow-y-auto" style={{ minHeight: 120 }}>
              <div className="mb-2">Hi! 👋 How can I help you today?</div>
              <div className="text-xs text-gray-400">(AI chat coming soon...)</div>
            </div>
            <div className="px-4 py-3 border-t border-sky-100 bg-sky-50 rounded-b-2xl">
              <input
                type="text"
                className="w-full rounded-lg border border-sky-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Type your message... (coming soon)"
                disabled
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </>
  );
}
