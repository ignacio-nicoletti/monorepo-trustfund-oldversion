import UserProfile from "~/src/components/userProfile";
import { fetchUserDetailWithRelations } from "~/src/server-actions/users";

export const revalidate = 0;

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  let user = await fetchUserDetailWithRelations(id);

  return <UserProfile userInfo={user} />;
}
