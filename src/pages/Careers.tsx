import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ArrowRight, ArrowLeft, PartyPopper, Sparkles, GraduationCap, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { submitCreatorApplication } from "@/lib/applications";
import {
  creativeInterests,
  experienceLevels,
  equipmentOptions,
  createdBeforeOptions,
  collaborationTypes,
  applicationSteps,
  applicationHighlights,
} from "@/data/careerApplication";

// ============================================================
// Validation mirrors the form's required/optional markings:
//   Required — 1,2,3,4,5,6,7,10,11,12,13,14 and the consent box
//   Optional — 9 (work samples)
// ============================================================

const formSchema = z.object({
  // Section 1 — personal information
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(7, "Please enter a valid phone / WhatsApp number"),
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(2, "Please tell us where you're based"),
  // Section 2 — creative interests
  interests: z.array(z.string()).min(1, "Please select at least one area"),
  experience: z.string().min(1, "Please select your experience level"),
  equipment: z.array(z.string()).min(1, "Please select at least one option"),
  // Section 3 — creativity
  createdBefore: z.string().min(1, "Please choose an option"),
  workSamples: z.string().optional(),
  videoIdea: z.string().min(20, "Please describe your idea (at least 20 characters)"),
  audienceInterest: z.string().min(20, "Please share your thoughts (at least 20 characters)"),
  // Section 4 — collaboration
  collaboration: z.array(z.string()).min(1, "Please select at least one option"),
  aboutYou: z.string().min(20, "Please tell us about yourself (at least 20 characters)"),
  motivation: z.string().min(20, "Please tell us a bit more (at least 20 characters)"),
  // Section 5 — confirmation
  confirmed: z.boolean().refine((v) => v === true, "Please confirm before submitting"),
});

type FormValues = z.infer<typeof formSchema>;

// --- Reusable field components ---------------------------------

