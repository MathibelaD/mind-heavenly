"use client";
import Link from "next/link";
import { useState } from "react";

type FormState = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  date_of_birth?: string;
  timezone?: string;
  bio?: string;
  emergency_contact?: string;
  medical_history?: string;
  therapy_goals?: string;
};

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';

export default function SignUpPage() {
  // Onboarding steps for all user/profile schema fields
  const steps = [
    {
      label: "Full Name",
      name: "name",
      type: "text",
      placeholder: "Enter your full name",
      required: true
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      required: true
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Create a password",
      required: true
    },
    {
      label: "Phone Number",
      name: "phone",
      type: "tel",
      placeholder: "Enter your phone number",
      required: true
    },
    {
      label: "Date of Birth",
      name: "date_of_birth",
      type: "date",
      placeholder: "Select your birth date",
      required: true
    },
    {
      label: "Timezone",
      name: "timezone",
      type: "text",
      placeholder: "e.g. Africa/Johannesburg",
      required: false
    },
    {
      label: "Bio",
      name: "bio",
      type: "textarea",
      placeholder: "Tell us about yourself",
      required: false
    },
    {
      label: "Emergency Contact",
      name: "emergency_contact",
      type: "text",
      placeholder: "Who should we contact in an emergency?",
      required: false
    },
    {
      label: "Medical History",
      name: "medical_history",
      type: "textarea",
      placeholder: "Any relevant medical history?",
      required: false
    },
    {
      label: "Therapy Goals",
      name: "therapy_goals",
      type: "textarea",
      placeholder: "What are your goals for therapy?",
      required: false
    }
  ];

  const [form, setForm] = useState<FormState>({});
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validate required field
    const current = steps[step];
    if (current.required && !(form as any)[current.name]) {
      setError(`Please enter your ${current.label.toLowerCase()}`);
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign up failed");
      setSuccess("Account created! Please check your email to verify.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Sign up failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-wellness-50 to-mindful-50 flex items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl mx-auto"
        >
          <Card className="backdrop-blur-sm bg-white/90">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Create Your Account</CardTitle>
              <CardDescription>
                Sign up to start your therapy journey with Mind Heavenly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={step < steps.length - 1 ? handleNext : handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor={steps[step].name} className="font-semibold text-gray-700 block mb-2">{steps[step].label}</label>
                  {steps[step].type === "textarea" ? (
                    <textarea
                      name={steps[step].name}
                      id={steps[step].name}
                      placeholder={steps[step].placeholder}
                      className="w-full px-4 py-3 border-2 border-therapy-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-therapy-300"
                      value={(form as any)[steps[step].name] || ""}
                      onChange={handleChange}
                      rows={3}
                    />
                  ) : (
                    <input
                      type={steps[step].type}
                      name={steps[step].name}
                      id={steps[step].name}
                      placeholder={steps[step].placeholder}
                      className="w-full px-4 py-3 border-2 border-therapy-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-therapy-300"
                      value={(form as any)[steps[step].name] || ""}
                      onChange={handleChange}
                      required={steps[step].required}
                    />
                  )}
                </div>
                {error && <div className="text-red-500 text-sm text-center mb-2">{error}</div>}
                <div className="flex justify-between">
                  {step > 0 && (
                    <button type="button" onClick={handlePrev} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition">Back</button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg font-semibold text-lg shadow-xl transition bg-gradient-to-r from-therapy-400 via-wellness-400 to-mindful-400 text-white hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : step < steps.length - 1 ? "Next" : "Sign Up"}
                  </button>
                </div>
              </form>
              {success && <div className="text-green-600 mt-4 text-sm text-center">{success}</div>}
              <div className="mt-6 text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <a href="/auth/signin" className="text-primary underline">Sign in</a>
              </div>
              <div className="mt-8 text-center text-xs text-gray-400">
                <span>After signing up, you'll receive a verification email. Please check your Gmail inbox.</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

