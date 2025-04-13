import { InboxSidebar } from "@/components/inbox-sidebar"
import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar"

import { useContext } from "react"
import { ApprovalContext } from "@/context/ApprovalContext"

export default function Dashboard() {
	const { approvals } = useContext(ApprovalContext)
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "350px",
				} as React.CSSProperties
			}
		>
			<InboxSidebar approvals={approvals} />
			<SidebarInset>
				<div className="flex flex-1 flex-col gap-4 p-4">
					{Array.from({ length: 24 }).map((_, index) => (
						<div
							key={index}
							className="aspect-video h-12 w-full rounded-lg bg-muted/50"
						/>
					))}
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
