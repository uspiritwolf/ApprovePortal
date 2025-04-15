import { useTransition, useState, useContext } from "react"
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
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { UserSelector } from '@/components/user-selector'
import { UserBaseInfo } from "@/types/UserInfo"
import { AuthContext } from "@/context/AuthContext"
import { ApprovalContext } from "@/context/ApprovalContext"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { TemplateSelector } from "@/components/template-selector"
import { TemplateApproval } from "@/types/TemplateApproval"
import { getErrorStr } from "@/utils"

interface NewApprovalContentProps extends React.ComponentProps<typeof DialogContent> {
	onOpenChange: (open: boolean) => void
}

type UserArray = (UserBaseInfo | undefined)[];

function NewApprovalContent({ onOpenChange }: NewApprovalContentProps) {
	const { token, user } = useContext(AuthContext)
	const { refresh } = useContext(ApprovalContext)
	const [isPending, startTransition] = useTransition()
	const [approvers, setApprovers] = useState<UserArray>([])
	const [description, setDescription] = useState<string>("")
	const [title, setTitle] = useState<string>("")
	const [tab, setTab] = useState<string>("new")
	const [error, setError] = useState<string | null>(null)
	const [currentTemplate, setTemplate] = useState<TemplateApproval | undefined>(undefined)
	const [isTemplate, setIsTemplate] = useState<boolean>(false)

	const isManager = user?.role === "Manager"

	const handleSubmit = () => {
		startTransition(async () => {
			const method = (isTemplate && tab === "new") ? "template" : "create";
			const response = await fetch(`/api/approval/${method}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify({
					Title: title,
					ApproverIds: approvers.map(e => e!.id),
					Description: description,
				}),
			})
			if (!response.ok) {
				setError(await getErrorStr(response))
				return
			}
			await refresh()
			onOpenChange(false)
		})
	}

	const handleSelectUser = (key: number, user: UserBaseInfo | undefined) => {
		setError(null);
		setApprovers((prev) => {
			const newUsers = [...prev]
			newUsers[key] = user
			return newUsers
		})
	}

	const addUser = () => {
		setError(null);
		setApprovers((prev) => {
			const newUsers = [...prev]
			newUsers.push(undefined)
			return newUsers
		})
	}

	const handleSelectTemplate = (value: TemplateApproval | undefined) => {
		setTitle(value?.title ?? "")
		setDescription(value?.description ?? "")
		setApprovers(value?.approvers ?? [])
		setTemplate(value)
	}

	const canSumbit = () => {
		return approvers.every((user) => user !== undefined) && title.length > 0 && description.length > 0 && !error
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
				{error &&
					<Alert variant="destructive">
						<AlertTitle>Failed</AlertTitle>
						<AlertDescription>
							{error}
						</AlertDescription>
					</Alert>
				}
			</DialogHeader>
			<Tabs value={tab} onValueChange={setTab}>
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="new">Create a new</TabsTrigger>
					<TabsTrigger value="template">Use Template</TabsTrigger>
				</TabsList>
				<TabsContent value="new" className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="Title">
							Tittle
						</Label>
						<Input id="Title" className="col-span-3" value={title} onChange={(e) => { setError(null); setTitle(e.currentTarget.value) }} />
					</div>
					<Separator />
					<div className="grid grid-cols-4 w-full gap-1.5">
						<Label>Approver</Label>
						<Button variant="outline" size="icon" onClick={addUser}>+</Button>
					</div>
					{approvers.map((user, index) => (
						<div key={index} className="grid grid-cols-4 items-center gap-4">
							<Label>{index + 1}</Label>
							<UserSelector value={user} onChange={(u) => handleSelectUser(index, u)} />
						</div>
					))}
					<Separator />
					<div className="grid w-full gap-1.5">
						<Label htmlFor="description">Description</Label>
						<Textarea placeholder="Type your message here." id="description" value={description} onChange={(e) => { setError(null); setDescription(e.currentTarget.value) }} />
					</div>
					{isManager && <div className="flex items-center space-x-2">
						<Checkbox id="isTemplate" checked={isTemplate} onCheckedChange={(e) => setIsTemplate(e === true)} />
						<Label htmlFor="isTemplate">Submit as template</Label>
					</div>}
				</TabsContent>
				<TabsContent value="template" className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label>
							Template
						</Label>
						<TemplateSelector value={currentTemplate} onChange={handleSelectTemplate} />
					</div>
				</TabsContent>
			</Tabs>
			<DialogFooter>
				<Button type="submit" onClick={handleSubmit} disabled={!canSumbit()}>Submit</Button>
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
