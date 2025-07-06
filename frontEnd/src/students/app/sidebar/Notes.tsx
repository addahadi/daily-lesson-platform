import noteApiController from "@/students/Api/note.Api";
import type notesProps from "@/students/lib/type";
import { renderMarkdown } from "@/students/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { X, FileText, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PAGE_SIZE = 4;
const Notes = () => {
  const { user } = useUser();
  const [notes, setNotes] = useState<notesProps[]>();
  const [selectedNote, setSelectedNote] = useState<notesProps | null>(null);
  const [noNotes, setNoNotes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      const result = await noteApiController().getAllNotes(user.id, page);

      if (result === null || result.length === 0) {
        if (page === 1) setNoNotes(true);
        setHasMore(false);
      } else {
        setHasMore(result.length === PAGE_SIZE);
        setNotes((prev) => [...(prev || []), ...result]);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, page]);

  const EmptyNotesState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-orange-50 rounded-full p-6 mb-6">
        <FileText className="w-12 h-12 text-orange-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        No notes yet
      </h2>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Start taking notes while learning to capture important insights and key
        concepts. Your notes will appear here for easy access.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Start Learning
        </Link>
        <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-medium transition-colors">
          <FileText className="w-5 h-5" />
          Learn About Notes
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="w-full mx-auto p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Notes</h1>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Notes</h1>

      {noNotes ? (
        <EmptyNotesState />
      ) : (
        notes && (
          <div className=" grid grid-cols-2">
            {notes.map((note, index) => {
              const isoDate = note.created_at;
              const normalDate = new Date(isoDate).toLocaleString();
              const truncatedContent = note.content.slice(0, 80) + "...";

              return (
                <div
                  key={index}
                  onClick={() => setSelectedNote(note)}
                  className="border bg-white border-gray-200 rounded-xl p-6 hover:border-orange-1 transition-colors cursor-pointer mb-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-medium text-gray-900">
                      {note.note_title}
                    </h2>
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/dashboard/course/${note.course_slug}/module/${note.topic_id}/lesson/${note.lesson_slug}`}
                        className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        {note.lesson_title}
                      </Link>
                      <span className="text-sm text-gray-400">
                        {normalDate}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete clicked");
                        }}
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
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
          </div>
        )
      )}

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
      {hasMore && (
        <button
          className="mt-4 px-4 py-2 bg-orange-1 text-white rounded"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Show More"}
        </button>
      )}
    </div>
  );
};

export default Notes;
