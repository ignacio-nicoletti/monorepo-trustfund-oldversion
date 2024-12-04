import React from "react";

import { Search } from "lucide-react";

import { Input } from "@repo/ui/components/ui/input.tsx";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/components/ui/command.tsx";

import useDebounce from "~/src/utils/debounce";
import { getAllUnavailableWarrantors } from "~/src/server-actions/warrantors";

export default function WarrantorSearchBar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setIsTyping(debouncedSearchTerm.length > 0);
      setIsLoading(true);
      getAllUnavailableWarrantors(debouncedSearchTerm)
        .then((data) => {
          if (data.length > 0) {
            setResults(data);
          } else {
            setResults("");
          }
          setIsLoading(false);
          // setIsTyping(false)
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsLoading(false);
          // setIsTyping(false)
        });
    } else {
      setResults("");
      setIsTyping(false);
    }
  }, [debouncedSearchTerm]);

  // Handle click outside the search bar
  React.useEffect(() => {
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

  return (
    <div className="relative xl:w-1/2 w-full pt-5" ref={searchRef}>
      <div className="relative flex items-center">
        <Search className="absolute m-auto left-2 top-2.5 w-4 text-black  " />
        <Input
          type="text"
          placeholder="Buscar disponibilidad por nombre"
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
        <Command className={`absolute top-full w-full h-auto mt-1 border rounded-md shadow-md`}>
          <CommandList id="search-results">
            <CommandGroup>
              {!isTyping ? (
                <CommandEmpty>Ingrese el nombre del garante</CommandEmpty>
              ) : isLoading ? (
                <CommandItem disabled>Espere...</CommandItem>
              ) : results === "Usuario disponible" ? (
                <CommandEmpty>El garante esta disponible ✅</CommandEmpty>
              ) : results === "Usuario no existe" ? (
                <CommandEmpty>El garante no se encuentra en la base de datos 🤷‍♂️</CommandEmpty>
              ) : (
                <CommandEmpty>El garante no esta disponible ❌</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  );
}
