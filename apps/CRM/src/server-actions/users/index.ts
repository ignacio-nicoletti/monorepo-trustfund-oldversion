"use server";

import db, {
  addresses,
  coverageTypes,
  currencyTypes,
  datePeriods,
  dollarTypes,
  eq,
  financingTypes,
  inmobiliarias,
  organizations,
  roles,
  statusWarranty,
  users,
  warranties,
  warrantors,
  warrantyTypes,
} from "@repo/database/db";
import { months } from "~/src/utils/month";

export async function getUser(id: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (user?.id && user) {
      return user;
    } else {
      throw Error("Error: user no encontrado");
    }
  } catch (error: any) {
    throw Error(error.message);
  }
}

export async function fetchUserById(id: string) {
  const userData = await db
    .select({
      id: users.id,
      name: users.name,
      lastname: users.lastname,
      email: users.email,
      warrantiesWon: users.warrantiesWon,
      warrantiesInProcess: users.warrantiesInProcess,
      warrantiesLost: users.warrantiesLost,
      status: users.status,
      image_profile: users.image_profile,
      organization: organizations.type,
      organizationId: organizations.id,
      role: roles.type,
      roleId: roles.id,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id)) // Filtrar por id específico
    .leftJoin(organizations, eq(organizations.id, users.organizationId))
    .leftJoin(roles, eq(roles.id, users.role));

  if (userData[0]?.id) {
    return userData[0];
  } else {
    throw Error("Error: user no encontrado");
  }
}

export type UserDataType = Awaited<ReturnType<typeof fetchUserById>>;

