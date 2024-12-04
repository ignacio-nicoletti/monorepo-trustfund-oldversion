import { useState } from "react";
import { useRouter } from "next/navigation";

//VALIDACIONES
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginFormSchema } from "./LoginFormValidate/LoginFormValidate";
import { useForm } from "react-hook-form";

//FORGOT-PASSWORD
import { signIn } from "next-auth/react";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import generateOtp from "~/src/utils/OTP/generateOTP";
import { sendEmail } from "~/src/utils/sendEmail";
import { render } from "@react-email/components";
import MyEmail from "~/src/utils/OTP/emails/MyEmail";

export const loginFormController = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [emailValue, setEmailValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  // Crear formulario de react-hook-form y pasarle el esquema implementado con ZOD
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", //para verificar el estado mientras se tipea
  });

  const onSubmit = async (values: z.infer<typeof LoginFormSchema>) => {
    //implementar logica para crear usuario en la db

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      toast({
        title: "Error al iniciar sesión",
        description: res.error,
      });
    } else {
      toast({
        title: "Sesión iniciada",
        variant: "success",
      });

      router.push("/dashboard/gestion-inmobiliarias");
    }
  };

  // Ver si la usamos "olvide la contrasenia"
  const handleClickForgotPassword = async (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (error) {
      console.log("Email invalido");
    } else {
      const generatedOTP = generateOtp();

      fetch(`/api/users/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...generatedOTP, email: emailValue }),
      })
        .then(async (res) => {
          if (res.ok) {
            const testProps = {
              title: {
                top: "Cambio de contraseña",
              },
              body: {
                text: `Código de verificación de un solo uso: ${generatedOTP.otp}`,
              },
              CTA: {
                url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/forgot-password?otp=true&email=${emailValue}`,
                text: "Cambiar contraseña",
              },
              userEmail: emailValue,
            };

            const emailHtml = await render(
              //@ts-ignore
              <MyEmail props={testProps} />
            );
            // Define the email options
            const options = {
              from: "trusfundnotifications@gmail.com",
              to: emailValue,
              subject: "Código verificación",
              html: emailHtml,
            };

            await sendEmail(emailHtml, options);

            console.log("Se envia codigo de verificacion por email...");

            toast({
              variant: "success",
              title: "Código enviado exitosamente.",
            });

            setTimeout(() => {
              router.push(`/forgot-password?otp=true&email=${emailValue}`);
            }, 1000);
          } else {
            return toast({
              variant: "destructive",
              // title: "Ha ocurrido un error.",
              description:
                "Ocurrió un error al generar el código de verificación. Volvé a intentarlo en unos minutos.",
            });
          }
        })
        .catch((error) => {
          return toast({
            variant: "destructive",
            title: "Ha ocurrido un error.",
            description: error.message,
          });
        });
    }
  };

  return {
    emailValue,
    setEmailValue,
    error,
    setError,
    form,
    onSubmit,
    handleClickForgotPassword,
  };
};
