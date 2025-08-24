import { Button } from "@/Shared/components/ui/button";
import { Input } from "@/Shared/components/ui/input";
import { Textarea } from "@/Shared/components/ui/textarea";
import type { section } from "@/Shared/lib/adminType";
import {
  ArrowDown,
  ArrowUp,
  Code,
  GripVertical,
  TrashIcon,
} from "lucide-react";
import React, { useState, type SetStateAction } from "react";
import { Label } from "recharts";

type Section = {
  heading: string;
  code: string;
  id: string;
};

interface LessonCodeEditorProps {
  section: Section;
  index: number;
  setSections: React.Dispatch<SetStateAction<section[] | undefined>>;
  setChange: React.Dispatch<SetStateAction<boolean>>;
}

const LessonCodeEditor = ({
  section,
  index,
  setSections,
  setChange,
}: LessonCodeEditorProps) => {
  const [currentSection, setCurrentSection] = useState({
    heading: section?.heading || "",
    code: section?.code || "",
    id: section?.id || "",
  });
  function handleChange(title: string, value: string) {
    setCurrentSection((prev) => {
      return {
        ...prev,
        [title]: value,
      };
    });
    setChange(false);
    setSections((prev) => {
      if (!prev) return;
      const updated = prev.map((section) => {
        if (section.id === currentSection.id) {
          return currentSection;
        }
        return section;
      });
      return updated;
    });
  }

  function handlePlacement(direction: "up" | "down") {
    const currentIndex = index;
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    console.log(targetIndex, currentIndex);
    setSections((prev) => {
      if (!prev) return;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[currentIndex];
      updated[currentIndex] = updated[targetIndex];
      updated[targetIndex] = temp;

      return updated;
    });
  }
  return (
    <div className="  mt-4 p-6 border border-gray-300 w-full rounded-xl">
      <div className="flex flex-row items-center justify-between w-full">
        <div className=" flex flex-row gap-2 items-center">
          <GripVertical className="w-4 h-4" />
          <Code className="w-4 h-4" />
          <span>Code</span>
        </div>
        <div className=" flex flex-row gap-2 items-center">
          <Button variant="ghost" onClick={() => handlePlacement("up")}>
            <ArrowUp className=" w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={() => handlePlacement("down")}>
            <ArrowDown className=" w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              setSections((prev) => {
                if (!prev) return;
                return prev.filter((section) => {
                  return section.id !== currentSection.id;
                });
              });
              setChange(false);
            }}
            variant="ghost"
          >
            <TrashIcon className=" w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>
      <div className=" mt-3 flex flex-col gap-3">
        <div>
          <Label>Heading (code)</Label>
          <Input
            placeholder="Enter a title"
            className=" w-full dark:bg-gray-700"
            value={currentSection.heading}
            onChange={(e) => {
              handleChange("heading", e.target.value);
            }}
          />
        </div>
        <div>
          <Label>Content (Markdown)</Label>
          <Textarea
            id="code-content"
            value={currentSection.code}
            onChange={(e) => {
              handleChange("code", e.target.value);
            }}
            placeholder="Write your code examples here..."
            rows={10}
            className="font-mono text-sm bg-gray-700 text-green-500 border-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default LessonCodeEditor;
