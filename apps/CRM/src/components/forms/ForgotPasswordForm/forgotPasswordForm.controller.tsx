// validacion
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";

import { ForgotPassFormSchema, OTPSchema } from "./ForgotPassValidate/ForgotPassValidate";
import { useToast } from "@repo/ui/components/ui/use-toast.ts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastAction } from "@repo/ui/components/ui/toast.tsx";
import { generateOtp } from "~/src/utils/OTP";
import { sendEmail } from "~/src/utils/sendEmail";
import { render } from "@react-email/components";
import MyEmail from "~/src/utils/OTP/emails/MyEmail";

interface OTP {
  id: string | null;
  otp: number | null;
  expirationAt: string | null;
  email: string | null;
  userId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const forgotPasswordController = (otpParams?: { [key: string]: string | undefined }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [otpData, setOtpData] = useState<OTP>({
    id: null,
    otp: null,
    expirationAt: null,
    email: null,
    userId: null,
    createdAt: null,
    updatedAt: null,
  });
  const [error, setError] = useState<string>("");

  // Crear formulario de react-hook-form y pasarle el esquema implementado con ZOD
  const form = useForm<z.infer<typeof ForgotPassFormSchema>>({
    resolver: zodResolver(ForgotPassFormSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
    mode: "onChange", //para verificar el estado mientras se tipea
  });
  const formOtp = useForm<z.infer<typeof OTPSchema>>({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otpInput: "",
    },
    mode: "onChange", //para verificar el estado mientras se tipea
  });

  const validateOTP = (value: string, email: string | undefined) => {
    if (value.length === 6 && email?.length) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/otp?otp=${value}&email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data[0].id) {
            setOtpData(data[0]);
            return;
          } else {
            throw new Error(data?.message);
          }
        })
        .catch((error) => {
          setOtpData({
            id: null,
            otp: null,
            expirationAt: null,
            email: null,
            userId: null,
            createdAt: null,
            updatedAt: null,
          });

          setError(error.message);
          console.log(error);
        });
    }
  };

  const onSubmitOtp = () => {
    //implementar logica para crear usuario en la db

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/otp?otp=${otpData?.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data === "OTP eliminado") {
          toast({
            variant: "success",
            title: "Código verificado exitosamente.",
            description: "Código de verificación valido, ya podés cambiar la contraseña",
          });
        } else {
          throw new Error(data?.message);
        }
      })
      .catch((error) => {
        return toast({
          variant: "destructive",
          title: "Ha ocurrido un error.",
          description: error.message,
        });
      });
  };

  const onSubmit = (values: z.infer<typeof ForgotPassFormSchema>, email: string | undefined) => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${otpData.userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, email: email }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.id) {
          toast({
            title: "Contraseña modificada exitosamente",
            // variant: "success",
            // description: "Código de verificación valido, ya podés cambiar la contraseña",
            action: (
              <ToastAction
                className="bg-[#26DEB0] duration-100 hover:bg-[#26DEB0]"
                altText="Continuar"
                onClick={() => {
                  router.push(`/`);
                }}
              >
                Continuar
              </ToastAction>
            ),
          });
          setTimeout(() => {
            router.push(`/`);
          }, 5000);
        } else {
          throw new Error(data?.message);
        }
      })
      .catch((error) =>
        toast({
          variant: "destructive",
          title: "Ha ocurrido un error",
          description:
            "Ha ocurrido un error al cambiar la contraseña, intenta nuevamente en unos minutos",
        })
      );
  };

  const handleNewOTP = async (
    e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const generatedOTP = generateOtp();

    fetch(`/api/users/otp`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...generatedOTP,
        email: otpParams?.email ?? null,
      }),
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
              url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/forgot-password?otp=true&email=${otpParams?.email}`,
              text: "Cambiar contraseña",
            },
            userEmail: otpParams?.email!,
          };
          const emailHtml = await render(
            <MyEmail props={testProps} />
          );
          // Define the email options
          const options = {
            from: "trusfundnotifications@gmail.com",
            to: otpParams?.email ?? "some@email.com",
            subject: "Código verificación",
            html: emailHtml,
          };

          await sendEmail(emailHtml, options);

          console.log("Se envia codigo de verificacion por email...");

          return toast({
            variant: "success",
            title: "Código enviado exitosamente.",
            // description: "There was a problem with your request.",
          });
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
  };

  return {
    form,
    formOtp,
    onSubmit,
    onSubmitOtp,
    handleNewOTP,
    validateOTP,
    otpData,
    error,
  };
};
