export interface ArchivedEvent {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  description: string[];
  highlights?: string[];
  lumaUrl?: string;
}

export const EVENT_ARCHIVE: ArchivedEvent[] = [
  {
    slug: "001-meet-and-shape",
    number: "001",
    title: "Meet & Shape",
    subtitle: "The inaugural gathering",
    date: "February 17, 2025",
    time: "6:30 PM – 9:30 PM",
    location: "The Castle Berlin, Mitte",
    description: [
      "The very first OPEN BLN gathering brought together mentors, mentees, builders, learners, and dreamers under one roof.",
      "Through a guided exercise, participants discovered each other's paths, set intentions for the community, and began co-shaping what OPEN BLN would become.",
      "It was an evening of meaningful conversations and intentional connection — the first brushstroke on what was, until then, a blank canvas.",
    ],
    highlights: [
      "First official OPEN BLN event",
      "Guided intention-setting exercise",
      "Intimate gathering of founding members",
    ],
    lumaUrl: "https://lu.ma/piwxfxqb",
  },
  {
    slug: "002-shape-and-align",
    number: "002",
    title: "Shape & Align",
    subtitle: "Growing into purpose",
    date: "March 11, 2025",
    time: "6:30 PM – 9:30 PM",
    location: "Berlin, Mitte",
    description: [
      "Event 002 arrived just days after OPEN BLN's first anniversary on International Women's Day. We hit capacity and secured a bigger space. The waitlist was open, and more were welcome.",
      "The room was filled with returning members, new faces, and fellow community builders. It was an honor — and a little nerve-wracking. But what can go wrong when the intention is real?",
      "A day to honor our purpose and our calling. Regardless of disciplines, we stepped in together, embraced the unknown, and shaped the future one step at a time.",
    ],
    highlights: [
      "Hit full capacity",
      "Upgraded to a larger venue",
      "Returning members and new faces together",
    ],
  },
];

export function getEventBySlug(slug: string): ArchivedEvent | undefined {
  return EVENT_ARCHIVE.find((e) => e.slug === slug);
}
