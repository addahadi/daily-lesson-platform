import { Button } from "@/Shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/Shared/components/ui/card";
import { Input } from "@/Shared/components/ui/input";
import { Label } from "@/Shared/components/ui/label";
import LoadingSpinner from "@/Shared/components/ui/loading";
import type { FolderType } from "@/Shared/lib/type";
import { getCach, setCache } from "@/Shared/lib/utils";
import useFolderApiController from "@/students/Api/folder.Api";
import EmptyCase from "@/Shared/components/empty/EmptyCase";
import FolderCard from "@/students/components/library/FolderCard";
import { Folder, Plus, Save, X } from "lucide-react";
import { useEffect, useState, type SetStateAction } from "react";
import { toast, Toaster } from "sonner";
import { FOLDER_CACHE_KEY } from "@/Shared/lib/utils";

const TTL = 1000 * 60 * 60;

const Folders = () => {
  const [create, setCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getAllFolders, deleteFolder } = useFolderApiController();

  const [noFolders, setNoFolders] = useState(false);
  const [folders, setFolders] = useState<FolderType[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllFolders();
      console.log(data);
      if (data === null) {
        setLoading(false);
        setNoFolders(true);
        return;
      }
      setLoading(false);
      setFolders(data as FolderType[]);
      setCache(FOLDER_CACHE_KEY, data, TTL);
    };

    const cached = getCach(FOLDER_CACHE_KEY);
    if (cached) {
      setFolders(cached);
    } else {
      fetchData();
    }
  }, [getAllFolders]);

  useEffect(() => {
    if (folders?.length === 0) {
      setNoFolders(true);
    }
  }, [folders]);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 p-4 sm:p-6">
      {/* Header Section - Responsive */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 transition-colors">
            Folders
          </h1>
          <div className="font-semibold text-sm text-gray-400 dark:text-gray-500 transition-colors">
            Organize your learning journey with custom folders
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <Button
            onClick={() => {
              setCreate(true);
            }}
            variant="destructive"
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 dark:bg-orange-600 dark:hover:bg-orange-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Folder</span>
          </Button>
        </div>
      </section>

      {/* Search Input - Responsive */}
      <Input
        className="w-full max-w-sm sm:max-w-md lg:max-w-lg mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
        placeholder="Search Folder ..."
      />

      {/* New Folder Modal */}
      {create && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex justify-center items-center z-50 p-4">
          <NewFolder
            setNoFolders={setNoFolders}
            setFolders={setFolders}
            close={() => {
              setCreate(false);
            }}
          />
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-32 w-full">
          <LoadingSpinner size={40} />
        </div>
      ) : (
        <div>
          {noFolders ? (
            <div className="flex justify-center items-center w-full py-12">
              <EmptyCase
                title="No created folders"
                description="You haven't created any folder yet."
                icon={<Save className="w-8 h-8" />}
                color="orange"
              />
            </div>
          ) : (
            /* Responsive Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {folders !== null &&
                folders?.map((folder) => {
                  return (
                    <FolderCard
                      setFolders={setFolders}
                      deleteFolder={deleteFolder}
                      title={folder.title}
                      id={folder.id}
                      key={folder.id}
                      createdAt={folder.created_at.split("T")[0]}
                    />
                  );
                })}
            </div>
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Folders;

type NewFolderProps = {
  close: () => void;
  setFolders: React.Dispatch<SetStateAction<FolderType[] | null>>;
  setNoFolders: React.Dispatch<SetStateAction<boolean>>;
};

const NewFolder = ({ close, setFolders, setNoFolders }: NewFolderProps) => {
  const [title, setTitle] = useState("");
  const { createFolder } = useFolderApiController();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!title) {
      toast.error("please provide a title");
      return;
    }
    setLoading(true);
    const data = await createFolder(title);
    if (data) {
      toast.message("folder created successfully");
      //@ts-ignore
      setFolders((prev) => {
        if (prev === null) {
          return [data];
        }
        return [...prev, data];
      });
      setNoFolders(false);
      setLoading(false);
      localStorage.removeItem(FOLDER_CACHE_KEY);
      close();
    }
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <Folder className="w-6 h-6 text-orange-500 dark:text-orange-400" />
          <h2 className="text-gray-800 dark:text-gray-100 font-semibold text-lg sm:text-xl transition-colors">
            Create new folder
          </h2>
        </div>
        <button
          onClick={close}
          className="w-8 h-8 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-center items-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-800 dark:text-gray-200" />
        </button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <Label className="text-gray-700 dark:text-gray-300 transition-colors">
            Folder Name
          </Label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Enter folder Name ..."
            className="mt-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-colors"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleClick}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 dark:bg-orange-600 dark:hover:bg-orange-500 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size={20} />
            ) : (
              <span>Create Folder</span>
            )}
          </Button>
          <Button
            onClick={close}
            variant="outline"
            className="w-full sm:w-auto border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
