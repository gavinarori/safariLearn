"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth"; 
export function NavUser() {
  const { user, signOut } = useAuth(); 

  if (!user) return null; 

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-colors duration-200 hover:bg-sidebar-accent/50"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={user.avatar_url || "/placeholder.svg"}
                          alt={user.full_name || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {user.full_name ? user.full_name.charAt(0) : "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.full_name}
                        </span>
                        <span className="truncate text-xs">{user.email}</span>
                      </div>

                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    Click to open menu
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.avatar_url || "/placeholder.svg"}
                      alt={user.full_name || "User"}
                    />
                    <AvatarFallback className="rounded-lg">
                      {user.full_name ? user.full_name.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.full_name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer transition-colors duration-150 hover:bg-accent hover:text-accent-foreground">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer transition-colors duration-150 hover:bg-accent hover:text-accent-foreground">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
                onClick={signOut} 
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
