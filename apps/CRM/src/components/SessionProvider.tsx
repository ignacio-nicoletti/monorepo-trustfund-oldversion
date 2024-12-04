'use client'

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

export default function NextSessionProvider({
  session,
  children
}: {
  session: Session;
  children: ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}