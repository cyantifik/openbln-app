import Link from "next/link";
import { Member } from "@/lib/data";

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
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

        {/* Name and Role */}
        <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{member.role}</p>

        {/* Company */}
        {member.company && (
          <p className="text-sm text-gray-500 mb-4">{member.company}</p>
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
