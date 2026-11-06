import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PartyPopper } from "lucide-react";

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
import { submitStudioBooking } from "@/lib/bookings";

// ============================================================
// STUDIO RENTAL — booking request (stage 04 / stage 13 Phase C3)
//
// The one public form WhatsApp is deliberately not involved in:
// the request INSERTs straight into `studio_bookings` (status
// pending) and the O Studio Admin confirms or declines it from
// the Bookings screen. Studio options come from the site's own
// service data, so the form can never drift from the copy.
// ============================================================

const formSchema = z
  .object({
    studio: z.string().min(1, "Please select a studio space"),
    bookingDate: z.string().min(1, "Please choose a date"),
    startTime: z.string().min(1, "Please choose a start time"),
    endTime: z.string().min(1, "Please choose an end time"),
    purpose: z.string().min(5, "Please tell us what you'll be recording"),
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
  });

type FormValues = z.infer<typeof formSchema>;

// Studio options are the Studio Rental service's own sub-services.
const studioOptions =
  getServiceBySlug("studio-rental")?.subServices ?? [
    "Podcast/Content Rooms",
    "Photo Studio",
    "Film set, etc.",
  ];

const StudioRental = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  // Kept so the confirmation can address the guest by name after reset.
  const [guestName, setGuestName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      studio: "",
      bookingDate: "",
      startTime: "",
      endTime: "",
      purpose: "",
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

  const selectedStudio = watch("studio");

  const onSubmit = async (values: FormValues) => {
    setSending(true);
    setSendError(null);
    try {
      await submitStudioBooking({
        studio: values.studio,
        bookingDate: values.bookingDate,
        startTime: values.startTime,
        endTime: values.endTime,
        purpose: values.purpose,
        name: values.name,
        phone: values.phone,
        email: values.email,
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
      <div className="container py-28 max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <PartyPopper className="text-primary" size={28} />
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl mb-4">
          Your booking request is in.
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">
          Thanks{guestName ? `, ${guestName.split(" ")[0]}` : ""}. O Studio has your request and
          will confirm availability for that slot by email or phone shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link to="/services/studio-rental">Back to Studio Rental</Link>
          </Button>
          <Button asChild className="rounded-full px-8">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* HERO */}
      <section className="bg-hero-gradient py-24">
        <div className="container text-center max-w-3xl mx-auto">
          <p className="text-xs tracking-widest-plus uppercase text-primary mb-6">
            Studio Rental
          </p>
          <h1 className="font-serif-display text-4xl sm:text-6xl leading-tight">Book The Studio</h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Pick a space, a date, and a time window. O Studio confirms availability and takes it
            from there.
          </p>
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
            <div className="space-y-6">
              {/* Which space */}
              <div className="space-y-2">
                <Label htmlFor="studio">Which space do you need?</Label>
                <Select
                  value={selectedStudio}
                  onValueChange={(next) => setValue("studio", next, { shouldValidate: true })}
                >
                  <SelectTrigger id="studio" className="w-full" aria-label="Which space do you need?">
                    <SelectValue placeholder="Select a studio space" />
                  </SelectTrigger>
                  <SelectContent>
                    {studioOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.studio && (
                  <p className="text-xs text-destructive">{errors.studio.message}</p>
                )}
              </div>

              {/* Date + window */}
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
              <p className="text-xs text-muted-foreground -mt-2">
                Times are West Africa Time (GMT+1).
              </p>

              {/* Purpose */}
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

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" placeholder="Who should we confirm with?" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input id="phone" placeholder="+234…" {...register("phone")} />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Anything we should set up in advance?{" "}
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

            <div className="mt-10 flex justify-end">
              <Button type="submit" className="rounded-full px-8" disabled={sending}>
                {sending ? "Sending…" : "Request This Slot"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default StudioRental;
