import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "@/pages/login"
import HomePage from "@/pages/home"

function App()
{
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</Router>
	);
}

export default App;