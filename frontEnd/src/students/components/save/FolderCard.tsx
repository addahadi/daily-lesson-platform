import { Card, CardContent } from "@/components/ui/card";
import { Folder } from "lucide-react";

type FolderCardProps = {
  title: string;
  createdAt: number ;
  onClick?: () => void;
};

const FolderCard = ({ title, createdAt, onClick }: FolderCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3">
          <Folder className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Created {createdAt}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
