import user from "@/assets/sectionOwner/profile-circle.svg";
import monitor from "@/assets/sectionOwner/device-message.svg";
import velocity from "@/assets/sectionOwner/rapidez.svg";
import house from "@/assets/sectionOwner/building-3.svg";
import HeaderImage from "@/components/reused/HeaderImage/headerImage";
const Owner = () => {

  const dataOwner = {
    sectiontitle: "Propietarios",
    subtitle: "Garantizá tu tranquilidad",
    buttonText: "Escribinos",
    ArrayOptions: [
      {
        icon: user.src,
        text: "Inquilinos confiables",
      },
      {
        icon: velocity.src,
        text: "Rapida respuesta ante reclamos",
      },
      {
        icon: monitor.src,
        text: "Asesoramiento 24/7",
      },
      {
        icon: house.src,
        text: "Resguardamos tu propiedad",
      },
    ],
  };

  return <HeaderImage data={dataOwner} />;
};

export default Owner;
