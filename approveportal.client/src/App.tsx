import { useEffect, useState } from 'react';
import './App.css';

interface Forecast {
	date: string;
	temperatureC: number;
	temperatureF: number;
	summary: string;
}

function WeatherPage(props: { token: string }) {
	const [forecasts, setForecasts] = useState<Forecast[]>();

	useEffect(() => {
		populateWeatherData(props.token);
	}, [props.token]);

	const contents = forecasts === undefined
		? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
		: <table className="table table-striped" aria-labelledby="tableLabel">
			<thead>
				<tr>
					<th>Date</th>
					<th>Temp. (C)</th>
					<th>Temp. (F)</th>
					<th>Summary</th>
				</tr>
			</thead>
			<tbody>
				{forecasts.map(forecast =>
					<tr key={forecast.date}>
						<td>{forecast.date}</td>
						<td>{forecast.temperatureC}</td>
						<td>{forecast.temperatureF}</td>
						<td>{forecast.summary}</td>
					</tr>
				)}
			</tbody>
		</table>;

	return (
		<div>
			<h1 id="tableLabel">Weather forecast</h1>
			<p>This component demonstrates fetching data from the server.</p>
			{contents}
		</div>
	);

	async function populateWeatherData(token: string) {
		const response = await fetch('weatherforecast', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
		if (response.ok) {
			const data = await response.json();
			setForecasts(data);
		}
	}
}

function LoginPage(props: { callback: (token: string) => void }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Username: </label>
					<input type="text" value={username} onChange={e => setUsername(e.target.value)} />
				</div>
				<div>
					<label>Password: </label>
					<input type="password" value={password} onChange={e => setPassword(e.target.value)} />
				</div>
				<div>
					<button type="submit">Login</button>
				</div>
			</form>
		</div>
	);
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const response = await fetch('auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				Username: username,
				Password: password
			})
		});
		if (response.ok) {
			const data = await response.json();
			props.callback(data.token);
		}
	}
}

function App() {
	const [token, setToken] = useState<string | null>(null);

	function handleLogin(token: string) {
		setToken(token);
	}

	if (token == null) {
		return (<LoginPage callback={handleLogin} />)
	} else {
		return (<WeatherPage token={token} />)
	}
}

export default App;