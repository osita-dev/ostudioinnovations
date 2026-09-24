import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, Youtube } from "lucide-react";
import { FaMapMarkerAlt, FaTiktok, FaWhatsapp } from 'react-icons/fa'
import { serviceCategories } from "@/data/services";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" aria-label="O Studio Innovations home">
              <img src="/OstudioInnovation.svg" alt="O Studio Innovations" className="h-16 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Creative. Digital. Production.
              <br />
              Where creativity meets innovation.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-widest-plus uppercase text-primary mb-4">Services</h4>
            <ul className="space-y-2.5">
              {serviceCategories.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {s.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest-plus uppercase text-primary mb-4">Explore</h4>
            <ul className="space-y-2.5">
              <li><Link to="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">Portfolio</Link></li>
              <li><Link to="/discover" className="text-sm text-muted-foreground hover:text-primary transition-colors">Project Discovery</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About O Studio</Link></li>
              <li><Link to="/journal" className="text-sm text-muted-foreground hover:text-primary transition-colors">Journal</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest-plus uppercase text-primary mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={15} className="text-primary shrink-0" /> info@ostudioinnovations.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={15} className="text-primary shrink-0" /> +234 704 225 1787
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <FaMapMarkerAlt size={15} className="text-primary shrink-0" /> 174 Ikorodu Rd, Somolu, Lagos 102216, Lagos
              </li>
              <li className="flex items-center gap-3 pt-1">
                <a href="https://www.youtube.com/@ostudioinnovations" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube size={18} />
                </a>
                <a href="https://www.tiktok.com/@ostudioinnovations?_r=1&_t=ZN-98zmnqYiFks" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaTiktok size={18} />
                </a>
                <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaWhatsapp size={18} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-line my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} O Studio Innovations. All rights reserved.</p>
          <p className="tracking-widest-plus uppercase">Where Creativity Meets Innovation</p>
        </div>
      </div>
    </footer>
  );
}
