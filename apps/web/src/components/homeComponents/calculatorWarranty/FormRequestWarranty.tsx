'use client'

import { Button } from "@repo/ui/components/ui/button.tsx";
import Image from "next/image";
import arrow_right from "@/assets/arrowIcons/arrow-right.svg";
import { useState, ChangeEvent } from "react";

interface FormRequestWarrantyProps {
  setShowFormWarranty: (value: boolean) => void;
  setShowCardsQuotes: (value: boolean) => void;
}

interface Form {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  DNI: string;
  location: string;
}

const FormRequestWarranty: React.FC<FormRequestWarrantyProps> = ({
  setShowFormWarranty,
  setShowCardsQuotes,
}) => {
  const [formUser, setFormUser] = useState<Form>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    DNI: "",
    location: "",
  });

  // Handler for input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormUser((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    formUser;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[#ECECEC]  rounded-[10px] shadow-lg relative gap-4 p-5 max-xl:w-auto">
      <div className="flex w-full items-center justify-center">
        <p className="w-1/2 text-2xl font-semibold text-maincolor">
          Obtené tu garantía
        </p>
        <p className="w-1/2 text-xs font-semibold opacity-[60%]">
          Completá tus datos personales para solicitar tu garantía.
        </p>
      </div>

      {/* Grid layout for the inputs */}
      <div className="grid grid-cols-3 gap-6 w-full">
        <input
          type="text"
          name="name"
          placeholder="Nombre/s"
          className="p-2 rounded-[10px] flex-1"
          value={formUser.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Apellido/s"
          className="p-2 rounded-[10px] flex-1"
          value={formUser.lastName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="p-2 rounded-[10px] flex-1"
          value={formUser.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="DNI"
          placeholder="DNI / Pasaporte / Cédula"
          className="p-2 rounded-[10px] flex-1"
          value={formUser.DNI}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          className="p-2 rounded-[10px] flex-1"
          value={formUser.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Localidad"
          className="p-2 rounded-[10px] flex-1"
          value={formUser.location}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-6 items-center justify-center w-full">
        <Button
          variant="default"
          className="px-8 py-6 bg-white text-maincolor border-maincolor border-2 w-1/2"
          onClick={() => {
            setShowFormWarranty(true);
            setShowCardsQuotes(false);
          }}
        >
          Volver a calcular
        </Button>
        <Button
          variant="default"
          className="px-8 py-6 w-1/2"
          onClick={() => onSubmit()}
        >
          Solicitá tu garantía
           <img
            alt="arrow-right"
            src={arrow_right.src}
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </Button>
      </div>
    </div>
  );
};

export default FormRequestWarranty;
