import Link from "next/link";
import { Member } from "@/lib/data";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link href={`/member/${member.id}`}>
      <div className="card hover:border-gray-400 cursor-pointer transition-colors h-full flex flex-col">
        {/* Admin Badge */}
        {member.is_admin && (
          <div className="mb-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-black text-white rounded">
              Admin
            </span>
          </div>
        )}

        {/* Avatar and Header */}
        <div className="flex items-start gap-4 mb-4">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
              {getInitials(member.name)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        </div>

        {/* Company */}
        {member.company && (
          <p className="text-sm text-gray-500 mb-4 ml-16">{member.company}</p>
        )}

        {/* Skills */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {member.skills_offered.slice(0, 3).map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
            {member.skills_offered.length > 3 && (
              <span className="text-xs text-gray-500 self-center">
                +{member.skills_offered.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
