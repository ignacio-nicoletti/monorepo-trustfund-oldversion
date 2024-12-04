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
import { usePathname } from "next/navigation";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { LucidePaperclip } from "lucide-react";
import { Loading } from "@repo/ui/components/Loading/Loading.tsx";
import { warrantyDocumentsController } from "./requestDocumentsWarranty.controller";
import { WarrantiesWithRelations } from "../ExtraComponents/returnTypes";
import { getCurrentMainFolderUrl } from "../MainFolder/helpers";
import NoData from "~/src/components/NoData/NoData";

interface Props {
  mockData: MockData;
  data: WarrantiesWithRelations | undefined;
}

function RequestDocumentsWarranty({ mockData, data }: Props) {
  const location = usePathname();
  const warrantyId = location?.split("/").pop();
  const [currentUrl, setCurrentUrl] = useState(getCurrentMainFolderUrl(mockData));

  const {
    form,
    handleDeleteImagePrimary,
    handleFileChange,
    handleIconMainClick,
    fileInputRefs,
    documentStates,
    setDocumentStates,
  } = warrantyDocumentsController(warrantyId!);

  const setFormValues = () => {
    let warrantorRequester = data?.warrantorsWithRelations?.find((elem) => elem?.isRequester);

    let docs = data?.warrantyWithRelations?.warranties?.documentsData;
    let formData;
    let initialDocumentStates: any = {};

    if (docs?.length) {
      formData = docs.map((elem, index) => {
        initialDocumentStates[elem?.warrantyDocumentTypesId! - 1] = {
          loading: false,
          uploadedMainImageName: elem?.name || null,
          uploadedMainImage: elem?.url || null,
        };
        return {
          id: elem?.id || undefined,
          url: elem?.url || undefined,
          name: elem?.name || undefined,
          file: null,
          warrantyDocumentTypesId: elem?.warrantyDocumentTypesId || undefined,
          warrantyId: elem?.warrantyId!,
        };
      });
    } else {
      formData = mockData?.warrantyDocumentTypes?.map((document, index) => {
        initialDocumentStates[index] = {
          loading: false,
          uploadedMainImageName: null,
          uploadedMainImage: null,
        };
        return {
          id: "",
          url: "",
          name: "",
          file: null,
          warrantyDocumentTypesId: document?.id,
          warrantyId: warrantyId,
        };
      });
    }

    form.reset({
      mainFolderUrl: currentUrl,
      driveFolderId: warrantorRequester?.driveFolderId || "",
      folderName: warrantorRequester?.folderName || "",
      warrantorId: warrantorRequester?.id?.length ? warrantorRequester.id : "",
      documentsData: formData,
    });

    setDocumentStates(initialDocumentStates);
  };

  useEffect(() => {
    setFormValues();
  }, [currentUrl, data?.warrantyWithRelations]);

  if (!mockData) return <NoData dataType="documentos" />;

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6 items-center text-center w-full">
        <fieldset className="border w-full px-5 py-2 text-end rounded-lg border-foreground">
          <legend className="hidden sm:inline w-auto font-bold">Documentos de la garantía</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 py-5 gap-5">
            {mockData.warrantyDocumentTypes.map((document, dIndex) => {
              const documentKey = `${dIndex}`;
              const documentState = documentStates[documentKey] || {
                loading: false,
                uploadedMainImageName: null,
                uploadedMainImage: null,
              };

              return (
                <FormField
                  key={document.id}
                  control={form.control}
                  name={`documentsData.${dIndex}.file`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label
                        className="text-start flex w-full"
                        htmlFor={`documentsData.${dIndex}.file`}
                      >
                        {document.type}
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
                                handleFileChange(e, dIndex, document.id, document.type!);
                              }}
                              placeholder={`Subir ${document.type}`}
                            />
                          </div>

                          {documentState.uploadedMainImage && !documentState.loading ? (
                            <Button
                              type="button"
                              className="text-red-400 text-xl bg-transparent p-2 h-3 mb-1 hover:bg-transparent hover:text-red-600 ease-in-out transition-all duration-1000"
                              onClick={() => handleDeleteImagePrimary(dIndex)}
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
        </fieldset>
      </form>
    </Form>
  );
}

export default RequestDocumentsWarranty;
