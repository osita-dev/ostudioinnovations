/**
 * Footer — the end credits: a huge "Let's make something." door into the
 * brief, then the services/explore/contact columns with gold icons only,
 * a gold hairline above a copyright bar, and Back to top riding Lenis.
 */
import { Link } from "react-router-dom";
import { ArrowUp, Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import { FaMapMarkerAlt, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { serviceCategories } from "@/data/services";
import {
  contactAddress,
  contactEmail,
  contactPhone,
  socialLinks,
} from "@/data/contact";
import { useCinema } from "@/cinema/core/CinemaProvider";
import { useLenis } from "@/cinema/core/SmoothScroll";

const exploreLinks = [
  { label: "Services", to: "/services" },
  { label: "Discover", to: "/discover" },
  { label: "Journal", to: "/journal" },
  { label: "FAQ", to: "/faq" },
  { label: "Careers", to: "/careers" },
];

export function Footer() {
  const lenisRef = useLenis();
  const { reducedMotion } = useCinema();

  const backToTop = () => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  };

  return (
    <footer className="border-t border-border bg-brand-black">
      <div className="container py-20">
        {/* The credit line */}
        <Link
          to="/start-project"
          className="group inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground transition-opacity group-hover:opacity-70 sm:text-6xl lg:text-7xl">
            Let&apos;s make something.
          </h2>
        </Link>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest-plus text-foreground/60">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceCategories.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {s.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest-plus text-foreground/60">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest-plus text-foreground/60">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-foreground/60">
                <Mail size={15} className="icon-gold shrink-0" aria-hidden="true" />
                {contactEmail}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-foreground/60">
                <Phone size={15} className="icon-gold shrink-0" aria-hidden="true" />
                {contactPhone}
              </li>
              <li className="flex items-start gap-2.5 text-sm text-foreground/60">
                <FaMapMarkerAlt
                  size={15}
                  className="icon-gold mt-1 shrink-0"
                  aria-hidden="true"
                />
                {contactAddress}
              </li>
              <li className="flex items-center gap-4 pt-1">
                <a
                  href={socialLinks.youtube}
                  aria-label="YouTube"
                  className="icon-gold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Youtube size={18} />
                </a>
                <a
                  href={socialLinks.tiktok}
                  aria-label="TikTok"
                  className="icon-gold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FaTiktok size={18} />
                </a>
                <a
                  href={socialLinks.instagram}
                  aria-label="Instagram"
                  className="icon-gold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={socialLinks.facebook}
                  aria-label="Facebook"
                  className="icon-gold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={socialLinks.whatsapp}
                  aria-label="WhatsApp"
                  className="icon-gold transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FaWhatsapp size={18} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex justify-end">
          <button
            type="button"
            onClick={backToTop}
            className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-widest-plus text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowUp size={14} aria-hidden="true" />
            Back to top
          </button>
        </div>

        <div className="hairline-gold mt-10" />

        <div className="mt-6 flex justify-center">
          <p className="text-xs text-foreground/60">
            &copy; {new Date().getFullYear()} O Studio Innovations. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
