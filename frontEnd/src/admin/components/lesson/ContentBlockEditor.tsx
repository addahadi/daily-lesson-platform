import { Button } from '@/components/ui/button'
import type { section } from '@/lib/adminType'
import { Code, FileText } from 'lucide-react'
import React, { type SetStateAction } from 'react'
import LessonCodeEditor from './LessonCodeEditor'
import LessonTextEditor from './LessonTextEditor'


interface ContentBlockEditorProps {
  sections: section[];
  setSections: React.Dispatch<SetStateAction<section[] | undefined>>;
  setChange: React.Dispatch<SetStateAction<boolean>>;
}

const ContentBlockEditor = ({
    sections,
    setSections,
    setChange
} : ContentBlockEditorProps) => {
  return (
    <div className=" w-full mt-4">
      <div className="flex flex-row gap-3">
        <Button
          onClick={() => {
            setSections((prev) => {
              if (!prev) return;
              return [
                ...prev,
                {
                  heading: "",
                  text: "",
                  id: crypto.randomUUID(),
                },
              ];
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
              return [
                ...prev,
                {
                  heading: "",
                  code: "",
                  id: crypto.randomUUID(),
                },
              ];
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
          } else
            return (
              <LessonTextEditor
                key={section.id}
                index={index}
                section={section}
                setSections={setSections}
                setChange={setChange}
              />
            );
        })}
      </section>
    </div>
  );
}

export default ContentBlockEditor