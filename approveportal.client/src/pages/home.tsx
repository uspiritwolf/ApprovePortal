import { AuthorizeView } from '@/components/authorize-view'
import Dashboard from '@/pages/dashboard'

export default function HomePage()
{
	return (
		<AuthorizeView>
			<Dashboard/>
		</AuthorizeView>
	)
}