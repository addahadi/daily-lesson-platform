import noteApiController from "@/Api/note.Api"
import type notesProps from "@/lib/type"
import { renderMarkdown } from "@/lib/utils"
import { useUser } from "@clerk/clerk-react"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Notes = () => {
  const { user } = useUser();
  const [notes, setNotes] = useState<notesProps[]>();
  const [selectedNote, setSelectedNote] = useState<notesProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const result = await noteApiController().getAllNotes(user.id);
      console.log(result)
      setNotes(result);
    };
    fetchData();
  }, [user]);

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Notes</h1>
      {notes &&
        notes.map((note , index) => {
          const isoDate = note.created_at;
          const normalDate = new Date(isoDate).toLocaleString();
          const truncatedContent = note.content.slice(0, 80) + "...";

          return (
            <div
              key={index}
              onClick={() => setSelectedNote(note)}
              className="border bg-white border-gray-200 rounded-xl p-6 hover:border-orange-1 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-medium text-gray-900">
                  {note.note_title}
                </h2>
                <div className="flex items-center gap-4">
                  <Link
                    to={`/dashboard/course/${note.course_slug}/module/${note.topic_id}/lesson/${note.lesson_slug}`}
                    className="text-sm text-gray-500"
                  >
                    {note.lesson_title}
                  </Link>
                  <span className="text-sm text-gray-400">{normalDate}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete clicked");
                    }}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {truncatedContent}
              </p>
            </div>
          );
        })}

      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-black-1">Note</h1>
              <button
                onClick={() => setSelectedNote(null)} // ✅ Close
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="h-full flex flex-col p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedNote.note_title || "Untitled Note"}
                </h1>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div
                  className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedNote.content
                      ? renderMarkdown(selectedNote.content)
                      : '<p class="text-gray-500 italic">No content yet...</p>',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Notes