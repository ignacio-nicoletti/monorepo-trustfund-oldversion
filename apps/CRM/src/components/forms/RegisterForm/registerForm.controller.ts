// validation
import { registerFormSchema } from "./RegisterFormValidate/RegisterFormValidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";

export const registerFormController = () => {
  const { toast } = useToast();

  // Crear formulario de react-form y pasarle el esquema implementado con ZOD
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      role: undefined,
      name: "",
      lastname: "",
      email: "",
      password: "",
      organization: undefined,
      image_profile: "",
      province: "",
      city: "",
      street: "",
      intersectionOne: "",
      intersectionTwo: "",
      number: "",
      postal_code: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    //crear usuario en la db
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "aplication/json",
      },
    });
    if (res.ok) {
      toast({
        title: "Usuario creado",
        variant: "success",
      });

      form.reset();
    } else {
      toast({
        title: "Error al iniciar sesión",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
  };

  const formValues = form.watch();
  return {
    form,
    formValues,
    onSubmit,
    handleFileChange,
  };
};
