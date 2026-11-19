import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { serviceCategories } from "@/data/services";
import { getProjectBySlug } from "@/data/portfolio";
import { getIcon } from "@/lib/icons";
import { submitProjectInquiry } from "@/lib/inquiries";
import type { CategorySlug } from "@/types";
import { cn } from "@/lib/utils";
import { FormFrame } from "@/components/start-project/FormFrame";
import { StepProgress } from "@/components/start-project/StepProgress";
import { StepTransition } from "@/components/start-project/StepTransition";
import { SuccessScene } from "@/components/start-project/SuccessScene";
import { usePageMeta } from "@/hooks/usePageMeta";

// Services where date/location/guest-count questions are relevant
const EVENT_LIKE: CategorySlug[] = ["media-events", "content-entertainment"];
// Services where "project type" should describe a digital deliverable
const TECH_LIKE: CategorySlug[] = ["technology"];

const budgetRanges = [
  "Under ₦200,000",
  "₦200,000 – ₦500,000",
  "₦500,000 – ₦1,000,000",
  "₦1,000,000 – ₦3,000,000",
  "Above ₦3,000,000",
  "Not sure yet",
];

const formSchema = z.object({
  service: z.string().min(1, "Please select a service"),
  projectType: z.string().min(2, "Please describe the project type"),
  date: z.string().optional(),
  location: z.string().optional(),
  expectedGuests: z.string().optional(),
  budgetRange: z.string().min(1, "Please select a budget range"),
  description: z.string().min(10, "Please tell us a bit more (at least 10 characters)"),
  additionalRequirements: z.string().optional(),
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "Please enter a valid phone / WhatsApp number"),
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const steps = ["Service", "Project Details", "Contact", "Review"] as const;

const StartProject = () => {
  usePageMeta(
    "Start a Project | O Studio Innovations",
    "Tell us about your project — a few quick steps, and the O Studio team replies with a plan."
  );

  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("service") ?? "";
  const projectParam = searchParams.get("project");
  const [step, setStep] = useState(0);
  // Slide direction for the step transition: 1 forward, -1 back.
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitted, setSubmitted] = useState(false);
  // Supabase delivery states — confirmation only after the row exists.
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      service: preselected,
      projectType: "",
      date: "",
      location: "",
      expectedGuests: "",
      budgetRange: "",
      description: "",
      additionalRequirements: "",
      name: "",
      phone: "",
      email: "",
    },
  });

  const { register, handleSubmit, watch, setValue, trigger, formState } = form;
  const selectedService = watch("service") as CategorySlug | "";
  const isEventLike = EVENT_LIKE.includes(selectedService as CategorySlug);
  const isTechLike = TECH_LIKE.includes(selectedService as CategorySlug);

  useEffect(() => {
    if (preselected) setValue("service", preselected, { shouldValidate: true });
  }, [preselected, setValue]);

  const stepFields: Record<number, (keyof FormValues)[]> = {
    0: ["service"],
    1: ["projectType", "budgetRange", "description"],
    2: ["name", "phone", "email"],
    3: [],
  };

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) {
      setDirection(1);
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };
  const onSubmit = async (values: FormValues) => {
    // Supabase is the ONLY submission path (stage 09 / Phase C): the brief
    // must land in `project_inquiries` — the single view in the O Studio
    // Admin — before we confirm. The visitor's answers are kept on failure
    // so they can retry.
    setSending(true);
    setSendError(null);
    try {
      await submitProjectInquiry({
        name: values.name,
        phone: values.phone,
        email: values.email,
        service: values.service as CategorySlug,
        projectType: values.projectType,
        date: values.date || undefined,
        location: values.location || undefined,
        expectedGuests: values.expectedGuests || undefined,
        budgetRange: values.budgetRange,
        description: values.description,
        additionalRequirements: values.additionalRequirements || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("[O Studio] project request failed to send", err);
      setSendError(
        err instanceof Error
          ? err.message
          : "We couldn't send your request just now — please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const values = watch();
  const selectedServiceData = serviceCategories.find((s) => s.slug === selectedService);
  // ?project= (from EndCredits) picks the frame's poster and "like" line.
  const projectData = projectParam ? getProjectBySlug(projectParam) : undefined;

  if (submitted) {
    return (
      <SuccessScene
        message={
          <>
            Thanks, {values.name.split(" ")[0]}. O Studio has received your structured project
            request and will follow up at {values.email} or {values.phone} shortly to discuss next
            steps.
          </>
        }
        actions={
          <Button asChild className="rounded-full px-8">
            <a href="/">Return Home</a>
          </Button>
        }
      />
    );
  }

  return (
    <div className="py-20">
      <FormFrame service={selectedServiceData} project={projectData}>
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">Start a Project</p>
          <h1 className="font-serif-display text-3xl sm:text-4xl">Tell us about your project.</h1>
          <p className="mt-4 text-muted-foreground">
            A structured brief helps O Studio respond with real answers, not guesses.
          </p>
        </div>

        {/* Step progress — one filling bar over the existing step labels */}
        <StepProgress step={step} labels={steps} />

        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-card">
          <StepTransition step={step} direction={direction}>
            {/* STEP 0 — SERVICE */}
            {step === 0 && (
              <div className="space-y-6">
                <h2 className="font-serif-display text-xl">Which service is this for?</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {serviceCategories.map((s) => {
                    const Icon = getIcon(s.icon);
                    const active = selectedService === s.slug;
                    return (
                      <button
                        type="button"
                        key={s.slug}
                        onClick={() => setValue("service", s.slug, { shouldValidate: true })}
                        className={cn(
                          "text-left rounded-xl border p-4 transition-colors",
                          active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                        )}
                      >
                        <Icon className="text-primary mb-2" size={20} strokeWidth={1.5} />
                        <p className="text-sm font-medium">{s.shortName}</p>
                      </button>
                    );
                  })}
                </div>
                {formState.errors.service && (
                  <p className="text-xs text-destructive">{formState.errors.service.message}</p>
                )}
              </div>
            )}

            {/* STEP 1 — PROJECT DETAILS (adaptive) */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif-display text-xl">
                  Tell us more about your {selectedServiceData?.shortName.toLowerCase() ?? "project"}.
                </h2>

                <div className="space-y-2">
                  <Label htmlFor="projectType">
                    {isTechLike ? "What are you looking to build?" : "Project type"}
                  </Label>
                  <Input
                    id="projectType"
                    placeholder={isTechLike ? "e.g. Business website, AI chatbot, internal tool" : "e.g. Wedding, documentary, brand identity"}
                    {...register("projectType")}
                  />
                  {formState.errors.projectType && (
                    <p className="text-xs text-destructive">{formState.errors.projectType.message}</p>
                  )}
                </div>

                {isEventLike && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Event / project date</Label>
                      <Input id="date" type="date" {...register("date")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedGuests">Expected audience / guests</Label>
                      <Input id="expectedGuests" placeholder="e.g. 150 guests" {...register("expectedGuests")} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Venue / city" {...register("location")} />
                    </div>
                  </div>
                )}

                {!isEventLike && !isTechLike && (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (if relevant)</Label>
                    <Input id="location" placeholder="City / region" {...register("location")} />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Budget range</Label>
                  <Select value={values.budgetRange} onValueChange={(v) => setValue("budgetRange", v, { shouldValidate: true })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an estimated budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formState.errors.budgetRange && (
                    <p className="text-xs text-destructive">{formState.errors.budgetRange.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Describe your project</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="What are you trying to achieve? Any context helps us prepare a relevant response."
                    {...register("description")}
                  />
                  {formState.errors.description && (
                    <p className="text-xs text-destructive">{formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalRequirements">Additional requirements (optional)</Label>
                  <Textarea
                    id="additionalRequirements"
                    rows={3}
                    placeholder="Anything else O Studio should know?"
                    {...register("additionalRequirements")}
                  />
                </div>
              </div>
            )}

            {/* STEP 2 — CONTACT */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif-display text-xl">How can we reach you?</h2>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Your name" {...register("name")} />
                  {formState.errors.name && <p className="text-xs text-destructive">{formState.errors.name.message}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" placeholder="+234..." {...register("phone")} />
                    {formState.errors.phone && <p className="text-xs text-destructive">{formState.errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                    {formState.errors.email && <p className="text-xs text-destructive">{formState.errors.email.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — REVIEW */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif-display text-xl">Review your request</h2>
                <dl className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                  {[
                    ["Service", selectedServiceData?.name],
                    ["Project type", values.projectType],
                    values.date ? ["Date", values.date] : null,
                    values.location ? ["Location", values.location] : null,
                    values.expectedGuests ? ["Expected guests", values.expectedGuests] : null,
                    ["Budget range", values.budgetRange],
                    ["Description", values.description],
                    values.additionalRequirements ? ["Additional requirements", values.additionalRequirements] : null,
                    ["Name", values.name],
                    ["Phone / WhatsApp", values.phone],
                    ["Email", values.email],
                  ]
                    .filter((row): row is [string, string] => Boolean(row))
                    .map(([label, val]) => (
                      <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-4 text-sm">
                        <dt className="sm:w-40 shrink-0 text-muted-foreground">{label}</dt>
                        <dd className="text-foreground">{val}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            )}
          </StepTransition>

          {/* SEND ERROR — answers are kept so the visitor can retry */}
          {sendError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
            >
              <p>{sendError}</p>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="flex items-center justify-between mt-10">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={goBack} className="rounded-full">
                <ArrowLeft className="mr-2" size={15} /> Back
              </Button>
            ) : <span />}

            {step < steps.length - 1 ? (
              <Button type="button" onClick={goNext} className="rounded-full px-6">
                Continue <ArrowRight className="ml-2" size={15} />
              </Button>
            ) : (
              <Button type="submit" className="rounded-full px-8" disabled={sending}>
                {sending ? "Sending…" : "Submit Project Request"}
              </Button>
            )}
          </div>
        </form>
      </FormFrame>
    </div>
  );
};

export default StartProject;
