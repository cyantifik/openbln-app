export interface SessionEvent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  date: string;
  venue: string;
  summary: string;
  sections: SessionSection[];
  photos?: string[];
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
    photos: [
      "/events/001-meet-and-shape/photo-1.jpg",
      "/events/001-meet-and-shape/photo-2.jpg",
      "/events/001-meet-and-shape/photo-3.jpg",
      "/events/001-meet-and-shape/photo-4.jpg",
      "/events/001-meet-and-shape/photo-5.jpg",
      "/events/001-meet-and-shape/photo-6.jpg",
    ],
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
    id: "lab-01",
    number: "Lab.01",
    title: "Between the Lines",
    subtitle: "Lab Session",
    date: "February 22, 2026",
    venue: "Coffee Circle Wedding, Lindower Strasse 18, Berlin",
    summary:
      "The first lab. An open working session to go through, document, digitize, and process everything shared at #001. All the input from Meet and Shape was laid out and ready. No fixed agenda — just us unpacking what was shared and preparing for #002: Shape & Align.",
    photos: [
      "/events/lab-01/photo-1.jpg",
      "/events/lab-01/photo-2.jpg",
      "/events/lab-01/photo-3.jpg",
    ],
    sections: [
      {
        title: "What Happened",
        type: "text",
        content:
          "We opened the lab for the first time. The afternoon was spent going through every sticky note, every piece of input from the first event, documenting and digitizing it all. An invite-only, private session for those who wanted to go deep.",
      },
      {
        title: "Format",
        type: "tags",
        items: [
          "Private session",
          "Invite only",
          "Open working session",
          "Afternoon format",
        ],
      },
    ],
  },
  {
    id: "lab-02",
    number: "Lab.02",
    title: "Between the Lines",
    subtitle: "Lab Session",
    date: "March 7, 2026",
    venue: "Coffee Circle Wedding, Lindower Strasse 18, Berlin",
    summary:
      "The second lab. We brainstormed and designed the flow for #002: Shape & Align. With findings from #001 and all the new input from signups ready to go, we designed activities and exercises to help us match accountability partners, set a community intention, and process everything gathered from new attendees. Then we took a hike to visit our potential new venue.",
    photos: [
      "/events/lab-02/photo-1.jpg",
      "/events/lab-02/photo-2.jpg",
      "/events/lab-02/photo-3.jpg",
      "/events/lab-02/photo-4.jpg",
      "/events/lab-02/photo-5.jpg",
    ],
    sections: [
      {
        title: "What Happened",
        type: "text",
        content:
          "Two parts, one fun afternoon. First, we gathered at the cafe to brainstorm and design the flow for Session 002. We worked through findings from #001, processed input from new signups, and designed the exercises for accountability group matching and community intention-setting. After that, we took a little hike to visit a potential new venue for the next event.",
      },
      {
        title: "Format",
        type: "tags",
        items: [
          "Private session",
          "Invite only",
          "Brainstorm + design",
          "Venue scouting",
          "Afternoon format",
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
    photos: [
      "/events/002-shape-and-align/photo-1.jpg",
      "/events/002-shape-and-align/photo-2.jpg",
      "/events/002-shape-and-align/photo-3.jpg",
      "/events/002-shape-and-align/photo-4.jpg",
      "/events/002-shape-and-align/photo-5.jpg",
      "/events/002-shape-and-align/photo-6.jpg",
    ],
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
        title: "Align (18:30 to 20:00)",
        type: "agenda",
        agendaItems: [
          {
            time: "18:30",
            title: "Arrive and settle in",
            description: "Grab a drink, find your spot, say hello to someone you haven't met yet.",
          },
          {
            time: "19:00",
            title: "Welcome back and recap",
            description: "Vicky opens the evening. A brief look at where we've been and where we're heading.",
          },
          {
            time: "19:15",
            title: "Group exercise: One Real Thing, One Real Offer",
            description: "Find your group. Each person shares one real thing they're working through and one real offer they can make to someone in the room.",
          },
          {
            time: "20:00",
            title: "Break",
            description: "Stretch, grab a drink, breathe.",
          },
        ],
      },
      {
        title: "Emerge (20:20 to 21:30)",
        type: "agenda",
        agendaItems: [
          {
            time: "20:20",
            title: "Group share-back (offers)",
            description: "Each group reads their offers aloud to the room. A first look at what we've been building for the community.",
          },
          {
            time: "20:35",
            title: "Platform wishlist",
            description: "Groups ideate on what they want the platform to do for them. Sticky notes, open thinking.",
          },
          {
            time: "20:55",
            title: "Wishlist share-back",
            description: "Each group shares their top wishlist item with the room.",
          },
          {
            time: "21:05",
            title: "Closing circle and social",
            description: "One sentence each, then social.",
          },
        ],
      },
    ],
  },
];

export function getSessionById(id: string): SessionEvent | undefined {
  return SESSIONS.find((s) => s.id === id);
}
