import { useEffect, useState } from "react";
import { Label } from "@repo/ui/components/ui/label.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import { MockData } from "~/src/server-actions/getMocks";
import { getCurrentMainFolderUrl } from "../MainFolder/helpers";
import { WarrantiesWithRelations } from "../ExtraComponents/returnTypes";
import { usePathname } from "next/navigation";
import { Loading } from "@repo/ui/components/Loading/Loading.tsx";
import { LucidePaperclip } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { warrantorDocumentsController } from "./requestDocumentsWarrantor.controller";
import NoData from "~/src/components/NoData/NoData";

type WarrantorItem = {
  id: string;
  name: string;
  isRequester: boolean;
  driveFolderId: string | null;
  folderName: string | null;
};

interface Props {
  mockData: MockData;
  data: WarrantiesWithRelations | undefined;
}

function RequestDocumentsWarrantor({ mockData, data }: Props) {
  const location = usePathname();
  const warrantyId = location?.split("/").pop();
  const [currentUrl] = useState(getCurrentMainFolderUrl(mockData));
  const [warrantors, setWarrantors] = useState<WarrantorItem[]>([]);

  const {
    form,
    handleDeleteImagePrimary,
    handleFileChange,
    handleIconMainClick,
    fileInputRefs,
    documentStates,
    setDocumentStates,
  } = warrantorDocumentsController();

  const setFormValues = () => {
    let warrantorRequester = data?.warrantorsWithRelations?.find((elem) => elem?.isRequester);

    const initialWarrantors = data?.warrantorsWithRelations?.map((warrantor, wIndex) => {
      const warrantorDocs = warrantor?.documentsData?.length ? warrantor.documentsData : [];
      const initialDocuments = mockData?.warrantorDocumentTypes?.map((document, dIndex) => {
        const dbDocument = warrantorDocs?.find(
          (doc) => doc?.warrantorDocumentTypesId === document?.id
        );
        const documentKey = `${wIndex}-${dbDocument?.warrantorDocumentTypesId ? dbDocument.warrantorDocumentTypesId - 1 : dIndex}`;

        // Set state for each document in documentStates
        setDocumentStates((prev) => ({
          ...prev,
          [documentKey]: {
            loading: false,
            uploadedMainImageName: dbDocument?.name || null,
            uploadedMainImage: dbDocument?.url || null,
          },
        }));

        return {
          id: dbDocument?.id || "",
          url: dbDocument?.url || "",
          name: dbDocument?.name || "",
          file: null,
          warrantorDocumentTypesId: dbDocument?.warrantorDocumentTypesId || document?.id,
          warrantorId: dbDocument?.warrantorId || warrantor?.id,
        };
      });

      return {
        id: warrantor?.id || undefined,
        isRequester: warrantor?.isRequester || false,
        warrantorName:
          warrantor?.name && warrantor?.lastname
            ? `${warrantor.name} ${warrantor.lastname}`
            : undefined,
        documentsData: initialDocuments,
      };
    });

    form.reset({
      mainFolderUrl: currentUrl,
      driveFolderId: warrantorRequester?.driveFolderId || "",
      folderName: warrantorRequester?.folderName || "",
      warrantors: initialWarrantors,
    });
  };

  useEffect(() => {
    if (currentUrl && !form.getValues("mainFolderUrl")?.length) {
      form.setValue("mainFolderUrl", currentUrl);
    }

    if (warrantyId && data?.warrantorsWithRelations) {
      setFormValues();
    }

    return () => {
      setWarrantors([]);
    };
  }, [currentUrl, warrantyId, data?.warrantorsWithRelations]);

  if (!mockData) return <NoData dataType="documentos" />;
  if (!warrantors) return <NoData dataType="garantes cargados" />;

  return (
    <>
      {form.watch("warrantors")?.map((warrantor, wIndex) => (
        <Form {...form} key={warrantor.id}>
          <form className="flex flex-col gap-6 items-center text-center w-full">
            <fieldset className="border w-full px-5 py-2 text-end rounded-lg border-foreground">
              <legend className="hidden sm:inline w-auto">
                Documentos <strong>{warrantor.warrantorName}</strong>
              </legend>
              <div>
                <h3>{warrantor.warrantorName}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 py-5 gap-5">
                  {warrantor.documentsData.map((document, dIndex) => {
                    const documentKey = `${wIndex}-${dIndex}`;
                    const documentState = documentStates[documentKey] || {
                      loading: false,
                      uploadedMainImageName: null,
                      uploadedMainImage: null,
                    };

                    return (
                      <FormField
                        key={`${warrantor.id}-${document.warrantorDocumentTypesId}`}
                        control={form.control}
                        name={`warrantors.${wIndex}.documentsData.${dIndex}.file`}
                        render={(s) => (
                          <FormItem className="w-full">
                            <Label
                              className="text-start flex w-full"
                              htmlFor={`warrantors.${wIndex}.documentsData.${dIndex}.file`}
                            >
                              {
                                mockData.warrantorDocumentTypes.find(
                                  (dt) => dt.id === document.warrantorDocumentTypesId
                                )?.type
                              }
                            </Label>
                            <FormControl>
                              <div
                                className={`w-full flex items-center justify-between rounded-lg border-[1px] bg-primary/15 ${
                                  documentState.uploadedMainImage
                                    ? "border-green-500"
                                    : "border-[#E0DEF7]"
                                } cursor-pointer p-1 px-3 h-9`}
                              >
                                <div
                                  className="flex gap-2 items-center w-3/4"
                                  onClick={() => handleIconMainClick(documentKey)}
                                >
                                  {documentState.loading && !documentState.uploadedMainImage ? (
                                    <Loading />
                                  ) : (
                                    <LucidePaperclip className="w-6" />
                                  )}
                                  <p className="text-sm truncate w-full text-start">
                                    {documentState.uploadedMainImageName
                                      ? documentState.uploadedMainImageName
                                      : "Adjuntar"}
                                  </p>
                                  <Input
                                    ref={(ref) => {
                                      if (ref) {
                                        fileInputRefs.current[documentKey] = ref;
                                      }
                                    }}
                                    type="file"
                                    className="hidden"
                                    multiple={false}
                                    accept="/*"
                                    onChange={(e: any) => {
                                      handleFileChange(
                                        e,
                                        wIndex,
                                        dIndex,
                                        mockData.warrantorDocumentTypes.find(
                                          (dt) => dt.id === document.warrantorDocumentTypesId
                                        )?.id!,
                                        mockData.warrantorDocumentTypes.find(
                                          (dt) => dt.id === document.warrantorDocumentTypesId
                                        )?.type!
                                      );
                                    }}
                                    placeholder={`Subir ${
                                      mockData.warrantorDocumentTypes.find(
                                        (dt) => dt.id === document.warrantorDocumentTypesId
                                      )?.type
                                    }`}
                                  />
                                </div>

                                {documentState.uploadedMainImage && !documentState.loading ? (
                                  <Button
                                    type="button"
                                    className="text-red-400 text-xl bg-transparent p-2 h-3 mb-1 hover:bg-transparent hover:text-red-600 ease-in-out transition-all duration-1000 z-10 "
                                    onClick={() => handleDeleteImagePrimary(wIndex, dIndex)}
                                  >
                                    x
                                  </Button>
                                ) : documentState.loading && documentState.uploadedMainImage ? (
                                  <Loading />
                                ) : null}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            </fieldset>
          </form>
        </Form>
      ))}
    </>
  );
}

export default RequestDocumentsWarrantor;
