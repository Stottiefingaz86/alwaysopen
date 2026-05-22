import type { IconType } from "react-icons";
import {
  SiAirbnb,
  SiBookingdotcom,
  SiGmail,
  SiGooglecalendar,
  SiHubspot,
  SiTwilio,
  SiWhatsapp,
} from "react-icons/si";
import type { LucideIcon } from "lucide-react";
import { UtensilsCrossed } from "lucide-react";

export type IntegrationIcon =
  | { kind: "simple"; Icon: IconType }
  | { kind: "lucide"; Icon: LucideIcon }
  | { kind: "image"; src: string };

export type IntegrationItem = {
  id: string;
  icon: IntegrationIcon;
};

export type IntegrationCategory = {
  id: string;
  items: IntegrationItem[];
};

/** Flat list for the landing grid (deduped by id). */
export function getIntegrationItems(): IntegrationItem[] {
  const seen = new Set<string>();
  const items: IntegrationItem[] = [];
  for (const category of integrationCategories) {
    for (const item of category.items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      items.push(item);
    }
  }
  return items;
}

export const integrationCategories: IntegrationCategory[] = [
  {
    id: "restaurants",
    items: [
      { id: "coverManager", icon: { kind: "lucide", Icon: UtensilsCrossed } },
      { id: "openTable", icon: { kind: "image", src: "/integrations/opentable.svg" } },
      { id: "googleCalendar", icon: { kind: "simple", Icon: SiGooglecalendar } },
    ],
  },
  {
    id: "salonsBeauty",
    items: [
      { id: "timely", icon: { kind: "image", src: "/integrations/timely.svg" } },
      { id: "fresha", icon: { kind: "image", src: "/integrations/fresha.svg" } },
      { id: "treatwell", icon: { kind: "image", src: "/integrations/treatwell.svg" } },
    ],
  },
  {
    id: "propertyTourism",
    items: [
      { id: "airbnb", icon: { kind: "simple", Icon: SiAirbnb } },
      { id: "bookingCom", icon: { kind: "simple", Icon: SiBookingdotcom } },
    ],
  },
  {
    id: "communication",
    items: [
      { id: "twilio", icon: { kind: "simple", Icon: SiTwilio } },
      { id: "whatsapp", icon: { kind: "simple", Icon: SiWhatsapp } },
      { id: "gmail", icon: { kind: "simple", Icon: SiGmail } },
      { id: "zadarma", icon: { kind: "image", src: "/integrations/zadarma.svg" } },
    ],
  },
  {
    id: "businessTools",
    items: [
      { id: "googleCalendar", icon: { kind: "simple", Icon: SiGooglecalendar } },
      { id: "outlook", icon: { kind: "image", src: "/integrations/microsoftoutlook.svg" } },
      { id: "hubspot", icon: { kind: "simple", Icon: SiHubspot } },
    ],
  },
];
