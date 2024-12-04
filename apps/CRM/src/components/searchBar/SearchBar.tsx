"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input.tsx";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/components/ui/command.tsx";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import useDebounce from "~/src/utils/debounce";
import { RealStateValidateFormSchema } from "../forms/UploadWarrantyForm/RealEstateData/realStateValidate/realStateValidate";

type Item = {
  name: string | null;
  id?: string;
};
type Props = {
  form: UseFormReturn<z.infer<typeof RealStateValidateFormSchema>>;
};

export default function Searchbar({ form }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      fetch(`/api/inmobiliarias/search?searchTerm=${debouncedSearchTerm}`)
        .then((response) => response.json())

        .then((data) => {
          if (Array.isArray(data)) {
            setResults(data);
          } else {
            setResults([]);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  // Handle click outside the search bar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedItem: any) => {
    const [name, agent] = selectedItem?.name!.split(" - ");
    //busco por id
    fetch(`/api/inmobiliarias/${selectedItem?.id}`)
      .then((response) => response.json())
      .then((data) => {
        form.reset({
          id: data.inmobiliarias.id || "",
          name: name || "",
          inmoAgent: agent || "",
          email: data.inmobiliarias.email || "",
          phone: data.inmobiliarias.phone || "",
          province: data.addresses.province || "",
          city: data.addresses.city || "",
          street: data.addresses.street || "",
          country: data.addresses.country || "",
          intersectionOne: data.addresses.intersectionOne || "",
          intersectionTwo: data.addresses.intersectionTwo || "",
          number: data.addresses.number || "",
          apartment: data.addresses.apartment || "",
          postal_code: data.addresses.postal_code || "",
        });
      });

    setSearchTerm(selectedItem?.name!);
    setIsOpen(false);
  };

  return (
    <div className="relative xl:w-1/2 w-full" ref={searchRef}>
      <div className="relative flex items-center">
        <Search className="absolute m-auto left-2 top-2.5 w-4 text-black  " />
        <Input
          type="text"
          placeholder="Buscar por nombre de inmobiliaria"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-8"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-results"
        />
      </div>
      {isOpen && (
        <Command
          className={`absolute top-full w-full ${results.length > 0 ? "h-[250px]" : "h-auto"} mt-1 border rounded-md shadow-md`}
        >
          <CommandList id="search-results">
            <CommandGroup>
              {isLoading ? (
                <CommandItem disabled>Loading...</CommandItem>
              ) : results.length === 0 ? (
                <CommandEmpty>No se encontró la inmobiliaria.</CommandEmpty>
              ) : (
                results.map((result, index) => (
                  <CommandItem key={index} onSelect={() => handleSelect(result)} role="option">
                    {result?.name ? result?.name : "No existe la inmobiliaria"}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  );
}
