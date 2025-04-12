import { useState, useContext } from "react"
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

type UserInfo = {
	id: number
	username: string
	email: string
}

export function UserSelector() {
	const [open, setOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<UserInfo | undefined>(undefined)
	const [users, setUsers] = useState<UserInfo[]>([])
	const { token } = useContext(AuthContext)

	const onSelect = (currentValue: string) => {
		const id = parseInt(currentValue);
		const user = users.find((user) => user.id === id);
		setSelectedUser(user)
		setOpen(false)
	}

	const searchUser = async (value: string) => {
		if (value === "") {
			return
		}
		const response = await fetch(`/api/users/search?q=${value}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`
			},
		})
		const data = await response.json() as UserInfo[]
		if (selectedUser && !data.find(user => user.id === selectedUser.id)) {
			data.push(selectedUser)
		}
		setUsers(data)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{selectedUser
						? selectedUser.username
						: "Search user..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command shouldFilter={false}>
					<CommandInput placeholder="Search user..." onValueChange={searchUser} />
					<CommandList>
						<CommandEmpty>No user found.</CommandEmpty>
						<CommandGroup>
							{users.map((user) => (
								<CommandItem
									value={user.id.toString()}
									content={user.username}
									onSelect={onSelect}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
										)}
									/>
									{user.username} {user.email && user.email !== "" && <>({user.email})</>}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
