import type { Metadata } from "next";

import NextSessionProvider from "~/src/components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

import { AppSidebar } from "@components/sidebar/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar.tsx";
import { getAllOrganizations } from "~/src/server-actions/organization";
import { redirect } from "next/navigation";
import { ThemeProvider } from "~/src/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "CRM para gestion interna",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const organizations = await getAllOrganizations();

  if (session) {
    return (
      <NextSessionProvider session={session}>
        <ThemeProvider
          attribute="class"
          defaultTheme={
            session?.user?.organization && session?.user?.organization === 2
              ? "dark"
              : "light"
          }
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar session={session} organizations={organizations} />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-primary/15">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  Colapsar menú
                </div>
              </header>
              <section className="p-5 xl:p-10">
                {children}
              </section>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </NextSessionProvider>
    );
  } else {
    redirect("/");
  }
}
