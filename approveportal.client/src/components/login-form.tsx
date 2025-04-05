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

import { AuthContext } from "@/context/AuthContext"

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement>
{
	className?: string;
}

export function LoginForm({ className, ...props }: LoginFormProps)
{
	const navigate = useNavigate();
	const { onLogin } = useContext(AuthContext);
	const [error, setError] = useState<string | null>(null);

	async function sumbit(formData: FormData) {
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
			onLogin((await response.json()).token)
				.then(() => navigate('/'))
				.catch(() => setError('Failed to login'))
		}
		else
		{
			const data = await response.json()
			let errorStr = data.title
			for (const key in data.errors) {
				errorStr += data.errors[key] + ' ';
			}
			setError(errorStr)
			return
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
					<form action={sumbit}>
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
					{error &&
						<div className="pt-6">
							<Alert variant="destructive">
								<AlertTitle>Failed</AlertTitle>
								<AlertDescription>
									{error}
								</AlertDescription>
							</Alert>
						</div>
					}
				</CardContent>
			</Card>
		</div>
	)
}
