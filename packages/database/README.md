# Funcionamiento de la DB con Drizzle

En esta documentacion vamos a dejar especificados los pasos para poder pushear modificaciones de los modelos a la base de datos y como hacer migraciones y backups.

> [!WARNING]
> Todos los comandos descritos abajo, deben ejecutarse en el root del proyecto (`monorepo-trustfund/`) .

> [!NOTE]
> Cada schema tiene su propio archivo `Model.ts` dentro de `src/schemas`.

---

### 1. `pnpm db:reset:hard`

Este comando se encarga de ejecutar un script que elimina el schema public y el schema drizzle de la db, vuelve a crear el schema public y elimina la carpeta drizzle de vs code. 
Correrlo antes que todos los comandos subsiguientes, en caso de querer resetear completamente la base de datos. 

### 2. `pnpm db:generate`

El comando drizzle db:generate se utiliza para generar una nueva migración basada en los cambios que hayas realizado en tus modelos o esquemas de base de datos. Es decir, cuando agregas, modificas o eliminas una tabla o una columna en tu código, este comando creará un archivo de migración que contiene las instrucciones necesarias para aplicar esos cambios a la base de datos.

<u>Tareas de este comando: </u>

- Detecta cambios en el esquema.
- Genera un archivo de migración que describe los cambios.
- Este archivo de migración contiene instrucciones en SQL o código para modificar la base de datos.

### 3. `pnpm db:migrate`

El comando drizzle db:migrate aplica las migraciones generadas (y pendientes) a la base de datos. Ejecuta el código de migración generado anteriormente para actualizar el esquema de la base de datos con los cambios descritos en los archivos de migración.

<u>Tareas típicas de este comando:</u>

- Ejecuta las migraciones pendientes en orden secuencial.
- Modifica la base de datos aplicando las instrucciones del archivo de migración (agregar columnas, tablas, índices, etc.).
- Actualiza un registro de migraciones (en una tabla de migraciones) para llevar un control de las que ya se han aplicado.

---

### 4. `pnpm db:check`

Se utiliza para verificar el estado de las migraciones y comparar el esquema actual de la base de datos con el esquema que has definido en el código. Este comando es útil para asegurarte de que la base de datos esté completamente sincronizada con los modelos y esquemas definidos en tu código.

<u>Funcionalidad de este comando:</u>

- Verificación de diferencias: Compara el esquema actual de la base de datos con el esquema definido en tu código para detectar si hay diferencias (es decir, cambios que aún no se han migrado).

- Reporte de cambios pendientes: Te muestra si hay migraciones pendientes o diferencias entre el estado de la base de datos y el código, pero no aplica ninguna migración ni modifica la base de datos. Solo informa sobre el estado actual.

- Prevención de problemas: Te permite verificar si has olvidado generar una migración o si hay desincronización entre tu base de datos y tu código antes de ejecutar db:generate o db:migrate.

---

> [!NOTE] Orden de ejecucion

<ol>1) pnpm db:generate</ol>
<ol>2) pnpm db:migrate</ol>
<ol>3) pnpm db:check</ol>

### 5. `pnpm db:seed`

Ahora con la base de datos completamente reseteada y el cliente de drizzle listo se ejecutra este comando con las siguiente funciones:

#### Primero:

- Corre `seedDatabaseMocks()`, esta funcion carga los mocks de la carpeta `./backups/exports` y la inserta en sus tablas correspondientes.

#### Segundo:

- Corre `seedDatabase()` la cual obtiene los seeder cargados en `./backups/exports` y los inserta en sus tablas.

#### Tercero:

- Corre `handleLocations()` quien se encarga de cargar todas las localidades a la base de datos.

### 6. `pnpm db:backup`

Antes de pushear cualquier cambio en el modelo de drizzle, hacer un backup corriendo este comando que ejecuta un script que toma toda la informacion de cada modelo de drizzle y genera un archivo `.json` por cada modelo en la carpeta `exports`. Esto para evitar perder informacion si los nuevos seeders llegaran a tener conflictos con los cambios que se van a pushear del modelo de drizzle. Actualmente el backup que se genera es de todos los modelos que no son mock, en caso de querer hacer un backup de los modelos mock, debemos importarlos en el script `./scripts/backup.ts`.

### 7. `pnpm db:studio`

Si en cualquier momento del proceso queres ver como estan las tablas este comando corre un servidor local en el puerto 4321, que toma el modelo de drizzle para mostrar la informacion de la db y en caso de que haya conflictos, muestra dialogos con los errores.

### 8. `pnpm db:adapter`

Este comando ejecuta el archivo `./src/adapter/adapter.ts` quien se encarga de realizar un fetch a la base de datos vieja, acomodar los json acorde a los nuevos schemas de drizzle y luego generar los archivos.json con la informacion necesaria como seeders dentro de la carpeta output, esos archivos json deben moverse a la carpeta `./src/backups/exports` antes de correr `pnpm db:seed`

### 9. `pnpm db:push`

Cuando se realiza un cambio en alguno de los schemas, debemos ir a `./drizzle.config.ts` comentar <u>schema: "./src/schema.ts"</u>, y descomentar <u>schema: "./src/schema.delete.ts"</u>, ejecutar `pnpm db:push`, luego volver a dejar como estaban esas lineas y volver a ejecutar el comando. Luego ejecutar pnpm `pnpm db:seed`.

