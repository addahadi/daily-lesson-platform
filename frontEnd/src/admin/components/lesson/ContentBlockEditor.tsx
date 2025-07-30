import { Button } from "@/components/ui/button";
import type { section } from "@/lib/adminType";
import { Code, FileText } from "lucide-react";
import React, { type SetStateAction, useEffect } from "react";
import LessonCodeEditor from "./LessonCodeEditor";
import LessonTextEditor from "./LessonTextEditor";

interface ContentBlockEditorProps {
  sections: section[];
  setSections: React.Dispatch<SetStateAction<section[] | undefined>>;
  setChange: React.Dispatch<SetStateAction<boolean>>;
}

const ContentBlockEditor = ({
  sections,
  setSections,
  setChange,
}: ContentBlockEditorProps) => {
  useEffect(() => {
    setSections((prev) => {
      if (!prev) return;

      const summaryIndex = prev.findIndex(
        (section) => "heading" in section && section.heading === "Summary"
      );

      if (summaryIndex === -1) {
        return [
          ...prev,
          {
            heading: "Summary",
            text: "",
            id: crypto.randomUUID(),
            isSummary: true,
          },
        ];
      }

      if (summaryIndex !== prev.length - 1) {
        const summarySection = prev[summaryIndex];
        const otherSections = prev.filter((_, index) => index !== summaryIndex);
        return [...otherSections, summarySection];
      }

      return prev;
    });
  }, [setSections]);

  const regularSections = sections.filter(
    (section) => !("heading" in section && section.heading === "Summary")
  );
  const summarySection = sections.find(
    (section) => "heading" in section && section.heading === "Summary"
  );

  return (
    <div className=" w-full mt-4">
      <div className="flex flex-row gap-3">
        <Button
          onClick={() => {
            setSections((prev) => {
              if (!prev) return;

              const summaryIndex = prev.findIndex(
                (section) =>
                  "heading" in section && section.heading === "Summary"
              );
              const summarySection =
                summaryIndex !== -1 ? prev[summaryIndex] : null;
              const otherSections = prev.filter(
                (_, index) => index !== summaryIndex
              );

              const newSection = {
                heading: "",
                text: "",
                id: crypto.randomUUID(),
              };

              return summarySection
                ? [...otherSections, newSection, summarySection]
                : [...otherSections, newSection];
            });
          }}
          variant="destructive"
          className=" bg-gray-800 text-white flex flex-row gap-2 items-center"
        >
          <FileText className=" w-4 h-4" />
          <span>New Markdown</span>
        </Button>
        <Button
          onClick={() => {
            setSections((prev) => {
              if (!prev) return;

              // Find summary section and remove it temporarily
              const summaryIndex = prev.findIndex(
                (section) =>
                  "heading" in section && section.heading === "Summary"
              );
              const summarySection =
                summaryIndex !== -1 ? prev[summaryIndex] : null;
              const otherSections = prev.filter(
                (_, index) => index !== summaryIndex
              );

              const newSection = {
                heading: "",
                code: "",
                id: crypto.randomUUID(),
              };

              return summarySection
                ? [...otherSections, newSection, summarySection]
                : [...otherSections, newSection];
            });
          }}
          variant="outline"
          className="flex flex-row gap-2 items-center"
        >
          <Code className=" w-4 h-4" />
          <span>New Code</span>
        </Button>
      </div>
      <section className=" flex flex-col gap-3 w-full ">
        {sections.map((section, index) => {
          if ("code" in section) {
            return (
              <LessonCodeEditor
                key={section.id}
                index={index}
                section={section}
                setSections={setSections}
                setChange={setChange}
              />
            );
          } else {
            const isSummary = section.heading === "Summary";
            return (
              <LessonTextEditor
                key={section.id}
                index={index}
                section={section}
                setSections={setSections}
                setChange={setChange}
                isSummary={isSummary}
              />
            );
          }
        })}
      </section>
    </div>
  );
};

export default ContentBlockEditor;
