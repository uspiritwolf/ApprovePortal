import { useState, useContext, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

import { AuthContext } from "@/context/AuthContext"

import { TemplateApproval } from "@/types/TemplateApproval"

interface TemplateSelectorProps {
	value: TemplateApproval | undefined;
	onChange: (value: TemplateApproval | undefined) => void
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
	const [open, setOpen] = useState(false)
	const [templates, setTemplates] = useState<TemplateApproval[]>([])
	const { token } = useContext(AuthContext)

	const selectHandle = (currentValue: string) => {
		const template = templates.find((template) => template.id === currentValue);
		setOpen(false)
		onChange(template)
	}

	useEffect(() => {
		const fetchTemplates = async () => {
			const response = await fetch("/api/approval/templates", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await response.json() as TemplateApproval[]
			setTemplates(data)
		}
		fetchTemplates()
	}, [token])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[260px] justify-between"
				>
					{value?.title ?? "No selected"}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[260px] p-0">
				<Command>
					<CommandInput placeholder="Search template..."/>
					<CommandList>
						<CommandEmpty>No template found.</CommandEmpty>
						<CommandGroup>
							{templates.map((t) => (
								<CommandItem
									key={t.id}
									value={t.id.toString()}
									content={t.title}
									onSelect={selectHandle}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value?.id === t.id ? "opacity-100" : "opacity-0"
										)}
									/>
									{t.title}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
