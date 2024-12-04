import __dirname from "./dirname.ts";
import fs from "node:fs";
import path from "node:path";
import crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

const outputDir = path.join(__dirname, "output");

// Verificar si el directorio output existe, y si no, crearlo
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const inmobiliariaOutput = path.join(__dirname, "output", "inmobiliarias.json");
const responsableOutput = path.join(__dirname, "output", "users.json");
const addressOutput = path.join(__dirname, "output", "addresses.json");

const errorOutput = path.join(__dirname, "output", "adapterError.txt");
export const adapter = async () => {
  try {
    let fetchData: any = await fetch("http://localhost:2066/api/inmobiliarias_adheridas");
    fetchData = await fetchData.json();
    let inmobiliariasArray: any = [];
    let responsableArray: any = [];
    let addressArray: any = [];

    console.time("Exportando modelos");

    for (const data of fetchData) {
      const uuidInmo = crypto.randomUUID();
      const uuidResponsable = crypto.randomUUID();
      const uuidAddress = crypto.randomUUID();

      let inmobiliaria = {
        id: uuidInmo,
        name: data.nombre,
        inmoAgent: data.asesorInmo,
        phone: data.telefono,
        web: data.web,
        email: data.mail,
        comment: data.cometario,
        warrantiesWon: data.ventas ? data.ventas : 0,
        order: data.orden,
        responsableId: null,
        addressId: uuidAddress,
      };

      let nameResponsable = data.asesorTF.split(" ")[0];

      let responsable = {
        id: uuidResponsable,
        name: nameResponsable, // Toma la primera palabra como nombre
        lastname:
          nameResponsable === "Evelyn"
            ? "Ibañez"
            : nameResponsable === "Victoria"
              ? "Reale"
              : nameResponsable === "Sol"
                ? "Blanco"
                : nameResponsable === "Melisa"
                  ? "Bosisio"
                  : nameResponsable === "Yamila"
                    ? "Mema"
                    : null,
        role: 1, //esperar la mock
        warrantiesWon: 0,
        warrantiesInProcess: 0,
        organizationId: 1, //esperar la mock
      };

   if (responsableArray.length) {
        let findResponsable = responsableArray.find((el: any) => el.name === responsable.name);
        if (findResponsable?.id) {
          inmobiliaria.responsableId = findResponsable.id;
        } else {
          // @ts-ignore
          inmobiliaria.responsableId = uuidResponsable;
          responsableArray.push(responsable);
        }
      } else {
        // @ts-ignore
        inmobiliaria.responsableId = uuidResponsable;
        responsableArray.push(responsable);
      }
      inmobiliariasArray.push(inmobiliaria);


      let addressInmo = {
        id: uuidAddress,
        province: data.provincia.length ? data.provincia : null,
        city: data.localidad.length ? data.localidad : null,
        domicilio: data.domicilio.length ? data.domicilio : null,
      };
      addressArray.push(addressInmo);
    }

    responsableArray.forEach((el: any) => {
      const uuidAddressToUser = crypto.randomUUID();

      let addressUsers = {
        id: uuidAddressToUser,
        province:
          el.name !== "Melisa" && el.name !== "Sol" && el.name !== "Yamila"
            ? "Buenos Aires"
            : "Mendoza",
        city:
          el.name !== "Melisa" && el.name !== "Sol" && el.name !== "Yamila"
            ? "La Plata"
            : "Mendoza Capital",
        country: "Argentina",

        street:
          el.name !== "Melisa" && el.name !== "Sol" && el.name !== "Yamila" ? "37" : "Necochea",

        number: el.name !== "Melisa" && el.name !== "Sol" && el.name !== "Yamila" ? 125 : 350,
        intersectionOne:
          el.name !== "Melisa" && el.name !== "Sol" && el.name !== "Yamila" ? "117" : null,
        intersectionTwo:
          el.name !== "Melisa" && el.name !== "Sol" && el.name !== "Yamila" ? "118" : null,
        postalCode: el.name !== "Melisa" && el.name !== "Sol" && el.name !== "Yamila" ? 1900 : 5500,
      };

      el.addressId = uuidAddressToUser;

      addressArray.push(addressUsers);
    });

    fs.writeFileSync(inmobiliariaOutput, JSON.stringify(inmobiliariasArray, null, 2), "utf-8");
    fs.writeFileSync(responsableOutput, JSON.stringify(responsableArray, null, 2), "utf-8");
    fs.writeFileSync(addressOutput, JSON.stringify(addressArray, null, 2), "utf-8");

    console.timeEnd("Exportando modelos");
    process.exit();
  } catch (error) {
    const errorMessage =
      typeof error === "object"
        ? JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        : String(error);
    fs.writeFileSync(errorOutput, errorMessage, "utf-8");
    console.error("Error al obtener datos de usuarios:", errorMessage);
    process.exit();
  }
};
adapter();

//que hacemos con password y email???
