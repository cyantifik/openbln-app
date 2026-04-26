export interface SessionEvent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  venue: string;
  summary: string;
  sections: SessionSection[];
}

export interface SessionSection {
  title: string;
  type: "text" | "list" | "tags" | "agenda" | "groups";
  content?: string;
  items?: string[];
  agendaItems?: AgendaItem[];
}

export interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

export const SESSIONS: SessionEvent[] = [
  {
    id: "001",
    number: "001",
    title: "Meet and Shape",
    subtitle: "Session 001",
    date: "February 17, 2026",
    venue: "The Castle Berlin, Backroom",
    summary:
      "Our first gathering. 25 seats turned into 60+ signups with a 32-person waitlist. Luma featured us as a February Berlin highlight. The backroom at The Castle was full of sticky notes, pool tables, and people who showed up fully. We shared, we listened, we shaped something new together.",
    sections: [
      {
        title: "The 4Ls Exercise",
        type: "text",
        content:
          "We used the 4Ls framework (Loved, Lacked, Learned, Longed For) in two rounds. First, each person shared their personal 4Ls: what they have loved, lacked, learned, and longed for in their life. Then we applied the same framework to our experiences with communities in Berlin. Every sticky note went on the pool table. No judgment, no conclusions. We listened, we took it all in.",
      },
      {
        title: "What Emerged",
        type: "list",
        items: [
          "The room was filled with openness and vulnerability, and that is exactly what made it special",
          "No conclusions were drawn. This was an introduction with intention and purposeful collaboration on an open horizon",
          "All input was collected, digitized, and organized to serve as the foundation for Session 002",
        ],
      },
      {
        title: "Keywords That Captured the Room",
        type: "tags",
        items: [
          "Belonging",
          "Openness",
          "Vulnerability",
          "Mentorship",
          "Connection",
          "Intention",
          "Canvas",
        ],
      },
    ],
  },
  {
    id: "002",
    number: "002",
    title: "Shape and Align",
    subtitle: "Session 002",
    date: "March 11, 2026",
    venue: "Benne Berlin",
    summary:
      "We went deeper. 60+ signups. Featured by FOMO Berlin (we didn't see that coming). Benne Berlin generously hosted us during peak hours. We formed accountability groups, set intentions for our community, and made sure every voice was heard in under three hours. What's forming is a genuine sense of belonging.",
    sections: [
      {
        title: "Accountability Groups",
        type: "text",
        content:
          "Five groups were formed based on what people shared about their goals, their reasons for being part of OPEN BLN, and what they're working toward. These groups are designed to carry the community's work forward between events. Each group carries a theme shaped entirely by what the people in the room said they needed most.",
      },
      {
        title: "Community Intentions",
        type: "list",
        items: [
          "To belong",
          "To connect",
          "To make other people grow",
          "To share knowledge freely",
          "To find what creative work really means",
          "To be open, curious, and supportive",
          "To build community, together",
        ],
      },
      {
        title: "Top Themes",
        type: "tags",
        items: [
          "Belonging",
          "Accountability",
          "Growth",
          "Knowledge sharing",
          "Collaboration",
          "Integrity",
        ],
      },
    ],
  },
  {
    id: "003",
    number: "003",
    title: "Align and Emerge",
    subtitle: "Session 003",
    date: "April 28, 2026",
    venue: "Spreegold Prenzlauer Berg, Berlin",
    summary:
      "Tonight is about emergence: what happens when we stop performing and start building together. No paper, no projections. Everything lives here.",
    sections: [
      {
        title: "Tonight's Flow",
        type: "agenda",
        agendaItems: [
          {
            time: "18:30",
            title: "Arrival and Welcome",
            description: "Grab a drink, settle in, say hello to someone you haven't met yet.",
          },
          {
            time: "19:00",
            title: "Opening Reflection",
            description: "Vicky opens the evening. A brief look at where we've been and where we're heading.",
          },
          {
            time: "19:15",
            title: "Group Time",
            description: "Find your group. Your group assignment and tonight's prompt are below.",
          },
          {
            time: "19:55",
            title: "Platform Reveal",
            description: "A first look at what we've been building for the community.",
          },
          {
            time: "20:15",
            title: "Cross-Group Mingling",
            description: "Move freely. Share what your group discussed. Connect across groups.",
          },
          {
            time: "20:45",
            title: "Closing Circle",
            description: "One word, one sentence, one intention. We close the night together.",
          },
        ],
      },
    ],
  },
];

export function getSessionById(id: string): SessionEvent | undefined {
  return SESSIONS.find((s) => s.id === id);
}
