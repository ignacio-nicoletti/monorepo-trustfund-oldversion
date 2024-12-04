import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar.tsx";
import { Badge } from "@repo/ui/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card.tsx";
import { DataTable } from "../Tables/DataTableWarranties/DataTable";
import { columns } from "~/src/components/Tables/DataTableWarranties/columns/user-profile-warranties/columns";
import { UserDetailType } from "~/src/server-actions/users";
import NoData from "../NoData/NoData";

const roleMap: { [key: number]: string } = {
  1: "Responsable",
  2: "Administrativo",
  3: "Super Admin",
  // Add more roles as needed
};

export default function UserProfile({
  userInfo,
}: {
  userInfo?: UserDetailType;
}) {
  // Default user info if not provided
  const defaultUserInfo: UserDetailType = {
    id: "",
    name: "John",
    lastname: "Doe",
    email: "johndoe@example.com",
    warrantiesWon: 10,
    warrantiesInProcess: 50,
    warrantiesLost: 50,
    image_profile: "",
    organization: "Trust Fund",
    organizationId: 1,
    roleId: 2,
    role: "Asesor",
    status: "Active",
    createdAt: "",
    addresses: null,
    totalAccumulatedUSD: 0,
    totalAccumulatedARS: 0,
    month: "",
    warranties: {
      totalGarantia: 0,
      garantias: [],
    },
  };

  const user = userInfo || defaultUserInfo;

  return (
    <div className="w-full space-y-6">
      <Card className="w-full border border-gray-200">
        <CardHeader className="flex flex-row justify-between flex-wrap">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={
                  user.image_profile ||
                  `https://api.dicebear.com/6.x/initials/svg?seed=${user.name} ${user.lastname}`
                }
                alt={`${user.name} ${user.lastname}`}
              />
              <AvatarFallback>
                {user.name ? user.name[0] : null}
                {user.lastname ? user.lastname[0] : null}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-3xl text-gray-800">
                {user.name} {user.lastname}
              </CardTitle>
              <p className="text-lg text-gray-600">{user.email}</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="text-base bg-gray-100 text-gray-800 border-gray-300"
                >
                  {roleMap[user.roleId!] || "Unknown Role"}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-base bg-primary text-white border-gray-300"
                >
                  {user.organization}
                </Badge>
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center w-2/3">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <dt className="font-semibold text-blue-700">
                Total ARS {user.month}
              </dt>
              <dd className="text-2xl font-bold text-blue-800">
                ARS {user.totalAccumulatedARS.toLocaleString("es-ES")}
              </dd>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <dt className="font-semibold text-blue-700">
                Total USD {user.month}
              </dt>
              <dd className="text-2xl font-bold text-blue-800">
                USD {user.totalAccumulatedUSD.toLocaleString("es-ES")}
              </dd>
            </div>
          </dl>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <dt className="font-semibold text-green-700">
                Garantías ganadas
              </dt>
              <dd className="text-2xl font-bold text-green-800">
                {user.warrantiesWon}
              </dd>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <dt className="font-semibold text-yellow-700">
                Garantías en proceso
              </dt>
              <dd className="text-2xl font-bold text-yellow-800">
                {user.warrantiesInProcess}
              </dd>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <dt className="font-semibold text-red-700">Garantías perdidas</dt>
              <dd className="text-2xl font-bold text-red-800">
                {user.warrantiesLost}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {user?.warranties?.garantias?.length ? (
        <Card className="w-full border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Garantías</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={
                user?.warranties
                  ? user.warranties
                  : { totalGarantia: 0, garantias: [] }
              }
              columns={columns}
              userDetail={true}
            />
          </CardContent>
        </Card>
      ) : <NoData dataType="Garantías"/>}
    </div>
  );
}
