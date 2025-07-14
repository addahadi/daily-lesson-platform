import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { section } from '@/lib/adminType'
import { ArrowDown, ArrowUp, FileText, GripVertical, TrashIcon } from 'lucide-react'
import React, { useState, type SetStateAction } from 'react'


type Section = {
  heading : string
  text : string
  id : string
}
interface LessonEditorProps {
  section: Section;
  index: number;
  setSections: React.Dispatch<SetStateAction<section[] | undefined>>;
  setChange: React.Dispatch<SetStateAction<boolean>>;
}


const LessonTextEditor = ({
    section,
    index,
    setSections,
    setChange
} : LessonEditorProps) => {
    const [currentSection , setCurrentSection] = useState({
        heading : section?.heading || '',
        text : section?.text || '',
        id : section?.id || ''
    })
    function handleChange(title : string , value : string){
        setCurrentSection((prev) => {
            return {
                ...prev,
                [title]: value
            }
        })
        setChange(false)
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

    function handlePlacement(direction : 'up' | 'down'){
      const currentIndex = index
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
      console.log(targetIndex , currentIndex)
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
          <FileText className="w-4 h-4" />
          <span>Markdown</span>
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
              setChange(false)
            }}
            variant="ghost"
          >
            <TrashIcon className=" w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>
      <div className=" mt-3 flex flex-col gap-3">
        <Label>Content (Markdown)</Label>
        <Textarea
          placeholder="Enter a title"
          className=" w-full"
          rows={8}
          value={currentSection.text}
          onChange={(e) => {
            handleChange("text", e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default LessonTextEditor