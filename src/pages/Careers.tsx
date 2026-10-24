import { useState, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ArrowRight, ArrowLeft, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { submitCreatorApplication } from "@/lib/applications";
import { buildApplicationWhatsAppLink } from "@/lib/whatsapp";
import {
  formDescription,
  creativeInterests,
  experienceLevels,
  equipmentOptions,
  createdBeforeOptions,
  collaborationTypes,
  localAvailabilityOptions,
  scheduleOptions,
  practicalTaskOptions,
  applicationSections,
} from "@/data/careerApplication";

// ============================================================
// Validation mirrors the official form's required/optional markings:
//   Required — all questions except 9 and 20
//   Optional — Q9 (work samples), Q20 (anything else)
// ============================================================

const formSchema = z.object({
  // Section 1 — personal information (Q1–Q4)
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(7, "Please enter a valid phone / WhatsApp number"),
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(2, "Please tell us where you're based"),
  // Section 2 — creative interests (Q5–Q7)
  interests: z.array(z.string()).min(1, "Please select at least one area"),
  experience: z.string().min(1, "Please select your experience level"),
  equipment: z.array(z.string()).min(1, "Please select at least one option"),
  // Section 3 — creative portfolio (Q8–Q12)
  createdBefore: z.string().min(1, "Please choose an option"),
  workSamples: z.string().optional(),
  videoIdea: z.string().min(20, "Please describe your idea (at least 20 characters)"),
  audienceInterest: z.string().min(20, "Please share your thoughts (at least 20 characters)"),
  resourcefulness: z.string().min(20, "Please tell us how you'd approach it (at least 20 characters)"),
  // Section 4 — collaboration and availability (Q13–Q16)
  collaboration: z.string().min(1, "Please select an option"),
  localAvailability: z.string().min(1, "Please choose an option"),
  schedule: z.string().min(1, "Please choose an option"),
  motivation: z.string().min(20, "Please tell us a bit more (at least 20 characters)"),
  // Section 5 — creative challenge (Q17–Q18)
  creativeChallenge: z.string().min(20, "Please describe your idea (at least 20 characters)"),
  practicalTask: z.string().min(1, "Please choose an option"),
  // Section 6 — final confirmation (Q19–Q20)
  confirmedAccuracy: z.boolean().refine((v) => v === true, "Please confirm before submitting"),
  confirmedOwnership: z.boolean().refine((v) => v === true, "Please confirm before submitting"),
  finalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// --- Reusable field components ---------------------------------

/** Card-style multi-select (Q5, Q7). Tap anywhere to toggle. */
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

/** Single-select presented as full-width rows (Q6, Q8, Q13, Q14, Q15, Q18). */
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

/** Numbered question label matching the official form (Q1–Q20). */
function QuestionLabel({
  number,
  htmlFor,
  optional = false,
  children,
}: {
  number: number;
  htmlFor?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-base">
      <span className="mr-0.5">{number}.</span> {children}
      {optional ? (
        <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
      ) : (
        <span className="ml-1 text-destructive" aria-hidden>
          *
        </span>
      )}
    </Label>
  );
}

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

const Careers = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  // Kept so the success screen can address the applicant by name
  // after the form has been reset.
  const [applicantName, setApplicantName] = useState("");

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
      resourcefulness: "",
      collaboration: "",
      localAvailability: "",
      schedule: "",
      motivation: "",
      creativeChallenge: "",
      practicalTask: "",
      confirmedAccuracy: false,
      confirmedOwnership: false,
      finalNotes: "",
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

  // Per-section validation — only the current section's fields are checked
  const stepFields: Record<number, (keyof FormValues)[]> = {
    0: ["fullName", "phone", "email", "location"],
    1: ["interests", "experience", "equipment"],
    2: ["createdBefore", "videoIdea", "audienceInterest", "resourcefulness"],
    3: ["collaboration", "localAvailability", "schedule", "motivation"],
    4: ["creativeChallenge", "practicalTask"],
    5: ["confirmedAccuracy", "confirmedOwnership"],
  };

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, applicationSections.length - 1));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: FormValues) => {
    const application = {
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
      resourcefulness: data.resourcefulness,
      collaboration: data.collaboration,
      localAvailability: data.localAvailability,
      schedule: data.schedule,
      motivation: data.motivation,
      creativeChallenge: data.creativeChallenge,
      practicalTask: data.practicalTask,
      confirmedAccuracy: data.confirmedAccuracy,
      confirmedOwnership: data.confirmedOwnership,
      finalNotes: data.finalNotes || undefined,
    };

    // Built and opened synchronously so the browser still treats this as a
    // user-initiated action — deferring it (await/timeout) risks the popup
    // blocker swallowing the WhatsApp handoff.
    const link = buildApplicationWhatsAppLink(application);
    setWhatsappLink(link);
    window.open(link, "_blank", "noopener,noreferrer");

    // Persistence stays fire-and-forget; the WhatsApp handoff is the
    // delivery path until a real backend exists.
    void submitCreatorApplication(application);

    setApplicantName(data.fullName);
    setSubmitted(true);
    reset();
  };

  // --- Success screen (spec: "Thank you for applying!") ---------
  if (submitted) {
    return (
      <div className="container py-28 max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <PartyPopper className="text-primary" size={28} />
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl mb-6">Thank you for applying!</h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed text-left">
          <p>
            Thank you{applicantName ? `, ${applicantName.split(" ")[0]}` : ""} for your interest in
            collaborating with O Studio Innovations.
          </p>
          <p>
            We appreciate your time, creativity, and willingness to share your ideas with us. Every
            creative journey begins somewhere, and we believe that potential can come from different
            backgrounds and levels of experience.
          </p>
          <p>
            We will review your application and contact selected applicants regarding possible next
            steps.
          </p>
          <p className="text-foreground">
            Let's bring ideas to life, tell compelling stories, and create meaningful content
            together.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground space-y-1.5 text-left">
          <p className="font-serif-display text-base text-foreground">O Studio Innovations</p>
          <p>Email: info@ostudioinnovations.com</p>
          <p>Phone / WhatsApp: +234 704 225 1787</p>
          <p>Location: 174 Ikorodu Road, Elediye Bus Stop, Onipanu, Lagos.</p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          The WhatsApp message with your answers just opened — press send so your application reaches
          us.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {whatsappLink && (
            <Button asChild variant="outline" className="rounded-full px-8">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                Didn't open? Send via WhatsApp
              </a>
            </Button>
          )}
          <Button asChild className="rounded-full px-8">
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    );
  }

  const section = applicationSections[step];

  return (
    <div>
      {/* HERO */}
      <section className="bg-hero-gradient py-28">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">
            O Studio Innovations
          </p>
          <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight max-w-3xl mx-auto">
            Content Creator Application Form
          </h1>
          <p className="mt-6 font-serif-display text-xl sm:text-2xl">
            <span className="text-gold-gradient">Creativity. Storytelling. Collaboration.</span>
          </p>
        </div>
      </section>

      {/* FORM DESCRIPTION */}
      <section className="border-b border-border">
        <div className="container max-w-3xl py-16">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-5">
            Form Description
          </p>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            {formDescription.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-20">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">
              Section {step + 1} of {applicationSections.length}
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl">{section.title}</h2>
            <p className="mt-4 text-muted-foreground">{section.purpose}</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-12">
            {applicationSections.map((s, i) => (
              <div key={s.short} className="flex-1 flex items-center">
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
                    {s.short}
                  </span>
                </div>
                {i < applicationSections.length - 1 && (
                  <div className={cn("h-px flex-1 -mt-5", i < step ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-card"
          >
            {/* SECTION 1 — PERSONAL INFORMATION (Q1–Q4) */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <QuestionLabel number={1} htmlFor="fullName">
                    Full Name
                  </QuestionLabel>
                  <Input id="fullName" placeholder="Your name" {...register("fullName")} />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <QuestionLabel number={2} htmlFor="phone">
                    Phone Number / WhatsApp Number
                  </QuestionLabel>
                  <Input id="phone" placeholder="+234..." {...register("phone")} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <QuestionLabel number={3} htmlFor="email">
                    Email Address
                  </QuestionLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <QuestionLabel number={4} htmlFor="location">
                    Where Are You Currently Based?
                  </QuestionLabel>
                  <Input
                    id="location"
                    placeholder="e.g. Gbagada Phase 1, Lagos"
                    {...register("location")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Please indicate your city or area of residence.
                  </p>
                  {errors.location && (
                    <p className="text-xs text-destructive">{errors.location.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 2 — YOUR CREATIVE INTERESTS (Q5–Q7) */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <QuestionLabel number={5}>
                    Which areas of content creation interest you the most?
                  </QuestionLabel>
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
                  <p className="text-xs text-muted-foreground">Select all that apply.</p>
                  {errors.interests && (
                    <p className="text-xs text-destructive">{errors.interests.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <QuestionLabel number={6}>
                    How would you describe your current experience with content creation?
                  </QuestionLabel>
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
                  <QuestionLabel number={7}>
                    What tools or equipment can you currently work with?
                  </QuestionLabel>
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
                  <p className="text-xs text-muted-foreground">Select all that apply.</p>
                  {errors.equipment && (
                    <p className="text-xs text-destructive">{errors.equipment.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 3 — YOUR CREATIVE PORTFOLIO (Q8–Q12) */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <QuestionLabel number={8}>
                    Have you ever recorded, edited, written, or contributed to a content project?
                  </QuestionLabel>
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
                  <QuestionLabel number={9} htmlFor="workSamples" optional>
                    Share a sample of your work, if available.
                  </QuestionLabel>
                  <Input
                    id="workSamples"
                    placeholder="TikTok, Instagram Reel, YouTube, Google Drive…"
                    {...register("workSamples")}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can share a TikTok video, Instagram Reel, YouTube video, Google Drive link, or
                    another accessible portfolio link. If you do not have previous work, you can leave
                    this blank.
                  </p>
                </div>

                <div className="space-y-2">
                  <QuestionLabel number={10} htmlFor="videoIdea">
                    Imagine O Studio Innovations asks you to create a short video. What would your
                    idea be?
                  </QuestionLabel>
                  <Textarea
                    id="videoIdea"
                    rows={5}
                    placeholder="Describe your concept, what it communicates, who it appeals to, and how you'd make it interesting."
                    {...register("videoIdea")}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      You do not need professional experience to answer this question.
                    </p>
                    <CharCount value={values.videoIdea} min={20} />
                  </div>
                  {errors.videoIdea && (
                    <p className="text-xs text-destructive">{errors.videoIdea.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <QuestionLabel number={11} htmlFor="audienceInterest">
                    In your opinion, what makes a video or story interesting enough for people to
                    watch, engage with, or share?
                  </QuestionLabel>
                  <Textarea
                    id="audienceInterest"
                    rows={5}
                    placeholder="Your creative thinking, storytelling instincts, and awareness of what connects with an audience."
                    {...register("audienceInterest")}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      We want to understand how you think about content.
                    </p>
                    <CharCount value={values.audienceInterest} min={20} />
                  </div>
                  {errors.audienceInterest && (
                    <p className="text-xs text-destructive">{errors.audienceInterest.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <QuestionLabel number={12} htmlFor="resourcefulness">
                    What would you do if you had a good video idea but limited equipment or
                    resources?
                  </QuestionLabel>
                  <Textarea
                    id="resourcefulness"
                    rows={5}
                    placeholder="How you would approach the idea, solve possible challenges, or find a practical way to bring it to life."
                    {...register("resourcefulness")}
                  />
                  <div className="flex items-center justify-end">
                    <CharCount value={values.resourcefulness} min={20} />
                  </div>
                  {errors.resourcefulness && (
                    <p className="text-xs text-destructive">{errors.resourcefulness.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 4 — COLLABORATION AND AVAILABILITY (Q13–Q16) */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <QuestionLabel number={13}>
                    What type of collaboration are you most interested in?
                  </QuestionLabel>
                  <Controller
                    name="collaboration"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
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

                <div className="space-y-3">
                  <QuestionLabel number={14}>
                    Are you available to participate in content shoots or projects around Gbagada
                    Phase 1, Lagos, when required?
                  </QuestionLabel>
                  <Controller
                    name="localAvailability"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={localAvailabilityOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.localAvailability && (
                    <p className="text-xs text-destructive">{errors.localAvailability.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <QuestionLabel number={15}>
                    How would you describe your availability for content projects?
                  </QuestionLabel>
                  <Controller
                    name="schedule"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={scheduleOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.schedule && (
                    <p className="text-xs text-destructive">{errors.schedule.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <QuestionLabel number={16} htmlFor="motivation">
                    Why would you like to collaborate with O Studio Innovations, and what do you hope
                    to contribute?
                  </QuestionLabel>
                  <Textarea
                    id="motivation"
                    rows={5}
                    placeholder="What interests you about working with us, what you would bring to the team, and what you would like to learn or achieve."
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

            {/* SECTION 5 — YOUR CREATIVE CHALLENGE (Q17–Q18) */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <QuestionLabel number={17} htmlFor="creativeChallenge">
                    If you could create one short video to capture people's attention, what would it
                    be about, and how would you present it?
                  </QuestionLabel>
                  <Textarea
                    id="creativeChallenge"
                    rows={6}
                    placeholder="A short skit, an educational video, a behind-the-scenes concept, a storytelling video, a social media trend adaptation — or any other original idea."
                    {...register("creativeChallenge")}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Briefly explain how you would bring it to life.
                    </p>
                    <CharCount value={values.creativeChallenge} min={20} />
                  </div>
                  {errors.creativeChallenge && (
                    <p className="text-xs text-destructive">{errors.creativeChallenge.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <QuestionLabel number={18}>
                    Would you be willing to complete a short practical creative task as part of the
                    selection process?
                  </QuestionLabel>
                  <Controller
                    name="practicalTask"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={practicalTaskOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.practicalTask && (
                    <p className="text-xs text-destructive">{errors.practicalTask.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 6 — FINAL CONFIRMATION (Q19–Q20) */}
            {step === 5 && (
              <div className="space-y-6">
                <p className="text-xs tracking-widest-plus uppercase text-primary">
                  Review your answers
                </p>
                <dl className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {[
                    ["Full name", values.fullName],
                    ["Phone / WhatsApp", values.phone],
                    ["Email", values.email],
                    ["Based in", values.location],
                    ["Interested in", values.interests.join(", ")],
                    ["Experience", values.experience],
                    ["Tools / equipment", values.equipment.join(", ")],
                    ["Content experience", values.createdBefore],
                    values.workSamples ? ["Work sample", values.workSamples] : null,
                    ["Q10 — Short video idea", values.videoIdea],
                    ["Q11 — What makes content interesting", values.audienceInterest],
                    ["Q12 — Good idea, limited resources", values.resourcefulness],
                    ["Q13 — Collaboration type", values.collaboration],
                    ["Q14 — Available around Gbagada", values.localAvailability],
                    ["Q15 — Schedule", values.schedule],
                    ["Q16 — Why O Studio", values.motivation],
                    ["Q17 — One attention-grabbing video", values.creativeChallenge],
                    ["Q18 — Practical task", values.practicalTask],
                    values.finalNotes ? ["Q20 — Anything else", values.finalNotes] : null,
                  ]
                    .filter((row): row is [string, string] => Boolean(row))
                    .map(([label, val]) => (
                      <div
                        key={label}
                        className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-4 text-sm"
                      >
                        <dt className="sm:w-56 shrink-0 text-muted-foreground">{label}</dt>
                        <dd className="text-foreground whitespace-pre-line">{val}</dd>
                      </div>
                    ))}
                </dl>

                {/* Q19 — Applicant Declaration */}
                <div className="space-y-3">
                  <QuestionLabel number={19}>Applicant Declaration</QuestionLabel>
                  <Controller
                    name="confirmedAccuracy"
                    control={form.control}
                    render={({ field }) => (
                      <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-border bg-background/40 p-4">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-primary accent-[hsl(var(--primary))]"
                        />
                        <span className="text-sm text-foreground/85 leading-relaxed">
                          I confirm that the information provided in this application is accurate to
                          the best of my knowledge.
                        </span>
                      </label>
                    )}
                  />
                  {errors.confirmedAccuracy && (
                    <p className="text-xs text-destructive">{errors.confirmedAccuracy.message}</p>
                  )}
                  <Controller
                    name="confirmedOwnership"
                    control={form.control}
                    render={({ field }) => (
                      <label className="flex items-start gap-3 cursor-pointer rounded-xl border border-border bg-background/40 p-4">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-primary accent-[hsl(var(--primary))]"
                        />
                        <span className="text-sm text-foreground/85 leading-relaxed">
                          I confirm that any work samples I submit are my own or that I have
                          permission to share them.
                        </span>
                      </label>
                    )}
                  />
                  {errors.confirmedOwnership && (
                    <p className="text-xs text-destructive">{errors.confirmedOwnership.message}</p>
                  )}
                </div>

                {/* Q20 — anything else (optional) */}
                <div className="space-y-2">
                  <QuestionLabel number={20} htmlFor="finalNotes" optional>
                    Is there anything else you would like us to know about you, your creativity, or
                    your interest in joining our projects?
                  </QuestionLabel>
                  <Textarea
                    id="finalNotes"
                    rows={4}
                    placeholder="Anything else you'd like to share…"
                    {...register("finalNotes")}
                  />
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

              {step < applicationSections.length - 1 ? (
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

export default Careers;
