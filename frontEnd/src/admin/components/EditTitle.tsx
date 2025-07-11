import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { type SetStateAction } from "react";

type EditTitleProps = {
  setIsCreate: React.Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  buttonTitle: string;
  size?: string;
};

const EditTitle = ({
  setIsCreate,
  title,
  description,
  buttonTitle,
  size = "",
}: EditTitleProps) => {
  return (
    <div className=" w-full flex justify-between">
      <div className="mb-8">
        <h1
          className={` ${
            size.length > 0 ? size : "text-3xl"
          }   font-semibold text-text-primary mb-2`}
        >
          {title}
        </h1>
        <p className="text-text-secondary">{description}</p>
      </div>
      <Button
        variant="destructive"
        onClick={() => setIsCreate(true)}
        className="  text-white bg-gray-900  hover:bg-gray-700"
      >
        <Plus className=" w-5 h-5  text-white" />
        <span>{buttonTitle}</span>
      </Button>
    </div>
  );
};

export default EditTitle;
