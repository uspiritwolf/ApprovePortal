import { useTransition, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { UserSelector } from '@/components/user-selector'

interface NewApprovalContentProps extends React.ComponentProps<typeof DialogContent> {
	onOpenChange: (open: boolean) => void
}

function NewApprovalContent({ onOpenChange }: NewApprovalContentProps) {
	const [isPending, startTransition] = useTransition()

	const handleSubmit = () => {
		startTransition(async () => {
			await new Promise((resolve) => setTimeout(resolve, 10000))
			onOpenChange(false)
		})
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const noAction = (e: any) => { e.preventDefault() };
	return (
		<DialogContent className="sm:max-w-[425px]" onInteractOutside={noAction} onEscapeKeyDown={noAction}>
			{isPending && (
				<div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center text-lg font-semibold">
					Processing...
				</div>
			)}
			<DialogHeader>
				<DialogTitle>Create Approval</DialogTitle>
				<DialogDescription>
					Creating a new approval process.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="subject">
						Tittle
					</Label>
					<Input id="subject" value="" className="col-span-3" />
				</div>
				<Separator />
				<div className="grid grid-cols-4 w-full gap-1.5">
					<Label>Approver</Label>
					<Button variant="outline" size="icon">+</Button>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label>0</Label>
					<UserSelector />
				</div>
				<Separator />
				<div className="grid w-full gap-1.5">
					<Label htmlFor="description">Description</Label>
					<Textarea placeholder="Type your message here." id="description" />
				</div>
			</div>
			<DialogFooter>
				<Button type="submit" onClick={handleSubmit}>Create</Button>
			</DialogFooter>
		</DialogContent>
	)
}

export function NewApprovalEntry() {
	const [open, setOpen] = useState(false)
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">New Approval</Button>
			</DialogTrigger>
			<NewApprovalContent onOpenChange={setOpen} />
		</Dialog>
	)
}
