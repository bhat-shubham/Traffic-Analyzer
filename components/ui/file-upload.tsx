import { cn } from "../../lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { CgFileRemove } from "react-icons/cg";
import { toast } from "react-hot-toast";
import { IoArrowRedoSharp} from "react-icons/io5";
import axios from "axios";
const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const isCancelledRef=useRef(false);
  const [isProcessed, setIsProcessed] = useState(false);;
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSize = 2 * 1024 * 1024;
  const [showComplete, setShowComplete] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  // removing files
  const handleRemove = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    setProgress(0);
    isCancelledRef.current=true;
    setIsLoading(false);
    setFiles([]);
    setIsProcessed(false);
    // console.log(progress);
    controllerRef.current?.abort();
    toast.error("Operation Cancelled By User")

  };
  let controller = new AbortController();
  const handleSubmit = async () =>
    {
      controller = new AbortController();
      isCancelledRef.current=false
      if(files.length===0){
        toast.error("Please Upload A File Before Submitting")
      }
      const formData = new FormData();
      formData.append("file", files[0]);
      try {
        setIsLoading(true);
        await axios.post("https://netnerve.onrender.com/uploadfile/", formData, {
          signal: controller.signal,
          onUploadProgress: (axiosProgressEvent) => {
            if (typeof axiosProgressEvent.total === "number" && axiosProgressEvent.total > 0) {
              const percent = Math.round((axiosProgressEvent.loaded * 100) / axiosProgressEvent.total);
              setProgress(percent);
                  if(percent===100 && !isCancelledRef.current){
                    setShowComplete(true);
                    toast.success("File Uploaded Successfully");
                    setTimeout(() =>
                      setShowComplete(false),2000);
            }
          }
      },
    });
  } catch {
    toast.error("Upload failed");
  } finally {
    setIsLoading(false);
  }
      try{
        setIsLoading(true);
        const response = await fetch("https://netnerve.onrender.com/uploadfile/",{
          method:"POST",
          body: formData,
        });
        if (response.ok){
          setIsProcessed(true);
          toast.success("File Processed Successfully")
        }
        const result= await response.json();
        console.log(result);
        

      }
      catch(err){
        console.log(err);
      }
}      

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
      toast.error("Upload Failed,Try Again")
    },
  });
  const [inputKey, setInputKey] = useState(0);
  // Extension Check
  const allowedFileTypes = [".cap", ".pcap"];
  const fileExt = files.length > 0 ? files[0].name.split(".").pop()?.toLowerCase() : undefined;
  if (fileExt && !allowedFileTypes.includes(`.${fileExt}`)) {
    setInputKey(prev => prev + 1);
    setFiles([]); // Clear files on unsupported type
    toast.error("Only .cap or .pcap files are supported" ,{
      style:{
        borderRadius: "8px",
        backgroundColor: "#202F34",
        color: "#fff",
      }
    
    });
    return;
  }
  if (files.length > 0 && files[0].size > maxSize) {
    toast.error("Size Excedded,Upload a file<2MB");
    setFiles([]); // Clear files on size limit exceeded
    setInputKey(prev => prev + 1); // Reset input to allow re-upload
  }
  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        whileHover="animate"
        className="p-10 group/file block rounded-lg w-full relative overflow-hidden"
      >
        <input
          key={inputKey}
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept=".cap,.pcap"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload Your Packet Capture File Here
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drop Your Files Here or Click to Upload ( .cap or .pcap )
          </p>
          <p className="font-sans font-normal text-white mt-1" >* Only Files Below ~2MB Can Be Processed For Now</p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start p-5 mt-4 mx-auto rounded-md",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    {/* <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p> */}
                    <motion.div 
                    whileHover={{scale:1.2}} 
                    className="tooltip" 
                    data-tip="Remove"
                    whileTap={{ scale:0.5 }}
                    transition={{duration: 0.2,type: "spring",stiffness: 300,damping: 20,}}
                    >
                    <CgFileRemove
                      size={20}
                      onClick={() => handleRemove(file)}
                      className="cursor-pointer"
                    />
                    </motion.div>
                  </div>
                  <div className="rounded-2xl transition-all duration-500 z-10 mt-5 bg-gradient-to-r from-[#1d4732] to-[#07f88c] h-10 w-[23.5vw]"  style={{ width: `${progress}%` }}>
                  <button onClick={handleSubmit} disabled={isLoading} className="cursor-pointer gap-2 border h-10 rounded-2xl flex items-center justify-center text-xl w-[23.5vw]">
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}>
                      {isProcessed ? (
                        <motion.p
                        key="success"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 500, damping: 20 }}
                        className="text-white">
                          ✅ File Processed Successfully!
                          </motion.p>
                          ) : isLoading ? (progress === 100 ? (showComplete ? (
                          <motion.p
                          key="done"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-white">
                            ✅ Uploading Done!
                            </motion.p>
                            ) : (
                            <motion.p
                            key="processing"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 500, damping: 20 }}
                            className="text-white">
                              🧠 Processing...
                              </motion.p>)
                              ) : (
                              <motion.p
                              key="uploading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="text-white">
                                📂 Uploading {progress}%
                                </motion.p>)
                                ) : (
                                <p>📦 Analyze My Packet</p>
                                )}
                                </motion.div>
                    <div>
                    <IoArrowRedoSharp className=""/>
                    </div>
                  </button>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
              onClick={handleClick}
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 2,
                }}
                className={cn(
                  "cursor-pointer relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-[#202F34] flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 15;
  const rows = 11;
  return (
    <div className="flex bg-gradient-to-r from-[#44A08D] to-[#093637] shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-110 p-0 rounded-md">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-[#59B2A4]" // soft teal
                  : "bg-[#0F3E3A] shadow-[inset_0_0_3px_rgba(255,255,255,0.1)]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