export async function fetchUserDetailWithRelations(id: string) {
  try {
    const now = new Date();
    const userData = await db
      .select({
        id: users.id,
        name: users.name,
        lastname: users.lastname,
        email: users.email,
        warrantiesWon: users.warrantiesWon,
        warrantiesInProcess: users.warrantiesInProcess,
        warrantiesLost: users.warrantiesLost,
        status: users.status,
        image_profile: users.image_profile,
        organization: organizations.type,
        organizationId: organizations.id,
        role: roles.type,
        roleId: roles.id,
        createdAt: users.createdAt,
        addresses: addresses,
      })
      .from(users)
      .where(eq(users.id, id)) // Filter by specific id
      .leftJoin(organizations, eq(organizations.id, users.organizationId))
      .leftJoin(addresses, eq(addresses.id, users.addressId))
      .leftJoin(roles, eq(roles.id, users.role));

    if (userData[0]?.id) {
      const rawWarranties = await db
        .select({
          warranty: warranties,
          warrantor: warrantors,
          inmobiliaria: inmobiliarias,
          address: addresses,
          statusWarranty: statusWarranty,
          currencyType: currencyTypes,
          dollarType: dollarTypes,
          financingType: financingTypes,
          warrantyType: warrantyTypes,
          datePeriod: datePeriods,
          coverageType: coverageTypes,
        })
        .from(warranties)
        .where(eq(warranties.userId, userData[0].id))
        .leftJoin(warrantors, eq(warrantors.warrantyId, warranties.id))
        .leftJoin(
          inmobiliarias,
          eq(inmobiliarias.id, warranties.inmobiliariaId)
        )
        .leftJoin(addresses, eq(warranties.addressId, addresses.id))
        .leftJoin(
          statusWarranty,
          eq(warranties.statusWarrantyId, statusWarranty.id)
        )
        .leftJoin(
          currencyTypes,
          eq(warranties.currencyTypeId, currencyTypes.id)
        )
        .leftJoin(dollarTypes, eq(warranties.dollarTypeId, dollarTypes.id))
        .leftJoin(
          financingTypes,
          eq(warranties.financingTypeId, financingTypes.id)
        )
        .leftJoin(
          warrantyTypes,
          eq(warranties.warrantyTypeId, warrantyTypes.id)
        )
        .leftJoin(datePeriods, eq(warranties.datePeriodId, datePeriods.id))
        .leftJoin(
          coverageTypes,
          eq(warranties.coverageTypeId, coverageTypes.id)
        );

      // Step 1: Process raw warranties to build allWarranties and calculate totalGarantia
      const { allWarranties, totalGarantia } = rawWarranties.reduce(
        (acc: any, row) => {
          const warrantyId = row.warranty.id;

          if (!acc.allWarranties[warrantyId]) {
            acc.allWarranties[warrantyId] = {
              ...row.warranty,
              address: row.address,
              statusWarranty: row.statusWarranty,
              currencyType: row.currencyType,
              dollarType: row.dollarType,
              financingType: row.financingType,
              warrantyType: row.warrantyType,
              datePeriod: row.datePeriod,
              coverageType: row.coverageType,
              inmobiliaria: row.inmobiliaria,
              warrantors: row.warrantor ? [row.warrantor] : [],
            };
            acc.totalGarantia += 1;
          }

          // Add warrantors to the list if not already present
          if (
            row.warrantor &&
            !acc.allWarranties[warrantyId].warrantors.some(
              (el: any) => row.warrantor?.id === el.id
            )
          ) {
            acc.allWarranties[warrantyId].warrantors.push(row.warrantor);
          }

          return acc;
        },
        {
          allWarranties: {},
          totalGarantia: 0,
        }
      );

      // Step 2: Calculate totalReserva, totalAccumulatedARS, and totalAccumulatedUSD
      const {
        //@ts-ignore
        totalAccumulatedARS,
        //@ts-ignore
        totalAccumulatedUSD,
      } = Object.values(allWarranties).reduce(
        (acc: any, warranty: any) => {
          // Check and accumulate totals for warranties within the current month
          if (warranty.reservationDate) {
            const reservationDate = new Date(warranty.reservationDate);

            const isCurrentMonth =
              reservationDate.getFullYear() === now.getFullYear() &&
              reservationDate.getMonth() === now.getMonth();

            const isValidWarranty =
              warranty.statusWarrantyId === 7 &&
              warranty.warrantyAmount &&
              warranty.warrantyAmount > 0;

            if (isCurrentMonth && isValidWarranty) {
              if (warranty.currencyType?.type === "USD") {
                acc.totalAccumulatedUSD += warranty.warrantyAmount;
              } else if (warranty.currencyType?.type === "ARS") {
                acc.totalAccumulatedARS += warranty.warrantyAmount;
              }
            }
          }

          return acc;
        },
        {
          totalAccumulatedARS: 0,
          totalAccumulatedUSD: 0,
        }
      );

      const result = Object.values(allWarranties);

      // Map warranties based on active parameter
      const warrantiesInProcess = result.map((item: any) => {
        const baseFields = {
          id: item.id,
          warrantyAmount: item.warrantyAmount,
        };

        const requester = item.warrantors?.length
          ? item.warrantors?.find((el: any) => el.isRequester)
          : null;

        return {
          ...baseFields,
          responsableId: userData[0]?.id || null,
          reservationDate: item?.reservationDate
            ? new Date(item?.reservationDate)
            : null,
          contractDuration: item?.contractDuration || null,
          warrantyType: item?.warrantyType?.type || null,
          requesterName:
            `${requester?.name || ""} ${requester?.lastname || ""}`.trim(),
          responsable: userData[0]?.name || "Not specified",
          sucursal: userData[0]?.addresses?.province || null,
          inmobiliaria: item?.inmobiliaria?.name || null,
          coverageType: item?.coverageType?.type || "",
          currencyType: item?.currencyType?.type || "",
          reservationAmount: item?.reservationAmount || null,
          paymentMethod: item?.financingType?.type || null,
          statusWarranty: item?.statusWarranty?.type || null,
        };
      });

      const warrantyData = {
        totalGarantia,
        garantias: warrantiesInProcess,
      };

      return warrantiesInProcess.length
        ? {
            ...userData[0],
            warranties: warrantyData,
            totalAccumulatedUSD,
            totalAccumulatedARS,
            month: months[now?.getMonth()],
          }
        : {
            ...userData[0],
            warranties: { totalGarantia: 0, totalReserva: 0, garantias: [] },
            totalAccumulatedUSD: 0,
            totalAccumulatedARS: 0,
            month: months[now?.getMonth()],
          };
    } else {
      throw Error("Error: User not found");
    }
  } catch (error: any) {
    throw Error(error.message);
  }
}

export type UserDetailType = Awaited<
  ReturnType<typeof fetchUserDetailWithRelations>
>;

export async function getAllUsers() {
  const usersData = await db
    .select({
      id: users.id,
      name: users.name,
      lastname: users.lastname,
      email: users.email,
      warrantiesWon: users.warrantiesWon,
      warrantiesLost: users.warrantiesLost,
      warrantiesInProcess: users.warrantiesInProcess,
      status: users.status,
      image_profile: users.image_profile,
      organization: organizations.type,
      role: roles.type,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(organizations, eq(organizations.id, users.organizationId))
    .leftJoin(roles, eq(roles.id, users.role))
    .leftJoin(addresses, eq(addresses.id, users.addressId));

  if (usersData.length > 0) {
    const usersWithWarranties = await Promise.all(
      usersData.map(async (user) => {
        const warrantiesFromDb = await db.query.warranties.findMany({
          where: eq(warranties.userId!, user.id!),
        });

        return {
          ...user,
          fullName: user.name + " " + user.lastname,
          warranties: warrantiesFromDb || [],
        };
      })
    );

    return usersWithWarranties;
  } else {
    throw Error("Error: No se encontraron usuarios");
  }
}

export type UsersDataType = Awaited<ReturnType<typeof getAllUsers>>;
