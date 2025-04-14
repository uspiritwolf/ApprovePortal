
import { Approval } from '@/types/Approval'
import { Separator } from '@/components/ui/separator'
import { Badge } from "@/components/ui/badge"
import { ApproveStatus } from "@/types/Approval"
import { useContext, useTransition } from 'react'
import { AuthContext } from '@/context/AuthContext'
import { Loader2 } from "lucide-react"
import { ApprovalContext } from '@/context/ApprovalContext'
interface ApprovalDetailsProps {
	value: Approval
}

interface ActinoPanelProps {
	onApprove: () => void
	onReject: () => void
}

function ActinoPanel({ onApprove, onReject }: ActinoPanelProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-3">
				<Badge className="bg-green-400 hover:bg-green-300 cursor-default select-none" variant="outline" onClick={onApprove}>Approve</Badge>
				<Badge className="bg-red-500 hover:bg-red-400 cursor-default select-none" variant="outline" onClick={onReject} >Reject</Badge>
			</div>
		</div>
	)
}

export function ApprovalDetails({ value }: ApprovalDetailsProps) {

	const { user, token } = useContext(AuthContext)
	const [isBusy, startTransition] = useTransition()
	const { refresh } = useContext(ApprovalContext)

	const getColor = (status: ApproveStatus) => {
		switch (status) {
			case 'Approved':
				return 'bg-green-400'
			case 'Rejected':
				return 'bg-red-400'
			case 'Pending':
				return 'bg-yellow-100'
			default:
				return ''
		}
	};

	const approveHandle = () => {
		startTransition(async () => {
			const response = await fetch(`/api/approval/approve/${value.id}`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			if (response.ok) {
				await refresh();
			}
		});
	}

	const rejectHandle = () => {
		startTransition(async () => {
			const response = await fetch(`/api/approval/reject/${value.id}`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			if (response.ok) {
				await refresh();
			}
		});
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<div className="flex flex-col gap-2">
				<h2 className="text-lg font-semibold">{value.title}</h2>
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold">Created By</span>
					<span className="text-sm">{value.createdBy.name}</span>
					<span className="text-sm text-gray-500">{value.createdBy.email}</span>
				</div>
			</div>
			<Separator />
			<span className="text-sm font-semibold">Approvers</span>
			{value.approvers.map((u, index) => (
				<div key={index} className="flex items-center gap-2">
					<Badge className={`w-20 text-center justify-center ${getColor(u.status)}`} variant="outline">{u.status}</Badge>
					<span className="text-sm font-semibold">{index + 1}.</span>
					<span className="text-sm">{u.name}</span>
					<span className="text-sm text-gray-500">{u.email}</span>
					{user?.id === u.id && !isBusy && u.status === 'Pending' && < ActinoPanel onApprove={approveHandle} onReject={rejectHandle} />}
					{user?.id === u.id && isBusy && <Loader2 className="animate-spin" />}
				</div>))}
			<Separator />
			<div className="flex flex-col gap-2">
				<h2 className="text-lg font-semibold">Description</h2>
				<p>{value.description}</p>
			</div>
		</div>
	)
}