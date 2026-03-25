import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { avatarStyles, buildAvatarUrl, personalityOptions, randomSeed } from "../utils/avatar";

const steps = ["Basics", "Intentions", "Lifestyle"];

const genderOptions = [
  "Prefer not to say",
  "Woman",
  "Man",
  "Non-binary",
  "Genderqueer",
  "Agender",
  "Other"
];

const defaultProfile = {
  age: "",
  gender: "Prefer not to say",
  location: "",
  pressureLevel: "Medium",
  marriageIntention: "Do not want marriage",
  kidsPreference: "No",
  relocationWillingness: "No",
  livingPreference: "Separate rooms",
  personalityTag: "Calm thinker",
  avatarStyle: "lorelei-neutral",
  avatarSeed: randomSeed(),
  bio: ""
};

const stepDescriptions = {
  0: "Tell us basic context so we can find compatible plans.",
  1: "Answer these based on what you want right now, not what others expect.",
  2: "Set practical preferences and choose a personality avatar instead of photos."
};

const Field = ({ label, hint, children }) => (
  <label className="block space-y-1">
    <span className="text-sm font-semibold text-slate-200">{label}</span>
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
    {children}
  </label>
);

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(defaultProfile);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/profile/me");
        if (data) {
          setProfile({
            ...defaultProfile,
            ...data,
            age: data.age || "",
            gender: data.gender || "Prefer not to say",
            avatarStyle: data.avatarStyle || "lorelei-neutral",
            avatarSeed: data.avatarSeed || randomSeed(),
            personalityTag: data.personalityTag || "Calm thinker"
          });
        }
      } catch {
        // first-time flow
      }
    };

    load();
  }, []);

  const canContinue = useMemo(() => {
    if (step === 0) return profile.age && profile.location;
    if (step === 1) return profile.pressureLevel && profile.marriageIntention && profile.kidsPreference;
    return profile.relocationWillingness && profile.livingPreference && profile.personalityTag && profile.avatarStyle;
  }, [profile, step]);

  const save = async () => {
    setError("");
    try {
      await api.put("/profile/me", { ...profile, age: Number(profile.age) });
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Could not save profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto card p-6">
      <p className="text-xs text-slate-400">Step {step + 1} / {steps.length}: {steps[step]}</p>
      <h1 className="text-2xl font-bold mt-2">Life Strategy Profile</h1>
      <p className="text-sm text-slate-400 mt-2">{stepDescriptions[step]}</p>

      <div className="mt-6 space-y-4">
        {step === 0 && (
          <>
            <Field label="What is your age?">
              <input className="input" placeholder="Enter age" type="number" min="18" max="100" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} />
            </Field>

            <Field label="Gender (optional)">
              <select className="input" value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}>
                {genderOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>

            <Field label="Where are you based?" hint="City / Country">
              <input className="input" placeholder="Example: Pune, India" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="How much family pressure do you currently feel?">
              <select className="input" value={profile.pressureLevel} onChange={(e) => setProfile({ ...profile, pressureLevel: e.target.value })}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </Field>

            <Field label="What is your marriage intention right now?">
              <select className="input" value={profile.marriageIntention} onChange={(e) => setProfile({ ...profile, marriageIntention: e.target.value })}>
                <option>Do not want marriage</option>
                <option>Open only for social reasons</option>
              </select>
            </Field>

            <Field label="What is your preference about having kids?">
              <select className="input" value={profile.kidsPreference} onChange={(e) => setProfile({ ...profile, kidsPreference: e.target.value })}>
                <option>No</option>
                <option>Maybe later</option>
              </select>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Are you open to relocation?">
              <select className="input" value={profile.relocationWillingness} onChange={(e) => setProfile({ ...profile, relocationWillingness: e.target.value })}>
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>

            <Field label="What living setup feels acceptable?">
              <select className="input" value={profile.livingPreference} onChange={(e) => setProfile({ ...profile, livingPreference: e.target.value })}>
                <option>Same house</option>
                <option>Separate rooms</option>
                <option>Different cities</option>
              </select>
            </Field>

            <Field label="Choose the personality vibe that represents you">
              <select className="input" value={profile.personalityTag} onChange={(e) => setProfile({ ...profile, personalityTag: e.target.value })}>
                {personalityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>

            <Field label="Pick your avatar style" hint="Profiles use avatars instead of photos to reduce misuse.">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {avatarStyles.map((style) => {
                  const active = profile.avatarStyle === style;
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setProfile({ ...profile, avatarStyle: style })}
                      className={`rounded-xl border p-2 text-xs capitalize ${active ? "border-glow bg-slate-800" : "border-slate-700 bg-slate-900"}`}
                    >
                      <img src={buildAvatarUrl(style, profile.avatarSeed)} alt={style} className="h-14 w-14 mx-auto rounded-lg" />
                      <p className="mt-2 text-slate-300">{style.replace("-", " ")}</p>
                    </button>
                  );
                })}
              </div>
              <button type="button" className="btn-muted mt-2" onClick={() => setProfile({ ...profile, avatarSeed: randomSeed() })}>
                Generate New Avatar
              </button>
            </Field>

            <Field label="Short bio" hint="Write what alignment means for you in 1-2 lines.">
              <textarea className="input min-h-24" placeholder="I want a respectful setup with independence and clear boundaries..." value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            </Field>
          </>
        )}
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      <div className="flex justify-between mt-6">
        <button className="btn-muted" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</button>
        {step < steps.length - 1 ? (
          <button className="btn-primary" onClick={() => setStep(step + 1)} disabled={!canContinue}>Next</button>
        ) : (
          <button className="btn-primary" onClick={save} disabled={!canContinue}>Save Profile</button>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
