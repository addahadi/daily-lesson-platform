import React, { useEffect, useState, type SetStateAction } from "react";
import { Textarea } from "@/Shared/components/ui/textarea";
import { Badge } from "@/Shared/components/ui/badge";
import { Label } from "@/Shared/components/ui/label";

type QuizzProps = {
  quizz_id: string;
  question: string;
  options: string[];
  correct_option_index: number;
};

type QuizzEditorType = {
  quizz: QuizzProps | null;
  setQuizz: React.Dispatch<SetStateAction<QuizzProps | null>>;
  setChange: React.Dispatch<SetStateAction<boolean>>;
};

type ChangeType = "badge" | "question" | "option";

const QuizzEditor = ({ quizz, setQuizz , setChange }: QuizzEditorType) => {
  const [quizzData, setQuizzData] = useState<QuizzProps>({
    quizz_id: quizz?.quizz_id || "",
    question: quizz?.question || "",
    options: quizz?.options || ["", "", "", ""],
    correct_option_index: quizz?.correct_option_index || 0,
  });

  useEffect(() => {
    setQuizz(quizzData);
  }, [quizzData, setQuizz]);

  const handleChange = (
    type: ChangeType,
    value: number | string,
    optionIndex?: number
  ) => {
    setChange(true)
    switch (type) {
      case "badge":
        setQuizzData((prev) => ({
          ...prev,
          correct_option_index: value as number,
        }));
        break;
      case "question":
        setQuizzData((prev) => ({
          ...prev,
          question: value as string,
        }));
        break;
      case "option":
        if (typeof optionIndex === "number") {
          setQuizzData((prev) => ({
            ...prev,
            options: prev.options.map((option, index) =>
              index === optionIndex ? (value as string) : option
            ),
          }));
        }
        break;
    }

  };


  return (
    <div className="mt-5">
      <div>
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          value={quizzData.question}
          className="dark:bg-gray-700"
          placeholder="Write a question"
          onChange={(e) => handleChange("question", e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <Label>Answer Options</Label>
        <div className="flex flex-col gap-3">
          {quizzData.options.map((option, index) => (
            <div
              key={index}
              className="flex flex-row gap-2 w-full items-center"
            >
              <div className="h-5 w-5 flex justify-center items-center p-4 bg-gray-300 text-gray-800 font-semibold text-lg rounded-full">
                <span>{index + 1}</span>
              </div>

              <Textarea
                value={option}
                className="dark:bg-gray-700"
                onChange={(e) => handleChange("option", e.target.value, index)}
                placeholder={`Option ${index + 1}`}
                rows={3}
              />

              <Badge
                variant="destructive"
                className={`cursor-pointer ${
                  index === quizzData.correct_option_index
                    ? "bg-green-600 hover:bg-green-500"
                    : ""
                }`}
                onClick={() => handleChange("badge", index)}
              >
                {index === quizzData.correct_option_index
                  ? "Correct"
                  : "Incorrect"}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizzEditor;
