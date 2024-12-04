"use client"

import { useState } from "react"
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Input } from "@repo/ui/components/ui/input.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select.tsx"
import { Textarea } from "@repo/ui/components/ui/textarea.tsx"
import { Button } from "@repo/ui/components/ui/button.tsx"

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const [formFields, setFormFields] = useState([
    { name: "motivo", value: "" },
    { name: "nombre", value: "" },
    { name: "telefono", value: "" },
    { name: "mensaje", value: "" },
  ]);

  // Función para actualizar el estado de un campo
  const updateField = (name: string, value: string) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  // Validación: verificar que todos los campos estén completos
  const isFormValid = formFields.every((field) => field.value.trim() !== "");

  return (
    <div className="w-full max-w-lg p-6 h-full  justify-between text-white rounded-lg">
      <h2 className="text-2xl sm:text-4xl  font-semibold mb-6">Contactate</h2>

      <form className="space-y-8">
        <Select
          onValueChange={(value) => updateField("motivo", value)}
        >
          <SelectTrigger className="w-full bg-transparent 0 border-t-0 focus-visible:ring-0 border-x-0 border-b border-[#00B5E2] rounded-none focus:border-[#00B5E2] focus:ring-0 [&>span]:text-white [&>svg]:text-white focus-visible:ring-offset-0">
            <SelectValue placeholder="Seleccioná el motivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consulta">Consulta general</SelectItem>
            <SelectItem value="soporte">Soporte técnico</SelectItem>
            <SelectItem value="ventas">Ventas</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Nombre y apellido"
          className="bg-transparent border-t-0 border-x-0 border-b border-[#00B5E2] rounded-none focus-visible:ring-0 placeholder:text-white/70  focus-visible:ring-offset-0"
          onChange={(e) => updateField("nombre", e.target.value)}
        />

        <Input
          type="number"
          placeholder="Teléfono"
          className="bg-transparent border-t-0 border-x-0 border-b border-[#00B5E2] rounded-none focus-visible:ring-0  placeholder:text-white/70 focus-visible:ring-offset-0"
          onChange={(e) => updateField("telefono", e.target.value)}
        />

        <Textarea
          placeholder="Mensaje"
          className="bg-transparent border-t-0 border-x-0 border-b rounded-none  border-[#00B5E2] ring-0 focus-visible:ring-0  placeholder:text-white/70 min-h-[100px] resize-none focus-visible:ring-offset-0"
          onChange={(e) => updateField("mensaje", e.target.value)}
        />

        <Button
          variant="default"
          className="px-8 py-6 rounded-full bg-[#009FBB] hover:bg-[#009FBB]/75 w-full"
          disabled={!isFormValid || loading} // Deshabilitado si el formulario es inválido o está cargando
        >
          Enviar
        </Button>
        
      </form>
    </div>
  );
}
