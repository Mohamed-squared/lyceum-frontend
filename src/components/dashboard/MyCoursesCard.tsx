"use client";

interface Course {
  id: string;
  title: string;
  visibility: string;
}

interface MyCoursesCardProps {
  title: string;
  courses: Course[];
}

export default function MyCoursesCard({ title, courses }: MyCoursesCardProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-200 mb-3">{title}</h3>
      {courses.length > 0 ? (
        <ul className="space-y-2">
          {courses.map((course) => (
            <li key={course.id} className="bg-slate-700/50 p-3 rounded-md flex justify-between items-center">
              <span className="font-medium text-slate-300">{course.title}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                course.visibility === 'public'
                ? 'bg-sky-200 text-sky-800'
                : 'bg-slate-500 text-slate-100'
              }`}>
                {course.visibility}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm">You haven't created any courses yet. Click "Create New Course" to get started!</p>
      )}
    </div>
  );
}
