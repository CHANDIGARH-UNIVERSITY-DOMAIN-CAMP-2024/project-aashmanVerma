import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "./ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Quizzes",
      url: "#",
      items: [
        {
          title: "Create",
          url: "/dashboard/quiz/create",
        },
        {
          title: "Manage",
          url: "/dashboard/quiz/manage",
        },
        {
          title: "Status",
          url: "/dashboard/quiz/status",
        },
      ],
    },
    {
      title: "Responses",
      url: "#",
      items: [
        {
          title: "Analysis",
          url: "/dashboard/analysis"
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      items: [
        {
          title: "Account",
          url: '/dashboard/account'
        },
        {
          title: "Sign Out",
          url: '/dashboard/sign-out'
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
        <SidebarGroupLabel>Quizz</SidebarGroupLabel>
        { props.profile }
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((item) => {
                        if (item.title === "Sign Out") {
                          return <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                              onClick={props.signOut}
                            >
                              <button onClick={props.signOut}>{item.title}</button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        } else {
                          return <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                            >
                              <a href={item.url}>{item.title}</a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        }
    })}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}