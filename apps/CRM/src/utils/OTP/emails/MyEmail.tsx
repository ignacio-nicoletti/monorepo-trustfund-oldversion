import { Html, Head, Tailwind, Container, Section, Text, Button } from "@react-email/components";

interface EmailProps<T> {
  title: {
    top: T;
    bottom?: T | undefined;
  };
  CTA: {
    url: T;
    text: T;
  };
  body: {
    text?: T | undefined;
  };
  userEmail: T;
}

const PasswordResetEmail = ({ props }: { props: EmailProps<string> }) => {
  return (
    <Html lang="es" dir="ltr">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cambio de Contraseña</title>
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#171717",
                hover: "#7065f0",
                footerBg: "#1c68ab",
              },
              fontFamily: {
                helvetica: "Helvetica, sans-serif",
              },
            },
          },
        }}
      >
        <Container className="flex flex-col justify-center items-center  bg-[#1c68ab]/5 text-center rounded-[12px] p-8">
          {/* Header */}
          <Section className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <Text className="font-bold text-3xl m-auto w-[20ch]">
              {props?.title?.top ?? ""}
              <br />
              {props?.title?.bottom ?? ""}
            </Text>
            {/* Body Text */}
            <Text className="text-base text-[#303030] mb-6">
              Hemos recibido una solicitud para cambiar tu contraseña. Si no has solicitado este
              cambio, ignora este correo.
            </Text>
            <Text className="text-base font-semibold text-[#303030] mb-6">{props.body.text}</Text>

            {/* CTA Button */}
            <Button
              href={props.CTA.url}
              className="bg-brand text-white py-2 px-6 rounded-lg transition-colors duration-200 hover:bg-hover"
            >
              Cambiar Contraseña
            </Button>
          </Section>

          {/* Footer
          <Section className="bg-footerBg text-white text-sm rounded-lg w-full max-w-xl mt-6 p-4">
            <Text className="text-center">
              Este e-mail se envió a{" "}
              <span className="text-white" style={{ textDecoration: "none", color: "inherit" }}>
                {props.userEmail}
              </span>
              .<br />
              Estás recibiendo este correo porque eres un miembro de Trustfund.
            </Text>
          </Section> */}
        </Container>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetEmail;
