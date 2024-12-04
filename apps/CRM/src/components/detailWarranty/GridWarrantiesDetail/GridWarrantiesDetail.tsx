"use client";
interface warrantiesDetail {
  reservationDate: string;
  reservationAmount: number;
  warrantyAmount: number;
  startDate: string;
  endDate: string;
  currencyTypes: string;
  contractDuration: string;
  warrantyTypes: string;
  coverageTypes: string;
  financingTypes: string;
  responsable:string;
  status:string
}

interface DetailWarrantiesProps {
  warranties: warrantiesDetail;
}

export const GridWarrantiesDetail = ({ warranties }: DetailWarrantiesProps) => {
  const data = [
    {
      title: "Fecha de reserva",
      value: warranties?.reservationDate || "-",
    },
    {
      title: "Valor Reserva",
      value: `${warranties?.currencyTypes} ${warranties?.reservationAmount}` || "-",
    },
    {
      title: "Valor Garantía",
      value: `${warranties.currencyTypes} ${warranties?.warrantyAmount}` || "-",
    },
    {
      title: "Inicio de garantía",
      value: warranties?.startDate || "-",
    },
    {
      title: "Fin de garantía",
      value: warranties?.endDate || "-",
    },
    {
      title: "Duración de contrato",
      value: `${warranties?.contractDuration || "-"}`,
    },
    {
      title: "Tipo de garantía",
      value: warranties?.warrantyTypes || "-",
    },
    {
      title: "Tipo de cobertura",
      value: warranties?.coverageTypes || "-",
    },
    {
      title: "Método Pago",
      value: warranties?.financingTypes || "-",
    },
    {
      title: "Responsable",
      value: warranties?.responsable || "-",
    },
    {
      title: "Estado de garantia",
      value: warranties?.status || "-",
    },
  ];

  return (
    <section className="flex flex-wrap w-full pb-2">
      {data.map((el, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 px-2 py-1 ${
            index % 4 !== 7 && index !== data.length - 1 ? "border-r border-gray-300" : ""
          }`}
        >
          <b className="text-lg font-medium">{el.title}:</b>
          <p className="text-md">{el.value}</p>
        </div>
      ))}
    </section>
  );
};
