import { Logo } from "@/components/landing/logo";
import { BOOK_MEETING_MAILTO } from "@/lib/contact";

const links = [
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#news", label: "News" },
  { href: "#phone-receptionist", label: "Phone line" },
  { href: "#about", label: "About" },
  { href: "#news", label: "News" },
  { href: BOOK_MEETING_MAILTO, label: "Book Meeting" },
  { href: "#", label: "Privacy" },
  { href: "#", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-google-gray-200 bg-google-gray-50">
      <div className="gradient-brand h-1 w-full" />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-google-gray-500">
              AlwaysOpen answers your business phone line with AI and helps you
              capture more bookings, plus monthly customer feedback reports (VoC) with
              clear actions and a Google Business plan.
            </p>
            <p className="mt-3 text-sm text-google-gray-500">
              Based in Manilva, La Chullera, Spain · English &amp; Spanish · clients worldwide
            </p>
          </div>
          <nav>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-google-gray-700 transition-colors hover:text-google-blue"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-google-gray-200 pt-8 text-sm text-google-gray-500 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} AlwaysOpen. All rights reserved.</p>
          <p>Helping local businesses get more customers.</p>
        </div>
      </div>
    </footer>
  );
}
