"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useClerk, useUser } from "@clerk/nextjs"
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const fullName = user?.fullName ? user.fullName : "Guest";
  const imageUrl = user?.imageUrl ? user.imageUrl : "/avatar.png";

  return (
    <SidebarProvider>
      <AppSidebar   
        signOut={signOut}      
        profile={
        user ? 
        <div className="flex items-center space-x-2 p-4 hover:bg-gray-100 rounded-md cursor-pointer">
          <Image width={10} height={10} src={imageUrl} alt={fullName} className="w-6 h-6 rounded-full" />
          <div>
            {fullName}
          </div>
        </div>
        : null
      } />
      <main className="w-full px-4 py-2">
        <SidebarTrigger className="mb-4" />
        {children}
        <Toaster />
      </main>
    </SidebarProvider>
  )
}
