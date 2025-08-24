import { Button } from "@/Shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Shared/components/ui/card";
import type { Lesson, Module } from "@/Shared/lib/adminType";
import { Edit, GripVertical, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type AdminCardProps = {
  id: string | undefined;
  title: string;
  URL: string;
  handleEditModule: () => void;
  handleDeleteModule: () => void;
  State: Module | Lesson;
  children: React.ReactNode;
  loading: boolean;
  manageTitle: string;
};

const AdminCard = ({
  id,
  title,
  URL,
  State,
  handleEditModule,
  handleDeleteModule,
  children,
  loading,
  manageTitle,
}: AdminCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      key={id}
      className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <GripVertical className="w-4 h-4" />
            </div>
            <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
              {title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                navigate(URL, {
                  state: { State },
                })
              }
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:text-gray-200 hover:dark:bg-gray-700"
            >
              {manageTitle}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleEditModule}
              className="dark:border-gray-600 dark:text-gray-200 hover:dark:bg-gray-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={loading}
              onClick={handleDeleteModule}
              className="dark:border-gray-600 dark:text-gray-200 hover:dark:bg-gray-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AdminCard;
