"use client";

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface UbicationInterfaces {
  id: string;
  value?: string;
  name: string;
}

interface ComboboxDemoProps {
  items: UbicationInterfaces[];
  onSelect: (value: string) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setUbicationSelected: React.Dispatch<React.SetStateAction<string>>;
}

export function ComboboxDemo({
  items,
  onSelect,
  searchTerm,
  setSearchTerm,
  setUbicationSelected,
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);

  // Filtrar elementos basados en el término de búsqueda
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar el cambio en el término de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // Abrir el Popover solo si hay coincidencias
    if (filteredItems.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  // Manejar el clic fuera del Popover para cerrarlo
  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".popover-content")) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <input
          type="text"
          placeholder="Search location..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-1 border-none focus:outline-none w-full "
        />
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command>
          <CommandList>
            {filteredItems.length === 0 ? (
              <CommandEmpty>No options found.</CommandEmpty>
            ) : (
              searchTerm !== "" && (
                <CommandGroup>
                  {filteredItems.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        onSelect(currentValue);
                        setOpen(false); // Cerrar el Popover después de seleccionar
                        setSearchTerm(currentValue); // Limpiar el término de búsqueda
                        setUbicationSelected(currentValue);
                      }}
                    >
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
