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
import { UserBaseInfo } from "@/types/UserInfo"

interface UserSelectorProps {
	value: UserBaseInfo | undefined;
	onChange: (value: UserBaseInfo | undefined) => void
}

async function SearchUser(token: string, str: string | null, first: number | null = null): Promise<UserBaseInfo[]> {
	const params = new URLSearchParams()
	if (first) params.append("f", first.toString())
	if (str) params.append("q", str)
	const query = params.toString()
	const response = await fetch(`/api/users/search?${query}`, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${token}`
		},
	})
	return await response.json() as UserBaseInfo[]
}

export function UserSelector({ value, onChange }: UserSelectorProps) {
	const [open, setOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState<UserBaseInfo | undefined>(value)
	const [users, setUsers] = useState<UserBaseInfo[]>([])
	const { token } = useContext(AuthContext)

	const selectHandle = (currentValue: string) => {
		const user = users.find((user) => user.id === currentValue);
		setSelectedUser(user)
		setOpen(false)
		onChange(user)
	}

	const searchUser = async (value: string) => {
		const data = await SearchUser(token!, value, null)
		if (selectedUser && !data.find(user => user.id === selectedUser.id)) {
			data.push(selectedUser)
		}
		setUsers(data)
	}

	useEffect(() => {
		if (!token) return

		const fetchInitialUsers = async () => {
			const initialUsers = await SearchUser(token, null, 10)
			setUsers(initialUsers)
		}

		fetchInitialUsers()
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
					{selectedUser
						? selectedUser.name
						: "Search user..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[260px] p-0">
				<Command shouldFilter={false}>
					<CommandInput placeholder="Search user..." onValueChange={searchUser} />
					<CommandList>
						<CommandEmpty>No user found.</CommandEmpty>
						<CommandGroup>
							{users.map((user) => (
								<CommandItem
									key={user.id}
									value={user.id.toString()}
									content={user.name}
									onSelect={selectHandle}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
										)}
									/>
									{user.name} <p className="text-xs">({user.username})</p>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
