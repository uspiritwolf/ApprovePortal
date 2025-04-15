import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { AuthContext } from "@/context/AuthContext"
import { getErrorStr } from "@/utils"
interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement>
{
	className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps)
{
	const navigate = useNavigate();
	const { onLogin } = useContext(AuthContext);
	const [error, setError] = useState<string | null>(null);

	async function sumbitLogin(formData: FormData) {
		const request = {
			username: formData.get("username"),
			password: formData.get("password"),
		}

		const response = await fetch("api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		})
		if (response.ok)
		{
			setError('')
			const res = await response.json()
			onLogin(res.token as string)
				.then(() => {
					navigate('/')
				})
				.catch((e: Error) => {
					setError(e.message)
				});
		}
		else
		{
			setError(await getErrorStr(response))
			return
		}
	}

	async function submitRegister(formData: FormData) {
		const request = {
			username: formData.get("username"),
			password: formData.get("password"),
			email: formData.get("email"),
			name: formData.get("name"),
		}

		const response = await fetch("api/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(request),
		})
		if (response.ok) {
			setError('')
			const res = await response.json()
			onLogin(res.token as string)
				.then(() => {
					navigate('/')
				})
				.catch((e: Error) => {
					setError(e.message)
				});
		}
		else {
			setError(await getErrorStr(response))
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>
						Enter your username below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="login">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="login">Login</TabsTrigger>
							<TabsTrigger value="register">Register</TabsTrigger>
						</TabsList>
						<TabsContent value="login">
							<form action={sumbitLogin}>
								<div className="flex flex-col gap-6">
									<div className="grid gap-2">
										<Label htmlFor="username">Username</Label>
										<Input
											id="username"
											name="username"
											type="text"
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											name="password"
											type="password"
											required />
									</div>
									<Button type="submit" className="w-full">
										Login
									</Button>
								</div>
							</form>
						</TabsContent>
						<TabsContent value="register">
							<form action={submitRegister}>
								<div className="flex flex-col gap-6">
									<div className="grid gap-2">
										<Label htmlFor="username">Username</Label>
										<Input
											id="username"
											name="username"
											type="text"
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											name="email"
											type="email"
											required />
									</div>
									<div className="grid gap-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											name="name"
											type="text"
											required />
									</div>
									<div className="grid gap-2">
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											name="password"
											type="password"
											required />
									</div>
									<Button type="submit" className="w-full">
										Login
									</Button>
								</div>
							</form>
						</TabsContent>
						{error &&
						<div className="pt-6">
							<Alert variant="destructive">
								<AlertTitle>Failed</AlertTitle>
								<AlertDescription>
									{error}
								</AlertDescription>
							</Alert>
						</div>}
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}
