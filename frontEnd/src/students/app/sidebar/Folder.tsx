import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingSpinner from "@/components/ui/loading"
import type { FolderType } from "@/lib/type"
import { getCach, setCache } from "@/lib/utils"
import useFolderApiController from "@/students/Api/folder.Api"
import EmptyCase from "@/students/components/empty/EmptyCase"
import FolderCard from "@/students/components/library/FolderCard"
import { Folder, Plus, Save, X } from "lucide-react"
import { useEffect, useState, type SetStateAction } from "react"
import { toast, Toaster } from "sonner"
import { FOLDER_CACHE_KEY } from "@/lib/utils"


const TTL = 1000 * 60 * 60;

const Folders = () => {
  const [create , setCreate] = useState(false)
  const [loading , setLoading] = useState(false)
  const {getAllFolders , deleteFolder} = useFolderApiController()
  
  const [noFolders,setNoFolders] = useState(false)
  const [folders , setFolders] = useState<FolderType[] | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllFolders();
      if (data?.length === 0) {
        setLoading(false);
        setNoFolders(true);
        return;
      }
      setLoading(false);
      setFolders(data);
      setCache(FOLDER_CACHE_KEY, data, TTL); 
    };

    const cached = getCach(FOLDER_CACHE_KEY);
    if (cached) {
      setFolders(cached);
    } else {
      fetchData();
    }
  }, [getAllFolders]);

  return (
    <div className=" h-screen p-6">
      <section className=" flex flex-row justify-between items-center">
        <div className="  flex-1 flex flex-col gap-2">
          <h1 className=" text-3xl font-semibold text-gray-800">Folders</h1>
          <div className=" font-semibold text-sm text-gray-400">
            Organize your learning journey with custom folders
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              setCreate(true);
            }}
            variant="destructive"
            className=" bg-orange-500 hover:bg-orange-400"
          >
            <Plus className=" w-4 h-4" />
            <span>New Folder</span>
          </Button>
        </div>
      </section>
      <Input className=" w-[400px] mt-4" placeholder="Search Folder ..." />
      {create && (
        <div className=" h-64 flex justify-center items-center mt-10">
          <NewFolder
            setNoFolders={setNoFolders}
            setFolders = {
              setFolders
            }
            close={() => {
              setCreate(false);
            }}
          />
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-32 w-full">
          <LoadingSpinner size={40} />
        </div>
      ) : (
        <div>
          {
            noFolders 
            ?<div className="flex justify-center items-center w-full">
              <EmptyCase
                title="No created folders"
                description="You haven’t created any folder yet."
                icon= {<Save className=" w-8 h-8" />}
              />
            </div>
            : <div className=" grid grid-cols-3 gap-3 w-full mt-8">
              {
                folders !== null && folders?.map((folder) => {
                  return <FolderCard
                      setFolders={setFolders}
                      deleteFolder = {deleteFolder}
                      title={folder.title}
                      id = {folder.id}
                      key={folder.id}
                      createdAt={folder.created_at.split("T")[0]} 
                    />
                  
                })
              }
            </div>
          }
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default Folders



type NewFolderProps = {
  close : () => void 
  setFolders : React.Dispatch<SetStateAction<FolderType[] | null>>
  setNoFolders : React.Dispatch<SetStateAction<boolean>>
}

const NewFolder = ({
  close,
  setFolders,
  setNoFolders
} :  NewFolderProps) => {

  const [title , setTitle] = useState("")
  const {createFolder} = useFolderApiController()
  const [loading , setLoading] = useState(false)
  async function handleClick(){
    if(!title){
      toast.error("please provide a title")
      return
    }
    setLoading(true)
    const data = await createFolder(title)
    if(data){
      toast.message("folder created succesfully")
      setFolders((prev) => {
        if(prev === null){
          return [data]
        }
        return [...prev, data]
      })
      setNoFolders(false)
      setLoading(false)
      localStorage.removeItem(FOLDER_CACHE_KEY)
    }
    setLoading(false)
  }



  return (
    <Card className="  w-[400px]">
      <CardHeader className=" flex flex-row justify-between items-center">
        <div className=" flex items-center gap-3">
          <Folder className=" w-6 h-6 text-orange-500" />
          <h2 className=" text-gray-800 font-semibold text-xl">
            Create new folder
          </h2>
        </div>
        <div
          onClick={close}
          className=" w-fit  p-1 rounded-lg hover:bg-gray-400 flex justify-center items-center"
        >
          <X className=" w-4 h-4 text-gray-800" />
        </div>
      </CardHeader>
      <CardContent className=" flex flex-col gap-6">
        <div>
          <Label>Folder Name</Label>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="Enter folder Name ..."
          />
        </div>
        <div className=" flex w-full">
          <Button
            onClick={handleClick}
            className=" items-end w-fit bg-orange-500 hover:bg-orange-400"
          >
            {loading ? (
              <LoadingSpinner size={20} />
            ) : (
              <span>Create Folder</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}