import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "@/pages/login"
import HomePage from "@/pages/home"

import { ApprovalProvider } from "@/context/ApprovalProvider";

function HomePageWithApprovalProvider() {
	return (
		<ApprovalProvider>
			<HomePage />
		</ApprovalProvider>
	);
}

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePageWithApprovalProvider/>} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</Router>
	);
}

export default App;