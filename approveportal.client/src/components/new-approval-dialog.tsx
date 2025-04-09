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

	return (
		<DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => { e.preventDefault() }}>
			{isPending && (
				<div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center text-lg font-semibold">
					Processing...
				</div>
			)}
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're done.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="name" className="text-right">
						Name
					</Label>
					<Input id="name" value="Pedro Duarte" className="col-span-3" />
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="username" className="text-right">
						Username
					</Label>
					<Input id="username" value="@peduarte" className="col-span-3" />
				</div>
			</div>
			<DialogFooter>
				<Button type="submit" onClick={handleSubmit}>Save changes</Button>
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
