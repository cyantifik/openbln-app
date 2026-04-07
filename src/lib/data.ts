export interface Member {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar_url?: string;
  bio?: string;
  skills_offered: string[];
  skills_needed: string[];
  is_admin: boolean;
  achievements: string[];
  links?: Record<string, string>;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description?: string;
  location?: string;
  attendance_count: number;
  created_at?: string;
}

export const MEMBERS: Member[] = [
  {
    id: "1",
    name: "Vicky Heinlein",
    role: "Co-Founder",
    company: "OPEN BLN",
    bio: "Community builder and design strategist passionate about connecting creative professionals in Berlin.",
    skills_offered: [
      "Mentorship",
      "Community Building",
      "Event Design",
      "Brand Strategy",
      "Design Leadership",
      "Creative Direction",
      "Job Search Strategy",
      "Design Thinking",
      "Career Navigation",
      "Portfolio Review",
      "Personal Branding",
      "Workshop Design",
    ],
    skills_needed: ["Product Management", "Business Development"],
    is_admin: true,
    achievements: ["Founding Team", "Founding Member", "First Step", "Networker"],
    links: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "2",
    name: "Habib Rahal",
    role: "Head of Product Design",
    company: "Konvo",
    bio: "Product designer focused on creating intuitive user experiences.",
    skills_offered: ["Product Design", "Framer", "Design Systems", "User Research"],
    skills_needed: ["Engineering", "Business Strategy"],
    is_admin: true,
    achievements: ["Founding Team", "Founding Member"],
    links: {
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "3",
    name: "Lena Müller",
    role: "Product Designer",
    company: "Kreativ Studio",
    bio: "UX-focused designer with a passion for research-driven design.",
    skills_offered: ["Product Design", "UX Research", "Wireframing", "Prototyping"],
    skills_needed: ["Development", "Marketing"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "4",
    name: "Marco Rossi",
    role: "Backend Engineer",
    company: "DataFlow GmbH",
    bio: "Full-stack engineer specializing in cloud infrastructure.",
    skills_offered: ["Python", "DevOps", "AWS", "Database Design"],
    skills_needed: ["Frontend", "UI Design"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "5",
    name: "Sofia Petrov",
    role: "UX Researcher",
    company: "NeuroLab",
    bio: "Research-driven strategist exploring human behavior and product design.",
    skills_offered: ["UX Research", "Strategy", "User Testing", "Data Analysis"],
    skills_needed: ["Product Design", "Development"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "6",
    name: "Jonas Weber",
    role: "Founder",
    company: "GreenByte",
    bio: "Entrepreneur focused on sustainable technology solutions.",
    skills_offered: ["Strategy", "Sustainability", "Fundraising", "Leadership"],
    skills_needed: ["Engineering", "Sales"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "7",
    name: "Aisha Khan",
    role: "Data Scientist",
    company: "Analytiq",
    bio: "Data science specialist with expertise in machine learning applications.",
    skills_offered: ["Python", "Machine Learning", "Data Analysis", "Statistics"],
    skills_needed: ["Product Strategy", "Design"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "8",
    name: "Tomás Silva",
    role: "Illustrator",
    company: "Freelance",
    bio: "Creative illustrator specializing in digital and editorial work.",
    skills_offered: ["Illustration", "Art Direction", "Visual Storytelling"],
    skills_needed: ["Marketing", "Business"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "9",
    name: "Emi Tanaka",
    role: "DevOps Engineer",
    company: "CloudKraft",
    bio: "Infrastructure specialist focused on scalable cloud solutions.",
    skills_offered: ["DevOps", "TypeScript", "Kubernetes", "CI/CD"],
    skills_needed: ["Product Management", "Design"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "10",
    name: "Felix Braun",
    role: "Copywriter",
    company: "Wortwerk",
    bio: "Content strategist and copywriter crafting compelling brand narratives.",
    skills_offered: ["Copywriting", "Content Strategy", "Brand Voice", "Editing"],
    skills_needed: ["Design", "Development"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "11",
    name: "Clara Dupont",
    role: "Frontend Developer",
    company: "PixelShift",
    bio: "React specialist building beautiful and functional web interfaces.",
    skills_offered: ["React", "TypeScript", "CSS", "Web Design"],
    skills_needed: ["Backend", "Product Strategy"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "12",
    name: "Nikolai Orlov",
    role: "Photographer",
    company: "Freelance",
    bio: "Professional photographer specializing in commercial and editorial work.",
    skills_offered: ["Photography", "Photo Editing", "Visual Curation"],
    skills_needed: ["Marketing", "Web Design"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "13",
    name: "Priya Sharma",
    role: "Product Manager",
    company: "LaunchPad",
    bio: "Product-focused leader with experience in scaling startups.",
    skills_offered: ["Product Design", "Strategy", "Leadership", "Analytics"],
    skills_needed: ["Engineering", "Sales"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "14",
    name: "Kai Zimmermann",
    role: "Sound Designer",
    company: "AudioSphere",
    bio: "Creative audio professional crafting immersive sonic experiences.",
    skills_offered: ["Sound Design", "Audio Production", "Music Production"],
    skills_needed: ["Video", "Web Design"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "15",
    name: "Yuki Abe",
    role: "Strategist",
    company: "BrandForge",
    bio: "Brand strategist and community builder connecting creative minds.",
    skills_offered: ["Strategy", "Community", "Brand Building", "Research"],
    skills_needed: ["Design", "Development"],
    is_admin: false,
    achievements: [],
  },
  {
    id: "16",
    name: "Omar Bensaïd",
    role: "Mobile Developer",
    company: "AppWerk",
    bio: "Full-stack mobile developer specializing in React Native and Flutter.",
    skills_offered: ["React", "Flutter", "Mobile Development", "TypeScript"],
    skills_needed: ["Product Design", "Strategy"],
    is_admin: false,
    achievements: [],
  },
];

export const EVENTS: Event[] = [
  {
    id: "1",
    title: "OPEN BLN #001: Meet & Shape",
    date: "2025-02-17",
    description: "The inaugural gathering. Mentors, mentees, builders, learners, and dreamers under one roof.",
    location: "The Castle Berlin, Mitte",
    attendance_count: 0,
  },
  {
    id: "2",
    title: "OPEN BLN #002: Shape & Align",
    date: "2025-03-11",
    description: "Growing into purpose. Returning members, new faces, and fellow community builders.",
    location: "Berlin, Mitte",
    attendance_count: 0,
  },
];

// Static data fallback functions
export function getMemberById(id: string): Member | undefined {
  return MEMBERS.find((m) => m.id === id);
}

export function searchMembers(query: string): Member[] {
  const lowerQuery = query.toLowerCase();
  return MEMBERS.filter((member) => {
    const nameMatch = member.name.toLowerCase().includes(lowerQuery);
    const skillMatch = member.skills_offered.some((skill) =>
      skill.toLowerCase().includes(lowerQuery)
    );
    return nameMatch || skillMatch;
  });
}

export function getUpcomingEvents(): Event[] {
  const today = new Date();
  return EVENTS.filter((event) => new Date(event.date) >= today).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getNewMembers(limit: number = 5): Member[] {
  return MEMBERS.slice(-limit).reverse();
}

// Async Supabase functions with fallback to static data
import { supabase } from "./supabase";

export async function getMembers(): Promise<Member[]> {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || MEMBERS;
  } catch (error) {
    console.error("Error fetching members from Supabase:", error);
    return MEMBERS;
  }
}

export async function getMember(id: string): Promise<Member | undefined> {
  try {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data || undefined;
  } catch (error) {
    console.error("Error fetching member from Supabase:", error);
    return getMemberById(id);
  }
}

export async function searchMembersDB(query: string): Promise<Member[]> {
  try {
    const lowerQuery = query.toLowerCase();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("status", "approved")
      .or(
        `name.ilike.%${lowerQuery}%,role.ilike.%${lowerQuery}%,company.ilike.%${lowerQuery}%`
      );

    if (error) throw error;
    return data || searchMembers(query);
  } catch (error) {
    console.error("Error searching members in Supabase:", error);
    return searchMembers(query);
  }
}

export async function getEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;
    return data || EVENTS;
  } catch (error) {
    console.error("Error fetching events from Supabase:", error);
    return EVENTS;
  }
}

export async function getUpcomingEventsDB(): Promise<Event[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", today)
      .order("date", { ascending: true });

    if (error) throw error;
    return data || getUpcomingEvents();
  } catch (error) {
    console.error("Error fetching upcoming events from Supabase:", error);
    return getUpcomingEvents();
  }
}

export async function getPastEvents(): Promise<Event[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .lt("date", today)
      .order("date", { ascending: false });

    if (error) throw error;
    return data || EVENTS.filter((event) => new Date(event.date) < new Date());
  } catch (error) {
    console.error("Error fetching past events from Supabase:", error);
    return EVENTS.filter((event) => new Date(event.date) < new Date());
  }
}
