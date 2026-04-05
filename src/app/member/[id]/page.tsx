import { getMember } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberProfile({ params }: MemberPageProps) {
  const { id } = await params;
  const member = await getMember(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link href="/community" className="text-sm text-gray-600 hover:text-black mb-8 inline-block">
        ← Back to Community
      </Link>

      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold">{member.name}</h1>
              {member.is_admin && (
                <span className="px-3 py-1 text-sm font-semibold bg-black text-white rounded">
                  Admin
                </span>
              )}
            </div>

            <p className="text-xl text-gray-600 mb-2">{member.role}</p>
            <p className="text-gray-500">{member.company}</p>
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <p className="text-gray-700 leading-relaxed max-w-2xl">{member.bio}</p>
        )}
      </div>

      {/* Achievements */}
      {member.achievements && member.achievements.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {member.achievements.map((achievement) => (
              <span
                key={achievement}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills Offered */}
      {member.skills_offered && member.skills_offered.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Skills Offered</h2>
          <div className="flex flex-wrap gap-3">
            {member.skills_offered.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Skills Needed */}
      {member.skills_needed && member.skills_needed.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Skills Needed</h2>
          <div className="flex flex-wrap gap-3">
            {member.skills_needed.map((skill) => (
              <span
                key={skill}
                className="inline-block px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded-full border border-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {member.links && Object.keys(member.links).length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Links</h2>
          <div className="space-y-3">
            {Object.entries(member.links).map(([key, value]) => (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-black"
              >
                <span className="capitalize font-medium">{key}</span>
                <span className="text-gray-400">→</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
