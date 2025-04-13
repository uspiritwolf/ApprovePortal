import { InboxSidebar } from "@/components/inbox-sidebar"
import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar"

import { useContext } from "react"
import { ApprovalContext } from "@/context/ApprovalContext"
import { useSearchParams } from "react-router-dom"
import { ApprovalDetails } from "@/components/approval-details"


export default function Dashboard() {
	const { approvals } = useContext(ApprovalContext)
	const [searchParams] = useSearchParams();
	const currentApproval = approvals.find((approval) => approval.id === searchParams.get("id"));
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
				{currentApproval && <ApprovalDetails value={currentApproval} />}
			</SidebarInset>
		</SidebarProvider>
	)
}
