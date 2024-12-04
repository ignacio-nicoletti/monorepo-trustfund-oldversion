import { useForm } from "react-hook-form";
import { DocumentFormSchema, DocumentFormValues } from "./validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";

export const warrantorDocumentsController = () => {
  const { toast } = useToast();
  const [documentStates, setDocumentStates] = useState<{
    [key: string]: {
      loading: boolean;
      uploadedMainImageName: string | null;
      uploadedMainImage: string | null;
    };
  }>({});

  // Inicializa el formulario
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(DocumentFormSchema),
    defaultValues: {
      mainFolderUrl: "",
      driveFolderId: "",
      folderName: "",
      warrantors: [],
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

  // Función que verifica si un valor existe
  const checkIfValueExists = (
    warrantorIndex: number,
    documentIndex?: number,
    folder?: boolean
  ): boolean => {
    if (folder) {
      const driveFolderId = form.getValues("driveFolderId");
      return !!driveFolderId;
    } else {
      const warrantors = form.getValues("warrantors");
      return !!warrantors[warrantorIndex]?.documentsData[documentIndex!]?.url;
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    warrantorIndex: number,
    documentIndex: number,
    docId: number,
    docType: string
  ) => {
    const documentKey = `${warrantorIndex}-${documentIndex}`;

    // Establece loading a true para este documento
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

    const file = e.target.files?.[0];

    // Checkeo que se haya adjuntado un archivo
    if (!file) {
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
        title: "No se agregó un archivo.",
      });
    }

    // Checkeo que se haya cargado una URL válida de la carpeta principal
    const mainFolderUrl = form.getValues("mainFolderUrl");
    if (!mainFolderUrl || !mainFolderUrl.includes("https://drive.google.com")) {
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
        title: "No se agregó el link de la carpeta principal o es inválido",
      });
    }

    const folderName = form.getValues("folderName");
    if (!folderName?.length) {
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
        title: "No se encontró el nombre del solicitante",
      });
    }

    // Checkeo si ya se agregó un archivo a ese campo y lo elimino en ese caso
    const checkDocExists = checkIfValueExists(warrantorIndex, documentIndex);
    if (checkDocExists) {
      const docsForm = form.getValues(
        `warrantors.${warrantorIndex}.documentsData.${documentIndex}`
      );
      const warrantorFolderId = form.getValues(`driveFolderId`);

      const response = await fetch("/api/uploadToDrive", {
        method: "PUT",
        body: JSON.stringify({
          dbId: docsForm?.id?.length ? docsForm.id : null,
          fileUrl: docsForm.url,
          folderId: warrantorFolderId,
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

      form.setValue(
        `warrantors.${warrantorIndex}.documentsData.${documentIndex}`,
        {
          id: undefined,
          url: undefined,
          name: undefined,
          warrantorDocumentTypesId: docsForm.warrantorDocumentTypesId,
          warrantorId: docsForm.warrantorId,
        }
      );
    }

    const formData = new FormData();
    formData.append("folderUrl", mainFolderUrl);
    formData.append("documentType", docType);
    formData.append("documentId", `${docId}`);
    formData.append(
      "warrantorName",
      form.getValues(`warrantors.${warrantorIndex}.warrantorName`) || ""
    );
    formData.append("folderName", folderName);
    formData.append(
      "warrantorId",
      form.getValues(`warrantors.${warrantorIndex}.id`) || ""
    );
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
    if (data.webViewLink && data.name && data.dbId) {
      form.setValue(
        `warrantors.${warrantorIndex}.documentsData.${documentIndex}`,
        {
          id: data.dbId,
          url: data.webViewLink,
          name: data.name,
          warrantorDocumentTypesId: form.getValues(
            `warrantors.${warrantorIndex}.documentsData.${documentIndex}.warrantorDocumentTypesId`
          ),
          warrantorId: form.getValues(
            `warrantors.${warrantorIndex}.documentsData.${documentIndex}.warrantorId`
          ),
        }
      );

      const driveFolderId = form.getValues(`driveFolderId`);
      if (!driveFolderId && data.folderId) {
        form.setValue(`driveFolderId`, data.folderId);
        localStorage.setItem("driveFolderId", data.folderId);
      }
    }

    const docsForm = form.getValues(
      `warrantors.${warrantorIndex}.documentsData.${documentIndex}`
    );

    setDocumentStates((prev) => ({
      ...prev,
      [documentKey]: {
        uploadedMainImageName: docsForm.name!,
        uploadedMainImage: docsForm.url!,
        loading: false,
      },
    }));

    return toast({
      variant: "success",
      title: "Archivo cargado exitosamente",
    });
  };

  const handleDeleteImagePrimary = async (
    warrantorIndex: number,
    documentIndex: number
  ) => {
    const documentKey = `${warrantorIndex}-${documentIndex}`;
    // Borro el archivo del drive, limpio el formulario y los estados del input
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
    let docsForm = form.getValues(
      `warrantors.${warrantorIndex}.documentsData.${documentIndex}`
    );
    let warrantorFolderId = form.getValues(`driveFolderId`);

    const response = await fetch("/api/uploadToDrive", {
      method: "PUT",
      body: JSON.stringify({
        dbId: docsForm?.id ? docsForm.id : null,
        fileUrl: docsForm.url,
        folderId: warrantorFolderId,
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
      let res = await response.json();

      if (res?.message && res?.message.includes("carpeta")) {
        form.setValue("driveFolderId", undefined);
      }
      form.setValue(
        `warrantors.${warrantorIndex}.documentsData.${documentIndex}`,
        {
          id: undefined,
          url: undefined,
          name: undefined,
          warrantorDocumentTypesId: undefined,
          warrantorId: undefined,
        }
      );

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
  return {
    form,
    handleDeleteImagePrimary,
    handleFileChange,
    handleIconMainClick,
    fileInputRefs,
    documentStates,
    setDocumentStates,
  };
};
