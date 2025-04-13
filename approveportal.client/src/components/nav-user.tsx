import {
	ChevronsUpDown,
	LogOut,
} from "lucide-react"

import {
	Avatar,
	AvatarFallback,
	/*AvatarImage,*/
} from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"

import { useContext } from "react"
import { AuthContext } from "@/context/AuthContext"

export function NavUser() {
	const { user, logout } = useContext(AuthContext)
	const { isMobile } = useSidebar()

	function getInitials() {
		const parts = user!.name.trim().split(/\s+/);
		if (parts.length < 2) {
			return parts[0][0].toUpperCase();
		} else {
			return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
		}
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								{/*<AvatarImage src={user.avatar} alt={user.name} />*/}
								<AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user!.name}</span>
								<span className="truncate text-xs">{user!.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									{/*<AvatarImage src={user.avatar} alt={user.username} />*/}
									<AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user!.name}</span>
									<span className="truncate text-xs">{user!.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={logout}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
