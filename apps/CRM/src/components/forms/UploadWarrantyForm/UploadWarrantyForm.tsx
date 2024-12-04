"use client";

import { Button } from "@repo/ui/components/ui/button.tsx";
import { MockData } from "~/src/server-actions/getMocks";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WarrantiesWithRelations } from "./ExtraComponents/returnTypes";
import LinksData from "./LinksData";
import RealEstateData from "./RealEstateData";
import WarrantyDetails from "./WarrantyDetails";
import MainFolder from "./MainFolder";
import ApplicantData from "./ApplicantData";
import ButtonChangeStatus from "./ExtraComponents/ButtonChangeStatus";
import { useSession } from "next-auth/react";
import RequestDocumentsWarrantor from "./RequestDocumentsWarrantor";
import RequestDocumentsWarranty from "./RequestDocumentsWarranty";
import Spinner from "../../LoadingUI/Spinner";
import { toast } from "@repo/ui/components/ui/use-toast.ts";

function UploadWarrantyForm({ mockData }: { mockData: MockData }) {
  const location = usePathname();
  const warrantyId = location?.split("/").pop();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [warrantyDataState, setWarrantyDataState] = useState<WarrantiesWithRelations | undefined>();
  const router = useRouter();
  const filteredStatusWarranty = useMemo(() => {
    if (session?.user.role === 1) {
      return mockData?.warrantyStatus.filter((status: { id: number }) => status.id < 7);
    } else {
      return mockData?.warrantyStatus;
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        if (warrantyId) {
          let data = await fetch(`/api/warranties/${warrantyId}`, {
            method: "GET",
          });
          let res = await data.json();
          setWarrantyDataState(res);

          if (res?.warrantyWithRelations?.statusWarranty.id === 7) {
            router.push("/dashboard/garantias/activas");
          } else if (res?.warrantyWithRelations?.statusWarranty.id === 8) {
            router.push("/dashboard/garantias/cerradas");
          }
        }
      } catch (error) {
        console.error("Error fetching warranty data:", error);
        setLoading(false);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    getData();

    return () => {
      setWarrantyDataState(undefined);
    };
  }, [warrantyId]); // Added warrantyId as a dependency to avoid potential issues

  const handleCancelUpdate = async () => {
    let DocumentWarrantor = warrantyDataState?.warrantorsWithRelations?.flatMap((el) => el.documentsData);
    let Documentwarranty = warrantyDataState?.warrantyWithRelations.warranties.documentsData;
    let requester = warrantyDataState?.warrantorsWithRelations.find((el) => el.isRequester);

    if (!requester?.id) {
      console.log("Fallo al eliminar el archivo: No hay un solicitante con ID.");
      return toast({
        variant: "destructive",
        title: "Fallo al eliminar el archivo",
      });
    }

    let warrantorRequests: any[] = [];
    let warrantyRequests: any[] = [];

    // Log that we are starting the deletion process
    console.log("Iniciando la eliminación de documentos...");

    // Manejar los documentos de warrantor
    if (DocumentWarrantor && DocumentWarrantor.length > 0) {
      warrantorRequests = DocumentWarrantor.map((doc) => {
        return fetch("/api/uploadToDrive", {
          method: "DELETE",
          body: JSON.stringify({
            fileUrl: doc?.url,
            folderId: requester.driveFolderId,
            dbId: doc?.id,
            warrantyId: warrantyDataState?.warrantyWithRelations.warranties.id,
          }),
        });
      }).filter(Boolean);
    }

    // Manejar los documentos de warranty
    if (Documentwarranty && Documentwarranty.length > 0) {
      warrantyRequests = Documentwarranty.map((el) => {
        if (!el?.url || !el?.id) {
          console.error("Error: falta URL o ID para el documento", el);
          return null; // Saltar documentos incompletos
        }
        return fetch("/api/uploadToDrive", {
          method: "DELETE",
          body: JSON.stringify({
            fileUrl: el?.url,
            folderId: requester.driveFolderId,
            dbId: el?.id,
            warrantyId: warrantyDataState?.warrantyWithRelations.warranties.id,
          }),
        });
      }).filter(Boolean); // Filtra los `null` si hay documentos inválidos
    }

    const allRequests = [...warrantorRequests, ...warrantyRequests];

    if (allRequests.length === 0) {
      return toast({
        variant: "destructive",
        title: "No hay documentos para eliminar",
      });
    }

    try {
      toast({
        variant: "default",
        title: "Eliminando los documentos...",
      });
      // Wait for all delete requests to complete
      await Promise.all(allRequests);

      toast({
        variant: "success",
        title: "Se borraron los documentos correctamente",
      });

      setTimeout(() => {
        window.location.reload(); // Solo recarga la página si es necesario
      }, 2000);
    } catch (error) {
      // Log error if something goes wrong
      console.error("Error al eliminar los documentos", error);

      // Show error toast if there's an issue
      toast({
        variant: "destructive",
        title: "Fallo al eliminar el archivo",
      });
    }
  };

  return (
    <>
      {loading ? (
        <section className="flex w-full min-h-screen p-0 m-0">
          <Spinner size="xl" />
        </section>
      ) : (
        <section className="flex w-full p-0 m-0 ">
          <div className="w-full flex flex-col">
            <div className=" flex justify-center items-center w-full mx-auto">
              <div className="w-full  flex flex-col gap-6">
                {/* Formulario padre */}
                <fieldset className="border  text-left w-full grid grd-rows-3 grid-cols-1 gap-4 p-5 rounded-lg border-foreground">
                  <legend className="hidden sm:inline font-bold w-auto">Formulario de garantía</legend>
                  <div className="flex flex-col-reverse items-baseline md:flex-row md:justify-between w-full gap-4">
                    <MainFolder mockData={mockData} />

                    {/* BOTON= Cambiar de estado */}
                    <ButtonChangeStatus
                      id={warrantyDataState?.warrantyWithRelations?.warranties.id!}
                      statuses={filteredStatusWarranty!}
                      currentStatus={
                        warrantyDataState?.warrantyWithRelations?.warranties?.statusWarrantyId?.toString()!
                      }
                      realStateId={warrantyDataState?.warrantyWithRelations?.inmobiliarias?.id}
                      setLoading={setLoading}
                      handleCancelUpdate={handleCancelUpdate}
                    />
                  </div>

                  {/* Campo 1 = Datos del solicitante */}
                  <ApplicantData mockData={mockData} warrantyDataState={warrantyDataState} />

                  {/* Campo para adjuntar documentos */}
                  <RequestDocumentsWarrantor mockData={mockData} data={warrantyDataState} />

                  {/* Campo 2 = Datos de la inmobiliaria */}
                  <RealEstateData
                    idInmobiliaria={warrantyDataState?.warrantyWithRelations?.inmobiliarias?.id || undefined}
                    dataInmo={warrantyDataState?.warrantyWithRelations}
                    idWarranty={warrantyDataState?.warrantyWithRelations?.warranties?.id}
                  />

                  {/* Campo 3 = Detalles de la garantia*/}
                  <WarrantyDetails
                    mockData={mockData}
                    warrantyWithRelations={warrantyDataState?.warrantyWithRelations}
                    // requester={warrantyDataState?.warrantorsWithRelations?.find(elem => elem.isRequester) ?? null}
                  />

                  {/* Campo para adjuntar documentos de la garantía */}
                  <RequestDocumentsWarranty mockData={mockData} data={warrantyDataState} />

                  {/* Campo 4 = Adjuntar Links*/}
                  <LinksData mockData={mockData} data={warrantyDataState} />
                </fieldset>
                {/* BOTONES= Cancelar && Finalizar */}
                <div className="flex justify-between">
                  {session?.user.role !== 1 && (
                    <Button
                      type="button"
                      variant={"destructive"}
                      className="w-1/4 ml-auto"
                      onClick={() => handleCancelUpdate()}
                    >
                      Cancelar carga
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default UploadWarrantyForm;
