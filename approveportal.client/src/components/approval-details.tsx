
import { Approval } from '@/types/Approval'
import { Separator } from '@/components/ui/separator'
interface ApprovalDetailsProsp {
	value: Approval
}
export function ApprovalDetails({ value }: ApprovalDetailsProsp) {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4">
			<h1>{value.title}</h1>
			<Separator />
			{Array.from({ length: 24 }).map((_, index) => (
				<div
					key={index}
					className="aspect-video h-12 w-full rounded-lg bg-muted/50"
				/>
			))}
		</div>
	)
}