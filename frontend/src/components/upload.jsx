import { useRef } from "react";
import { toast } from "react-toastify";
import { IKContext, IKUpload } from "imagekitio-react";
import { authenticator } from "../utils/upload.databank";

const Upload = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null);

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };
  const onSuccess = (res) => {
    console.log(res);
    setData(res);
  };
  const onUploadProgress = (progress) => {
    const progressPercentage = Math.round(
      (progress.loaded / progress.total) * 100
    );
    setProgress(progressPercentage);
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      <div className="cursor-pointer" onClick={() => ref.current.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
