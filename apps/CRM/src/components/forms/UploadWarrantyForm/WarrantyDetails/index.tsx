import React, { useEffect, useState } from "react";

import { MockData } from "~/src/server-actions/getMocks";

import { Button } from "@repo/ui/components/ui/button.tsx";
import { Label } from "@repo/ui/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select.tsx";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { warrantyDetailsFormController } from "./warrantyForm.controller";
import { Quota } from "./types/warrantyForm.types";
import { Form } from "@repo/ui/components/ui/form.tsx";
import InputNumber from "@components/forms/inputs/inputNumber";
import DataQuotaTable from "~/src/components/Tables/DataQuotaTable/DataQuotaTable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover.tsx";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@repo/ui/components/ui/calendar.tsx";

import type {
  WarrantyWithRelations,
} from "../ExtraComponents/returnTypes";
import { calculatingPayments } from "./helpers";

interface Props {
  mockData: MockData;
  warrantyWithRelations: WarrantyWithRelations | undefined;
}

function WarrantyDetails({ mockData, warrantyWithRelations }: Props) {
  const [quotas, setQuotas] = useState<Quota[] | any>();

  const { form, onSubmit } = warrantyDetailsFormController(
    warrantyWithRelations
  );

  useEffect(() => {
    if (warrantyWithRelations) {
      if (warrantyWithRelations.quotas) {
        setQuotas(
          warrantyWithRelations.quotas.sort(
            (a, b) => a.numberOfQuota - b.numberOfQuota
          )
        );
        form.reset({
          reservationAmount:
            warrantyWithRelations.warranties?.reservationAmount?.toString() ??
            "0",
          warrantyAmount:
            warrantyWithRelations.warranties?.warrantyAmount?.toString() ?? "0",
          warrantyAmountLessReservation:
            warrantyWithRelations.warranties?.warrantyAmountLessReservation?.toString() ??
            "0",
          contractDuration:
            warrantyWithRelations.warranties?.contractDuration ?? "",
          financingTypeId:
            warrantyWithRelations.warranties?.financingTypeId?.toString() ??
            "1",
          currencyTypeId:
            warrantyWithRelations.warranties?.currencyTypeId?.toString() ??
            undefined,
          dollarTypeId:
            warrantyWithRelations.warranties?.dollarTypeId?.toString() ?? "",
          warrantyTypeId:
            warrantyWithRelations.warranties?.warrantyTypeId?.toString() ?? "1",
          coverageTypeId:
            warrantyWithRelations.warranties?.coverageTypeId?.toString() ?? "1",
          contractInitDate: warrantyWithRelations?.datePeriods?.startDate
            ? new Date(
                warrantyWithRelations.datePeriods?.startDate!
              ).toISOString()
            : "",
          contractEndDate: warrantyWithRelations?.datePeriods?.endDate
            ? new Date(
                warrantyWithRelations.datePeriods?.endDate!
              ).toISOString()
            : "",
          reservationDate: warrantyWithRelations.warranties?.reservationDate
            ? new Date(
                warrantyWithRelations.warranties?.reservationDate
              ).toISOString()
            : "",
          userId: warrantyWithRelations.warranties?.userId ?? "",
          province: warrantyWithRelations.addresses?.province ?? "",
          city: warrantyWithRelations.addresses?.city ?? "",
          street: warrantyWithRelations.addresses?.street ?? "",
          intersectionOne:
            warrantyWithRelations.addresses?.intersectionOne ?? "",
          intersectionTwo:
            warrantyWithRelations.addresses?.intersectionTwo ?? "",
          number: warrantyWithRelations.addresses?.number?.toString() ?? "",
          postal_code: warrantyWithRelations.addresses?.postalCode ?? "",
          quotas: quotas,
          documentsData: undefined,
          statusWarrantyId:
            warrantyWithRelations.warranties?.statusWarrantyId ?? 1,
        });
      }
    }
  }, [warrantyWithRelations, form]);

  //validar que estos campos del formulario esten completos
  const formValues = form.watch();

  // Lógica para determinar si el botón de generar cuotas debe estar habilitado o no
  const isButtonDisabled =
    !formValues.reservationAmount ||
    !formValues.reservationDate ||
    !formValues.warrantyAmount ||
    !formValues.financingTypeId;

  const calculating = async () => {
    const fieldsToValidate = [
      "reservationAmount",
      "reservationDate",
      "warrantyAmount",
      "financingTypeId",
    ] as const;

    // Validación de los campos requeridos
    const isStepValid = await form.trigger(fieldsToValidate);

    if (!isStepValid) {
      return;
    }

    // Obtener valores del formulario
    const financingTypeId = formValues?.financingTypeId;
    const cuotas =
      financingTypeId === "2" ? "3" : financingTypeId === "3" ? "6" : "Contado";

    // values necesarios para calcular
    const values = {
      valorReserva: Number(formValues?.reservationAmount)!,
      totalGarantia: Number(formValues?.warrantyAmount)!,
      cuotas: cuotas === "Contado" ? "Contado" : Number(cuotas),
      reservationDate: formValues?.reservationDate!,
    };

    // Calcular las cuotas
    const result = calculatingPayments(values);
    if (Array.isArray(result)) {
      // Asignar resultado a warrantyDetails.quotas en el formulario
      setQuotas(result);
      form.setValue("quotas", result);
    } else {
      console.error(result.message, "Ocurrió un error");
    }
  };

  return (
    <Form {...form}>
      <form>
        <fieldset className="border px-5 py-2 text-end  rounded-lg border-foreground">
          <legend className="hidden sm:inline ">
            Detalles de la <strong>garantía</strong>
          </legend>
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-4  py-5  gap-5">
            <FormField
              control={form.control}
              name="reservationDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full!" htmlFor="web">
                    Fecha de la reserva
                  </Label>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={
                            "justify-start text-left font-normal bg-primary/15 w-full border border-primary/30 hover:bg-primary/30"
                          }
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? new Date(field.value).toLocaleDateString()
                            : "Ingrese una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          initialFocus
                          {...field} // This passes the necessary field properties to Calendar
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reservationAmount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    className="text-start flex w-full"
                    htmlFor="reservationAmount"
                  >
                    Valor de la reserva
                  </Label>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      id="reservationAmount"
                      placeholder="Valor de la reserva"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractInitDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="web">
                    Inicio del contrato
                  </Label>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={
                            "justify-start text-left font-normal bg-primary/15 w-full border border-primary/30 hover:bg-primary/30"
                          }
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? new Date(field.value).toLocaleDateString()
                            : "Ingrese una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          initialFocus
                          disabled={(date) => {
                            const initDate = new Date(
                              form.watch("reservationDate")
                            ); // Obtener la fecha de inicio del contrato
                            return date < initDate; // Deshabilitar fechas anteriores a la fecha de inicio
                          }}
                          classNames={{
                            day_disabled:
                              "bg-gray-300 text-gray-400 cursor-not-allowed", // Personaliza cómo se ven las fechas deshabilitadas
                          }}
                          {...field} // This passes the necessary field properties to Calendar
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractEndDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="web">
                    Fin del contrato
                  </Label>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={
                            "justify-start text-left font-normal bg-primary/15 w-full border border-primary/30 hover:bg-primary/30"
                          }
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? new Date(field.value).toLocaleDateString()
                            : "Ingrese una fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          initialFocus
                          disabled={(date) => {
                            const initDate = new Date(
                              form.watch("contractInitDate")
                            ); // Obtener la fecha de inicio del contrato
                            return date < initDate; // Deshabilitar fechas anteriores a la fecha de inicio
                          }}
                          classNames={{
                            day_disabled:
                              "bg-gray-300 text-gray-400 cursor-not-allowed", // Personaliza cómo se ven las fechas deshabilitadas
                          }}
                          {...field}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="warrantyAmount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    className="text-start flex w-full"
                    htmlFor="warrantyAmount"
                  >
                    Total garantía
                  </Label>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      id="warrantyAmount"
                      placeholder="Total garantía"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractDuration"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    className="text-start flex w-full"
                    htmlFor="contractDuration"
                  >
                    Duración del contrato
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      id={"contractDuration"}
                      placeholder="Duración del contrato"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="financingTypeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="text-start flex w-full"
                  >
                    Cantidad de cuotas
                  </Label>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          "w-full bg-primary/15 border border-primary/30"
                        }
                      >
                        <SelectValue
                          placeholder={
                            field?.value
                              ? field.value
                              : "Elige tipo de financiamiento"
                          }
                          className="text-slate-400!"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData?.financingTypes &&
                          mockData.financingTypes.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currencyTypeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="text-start flex w-full"
                  >
                    Tipo de moneda
                  </Label>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          "w-full bg-primary/15 border border-primary/30"
                        }
                      >
                        <SelectValue
                          placeholder="Elige un tipo de moneda"
                          className="text-slate-400!"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData?.currencyTypes &&
                          mockData.currencyTypes.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dollarTypeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="text-start flex w-full"
                  >
                    Tipo de dolar
                  </Label>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form?.getValues("currencyTypeId") === "1"}
                    >
                      <SelectTrigger
                        className={
                          "w-full bg-primary/15 border border-primary/30"
                        }
                      >
                        <SelectValue
                          placeholder="Elige un tipo de dolar"
                          className="text-slate-400!"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData?.dollarTypes &&
                          mockData.dollarTypes.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warrantyTypeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="text-start flex w-full"
                  >
                    Tipo de garantía
                  </Label>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          "w-full bg-primary/15 border border-primary/30"
                        }
                      >
                        <SelectValue
                          placeholder="Elige un tipo de garantía"
                          className="text-slate-400!"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData?.warrantyTypes &&
                          mockData.warrantyTypes.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverageTypeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    htmlFor={field.name}
                    className="text-start flex w-full"
                  >
                    Tipo de cobertura
                  </Label>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={
                          "w-full bg-primary/15 border border-primary/30"
                        }
                      >
                        <SelectValue
                          placeholder="Elige un tipo de cobertura"
                          className="text-slate-400!"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData?.coverageTypes &&
                          mockData.coverageTypes.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.type}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* //Agregar Address de la propiedad a la que el solicitante se va a mudar dsp */}
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="province">
                    Provincia
                  </Label>
                  <FormControl>
                    <Input placeholder="Provincia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="localidad">
                    Localidad
                  </Label>
                  <FormControl>
                    <Input placeholder="Localidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="street">
                    Calle principal *
                  </Label>
                  <FormControl>
                    <Input placeholder="Calle principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intersectionOne"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    className="text-start flex w-full"
                    htmlFor="intersectionOne"
                  >
                    Interseccion 1 *
                  </Label>
                  <FormControl>
                    <Input placeholder="Intersección 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intersectionTwo"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    className="text-start flex w-full"
                    htmlFor="intersectionTwo"
                  >
                    Interseccion 2
                  </Label>
                  <FormControl>
                    <Input placeholder="Intersección 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label className="text-start flex w-full" htmlFor="number">
                    Número de propiedad
                  </Label>
                  <FormControl>
                    <InputNumber
                      id={"number"}
                      placeHolder="Número de propiedad"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem className="w-full">
                  <Label
                    className="text-start flex w-full"
                    htmlFor="postal_code"
                  >
                    Código Postal
                  </Label>
                  <FormControl>
                    <InputNumber
                      id={"postal_code"}
                      placeHolder="Código Postal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {quotas && quotas?.length > 0 ? (
            <fieldset className="border max-w-[300px] md:max-w-full md:w-full flex gap-5 p-5 mt-5 rounded-lg border-foreground max-h-[400px] overflow-y-auto overflow-x-auto">
              <legend>
                Resumen de las <strong>cuotas</strong>
              </legend>
              <DataQuotaTable
                quotas={quotas}
                setQuotas={setQuotas}
                form={form}
                // w="1/2"
                currency={
                  warrantyWithRelations?.currencyTypes?.type
                    ? warrantyWithRelations?.currencyTypes?.type
                    : form.getValues("currencyTypeId") &&
                        form.getValues("currencyTypeId") === "1"
                      ? "ARS"
                      : "USD"
                }
              />
            </fieldset>
          ) : null}
          <div className="w-auto gap-5 mt-5 ml-auto flex flex-col sm:flex-row  justify-end">
            <Button
              onClick={() => calculating()}
              disabled={isButtonDisabled}
              type="button"
              className="bg-primary  duration-100 hover:bg-primary/80 "
            >
              Generar cuotas
            </Button>
            {quotas && quotas?.length > 0 ? (
              <Button
                type="button"
                onClick={(e) => onSubmit(formValues)}
                className="bg-primary  duration-100 hover:bg-primary/80"
              >
                Cargar datos
              </Button>
            ) : null}
          </div>
        </fieldset>
      </form>
    </Form>
  );
}

export default WarrantyDetails;
