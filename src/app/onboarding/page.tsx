"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  {
    label: "Welcome to MindHeavenly!",
    description: "Let's set up your profile so you get the best experience.",
    fields: []
  },
  {
    label: "About You",
    description: "Tell us a bit about yourself.",
    fields: [
      { name: "bio", label: "Bio", type: "textarea", placeholder: "Tell us about yourself...", required: false },
      { name: "therapy_goals", label: "Therapy Goals", type: "textarea", placeholder: "What are your goals for therapy?", required: false }
    ]
  },
  {
    label: "Emergency Info",
    description: "Who should we contact in case of emergency?",
    fields: [
      { name: "emergency_contact", label: "Emergency Contact", type: "text", placeholder: "Name & phone number", required: false },
      { name: "medical_history", label: "Medical History", type: "textarea", placeholder: "Any relevant medical history?", required: false }
    ]
  },
  {
    label: "All Done!",
    description: "Your profile is set up. You can now start using MindHeavenly!",
    fields: []
  }
];

export default function OnboardingPage() {
  const [form, setForm] = useState<any>({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      // Simulate profile update API call
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
      }, 1200);
    }
  };

  const handlePrev = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep(step - 1);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-2 bg-gradient-to-br from-[rgb(0,180,255)] via-[rgb(255,0,180)] to-[rgb(0,255,180)]">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-2 text-center text-[rgb(0,180,255)]">{steps[step].label}</h2>
        <p className="text-gray-600 text-center mb-6">{steps[step].description}</p>
        {steps[step].fields.length > 0 && (
          <form onSubmit={handleNext} className="space-y-4">
            {steps[step].fields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block font-semibold mb-2 text-gray-700" htmlFor={field.name}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    id={field.name}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border-2 border-[rgb(0,180,255)] rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[rgb(0,180,255)]"
                    value={form[field.name] || ""}
                    onChange={handleChange}
                    rows={3}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border-2 border-[rgb(0,180,255)] rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[rgb(0,180,255)]"
                    value={form[field.name] || ""}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
            {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
            <div className="flex justify-between">
              {step > 0 && (
                <button type="button" onClick={handlePrev} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">Back</button>
              )}
              <button
                type="submit"
                className="px-6 py-2 rounded-lg font-semibold text-lg shadow-xl transition bg-gradient-to-r from-[rgb(0,180,255)] via-[rgb(255,0,180)] to-[rgb(0,255,180)] text-white hover:scale-105"
                disabled={loading}
              >
                {loading ? "Finishing..." : "Next"}
              </button>
            </div>
          </form>
        )}
        {steps[step].fields.length === 0 && (
          <div className="flex flex-col items-center gap-4 mt-8">
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-lg font-semibold text-lg shadow-xl transition bg-gradient-to-r from-[rgb(0,180,255)] via-[rgb(255,0,180)] to-[rgb(0,255,180)] text-white hover:scale-105"
              disabled={loading}
            >
              {loading ? "Finishing..." : step === steps.length - 1 ? "Go to Dashboard" : "Next"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
