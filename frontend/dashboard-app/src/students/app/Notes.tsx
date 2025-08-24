import type { notesProps } from "@/Shared/lib/type";
import { renderMarkdown } from "@/Shared/lib/utils";
import {
  X,
  FileText,
  PlusCircle,
  Calendar,
  BookOpen,
  Trash2,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useNoteApi from "@/students/Api/note.Api";
import { toast, Toaster } from "sonner";
import LoadingSpinner from "@/Shared/components/ui/loading";
import { Button } from "@/Shared/components/ui/button";

const Notes = () => {
  const [notes, setNotes] = useState<notesProps[]>();
  const [selectedNote, setSelectedNote] = useState<notesProps | null>(null);
  const [noNotes, setNoNotes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(false);
  const { getAllNotes, deleteNote } = useNoteApi();
  const [isDeleteState, setIsDeleteState] = useState(false);
  const [showMoreLoading, setShowMoreLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const result = await getAllNotes(1);
      if (result === null) {
        setNoNotes(true);
        setHasMore(false);
        setLoading(false);
        return;
      }
      setNotes(result.data);
      setHasMore(result.final as boolean);
      setPage((prev) => prev + 1);
      setLoading(false);
    };
    fetchNotes();
  }, []);
  const showMore = async () => {
    setShowMoreLoading(true);
    const result = await getAllNotes(page);
    if (result) {
      setHasMore(result.final as boolean);
      setNotes((prev) => [...(prev || []), ...(result.data as notesProps[])]);
      setPage((prev) => prev + 1);
    }
    setShowMoreLoading(false);
  };

  const handleDelete = async (lesson_slug: string) => {
    setIsDeleteState(true);
    const message = await deleteNote(lesson_slug);
    if (message) {
      toast.success(message);
      setNotes((prev) => {
        return prev?.filter((note) => note.lesson_slug !== lesson_slug);
      });
    }
    setIsDeleteState(false);
  };

  useEffect(() => {
    if (notes && notes.length === 0) {
      setNoNotes(true);
    }
  }, [notes]);
  const EmptyNotesState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-orange-50 dark:bg-gray-800 rounded-full p-6 mb-6">
          <FileText className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          No notes yet
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-md">
          Start taking notes while learning to capture important insights and
          key concepts. Your notes will appear here for easy access.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Start Learning
          </Link>
          <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
            <FileText className="w-5 h-5" />
            Learn About Notes
          </button>
        </div>
      </div>
    );
  };

  if (loading && page === 1) {
    return (
      <div className=" flex justify-center items-center h-screen">
        <LoadingSpinner color="orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-3">
          Notes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Your learning insights and key takeaways
        </p>
        {notes && notes.length > 0 && (
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>
              {notes.length} note{notes.length !== 1 ? "s" : ""} collected
            </span>
          </div>
        )}
      </div>

      {noNotes ? (
        <EmptyNotesState />
      ) : (
        notes && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {notes.map((note: notesProps, index) => {
              const isoDate = note.created_at;
              const normalDate = new Date(isoDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const timeAgo = new Date(isoDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const truncatedContent = note.content.slice(0, 120) + "...";

              return (
                <div
                  key={index}
                  className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-6 cursor-pointer overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                          {note.note_title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{normalDate}</span>
                          </div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span>{timeAgo}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNote(note);
                          }}
                          className="p-2 text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-200"
                          aria-label="View note"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(note.lesson_slug);
                          }}
                          disabled={isDeleteState}
                          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                          aria-label="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lesson Link */}
                    <Link
                      to={`/dashboard/course/${note.course_slug}/module/${note.topic_id}/lesson/${note.lesson_slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-xl text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors duration-200 mb-4 group/link"
                    >
                      <BookOpen className="w-4 h-4 group-hover/link:scale-110 transition-transform duration-200" />
                      <span className="truncate max-w-48">
                        {note.lesson_title}
                      </span>
                    </Link>

                    <div
                      onClick={() => setSelectedNote(note)}
                      className="cursor-pointer"
                    >
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm line-clamp-4">
                        {truncatedContent}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/20 dark:border-gray-700/50 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50/50 to-pink-50/50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/40 dark:to-pink-900/40 rounded-2xl">
                  <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Note Details
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Created{" "}
                    {new Date(selectedNote.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all duration-200 hover:scale-110 transform"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col p-8 flex-1 min-h-0">
              <div className="mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4 break-words leading-tight">
                  {selectedNote.note_title || "Untitled Note"}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-xl">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">
                      {selectedNote.lesson_title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-xl">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(selectedNote.created_at).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div
                  className="prose prose-gray dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-orange-600 dark:prose-a:text-orange-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100"
                  dangerouslySetInnerHTML={{
                    __html: selectedNote.content
                      ? renderMarkdown(selectedNote.content)
                      : '<p class="text-gray-500 dark:text-gray-400 italic text-center py-8">No content yet...</p>',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-16">
          <Button
            variant="destructive"
            className=" bg-orange-500 hover:bg-orange-600"
            onClick={showMore}
            disabled={showMoreLoading}
          >
            {showMoreLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                <span>Loading more notes...</span>
              </>
            ) : (
              <>
                <span>Load More Notes</span>
              </>
            )}
          </Button>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Notes;
