import useNoteApi from "@/students/Api/note.Api";
import { Button } from "@/Shared/components/ui/button";
import { renderMarkdown } from "@/Shared/lib/utils";
import { Edit2, Edit3, Eye, Move, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const LessonNote = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState(false);
  const { lessonId } = useParams();
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const { getLessonNote, addNote } = useNoteApi();

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPreview(false);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    setDragState(false);
  };

  const handleMouseDown = (e: any) => {
    const rect = modalRef?.current?.getBoundingClientRect();
    if (e.target && rect) {
      setIsDragging(true);
      setDragState(true);
      setDragStart({
        x: e.clientX - rect?.left,
        y: e.clientY - rect?.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && modalRef.current) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;

      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;

      newX = Math.max(0, Math.min(newX, viewportWidth - modalWidth));
      newY = Math.max(0, Math.min(newY, viewportHeight - modalHeight));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragState(false);
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

  useEffect(() => {
    const fetchData = async () => {
      if (!lessonId) return;
      const userNote = await getLessonNote(lessonId);
      if (userNote) {
        setContent(userNote?.content);
        setTitle(userNote.title);
      }
    };
    fetchData();
  }, [lessonId]);

  async function saveNote() {
    if (!content || !lessonId) return;

    console.log(content, lessonId);
    setLoading(true);
    const message = await addNote(title, content, lessonId);
    if (message) {
      toast.success(message);
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="flex w-full justify-end p-4 fixed top-[70px] right-10 z-50">
        <Button
          className="rounded-full  text-gray-600 bg-orange-400 dark:text-white dark:bg-orange-400"
          variant="outline"
          size="icon"
          onClick={() => {
            setIsModalOpen(true);
            setPosition({ x: 0, y: 0 });
          }}
        >
          <Edit2 className="w-9 h-9" />
        </Button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className={`rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col ${
              isDragging ? "cursor-grabbing" : ""
            } bg-white dark:bg-gray-900`}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              transition: isDragging ? "none" : " all 0.2s ease-out",
            }}
          >
            {/* Modal Header */}
            <div
              onMouseDown={handleMouseDown}
              ref={headerRef}
              className="drag-handle flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-3">
                <Move size={16} className="text-gray-400 dark:text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {isPreview ? "Preview Note" : "Edit Note"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePreview}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isPreview
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-300 dark:text-orange-900 hover:bg-orange-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                  {isPreview ? "Edit" : "Preview"}
                </button>

                <button
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {!dragState && (
              <div className="flex-1 p-6 overflow-auto">
                <div>
                  {isPreview ? (
                    <div className="h-full flex flex-col">
                      <div className="mb-4">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                          {title || "Untitled Note"}
                        </h1>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <div
                          className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: content
                              ? renderMarkdown(content)
                              : '<p class="text-gray-500 italic">No content yet...</p>',
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col gap-4">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full text-4xl font-bold text-gray-900 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 bg-transparent border-none outline-none mb-6 leading-tight"
                      />
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell your note... (Supports markdown)"
                        className="w-full text-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none resize-none leading-relaxed"
                        style={{
                          minHeight: "200px",
                          lineHeight: "1.58",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border-t mt-4 border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {isPreview ? "Preview Mode" : "Edit Mode"} •{" "}
                    {content.length} characters
                  </div>
                  <div className="flex gap-3">
                    <button
                      disabled={loading}
                      onClick={() => {
                        saveNote();
                        closeModal();
                      }}
                      className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonNote;
