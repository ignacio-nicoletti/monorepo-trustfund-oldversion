import handleLocations from "./locations.ts";
import seedDatabase from "./seed-preparations.ts";
import seedDatabaseMocks from "./mock.ts";

async function main() {
  try {
    console.log("Subiendo mocks...");
    await seedDatabaseMocks(); // Ejecuta los mocks con la instancia de Drizzle

    console.log("Subiendo seeders...");
    await seedDatabase(); // Ejecuta los seeders con la instancia de Drizzle

    // console.log("Subiendo localidades...");
    // await handleLocations(); // Ejecuta la función que maneja las localidades

    process.exit(0); // Cierra el proceso exitosamente
  } catch (error) {
    console.error("Error en el proceso de seeding:", error);
    process.exit(1); // Cierra el proceso con error
  } finally {
    console.log("Finalicé");
    
  }
}

main();
