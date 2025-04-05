import { AuthorizeView } from '@/components/authorize-view'

export default function HomePage()
{
	return (
		<AuthorizeView>
			<h1>Home Page</h1>
		</AuthorizeView>
	)
}