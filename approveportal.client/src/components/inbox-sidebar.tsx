import * as React from "react"
import { ArchiveX, Command, File, Inbox, Send } from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { Label } from "@/components/ui/label"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

import { Approval } from "@/types/Approval"

interface InboxSidebarProps extends React.ComponentProps<typeof Sidebar> {
	approvals: Approval[]
}

const navMain = [
	{
		title: "Inbox",
		url: "#",
		icon: Inbox,
		isActive: true,
		status: "Pending",
		authorMe: false
	},
	{
		title: "Drafts",
		url: "#",
		icon: File,
		isActive: false,
		status: "Draft",
		authorMe: false
	},
	{
		title: "Sent",
		url: "#",
		icon: Send,
		isActive: false,
		status: "Pending",
		authorMe: true
	},
	{
		title: "Archive",
		url: "#",
		icon: ArchiveX,
		isActive: false,
		status: "Approved",
		authorMe: false
	},
]

export function InboxSidebar({ approvals, ...props }: InboxSidebarProps) {
	const [activeItem, setActiveItem] = React.useState(navMain[0])
	const { setOpen } = useSidebar()

	function handleFilter(approval: Approval) {
		return activeItem.status === approval.status;
	}

	return (
		<Sidebar
			collapsible="icon"
			className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
			{...props}
		>
			<Sidebar
				collapsible="none"
				className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
			>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
								<a href="#">
									<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
										<Command className="size-4" />
									</div>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">Acme Inc</span>
										<span className="truncate text-xs">Enterprise</span>
									</div>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent className="px-1.5 md:px-0">
							<SidebarMenu>
								{navMain.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											tooltip={{
												children: item.title,
												hidden: false,
											}}
											onClick={() => {
												setActiveItem(item)
												setOpen(true)
											}}
											isActive={activeItem?.title === item.title}
											className="px-2.5 md:px-2"
										>
											<item.icon />
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<NavUser/>
				</SidebarFooter>
			</Sidebar>

			{/* This is the second sidebar */}
			{/* We disable collapsible and let it fill remaining space */}
			<Sidebar collapsible="none" className="hidden flex-1 md:flex">
				<SidebarHeader className="gap-3.5 border-b p-4">
					<div className="flex w-full items-center justify-between">
						<div className="text-base font-medium text-foreground">
							{activeItem?.title}
						</div>
						<Label className="flex items-center gap-2 text-sm">
							<span>Unreads</span>
							<Switch className="shadow-none" />
						</Label>
					</div>
					<SidebarInput placeholder="Type to search..." />
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup className="px-0">
						<SidebarGroupContent>
							{approvals.filter(handleFilter).map((approval) => (
								<a
									href="#"
									key={approval.email}
									className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
								>
									<div className="flex w-full items-center gap-2">
										<span>{approval.name}</span>{" "}
										<span className="ml-auto text-xs">{approval.date}</span>
									</div>
									<span className="font-medium">{approval.subject}</span>
									<span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
										{approval.description}
									</span>
								</a>
							))}
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
		</Sidebar>
	)
}
