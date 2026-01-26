import React, { useEffect, useState } from "react";
import { t } from "i18next";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";
import Pica from "pica";

// Internal imports
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError, notifySuccess } from "@/utils/toast";
import Container from "@/components/image-uploader/Container";

const Uploader = ({
  setImageUrl,
  imageUrl,
  product,
  folder,
  targetWidth = 270, // Default target width for products (only used if preserveOriginal=false)
  targetHeight = 270, // Default target height for products (only used if preserveOriginal=false)
  preserveOriginal = false, // when true, upload the original file without resizing/compression
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const pica = Pica(); // Initialize Pica instance
  const { globalSetting } = useUtilsFunction();

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: product ? true : false,
    maxSize: 10485760, // Increased to 10 MB to allow higher quality images
    maxFiles: globalSetting?.number_of_image_per_product || 2,
    onDrop: async (acceptedFiles) => {
      // If preserveOriginal is requested, skip resizing/compression and upload the original file
      if (preserveOriginal) {
        console.log("🔵 ORIGINAL MODE: Uploading files without any resizing");
        acceptedFiles.forEach((file) => {
          console.log(
            `📁 File: ${file.name}, Size: ${(file.size / 1024).toFixed(2)}KB, Type: ${file.type}`,
          );
        });
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            }),
          ),
        );
        return;
      }

      const resizedFiles = await Promise.all(
        acceptedFiles.map((file) =>
          resizeImageToFixedDimensions(file, targetWidth, targetHeight),
        ),
      );
      setFiles(
        resizedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  const resizeImageToFixedDimensions = async (file, width, height) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await img.decode();

    // Calculate scaling to fit within target dimensions while preserving aspect ratio
    const scale = Math.min(width / img.width, height / img.height);
    const scaledWidth = Math.max(1, Math.round(img.width * scale));
    const scaledHeight = Math.max(1, Math.round(img.height * scale));

    // Use the scaled dimensions as the canvas size (no padding/letterboxing)
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = scaledWidth;
    finalCanvas.height = scaledHeight;

    // Choose output type: keep original type for best quality
    const originalType = file.type || "image/jpeg";
    const outputType =
      originalType === "image/png" || originalType === "image/webp"
        ? originalType
        : "image/jpeg";

    // Perform high-quality resize directly to final canvas
    await pica.resize(img, finalCanvas, {
      unsharpAmount: 160,
      unsharpRadius: 0.6,
      unsharpThreshold: 1,
      quality: 3, // Maximum quality (0-3, where 3 is highest)
    });

    // Create blob from canvas with maximum quality
    const quality = outputType === "image/jpeg" ? 0.95 : 1.0;
    const blob = await pica.toBlob(finalCanvas, outputType, quality);

    // Ensure filename extension matches output type
    const ext = outputType.split("/")[1] || "jpg";
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const newName = `${baseName}.${ext}`;

    return new File([blob], newName, { type: outputType });
  };

  useEffect(() => {
    if (fileRejections && fileRejections.length) {
      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((e) => {
          if (e.code === "too-many-files") {
            notifyError(
              `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`,
            );
          } else {
            notifyError(e.message);
          }
        });
      });
    }

    if (!files || files.length === 0) return;

    // Upload each file
    files.forEach((file) => {
      if (
        product &&
        (imageUrl?.length || 0) + files.length >
          globalSetting?.number_of_image_per_product
      ) {
        return notifyError(
          `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`,
        );
      }

      setLoading(true);
      setError("Uploading....");

      console.log(
        `⬆️ Uploading to Cloudinary: ${file.name}, Size: ${(file.size / 1024).toFixed(2)}KB`,
      );

      const name = file.name.replaceAll(/\s/g, "");
      const public_id = name?.substring(0, name.lastIndexOf(".")) || name;

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET,
      );
      formData.append("cloud_name", import.meta.env.VITE_APP_CLOUD_NAME);
      formData.append("folder", folder);
      formData.append("public_id", public_id);

      axios({
        url: import.meta.env.VITE_APP_CLOUDINARY_URL,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      })
        .then((res) => {
          notifySuccess("Image Uploaded successfully!");
          setLoading(false);
          if (product) {
            setImageUrl((imgUrl) => [...(imgUrl || []), res.data.secure_url]);
          } else {
            setImageUrl(res.data.secure_url);
          }
        })
        .catch((err) => {
          console.error("err", err);
          notifyError(err?.message || "Upload failed");
          setLoading(false);
        });
    });
  }, [files]);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files],
  );

  const handleRemoveImage = async (img) => {
    try {
      setLoading(false);
      notifyError("Image delete successfully!");
      if (product) {
        const result = imageUrl?.filter((i) => i !== img);
        setImageUrl(result);
      } else {
        setImageUrl("");
      }
    } catch (err) {
      console.error("err", err);
      notifyError(err?.message || "Remove failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      {/* Display image upload info */}
      {preserveOriginal ? (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-2 text-left font-medium">
          ✓ upload image of size 1200 X 350px or larger for best quality
        </p>
      ) : (
        targetWidth &&
        targetHeight && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-left">
            Recommended size: {targetWidth} × {targetHeight} px
          </p>
        )
      )}
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-emerald-500" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-gray-400">
          {t("imageFormat")}
          {preserveOriginal && " • Original quality preserved"}
        </em>
      </div>

      <div className="text-emerald-500">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {product ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !product && imageUrl ? (
          <div className="relative">
            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
              src={imageUrl}
              alt="product"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;
