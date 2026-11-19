import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Check, Clock, DoorOpen, Users, Video } from "lucide-react";

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
import { getServiceBySlug } from "@/data/services";
import { contactWhatsAppUrl } from "@/data/contact";
import { submitStudioBooking } from "@/lib/bookings";
import { RoomHero } from "@/components/studio-rental/RoomHero";
import { RoomPicker } from "@/components/studio-rental/RoomPicker";
import { SuccessScene } from "@/components/start-project/SuccessScene";
import { usePageMeta } from "@/hooks/usePageMeta";

// ============================================================
// STUDIO RENTAL — booking request
//
// Rental is the product (the space). A booking is the request
// that holds a slot — it is not a transaction. There is no
// system pricing and no payment here: the request INSERTs into
// `studio_bookings` (status pending) and the O Studio team
// replies with availability and a quote.
//
// The whole page turns on one fork — "how will you use the
// studio?" — which decides which fields follow it. Space options
// come from the site's own service data, so the form can never
// drift from the copy.
// ============================================================

/** Deliberately not in subServices — it is a meta choice, not a space. */
const NOT_SURE = "Not sure yet — recommend one";

const DELIVERABLE_OPTIONS = [
  "Edited video",
  "Raw footage",
  "Session / event photos",
  "Short highlight reel",
  "Social cutdowns",
  "Behind-the-scenes reel",
] as const;

const USAGE_OPTIONS = [
  "Organic social only",
  "Paid ads",
  "Website",
  "TV / broadcast",
  "Internal use only",
  "Not sure yet",
] as const;

const TURNAROUND_OPTIONS = ["Same day", "Within 48 hours", "Within a week", "Flexible"] as const;

const TECHNICIAN_OPTIONS = [
  "Yes — please have someone on site",
  "No — we're self-sufficient",
  "Not sure — tell me more",
] as const;

