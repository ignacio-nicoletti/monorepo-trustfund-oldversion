"use client";
// imagenes
import trustLogo from "@assets/logoTrustFund.svg";
import logoMobile from "@assets/logo.svg";
import eye from "@assets/eyes.svg";
import eyeSlash from "@assets/eye-slash.svg";

// ui
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form.tsx";
import InputPassword from "@components/forms/inputs/inputPassword";
import Modal from "@repo/ui/components/Modal/Modal.tsx";

import { loginFormController } from "./loginForm.controller";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import EmailForgotPassReqForm from "../ForgotPasswordForm/EmailForgotPassReqForm";

function LoginForm() {
  const { emailValue, setEmailValue, error, setError, form, onSubmit, handleClickForgotPassword } =
    loginFormController();

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
        <div className=" flex justify-center items-center p-4 md:w-full w-3/4 mx-auto mt-16 md:m-auto">
          <div className="w-full md:w-2/3 lg:w-3/10 flex flex-col gap-6">
            <h1 className="text-4xl font-bold leading-10 tracking-tighter ">Iniciar sesión</h1>
            <p className="text-base text-slate-500 font-medium">
              Ingresa tus credenciales para acceder a tu cuenta.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 items-center  text-center w-full  "
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Label className="text-start flex w-full" htmlFor="email">
                        Correo electrónico
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="Ingresá tu correo electrónico"
                          id="email"
                          className="border border-primary/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          id="password"
                          icons={{ eye, eyeSlash }}
                          value={field.value}
                          onChange={field.onChange}
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Modal 
                  isOTP={false}
                  showModalText="¿Olvidaste tu contraseña?"
                  showModalStyles="h-min bg-transparent p-0 text-base font-medium duration-100 hover:cursor-pointer text-foreground"
                  title="Recupera tu contraseña"
                  text="Ingresá tu correo electrónico y recibirás un código para recuperar tu contraseña."
                  btnConfirmText="Enviar"
                  btnRejectText="Cancelar"
                  btnRejectStyles=""
                  btnConfirmStyles="bg-primary duration-100 hover:text-muted-foreground border-none outline-none"
                  onSubmit={handleClickForgotPassword}
                >
                  <EmailForgotPassReqForm
                    emailValue={emailValue}
                    setEmailValue={setEmailValue}
                    error={error}
                    setError={setError}
                  />
                </Modal>
                <Button
                  type="submit"
                  className="w-full bg-primary duration-100 hover:bg-primary/80 hover:text-white border-none"
                  disabled={!form.formState.isValid}
                >
                  Ingresar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
