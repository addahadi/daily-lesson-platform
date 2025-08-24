import { Card, CardContent } from "@/Shared/components/ui/card";
import type { FolderType } from "@/Shared/lib/type";
import { Folder, Trash2 } from "lucide-react";
import type { SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FOLDER_CACHE_KEY } from "@/Shared/lib/utils";

type FolderCardProps = {
  title: string;
  id: string;
  createdAt: string;
  setFolders: React.Dispatch<SetStateAction<FolderType[] | null>>;
  deleteFolder: (folderId: string) => Promise<boolean>;
};

const FolderCard = ({
  title,
  createdAt,
  id,
  setFolders,
  deleteFolder,
}: FolderCardProps) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    const data = await deleteFolder(id);
    if (data) {
      toast.success("folder was deleted successfully");
      setFolders((prev) => {
        const updated =
          prev?.filter((folder) => {
            return folder.id != id;
          }) || null;
        return updated;
      });
      localStorage.removeItem(FOLDER_CACHE_KEY);
    }
    return;
  };
  return (
    <Card className="group cursor-pointer bg-gray-800  hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <div className=" flex-1 flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 rounded-full p-3">
            <Folder className="w-6 h-6" />
          </div>
          <div
            className="flex flex-col"
            onClick={() => {
              navigate(`/dashboard/library/${id}`, {
                state: {
                  title,
                },
              });
            }}
          >
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Created {createdAt}
            </p>
          </div>
        </div>
        <div onClick={handleDelete}>
          <Trash2 className=" w-5 h-5 text-red-500 hover:text-red-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
