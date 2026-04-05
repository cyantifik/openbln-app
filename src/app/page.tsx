import MemberCard from "@/components/MemberCard";
import { getUpcomingEventsDB, getMembers, MEMBERS, getUpcomingEvents } from "@/lib/data";
import Link from "next/link";
import type { Member } from "@/lib/data";

async function getNewMembers(limit: number = 6): Promise<Member[]> {
  try {
    const members = await getMembers();
    return members.slice(-limit).reverse();
  } catch (error) {
    return MEMBERS.slice(-limit).reverse();
  }
}

export default async function Home() {
  let upcomingEvents;
  let newMembers;

  try {
    upcomingEvents = await getUpcomingEventsDB();
  } catch (error) {
    upcomingEvents = getUpcomingEvents();
  }

  try {
    newMembers = await getNewMembers(6);
  } catch (error) {
    newMembers = MEMBERS.slice(-6).reverse();
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      {/* Hero */}
      <div className="mb-20">
        <h1 className="text-5xl font-bold mb-6">Welcome to OPEN BLN</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          A community platform for designers, developers, and creative
          professionals in Berlin. Connect, collaborate, and grow together.
        </p>
      </div>

      {/* Upcoming Events */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <Link href="/events" className="text-sm text-gray-600 hover:text-black">
            View all →
          </Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card">
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>{event.attendance_count} attended</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center text-gray-500">
            <p>No upcoming events at the moment. Check back soon!</p>
          </div>
        )}
      </section>

      {/* New Members */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">New Members</h2>
          <Link
            href="/community"
            className="text-sm text-gray-600 hover:text-black"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}
