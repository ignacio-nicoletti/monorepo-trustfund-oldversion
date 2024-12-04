import { useForm } from "react-hook-form";
import { DocumentFormSchema, DocumentFormValues } from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";

export const warrantyDocumentsController = (warrantyId: string) => {
  const { toast } = useToast();
  const [documentStates, setDocumentStates] = useState<{
    [key: string]: {
      loading: boolean;
      uploadedMainImageName: string | null;
      uploadedMainImage: string | null;
    };
  }>({});

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(DocumentFormSchema),
    defaultValues: {
      mainFolderUrl: "",
      driveFolderId: "",
      folderName: "",
      warrantorId: "",
      documentsData: [{}],
    },
  });

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleIconMainClick = (documentKey: string) => {
    const uploadedMainImage = documentStates[documentKey]?.uploadedMainImage;
    if (uploadedMainImage) {
      // Abrir la imagen en una nueva pestaña
      window.open(uploadedMainImage, "_blank");
    } else if (!uploadedMainImage && fileInputRefs.current[documentKey]) {
      // Si no hay imagen, activa el input de archivo
      fileInputRefs.current[documentKey]?.click();
    }
  };

  const checkIfValueExists = (documentIndex: number, folder?: boolean): boolean => {
    if (folder) {
      const driveFolderId = form.getValues("driveFolderId");
      return !!driveFolderId;
    } else {
      const documentsData = form.getValues("documentsData");
      return !!documentsData[documentIndex]?.url;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    documentIndex: number,
    docId: number,
    docType: string
  ) => {
    const documentKey = `${documentIndex}`;
    const file = e.target.files?.[0];
  
    if (!file) {
      return toast({
        variant: "destructive",
        title: "No se agregó un archivo.",
      });
    }
  
    const mainFolderUrl = form.getValues("mainFolderUrl");
    if (!mainFolderUrl || !mainFolderUrl.includes("https://drive.google.com")) {
      return toast({
        variant: "destructive",
        title: "No se agregó el link de la carpeta principal o es inválido",
      });
    }
  
    const folderName = form.getValues("folderName");
    if (!folderName?.length) {
      return toast({
        variant: "destructive",
        title: "No se encontró el nombre del solicitante",
      });
    }
  
    const warrantorId = form.getValues("warrantorId");
    if (!warrantorId?.length) {
      return toast({
        variant: "destructive",
        title: "Debe cargar un solicitante para poder agregar un documento",
      });
    }
  
    setDocumentStates((prev) => {
      const previousState = prev[documentKey] || {
        loading: false,
        uploadedMainImageName: null,
        uploadedMainImage: null,
      };
      return {
        ...prev,
        [documentKey]: {
          ...previousState,
          loading: true,
        },
      };
    });
  
    const checkDocExists = checkIfValueExists(documentIndex);
    if (checkDocExists) {
      const docsForm = form.getValues(`documentsData.${documentIndex}`);
      const driveFolderId = form.getValues(`driveFolderId`);
  
      const response = await fetch("/api/uploadToDrive", {
        method: "PUT",
        body: JSON.stringify({
          dbId: docsForm?.id?.length ? docsForm.id : null,
          fileUrl: docsForm.url,
          folderId: driveFolderId,
        }),
      });
  
      if (!response.ok) {
        setDocumentStates((prev) => {
          const previousState = prev[documentKey] || {
            loading: false,
            uploadedMainImageName: null,
            uploadedMainImage: null,
          };
          return {
            ...prev,
            [documentKey]: {
              ...previousState,
              loading: false,
            },
          };
        });
        return toast({
          variant: "destructive",
          title: "Fallo al reemplazar el archivo",
        });
      }
  
      form.setValue(`documentsData.${documentIndex}`, {
        id: undefined,
        url: undefined,
        name: undefined,
        warrantyDocumentTypesId: docId,
        warrantyId: warrantyId,
      });
    }
  
    const formData = new FormData();
    formData.append("folderUrl", mainFolderUrl);
    formData.append("documentType", docType);
    formData.append("documentId", `${docId}`);
    formData.append("folderName", folderName);
    formData.append("warrantorId", warrantorId);
    formData.append("warrantyId", warrantyId);
    formData.append("file", file);
  
    const response = await fetch("/api/uploadToDrive", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) {
      setDocumentStates((prev) => {
        const previousState = prev[documentKey] || {
          loading: false,
          uploadedMainImageName: null,
          uploadedMainImage: null,
        };
        return {
          ...prev,
          [documentKey]: {
            ...previousState,
            loading: false,
          },
        };
      });
      return toast({
        variant: "destructive",
        title: "Fallo al adjuntar el archivo",
      });
    }
  
    const data = await response.json();
    const uploadedFileName = data.fileId;
  
    if (data.webViewLink && data.name && data.dbId) {
      form.setValue(`documentsData.${documentIndex}`, {
        id: data.dbId,
        url: data.webViewLink,
        name: data.name,
        warrantyDocumentTypesId: docId,
        warrantyId: form.getValues(`documentsData.${documentIndex}.warrantyId`),
      });
  
      const folderExists = checkIfValueExists(documentIndex, true);
      if (!folderExists && data.folderId) {
        form.setValue(`driveFolderId`, data.folderId);
      }
    }
  
    const docsForm = form.getValues(`documentsData.${documentIndex}`);
    setDocumentStates((prev) => {
      const previousState = prev[documentKey] || {
        loading: false,
        uploadedMainImageName: null,
        uploadedMainImage: null,
      };
      return {
        ...prev,
        [documentKey]: {
          uploadedMainImageName: docsForm.name!,
          uploadedMainImage: docsForm.url!,
          loading: false,
        },
      };
    });
  
    console.log(`File uploaded successfully: ${uploadedFileName}`);
  };
  

  const handleDeleteImagePrimary = async (documentIndex: number) => {
    const documentKey = `${documentIndex}`;
    setDocumentStates((prev) => {
      const previousState = prev[documentKey] || {
        loading: false,
        uploadedMainImageName: null,
        uploadedMainImage: null,
      };
      return {
        ...prev,
        [documentKey]: {
          ...previousState,
          loading: true,
        },
      };
    });

    const docsForm = form.getValues(`documentsData.${documentIndex}`);
    const warrantyFolderId = form.getValues(`driveFolderId`);

    const response = await fetch("/api/uploadToDrive", {
      method: "PUT",
      body: JSON.stringify({
        dbId: docsForm?.id ? docsForm.id : null,
        fileUrl: docsForm.url,
        folderId: warrantyFolderId,
      }),
    });

    if (!response.ok) {
      setDocumentStates((prev) => {
        const previousState = prev[documentKey] || {
          loading: false,
          uploadedMainImageName: null,
          uploadedMainImage: null,
        };
        return {
          ...prev,
          [documentKey]: {
            ...previousState,
            loading: false,
          },
        };
      });
      return toast({
        variant: "destructive",
        title: "Fallo al eliminar el archivo",
      });
    } else {
      const res = await response.json();

      if (res?.message && res?.message.includes("carpeta")) {
        form.setValue("driveFolderId", undefined);
      }
      form.setValue(`documentsData.${documentIndex}`, {
        id: undefined,
        url: undefined,
        name: undefined,
        warrantyDocumentTypesId: undefined,
        warrantyId: undefined,
      });

      setDocumentStates((prev) => {
        const previousState = prev[documentKey] || {
          loading: false,
          uploadedMainImageName: null,
          uploadedMainImage: null,
        };
        return {
          ...prev,
          [documentKey]: {
            uploadedMainImageName: null,
            uploadedMainImage: null,
            loading: false,
          },
        };
      });
    }

    window.location.reload();
  };

  return { form, handleDeleteImagePrimary, handleFileChange, handleIconMainClick, fileInputRefs, documentStates, setDocumentStates };
};
