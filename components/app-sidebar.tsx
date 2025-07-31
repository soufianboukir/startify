"use client"

import * as React from "react"
import {
  Flag,
  LayoutDashboard,
  ShieldUser,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Reported items",
      url: "/reported",
      icon: Flag,
    },
    {
      title: "Admins",
      url: "/admins",
      icon: ShieldUser,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link className='flex gap-2 items-center cursor-pointer' href={'/feed'}>
                  <Image src={'/icons/startify-logo.png'} width={30} height={30} alt='Startify logo' className='rounded-xs'/>
                  <div className='hidden flex-col lg:flex'>
                      <span className='font-semibold'>Startify</span>
                      <span className='text-xs'>Connecting worldwide ideas</span>
                  </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
