import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, PartyPopper } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { submitFeedback } from "@/lib/feedback";
import {
  feedbackIntro,
  privacyNote,
  thankYouMessage,
  howHeardOptions,
  serviceOptions,
  wouldUseOptions,
  photoConsentOptions,
  contactOptions,
  feedbackSections,
  contactWhatsApp,
  contactWhatsAppUrl,
  contactEmail,
} from "@/data/feedback";

// ============================================================
// LAUNCH FEEDBACK — /feedback
//
// A private, link-only follow-up to the soft launch. 4 short
// steps, mobile-first, only two answers are required (rating +
// photo consent). Personalised links may carry ?name=, ?phone=
// and ?id= — name and phone prefill but stay editable, and the
// id is stored with the response so rows can be matched to the
// guest list. No tracking, no analytics.
// ============================================================

const formSchema = z
  .object({
    // Section 1 — warm-up
    howHeard: z.string().optional(),
    howHeardOther: z.string().trim().max(300, "That's plenty — 300 characters is the cap.").optional(),
    rating: z
      .number()
      .min(1, "Please tap a rating from 1 to 5")
      .max(5, "Please tap a rating from 1 to 5"),
    // Section 2 — understanding the space
    whatWeDo: z
      .string()
      .trim()
      .max(300, "A sentence or two is plenty — 300 characters is the cap.")
      .optional(),
    topService: z.string().optional(),
    stoodOut: z
      .string()
      .trim()
      .max(300, "That's plenty — 300 characters is the cap.")
      .optional(),
    // Section 3 — improvement
    doBetter: z
      .string()
      .trim()
      .max(300, "That's plenty — 300 characters is the cap.")
      .optional(),
    expectedMissing: z
      .string()
      .trim()
      .max(300, "That's plenty — 300 characters is the cap.")
      .optional(),
    addOneThing: z
      .string()
      .trim()
      .max(300, "That's plenty — 300 characters is the cap.")
      .optional(),
    wouldUse: z.string().optional(),
    whatWouldChange: z
      .string()
      .trim()
      .max(300, "That's plenty — 300 characters is the cap.")
      .optional(),
    // Section 4 — last bit
    anythingElse: z
      .string()
      .trim()
      .max(1500, "That's the cap — 1500 characters.")
      .optional(),
    questions: z
      .string()
      .trim()
      .max(300, "That's plenty — 300 characters is the cap.")
      .optional(),
    photoConsent: z.string().min(1, "Please choose one — we won't assume anything"),
    contactConsent: z.string().optional(),
    name: z.string().trim().max(120, "That's a little long — 120 characters is plenty.").optional(),
    phone: z.string().trim().max(40, "That's a little long — 40 characters is plenty.").optional(),
    // Honeypot — invisible to people, tempting for bots.
    website: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.howHeard === "Other" && !data.howHeardOther?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["howHeardOther"],
        message: "Please tell us where you heard about us",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

// --- Reusable field components (same look as the Careers form) ---

/** Single-select presented as full-width tap rows. */
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
              "flex items-center gap-3 text-left rounded-xl border px-4 py-4 transition-colors",
              active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
            )}
          >
            <span
              className={cn(
                "grid h-5 w-5 shrink-0 place-content-center rounded-full border transition-colors",
                active ? "border-primary" : "border-border"
              )}
            >
              {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
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

/** Tap-friendly 1–5 rating (Q2, required). */
function RatingPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div
      className="grid grid-cols-5 gap-2 sm:gap-3"
      role="radiogroup"
      aria-label="Overall experience rating"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${n} out of 5`}
            onClick={() => onChange(n)}
            className={cn(
              "h-14 rounded-xl border text-lg font-semibold transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground/80 hover:border-primary/40"
            )}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

/** Question label — number optional, "Optional" chip or required * (same convention as Careers). */
function QuestionLabel({
  number,
  htmlFor,
  optional = false,
  children,
}: {
  number?: number;
  htmlFor?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor} className="text-base">
      {number != null && <span className="mr-1">{number}.</span>}
      {children}
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

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  // Supabase delivery states — success screen only after the row exists.
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Personalised links: /feedback?name=Ada&phone=...&id=12
  // Name and phone prefill but stay editable; id rides along
  // with the response so rows can be matched to the guest list.
  const guestId = searchParams.get("id") ?? "";
  const prefilledName = searchParams.get("name") ?? "";
  const prefilledPhone = searchParams.get("phone") ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      howHeard: "",
      howHeardOther: "",
      rating: 0,
      whatWeDo: "",
      topService: "",
      stoodOut: "",
      doBetter: "",
      expectedMissing: "",
      addOneThing: "",
      wouldUse: "",
      whatWouldChange: "",
      anythingElse: "",
      questions: "",
      photoConsent: "",
      contactConsent: "",
      name: prefilledName,
      phone: prefilledPhone,
      website: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = form;

  const values = watch();

  // This page must never be listed by search engines: inject a
  // noindex meta tag while mounted, restore everything on leave.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Launch Feedback | O Studio Innovations";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
      document.title = previousTitle;
    };
  }, []);

  // Per-section validation — only the current step's fields are checked.
  const stepFields: Record<number, (keyof FormValues)[]> = {
    0: ["howHeard", "howHeardOther", "rating"],
    1: ["whatWeDo", "topService", "stoodOut"],
    2: ["doBetter", "expectedMissing", "addOneThing", "wouldUse", "whatWouldChange"],
    3: ["anythingElse", "questions", "photoConsent", "contactConsent", "name", "phone"],
  };

  const topRef = useRef<HTMLDivElement>(null);
  const scrollBackToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) {
      setStep((s) => Math.min(s + 1, feedbackSections.length - 1));
      scrollBackToTop();
    }
  };
  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollBackToTop();
  };

  const onSubmit = async (data: FormValues) => {
    // Guard against double submissions (the button is disabled too).
    if (sending) return;

    // Honeypot: real guests never see this field. Pretend success
    // so bots learn nothing, but store nothing either.
    if (data.website?.trim()) {
      setSubmitted(true);
      reset();
      return;
    }

    setSending(true);
    setSendError(null);
    try {
      await submitFeedback({
        guestId,
        name: data.name,
        phone: data.phone,
        howHeard: data.howHeard,
        howHeardOther: data.howHeardOther,
        rating: data.rating,
        whatWeDo: data.whatWeDo,
        topService: data.topService,
        stoodOut: data.stoodOut,
        doBetter: data.doBetter,
        expectedMissing: data.expectedMissing,
        addOneThing: data.addOneThing,
        wouldUse: data.wouldUse,
        whatWouldChange: data.whatWouldChange,
        anythingElse: data.anythingElse,
        questions: data.questions,
        photoConsent: data.photoConsent,
        contactConsent: data.contactConsent,
      });
      setSubmitted(true);
      reset();
    } catch (err) {
      // Answers stay on screen — the guest can simply retry.
      console.error("[O Studio] feedback failed to send", err);
      setSendError(
        err instanceof Error
          ? err.message
          : "We couldn't send your feedback just now — please try again."
      );
    } finally {
      setSending(false);
    }
  };

  // --- Success screen (spec copy, verbatim) --------------------
  if (submitted) {
    return (
      <div className="container py-24 sm:py-28 max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <PartyPopper className="text-primary" size={28} />
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl leading-snug">{thankYouMessage}</h1>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full px-8 h-11 sm:h-9">
            <a href="/">Return Home</a>
          </Button>
        </div>
      </div>
    );
  }

  const section = feedbackSections[step];

  return (
    <div>
      {/* HERO — intro copy is the first thing on the page */}
      <section className="bg-hero-gradient py-20 sm:py-28">
        <div className="container text-center">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">
            O Studio Innovations
          </p>
          <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight max-w-3xl mx-auto">
            Launch Feedback
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            {feedbackIntro}
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="py-14 sm:py-20">
        <div className="container max-w-2xl">
          <div ref={topRef} className="scroll-mt-28 text-center mb-8 sm:mb-12">
            <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">
              Step {step + 1} of {feedbackSections.length}
            </p>
            <h2 className="font-serif-display text-2xl sm:text-4xl">{section.title}</h2>
            <p className="mt-3 text-muted-foreground">{section.purpose}</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            {feedbackSections.map((s, i) => (
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
                {i < feedbackSections.length - 1 && (
                  <div className={cn("h-px flex-1 -mt-5", i < step ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative bg-card border border-border rounded-2xl p-5 sm:p-10 shadow-card"
          >
            {/* Honeypot — off-screen, never seen by real guests */}
            <div
              className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            {/* SECTION 1 — WARM-UP (Q1–Q2) */}
            {step === 0 && (
              <div className="space-y-7">
                <div className="space-y-3">
                  <QuestionLabel number={1} htmlFor="howHeard" optional>
                    How did you hear about the launch?
                  </QuestionLabel>
                  <Controller
                    name="howHeard"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={howHeardOptions}
                        value={field.value}
                        onChange={(next) => {
                          field.onChange(next);
                          // Never keep an answer to a box that's no longer shown.
                          if (next !== "Other") setValue("howHeardOther", "");
                        }}
                      />
                    )}
                  />
                  {errors.howHeard && (
                    <p className="text-xs text-destructive">{errors.howHeard.message}</p>
                  )}
                </div>

                {values.howHeard === "Other" && (
                  <div className="space-y-2">
                    <Label htmlFor="howHeardOther" className="text-base">
                      Where did you hear about us?
                    </Label>
                    <Input
                      id="howHeardOther"
                      className="h-11 sm:h-9"
                      placeholder="A few words is plenty…"
                      {...register("howHeardOther")}
                    />
                    {errors.howHeardOther && (
                      <p className="text-xs text-destructive">{errors.howHeardOther.message}</p>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <QuestionLabel number={2}>
                    How would you rate your overall experience on the day?
                  </QuestionLabel>
                  <Controller
                    name="rating"
                    control={form.control}
                    render={({ field }) => (
                      <RatingPicker value={field.value} onChange={field.onChange} />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tap a number — 1 is low, 5 is high. There's no right answer.
                  </p>
                  {errors.rating && (
                    <p className="text-xs text-destructive">{errors.rating.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 2 — UNDERSTANDING THE SPACE (Q3–Q5) */}
            {step === 1 && (
              <div className="space-y-7">
                <div className="space-y-2">
                  <QuestionLabel number={3} htmlFor="whatWeDo" optional>
                    In your own words, what do you think we do?
                  </QuestionLabel>
                  <Textarea
                    id="whatWeDo"
                    rows={3}
                    placeholder="However you'd explain it to a friend…"
                    {...register("whatWeDo")}
                  />
                  {errors.whatWeDo && (
                    <p className="text-xs text-destructive">{errors.whatWeDo.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <QuestionLabel number={4} optional>
                    Which of our services interests you most?
                  </QuestionLabel>
                  <Controller
                    name="topService"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={serviceOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.topService && (
                    <p className="text-xs text-destructive">{errors.topService.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <QuestionLabel number={5} htmlFor="stoodOut" optional>
                    What stood out to you most about the space?
                  </QuestionLabel>
                  <Textarea
                    id="stoodOut"
                    rows={3}
                    placeholder="The light, the rooms, the people…"
                    {...register("stoodOut")}
                  />
                  {errors.stoodOut && (
                    <p className="text-xs text-destructive">{errors.stoodOut.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 3 — IMPROVEMENT (Q6–Q9) */}
            {step === 2 && (
              <div className="space-y-7">
                <div className="space-y-2">
                  <QuestionLabel number={6} htmlFor="doBetter" optional>
                    What's one thing we could do better?
                  </QuestionLabel>
                  <Textarea
                    id="doBetter"
                    rows={3}
                    placeholder="One thing is enough…"
                    {...register("doBetter")}
                  />
                  {errors.doBetter && (
                    <p className="text-xs text-destructive">{errors.doBetter.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <QuestionLabel number={7} htmlFor="expectedMissing" optional>
                    What did you expect to see that you didn't?
                  </QuestionLabel>
                  <Textarea
                    id="expectedMissing"
                    rows={3}
                    placeholder="Anything you were curious about…"
                    {...register("expectedMissing")}
                  />
                  {errors.expectedMissing && (
                    <p className="text-xs text-destructive">{errors.expectedMissing.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <QuestionLabel number={8} htmlFor="addOneThing" optional>
                    If you could add one thing to this space, what would it be?
                  </QuestionLabel>
                  <Textarea
                    id="addOneThing"
                    rows={3}
                    placeholder="A café corner, a podcast room, more seating…"
                    {...register("addOneThing")}
                  />
                  {errors.addOneThing && (
                    <p className="text-xs text-destructive">{errors.addOneThing.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <QuestionLabel number={9} optional>
                    Would you use our services or recommend us to someone?
                  </QuestionLabel>
                  <Controller
                    name="wouldUse"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={wouldUseOptions}
                        value={field.value}
                        onChange={(next) => {
                          field.onChange(next);
                          // The follow-up box only exists for Maybe / Not yet.
                          if (next === "Yes") setValue("whatWouldChange", "");
                        }}
                      />
                    )}
                  />
                  {errors.wouldUse && (
                    <p className="text-xs text-destructive">{errors.wouldUse.message}</p>
                  )}
                </div>

                {(values.wouldUse === "Maybe" || values.wouldUse === "Not yet") && (
                  <div className="space-y-2">
                    <Label htmlFor="whatWouldChange" className="text-base">
                      What would change that?
                    </Label>
                    <Textarea
                      id="whatWouldChange"
                      rows={3}
                      placeholder="Tell us what would tip you over the line…"
                      {...register("whatWouldChange")}
                    />
                    {errors.whatWouldChange && (
                      <p className="text-xs text-destructive">{errors.whatWouldChange.message}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 4 — LAST BIT (Q10 + photos + details) */}
            {step === 3 && (
              <div className="space-y-7">
                <div className="space-y-2">
                  <QuestionLabel number={10} htmlFor="anythingElse" optional>
                    Anything you didn't get to say on the day?
                  </QuestionLabel>
                  <Textarea
                    id="anythingElse"
                    rows={4}
                    placeholder="Anything at all — we're listening…"
                    {...register("anythingElse")}
                  />
                  {errors.anythingElse && (
                    <p className="text-xs text-destructive">{errors.anythingElse.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <QuestionLabel number={11} htmlFor="questions" optional>
                    Any questions for us?
                  </QuestionLabel>
                  <Textarea
                    id="questions"
                    rows={3}
                    placeholder="Ask us anything — about the spaces, prices, bookings…"
                    {...register("questions")}
                  />
                  {errors.questions && (
                    <p className="text-xs text-destructive">{errors.questions.message}</p>
                  )}
                </div>

                {/* Photo consent — required, nothing pre-selected */}
                <div className="space-y-3">
                  <QuestionLabel>
                    We took photos at our launch and would love to feature some of them. May we use
                    photos that include you?
                  </QuestionLabel>
                  <Controller
                    name="photoConsent"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={photoConsentOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.photoConsent && (
                    <p className="text-xs text-destructive">{errors.photoConsent.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You can change your mind anytime by messaging us at{" "}
                    <a
                      href={contactWhatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-foreground/80"
                    >
                      {contactWhatsApp}
                    </a>{" "}
                    or{" "}
                    <a href={`mailto:${contactEmail}`} className="underline text-foreground/80">
                      {contactEmail}
                    </a>
                    , and we'll remove your photos.
                  </p>
                </div>

                {/* Future contact — optional */}
                <div className="space-y-3">
                  <QuestionLabel optional>
                    Can we reach out to you for future events or updates?
                  </QuestionLabel>
                  <Controller
                    name="contactConsent"
                    control={form.control}
                    render={({ field }) => (
                      <SelectCardGroup
                        options={contactOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.contactConsent && (
                    <p className="text-xs text-destructive">{errors.contactConsent.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Name
                    <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
                  </Label>
                  <Input
                    id="name"
                    className="h-11 sm:h-9"
                    placeholder="Your name"
                    autoComplete="name"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Phone
                    <span className="ml-2 text-xs font-normal text-muted-foreground">Optional</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    className="h-11 sm:h-9"
                    placeholder="+234..."
                    autoComplete="tel"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* SEND ERROR — answers are kept, guest can retry */}
            {sendError && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
              >
                <p>{sendError}</p>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div className="flex items-center justify-between gap-3 mt-8">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  disabled={sending}
                  className="rounded-full h-11 sm:h-9"
                >
                  <ArrowLeft className="mr-2" size={15} /> Back
                </Button>
              ) : (
                <span />
              )}

              {step < feedbackSections.length - 1 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={sending}
                  className="rounded-full px-6 h-11 sm:h-9"
                >
                  Continue <ArrowRight className="ml-2" size={15} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="rounded-full px-8 h-11 sm:h-9"
                  disabled={sending}
                >
                  {sending ? "Sending…" : "Send feedback"}
                </Button>
              )}
            </div>

            {/* Privacy line — near the submit button */}
            <p className="mt-4 text-xs text-muted-foreground text-center sm:text-left">
              {privacyNote}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