/** Card-style multi-select (Q5, Q7, Q12). Tap anywhere to toggle. */
function CheckCardGroup({
  options,
  value = [],
  onChange,
  columns = 2,
}: {
  options: string[];
  value?: string[];
  onChange: (next: string[]) => void;
  columns?: 1 | 2;
}) {
  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((o) => o !== option) : [...value, option]);

  return (
    <div className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2")}>
      {options.map((option) => {
        const active = value.includes(option);
        return (
          <button
            type="button"
            key={option}
            onClick={() => toggle(option)}
            aria-pressed={active}
            className={cn(
              "flex items-start gap-3 text-left rounded-xl border p-4 transition-colors",
              active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
            )}
          >
            <span
              className={cn(
                "mt-0.5 grid h-4 w-4 shrink-0 place-content-center rounded-sm border transition-colors",
                active ? "border-primary bg-primary text-primary-foreground" : "border-border"
              )}
            >
              {active && <Check size={12} />}
            </span>
            <span className={cn("text-sm", active ? "text-foreground" : "text-foreground/80")}>
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Single-select presented as full-width rows (Q6, Q8, Q13). */
function SelectCardGroup({
  options,
  value = "",
  onChange,
}: {
  options: string[];
  value?: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={cn(
              "flex items-center gap-3 text-left rounded-xl border px-4 py-3.5 transition-colors",
              active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
            )}
          >
            <span
              className={cn(
                "grid h-4 w-4 shrink-0 place-content-center rounded-full border transition-colors",
                active ? "border-primary" : "border-border"
              )}
            >
              {active && <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            <span className={cn("text-sm", active ? "text-foreground" : "text-foreground/80")}>
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const highlightIcons = [Sparkles, Users, GraduationCap];

const Careers = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      location: "",
      interests: [],
      experience: "",
      equipment: [],
      createdBefore: "",
      workSamples: "",
      videoIdea: "",
      audienceInterest: "",
      collaboration: [],
      aboutYou: "",
      motivation: "",
      confirmed: false,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = form;

  const values = watch();

  // Per-step validation — only the current step's fields are checked
  const stepFields: Record<number, (keyof FormValues)[]> = {
    0: ["fullName", "phone", "email", "location"],
    1: ["interests", "experience", "equipment"],
    2: ["createdBefore", "videoIdea", "audienceInterest"],
    3: ["collaboration", "aboutYou", "motivation"],
    4: ["confirmed"],
  };

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, applicationSteps.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FormValues) => {
    void submitCreatorApplication({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      location: data.location,
      interests: data.interests,
      experience: data.experience,
      equipment: data.equipment,
      createdBefore: data.createdBefore,
      workSamples: data.workSamples || undefined,
      videoIdea: data.videoIdea,
      audienceInterest: data.audienceInterest,
      collaboration: data.collaboration,
      aboutYou: data.aboutYou,
      motivation: data.motivation,
      confirmed: data.confirmed,
    });
    setSubmitted(true);
    reset();
  };

  // --- Success screen -----------------------------------------
  if (submitted) {
    return (
      <div className="container py-28 max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <PartyPopper className="text-primary" size={28} />
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl mb-4">Your application is in.</h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Thank you for taking the time to apply to O Studio Innovations. We've received your
          application and will be in touch at the email or phone number you provided if your work
          looks like a fit for what we're building.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Every application is read. If it isn't a match right now, we may still reach out later.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full px-8">
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    );
  }

  const stepMeta = [
    { title: "Tell us about yourself", purpose: "So we know who is applying and how to reach you." },
    { title: "What you're interested in", purpose: "To understand your strengths and creative interests." },
    { title: "Show us your creativity", purpose: "The most important part. Tell us how you think about content." },
    { title: "Working together", purpose: "So we understand how you'd like to collaborate with us." },
    { title: "Review your application", purpose: "Check everything over before you send it." },
  ][step];

  return (
    <div>
      {/* HERO */}
      <section className="bg-hero-gradient py-28">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">Join O Studio</p>
          <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight max-w-3xl mx-auto">
            Content Creator Application
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            O Studio Innovations is looking to connect with creative individuals interested in video
            creation, video editing, and storytelling.
          </p>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            If you have ideas, creativity, or a passion for bringing stories to life, we'd love to
            hear from you.
          </p>
        </div>
      </section>

      {/* REASSURANCE STRIP */}
      <section className="border-b border-border">
        <div className="container py-16">
          <div className="grid sm:grid-cols-3 gap-5">
            {applicationHighlights.map((item, i) => {
              const Icon = highlightIcons[i];
              return (
                <div
                  key={item.title}
                  className="bg-card border border-border rounded-2xl p-6 shadow-card"
                >
                  <Icon className="text-primary mb-3" size={22} strokeWidth={1.5} />
                  <p className="font-serif-display text-lg mb-2">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-20">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">
              Application Form
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl">{stepMeta.title}</h2>
            <p className="mt-4 text-muted-foreground">{stepMeta.purpose}</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-12">
            {applicationSteps.map((label, i) => (
              <div key={label} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold border",
                      i < step
                        ? "bg-primary text-primary-foreground border-primary"
                        : i === step
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground"
                    )}
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="text-[11px] mt-2 text-muted-foreground hidden sm:block text-center px-1">
                    {label}
                  </span>
                </div>
                {i < applicationSteps.length - 1 && (
                  <div className={cn("h-px flex-1 -mt-5", i < step ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-card"
          >
            {/* STEP 0 — ABOUT YOU */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" placeholder="Your name" {...register("fullName")} />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp number</Label>
                    <Input id="phone" placeholder="+234..." {...register("phone")} />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Where are you currently based?</Label>
                  <Input id="location" placeholder="e.g. Gbagada Phase 1, Lagos" {...register("location")} />
                  {errors.location && (
                    <p className="text-xs text-destructive">{errors.location.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 1 — CREATIVE INTERESTS */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label>Which area of content creation are you most interested in?</Label>
                  <Controller
                    name="interests"
                    control={form.control}
                    render={({ field }) => (
                      <CheckCardGroup
                        options={creativeInterests}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.interests && (
                    <p className="text-xs text-destructive">{errors.interests.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>How would you describe your current experience?</Label>
                  <Controller
                    name="experience"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={experienceLevels}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.experience && (
                    <p className="text-xs text-destructive">{errors.experience.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>What tools or equipment can you currently use?</Label>
                  <Controller
                    name="equipment"
                    control={form.control}
                    render={({ field }) => (
                      <CheckCardGroup
                        options={equipmentOptions}
                        value={field.value}
                        onChange={field.onChange}
                        columns={1}
                      />
                    )}
                  />
                  {errors.equipment && (
                    <p className="text-xs text-destructive">{errors.equipment.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2 — SHOW YOUR CREATIVITY */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label>Have you created, recorded, or edited any content before?</Label>
                  <Controller
                    name="createdBefore"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={createdBeforeOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.createdBefore && (
                    <p className="text-xs text-destructive">{errors.createdBefore.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workSamples">If you have samples of your work, share a link</Label>
                  <Input
                    id="workSamples"
                    placeholder="TikTok, Instagram Reel, YouTube, Google Drive…"
                    {...register("workSamples")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional — but if you have made something, we'd like to see it.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoIdea">
                    If you could create a video for O Studio Innovations, what would your idea be?
                  </Label>
                  <Textarea
                    id="videoIdea"
                    rows={5}
                    placeholder="Tell us briefly what the video would be about and how you would make it interesting to watch."
                    {...register("videoIdea")}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      This is one of the most important parts of your application.
                    </p>
                    <CharCount value={values.videoIdea} min={20} />
                  </div>
                  {errors.videoIdea && (
                    <p className="text-xs text-destructive">{errors.videoIdea.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audienceInterest">
                    What do you think makes a video or story interesting to an audience?
                  </Label>
                  <Textarea
                    id="audienceInterest"
                    rows={5}
                    placeholder="This is your chance to show how you think about content, even if you haven't made videos before."
                    {...register("audienceInterest")}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      There is no wrong answer — we want your perspective.
                    </p>
                    <CharCount value={values.audienceInterest} min={20} />
                  </div>
                  {errors.audienceInterest && (
                    <p className="text-xs text-destructive">{errors.audienceInterest.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3 — COLLABORATION */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label>What kind of collaboration are you interested in?</Label>
                  <Controller
                    name="collaboration"
                    control={form.control}
                    render={({ field }) => (
                      <CheckCardGroup
                        options={collaborationTypes}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.collaboration && (
                    <p className="text-xs text-destructive">{errors.collaboration.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aboutYou">
                    Tell us something about yourself that you think we should know.
                  </Label>
                  <Textarea
                    id="aboutYou"
                    rows={5}
                    placeholder="Share your personality, interests, background, ambitions, or anything you feel is important for us to know."
                    {...register("aboutYou")}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Tell us anything you think we should know about you.
                    </p>
                    <CharCount value={values.aboutYou} min={20} />
                  </div>
                  {errors.aboutYou && (
                    <p className="text-xs text-destructive">{errors.aboutYou.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">
                    Why would you like to collaborate with O Studio Innovations?
                  </Label>
                  <Textarea
                    id="motivation"
                    rows={5}
                    placeholder="Tell us what interests you about creating content with us and what you hope to contribute."
                    {...register("motivation")}
                  />
                  <div className="flex items-center justify-end">
                    <CharCount value={values.motivation} min={20} />
                  </div>
                  {errors.motivation && (
                    <p className="text-xs text-destructive">{errors.motivation.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4 — REVIEW & CONFIRM */}
            {step === 4 && (
              <div className="space-y-6">
                <dl className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {[
                    ["Full name", values.fullName],
                    ["Phone / WhatsApp", values.phone],
                    ["Email", values.email],
                    ["Based in", values.location],
                    ["Interested in", values.interests.join(", ")],
                    ["Experience", values.experience],
                    ["Tools / equipment", values.equipment.join(", ")],
                    ["Created content before", values.createdBefore],
                    values.workSamples ? ["Work samples", values.workSamples] : null,
                    ["Video idea", values.videoIdea],
                    ["What makes content interesting", values.audienceInterest],
                    ["Collaboration", values.collaboration.join(", ")],
                    ["About you", values.aboutYou],
                    ["Why O Studio", values.motivation],
                  ]
                    .filter((row): row is [string, string] => Boolean(row))
                    .map(([label, val]) => (
                      <div
                        key={label}
                        className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-4 text-sm"
                      >
                        <dt className="sm:w-48 shrink-0 text-muted-foreground">{label}</dt>
                        <dd className="text-foreground whitespace-pre-line">{val}</dd>
                      </div>
                    ))}
                </dl>

                <div className="rounded-xl border border-border bg-background/40 p-5">
                  <Controller
                    name="confirmed"
                    control={form.control}
                    render={({ field }) => (
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-primary accent-[hsl(var(--primary))]"
                        />
                        <span className="text-sm text-foreground/85 leading-relaxed">
                          I confirm that the information I've provided is accurate and that any work
                          samples I share are mine or that I have permission to share them.
                        </span>
                      </label>
                    )}
                  />
                  {errors.confirmed && (
                    <p className="text-xs text-destructive mt-2">{errors.confirmed.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div className="flex items-center justify-between mt-10">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={goBack} className="rounded-full">
                  <ArrowLeft className="mr-2" size={15} /> Back
                </Button>
              ) : (
                <span />
              )}

              {step < applicationSteps.length - 1 ? (
                <Button type="button" onClick={goNext} className="rounded-full px-6">
                  Continue <ArrowRight className="ml-2" size={15} />
                </Button>
              ) : (
                <Button type="submit" className="rounded-full px-8">
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

/** Live character counter for the long-answer questions. */
function CharCount({ value, min }: { value: string; min: number }) {
  const length = (value ?? "").trim().length;
  const short = length < min;
  return (
    <p className={cn("text-xs shrink-0", short ? "text-muted-foreground" : "text-primary")}>
      {length} characters
    </p>
  );
}

export default Careers;