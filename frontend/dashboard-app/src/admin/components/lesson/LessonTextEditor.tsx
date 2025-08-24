import { Button } from "@/Shared/components/ui/button";
import { Input } from "@/Shared/components/ui/input";
import { Label } from "@/Shared/components/ui/label";
import { Textarea } from "@/Shared/components/ui/textarea";
import type { section } from "@/Shared/lib/adminType";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  GripVertical,
  TrashIcon,
} from "lucide-react";
import React, { useState, type SetStateAction } from "react";

type Section = {
  heading: string;
  text: string;
  id: string;
  isSummary?: boolean;
};
interface LessonEditorProps {
  section: Section;
  index: number;
  setSections: React.Dispatch<SetStateAction<section[] | undefined>>;
  setChange: React.Dispatch<SetStateAction<boolean>>;
  isSummary?: boolean;
}

const LessonTextEditor = ({
  section,
  index,
  setSections,
  setChange,
  isSummary = false,
}: LessonEditorProps) => {
  const [currentSection, setCurrentSection] = useState({
    heading: section?.heading || "",
    text: section?.text || "",
    id: section?.id || "",
    isSummary: section?.isSummary || false,
  });

  function handleChange(title: string, value: string) {
    // Prevent changing heading if it's a summary section
    if (isSummary && title === "heading") {
      return;
    }

    setCurrentSection((prev) => {
      return {
        ...prev,
        [title]: value,
      };
    });
    setChange(true);
    setSections((prev) => {
      if (!prev) return;
      const updated = prev.map((section) => {
        if (section.id === currentSection.id) {
          return {
            ...currentSection,
            [title]: value,
          };
        }
        return section;
      });
      return updated;
    });
  }

  function handlePlacement(direction: "up" | "down") {
    // Prevent moving summary section
    if (isSummary) return;

    const currentIndex = index;
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    console.log(targetIndex, currentIndex);
    setSections((prev) => {
      if (!prev) return;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const summaryIndex = prev.findIndex(
        (section) => "heading" in section && section.heading === "Summary"
      );
      if (targetIndex === summaryIndex) return prev;

      const updated = [...prev];
      const temp = updated[currentIndex];
      updated[currentIndex] = updated[targetIndex];
      updated[targetIndex] = temp;

      return updated;
    });
  }

  function handleDelete() {
    if (isSummary) return;

    setSections((prev) => {
      if (!prev) return;
      return prev.filter((section) => {
        return section.id !== currentSection.id;
      });
    });
    setChange(true);
  }

  return (
    <div
      className={`mt-4 p-6 border w-full rounded-xl ${
        isSummary
          ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600"
          : "border-gray-300"
      }`}
    >
      <div className="flex flex-row items-center justify-between w-full">
        <div className=" flex flex-row gap-2 items-center">
          <GripVertical className="w-4 h-4" />
          <FileText className="w-4 h-4" />
          <span>{isSummary ? "Summary" : "Markdown"}</span>
          {isSummary && (
            <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              Required
            </span>
          )}
        </div>
        <div className=" flex flex-row gap-2 items-center">
          {!isSummary && (
            <>
              <Button variant="ghost" onClick={() => handlePlacement("up")}>
                <ArrowUp className=" w-4 h-4" />
              </Button>
              <Button variant="ghost" onClick={() => handlePlacement("down")}>
                <ArrowDown className=" w-4 h-4" />
              </Button>
              <Button onClick={handleDelete} variant="ghost">
                <TrashIcon className=" w-4 h-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className=" mt-3 flex flex-col gap-3">
        {!isSummary && (
          <>
            <Label>Heading</Label>
            <Input
              placeholder="Enter section heading"
              className="w-full dark:bg-gray-700"
              value={currentSection.heading}
              onChange={(e) => {
                handleChange("heading", e.target.value);
              }}
            />
          </>
        )}
        <Label>
          {isSummary ? "Summary Content (Required)" : "Content (Markdown)"}
        </Label>
        <Textarea
          placeholder={
            isSummary ? "Enter lesson summary..." : "Enter content..."
          }
          className={`w-full ${
            isSummary && !currentSection.text
              ? "border-red-300 focus:border-red-500"
              : "dark:bg-gray-700"
          }`}
          rows={8}
          value={currentSection.text}
          onChange={(e) => {
            handleChange("text", e.target.value);
          }}
        />
        {isSummary && !currentSection.text && (
          <p className="text-red-500 text-sm">
            Summary content is required before saving
          </p>
        )}
      </div>
    </div>
  );
};

export default LessonTextEditor;
