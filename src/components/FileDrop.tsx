import { Spinner } from "@chakra-ui/react";
import React, { useState } from "react";

type FileStatus = "waiting_file" | "on_process" | "error" | "success";

const ACCEPT_IMAGE = "image/png, image/jpeg";

export type FileDropProps = {
  /**
   * Get File meta
   */
  getFormInfo: (file: FormData) => void;
  /**
   * Get Image
   */
  getCoverImage: (url: string) => void;
};

export const FileDrop: React.FC<FileDropProps> = ({ getFormInfo, getCoverImage }) => {
  const [hightLighted, setHightLigted] = useState(false);
  const [fileStatus, setFileStatus] = useState<FileStatus>("waiting_file");
  const [fileInfos, setFileInfo] = useState({} as File);

  // Drag n drop file
  const handleOnDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    if (e.dataTransfer.files[0].type != "image/png" && e.dataTransfer.files[0].type != "image/jpeg") {
      setFileStatus("error");
      return;
    }
    const form = new FormData();
    form.append("file", e.dataTransfer.files[0], e.dataTransfer.files[0].name);
    setFileStatus("success");
    getCoverImage(URL.createObjectURL(e.dataTransfer.files[0]));
    getFormInfo(form);
  };

  const handleOnDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setFileStatus("waiting_file");
    setFileInfo({} as File);
  };

  // Select image
  const handleSelectFile = (e: any) => {
    e.preventDefault();
    const form = new FormData();
    form.append("file", e.target.files[0], e.target.files[0].name);
    getCoverImage(URL.createObjectURL(e.target.files[0]));
    getFormInfo(form);
  };

  return (
    <>
      <div
        className={`file-dropzone ${hightLighted ? "hover" : ""} ${fileStatus === "error" ? "error" : ""}`}
        onDragEnter={() => setHightLigted(true)}
        onDragLeave={() => setHightLigted(false)}
        onDragOver={(e: React.DragEvent) => handleOnDragOver(e)}
        onDrop={(e) => handleOnDrop(e)}
      >
        <FileIcons fileStatus={fileStatus} />
        <DropContent fileName={fileInfos.name} fileStatus={fileStatus} handleImageSelect={handleSelectFile} />
      </div>
    </>
  );
};

const FileIcons: React.FC<{
  fileStatus: FileStatus;
}> = ({ fileStatus }) => {
  if (fileStatus === "error") {
    return <span>ERR</span>;
  }
  if (fileStatus === "success") {
    return <span>SUCCESS</span>;
  }
};

const DropContent: React.FC<{
  fileName: string;
  fileStatus: FileStatus;
  handleImageSelect: (e: any) => void;
}> = ({ fileName, fileStatus, handleImageSelect }) => {
  if (fileStatus === "on_process") return <Spinner />;
  if (fileStatus === "success") {
    return (
      <>
        <p>{fileName}</p>
      </>
    );
  } else
    return (
      <>
        <p>
          Drag and drop your image here <br />
          or <label htmlFor="image_input">click here</label> to import a file <br />
          <input id="image_input" type="file" onInput={(e) => handleImageSelect(e)} accept={ACCEPT_IMAGE} />
        </p>
        {fileStatus === "error" && <p className="text-danger">Only support .png, .jpeg or .jpg file. Please check your file type.</p>}
      </>
    );
};
