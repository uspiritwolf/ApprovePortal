

export async function getErrorStr(response: Response): Promise<string> {
	const text = await response.text();
	try {
		const data = JSON.parse(text);
		let errorStr = data.title + ' '
		for (const key in data.errors) {
			errorStr += data.errors[key] + ' '
		}
		return errorStr.trim()
	}
	catch {
		return text
	}
}