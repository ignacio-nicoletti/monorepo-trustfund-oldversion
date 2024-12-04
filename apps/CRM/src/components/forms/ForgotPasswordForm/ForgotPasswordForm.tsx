"use client";

// imagenes
import trustLogo from "@assets/logoTrustFund.svg";
import logoMobile from "@assets/logo.svg";
// import imga from "@assets/images/resetPassword.svg";
import eye from "@assets/eyes.svg";
import eyeSlash from "@assets/eye-slash.svg";

// ui

import React from "react";
import { forgotPasswordController } from "./forgotPasswordForm.controller";
import Modal from "@repo/ui/components/Modal/Modal.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import InputPassword from "../inputs/inputPassword";
import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@repo/ui/components/ui/input-otp.tsx";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import { Label } from "@repo/ui/components/ui/label.tsx";

export interface Props {
  otpParams?: { [key: string]: string | undefined };
}

function ForgotPasswordForm({ otpParams }: Props) {
  const { form, formOtp, onSubmit, onSubmitOtp, handleNewOTP, validateOTP, otpData, error } =
    forgotPasswordController(otpParams);

  return (
    <section className="w-screen h-screen flex p-0 m-0">
      <div className="hidden md:flex md:w-1/2 bg-primary flex-col justify-center items-center">
        <img
          src={trustLogo.src}
          alt="Img login not found"
          className=" p-0 "
          width={400}
          height={400}
        />
        <h2 className="text-white text-2xl">Sistema de gestión</h2>
        <Separator className="w-1/2 mt-10 bg-white" />
      </div>

      <div className="md:w-1/2 w-full flex flex-col bg-trust">
        <header className="flex md:hidden py-10 flex-col justify-center items-center">
          <div className="flex items-center gap-10 flex-wrap justify-center">
            <img
              src={logoMobile.src}
              alt="Img login not found"
              className=" p-0 "
              width={50}
              height={50}
            />
            <h2 className="text-primary font-bold text-2xl">Sistema de gestión</h2>
          </div>
          <Separator className="mt-10 bg-primary/30" />
        </header>
        <div className=" flex justify-center items-center p-4 md:w-full w-3/4 m-auto">
          <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-4xl font-bold leading-10 tracking-tighter">
              Restaurá tu contraseña
            </h1>
            <p className="text-base text-slate-500 font-medium">
              Completá el formulario y generá una nueva contraseña.
            </p>
            {(otpParams?.otp?.length ?? false) ? (
              <Modal
                isOTP={true}
                showModalText="¿Olvidaste tu contraseña?"
                showModalStyles="h-min bg-transparent p-0 text-[#504cd3] text-base font-medium duration-100 hover:cursor-pointer hover:text-[#7065F0] hover:bg-transparent"
                title="Verificación de Código de Seguridad"
                titleStyles="tracking-wide text-center"
                text={`Ingresa el código enviado a tu correo para continuar. Si no lo recibiste, haz clic en "Reenviar código"`}
                btnConfirmText={otpData?.id ? "Confirmar" : ""}
                btnRejectText=""
                btnRejectStyles=""
                btnConfirmStyles="bg-foreground duration-100 tracking-wide"
                onSubmit={() => onSubmitOtp()}
              >
                <Form {...formOtp}>
                  <form className="flex flex-col gap-6 items-center  text-center w-full">
                    <FormField
                      control={formOtp.control}
                      name="otpInput"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <InputOTP
                              maxLength={6}
                              containerClassName="justify-center"
                              onChange={(value) => validateOTP(value, otpParams?.email)}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage>
                            {error?.length > 0 ? <p className="mt-5">{error}</p> : null}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>

                <Button
                  variant="secondary"
                  className="text-sm h-min bg-transparent p-0 text-foreground] font-medium duration-100 hover:cursor-pointer hover:text-foreground hover:bg-transparent"
                  type="button"
                  onClick={handleNewOTP}
                >
                  Reenviar código
                </Button>
              </Modal>
            ) : null}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => onSubmit(values, otpParams?.email))}
                className="flex flex-col gap-8 items-center  text-center w-full"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label htmlFor="password" className="text-start flex w-full text-foreground">
                        Contraseña
                      </Label>

                      <FormControl>
                        {/* Pasarle al InputPassword valores de react-form */}
                        <InputPassword
                          icons={{ eye, eyeSlash }}
                          value={field.value}
                          onChange={field.onChange}
                          id="password"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label htmlFor="password" className="text-start flex w-full text-foreground">
                        Confirma tu nueva contraseña
                      </Label>
                      <FormControl>
                        <InputPassword
                          icons={{ eye, eyeSlash }}
                          value={field.value}
                          onChange={field.onChange}
                          id="password"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary duration-100 hover:bg-primary/80 hover:text-white border-none"
                  disabled={!form.formState.isValid}
                >
                  Confirmar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPasswordForm;
