"use client"

import { useForm } from "react-hook-form"
import { signOut } from 'next-auth/react'
import { useRouter } from "next/navigation"
import { useToast } from "@repo/ui/components/ui/use-toast.ts"

import { Button } from "@repo/ui/components/ui/button.tsx"
import { Form } from "@repo/ui/components/ui/form.tsx"
import { LogOut } from "lucide-react"

type LogoutProps = {
  size: 'default' | 'icon' | 'lg' | 'sm'
  variant: "default" | "destructive" | "ghost" | "outline" | "link" | "secondary"
  className?: string
}

export default function Logout(props: LogoutProps) {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm()

  async function onSubmit() {
    signOut({redirect: false})
      .then(() => {
        toast({
          title: "Sesión finalizada ✅",
          description: "Gracias por usar el servicio!",
          variant: "success" 
        })
        router.refresh()
      })
      .catch(error => console.log(error))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`flex items-center ${props.className}`} >
        <Button variant={props.variant} type="submit" size={props.size} className={props.className}>
          <LogOut />
          Cerrar sesión
        </Button>
      </form>
    </Form>

  )
}