import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { serviceCategories } from "@/data/services";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" aria-label="O Studio Innovations home">
              <img src="/logo-mark.png" alt="O Studio Innovations" className="h-16 w-auto object-contain" />
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
                <Mail size={15} className="text-primary shrink-0" /> hello@ostudio.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={15} className="text-primary shrink-0" /> +234 000 000 0000
              </li>
              <li className="flex items-center gap-3 pt-1">
                <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook size={18} />
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