const formSchema = z
  .object({
    mode: z.enum(["space", "crew"]),
    studio: z.string().min(1, "Please select a studio space"),
    bookingDate: z.string().min(1, "Please choose a date"),
    startTime: z.string().min(1, "Please choose a start time"),
    endTime: z.string().min(1, "Please choose an end time"),
    // Kept as text so an empty field reads as "required" rather
    // than silently coercing to 0.
    partySize: z
      .string()
      .min(1, "How many people are coming?")
      .regex(/^[1-9]\d{0,2}$/, "Please enter a number between 1 and 999"),
    purpose: z.string().min(5, "Please tell us what you'll be recording"),
    // Space Only
    guestGear: z.string().optional(),
    studioGear: z.string().optional(),
    needsTechnician: z.string().optional(),
    loadIn: z.string().optional(),
    // With O Studio
    deliverables: z.array(z.string()),
    usage: z.string().optional(),
    turnaround: z.string().optional(),
    // Contact
    name: z.string().min(2, "Please enter your name"),
    phone: z.string().min(7, "Please enter a valid phone / WhatsApp number"),
    email: z.string().email("Please enter a valid email address"),
    notes: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const today = new Date().toISOString().slice(0, 10);
    if (value.bookingDate && value.bookingDate < today) {
      ctx.addIssue({
        code: "custom",
        path: ["bookingDate"],
        message: "Please choose today or a future date",
      });
    }
    if (value.startTime && value.endTime && value.endTime <= value.startTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after the start time",
      });
    }
    const people = Number(value.partySize);
    if (value.partySize && !Number.isNaN(people) && people > 500) {
      ctx.addIssue({
        code: "custom",
        path: ["partySize"],
        message: "That's a large group — please contact us directly",
      });
    }
    // Mode-conditional: only the selected mode is validated.
    if (value.mode === "crew") {
      if (value.deliverables.length === 0) {
        ctx.addIssue({
          code: "custom",
          path: ["deliverables"],
          message: "Please pick at least one thing we should deliver",
        });
      }
      if (!value.usage) {
        ctx.addIssue({
          code: "custom",
          path: ["usage"],
          message: "Please tell us where the footage will be used",
        });
      }
      if (!value.turnaround) {
        ctx.addIssue({
          code: "custom",
          path: ["turnaround"],
          message: "Please choose how soon you need it",
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

// Space options are the Studio Rental service's own sub-services.
const studioOptions = [
  ...(getServiceBySlug("studio-rental")?.subServices ?? [
    "Podcast / Content Room",
    "Photo Studio",
    "Film Set",
  ]),
  NOT_SURE,
];

const fieldLabel = "text-xs tracking-widest-plus uppercase text-primary mb-2";

const StudioRental = () => {
  usePageMeta(
    "Book a studio session — Studio Rental | O Studio Innovations",
    "Studio Rental is the space. A booking is your request to hold a slot — tell us the space, the date, and how you'll use it."
  );

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  // Kept so the confirmation can address the guest by name after reset.
  const [guestName, setGuestName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      mode: "space",
      studio: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      partySize: "2",
      purpose: "",
      guestGear: "",
      studioGear: "",
      needsTechnician: "",
      loadIn: "",
      deliverables: [],
      usage: "",
      turnaround: "",
      name: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const mode = watch("mode");
  const selectedStudio = watch("studio");
  const deliverables = watch("deliverables");

  const toggleDeliverable = (option: string) => {
    const next = deliverables.includes(option)
      ? deliverables.filter((d) => d !== option)
      : [...deliverables, option];
    setValue("deliverables", next, { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    setSending(true);
    setSendError(null);
    try {
      const isSpaceOnly = values.mode === "space";
      await submitStudioBooking({
        mode: values.mode,
        studio: values.studio,
        bookingDate: values.bookingDate,
        startTime: values.startTime,
        endTime: values.endTime,
        partySize: Number(values.partySize),
        purpose: values.purpose,
        name: values.name,
        phone: values.phone,
        email: values.email,
        ...(isSpaceOnly
          ? {
              guestGear: values.guestGear || undefined,
              studioGear: values.studioGear || undefined,
              needsTechnician: values.needsTechnician || undefined,
              loadIn: values.loadIn || undefined,
            }
          : {
              deliverables: values.deliverables,
              usage: values.usage || undefined,
              turnaround: values.turnaround || undefined,
            }),
        notes: values.notes || undefined,
      });
      setGuestName(values.name);
      setSubmitted(true);
      reset();
    } catch (err) {
      // Logged for debugging; the guest only ever sees plain English.
      console.error("[O Studio] booking request failed to send", err);
      setSendError(
        err instanceof Error
          ? err.message
          : "We couldn't send your booking request just now — please try again."
      );
    } finally {
      setSending(false);
    }
  };

  // --- Confirmation -------------------------------------------
  if (submitted) {
    return (
      <SuccessScene
        message={
          <>
            Thanks{guestName ? `, ${guestName.split(" ")[0]}` : ""}. O Studio has your request and
            will reply with availability and a quote for your slot — usually within the same working
            day.
          </>
        }
        actions={
          <>
            <Button asChild variant="outline" className="rounded-full px-8">
              <Link to="/services/studio-rental">Back to Studio Rental</Link>
            </Button>
            <Button asChild className="rounded-full px-8">
              <Link to="/">Return Home</Link>
            </Button>
          </>
        }
      />
    );
  }

  return (
    <div>
      {/* HERO */}
      <RoomHero />

      {/* RENTAL vs BOOKING */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-5xl grid gap-6 md:grid-cols-2">
          <div className="bg-card border border-border rounded-2xl p-7 shadow-card">
            <div className="flex items-center gap-2.5 mb-3">
              <DoorOpen size={18} className="text-primary" />
              <h2 className="font-serif-display text-xl">Studio Rental — what you hire</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Three professional spaces, hired by the session. Everything is already set up and
              checked before you arrive.
            </p>
            <ul className="mt-4 space-y-2">
              {getServiceBySlug("studio-rental")?.subServices.map((space) => (
                <li key={space} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check size={15} className="text-primary shrink-0 mt-0.5" />
                  {space}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-7 shadow-card">
            <div className="flex items-center gap-2.5 mb-3">
              <Clock size={18} className="text-primary" />
              <h2 className="font-serif-display text-xl">Booking — how you reserve it</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A request, not a payment. Send your slot and we come back to you — nothing is charged
              here.
            </p>
            <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <span className="text-primary font-semibold">1.</span> You send your date, time, and
                what you're shooting.
              </li>
              <li className="flex gap-2.5">
                <span className="text-primary font-semibold">2.</span> We reply with availability and
                a quote.
              </li>
              <li className="flex gap-2.5">
                <span className="text-primary font-semibold">3.</span> You confirm — your slot is
                held.
              </li>
            </ol>
            <a
              href={contactWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block text-sm text-primary hover:underline"
            >
              Prefer to talk it through? WhatsApp us →
            </a>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="py-20">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-xs tracking-widest-plus uppercase text-primary mb-4">
              Booking Request
            </p>
            <h2 className="font-serif-display text-3xl sm:text-4xl">Tell us about your session.</h2>
            <p className="mt-4 text-muted-foreground">
              Requests are answered in the order they arrive — usually within the same working day.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card border border-border rounded-2xl p-8 sm:p-10 shadow-card"
          >
            <div className="space-y-8">
              {/* MODE — the fork */}
              <fieldset className="space-y-3">
                <legend className={fieldLabel}>How will you use the studio?</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer gap-3 rounded-2xl border p-5 transition ${
                      mode === "space"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="studio-mode"
                      value="space"
                      checked={mode === "space"}
                      onChange={() => setValue("mode", "space", { shouldValidate: true })}
                      className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    />
                    <span>
                      <span className="flex items-center gap-2 font-medium">
                        <DoorOpen size={15} className="text-primary" />
                        Space only
                      </span>
                      <span className="mt-1.5 block text-sm text-muted-foreground leading-snug">
                        You bring your own crew and gear. We provide the room, the set, and a
                        technician on call.
                      </span>
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer gap-3 rounded-2xl border p-5 transition ${
                      mode === "crew"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="studio-mode"
                      value="crew"
                      checked={mode === "crew"}
                      onChange={() => setValue("mode", "crew", { shouldValidate: true })}
                      className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    />
                    <span>
                      <span className="flex items-center gap-2 font-medium">
                        <Video size={15} className="text-primary" />
                        With O Studio
                      </span>
                      <span className="mt-1.5 block text-sm text-muted-foreground leading-snug">
                        Bring the idea. Our crew and equipment shoot it, and we deliver the finished
                        files.
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* SLOT */}
              <div className="space-y-3">
                <p className={fieldLabel}>Your slot</p>
                <RoomPicker
                  options={studioOptions}
                  value={selectedStudio}
                  onChange={(next) => setValue("studio", next, { shouldValidate: true })}
                  error={errors.studio?.message}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="bookingDate">Date</Label>
                    <Input id="bookingDate" type="date" {...register("bookingDate")} />
                    {errors.bookingDate && (
                      <p className="text-xs text-destructive">{errors.bookingDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start time</Label>
                    <Input id="startTime" type="time" {...register("startTime")} />
                    {errors.startTime && (
                      <p className="text-xs text-destructive">{errors.startTime.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End time</Label>
                    <Input id="endTime" type="time" {...register("endTime")} />
                    {errors.endTime && (
                      <p className="text-xs text-destructive">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Times are West Africa Time (GMT+1).
                </p>

                <div className="space-y-2 max-w-[12rem]">
                  <Label htmlFor="partySize" className="flex items-center gap-1.5">
                    <Users size={13} className="text-primary" />
                    People attending
                  </Label>
                  <Input
                    id="partySize"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={999}
                    placeholder="2"
                    {...register("partySize")}
                  />
                  {errors.partySize && (
                    <p className="text-xs text-destructive">{errors.partySize.message}</p>
                  )}
                </div>
              </div>

              {/* PURPOSE */}
              <div className="space-y-2">
                <Label htmlFor="purpose">What are you recording?</Label>
                <Textarea
                  id="purpose"
                  rows={4}
                  placeholder="e.g. Four episodes of a finance podcast, two guests…"
                  {...register("purpose")}
                />
                {errors.purpose && (
                  <p className="text-xs text-destructive">{errors.purpose.message}</p>
                )}
              </div>

              {/* SPACE ONLY — conditional */}
              {mode === "space" && (
                <div className="space-y-6 rounded-2xl border border-border p-6">
                  <p className="text-xs tracking-widest-plus uppercase text-primary">
                    Space only — your setup
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="guestGear">
                      What are you bringing with you?
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        Optional
                      </span>
                    </Label>
                    <Textarea
                      id="guestGear"
                      rows={2}
                      placeholder="e.g. 2 cameras, 3 lights, 1 operator, backdrop stand…"
                      {...register("guestGear")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studioGear">
                      What do you need from us?
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        Optional
                      </span>
                    </Label>
                    <Textarea
                      id="studioGear"
                      rows={2}
                      placeholder="e.g. 2 microphones, C-stands, seamless backdrop, monitor…"
                      {...register("studioGear")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="needsTechnician">Do you need an O Studio technician on site?</Label>
                    <Select
                      value={watch("needsTechnician") || ""}
                      onValueChange={(next) =>
                        setValue("needsTechnician", next, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger id="needsTechnician" className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {TECHNICIAN_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loadIn">
                      Load-in, parking, or access notes
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                        Optional
                      </span>
                    </Label>
                    <Textarea
                      id="loadIn"
                      rows={2}
                      placeholder="e.g. Loading bay access from 8am, two vehicles…"
                      {...register("loadIn")}
                    />
                  </div>
                </div>
              )}

              {/* WITH O STUDIO — conditional */}
              {mode === "crew" && (
                <div className="space-y-6 rounded-2xl border border-border p-6">
                  <p className="text-xs tracking-widest-plus uppercase text-primary">
                    With O Studio — what we deliver
                  </p>

                  <div className="space-y-2">
                    <Label>What should we deliver?</Label>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {DELIVERABLE_OPTIONS.map((option) => {
                        const checked = deliverables.includes(option);
                        return (
                          <label
                            key={option}
                            className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition ${
                              checked
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/40"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleDeliverable(option)}
                              className="h-4 w-4 shrink-0 accent-primary"
                            />
                            {option}
                          </label>
                        );
                      })}
                    </div>
                    {errors.deliverables && (
                      <p className="text-xs text-destructive">{errors.deliverables.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usage">Where will the footage be used?</Label>
                    <Select
                      value={watch("usage") || ""}
                      onValueChange={(next) => setValue("usage", next, { shouldValidate: true })}
                    >
                      <SelectTrigger id="usage" className="w-full">
                        <SelectValue placeholder="Select where it will be used" />
                      </SelectTrigger>
                      <SelectContent>
                        {USAGE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.usage && (
                      <p className="text-xs text-destructive">{errors.usage.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="turnaround">How soon do you need it?</Label>
                    <Select
                      value={watch("turnaround") || ""}
                      onValueChange={(next) => setValue("turnaround", next, { shouldValidate: true })}
                    >
                      <SelectTrigger id="turnaround" className="w-full">
                        <SelectValue placeholder="Select a turnaround" />
                      </SelectTrigger>
                      <SelectContent>
                        {TURNAROUND_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.turnaround && (
                      <p className="text-xs text-destructive">{errors.turnaround.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* CONTACT */}
              <div className="space-y-6">
                <p className={fieldLabel}>Who should we confirm with?</p>
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input id="name" placeholder="Who should we confirm with?" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" placeholder="+234…" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                </div>
              </div>

              {/* NOTES */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Anything else we should know?{" "}
                  <span className="text-xs font-normal text-muted-foreground">Optional</span>
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  placeholder="Equipment, guest count, access needs…"
                  {...register("notes")}
                />
              </div>
            </div>

            {/* SEND ERROR — form data is kept so the guest can retry */}
            {sendError && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
              >
                <p>{sendError}</p>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground max-w-xs">
                No payment is taken now — we reply with availability and a quote first.
              </p>
              <Button type="submit" className="rounded-full px-8" disabled={sending}>
                {sending ? "Sending…" : "Send Booking Request"}
                {!sending && <ArrowRight className="ml-2" size={16} />}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default StudioRental;
