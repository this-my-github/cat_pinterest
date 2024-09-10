import { BASE_URL } from '../constanst/url';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const request = async (path: string, token?: string | null, method: RequestMethod = 'GET', data?: any) => {
    if (!token) {
		throw new Error('Unauthorized');
	  }
	
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'X-Auth-Token':  token,
	};

	const response = await fetch(BASE_URL + path, {
		headers,
		method,
		body: data ? JSON.stringify(data) : undefined,
	});

	if (!response.ok) {
		throw new Error(`Ошибка при выполнении запроса: ${response.status} ${response.statusText}`);
	}

	const loadedData = await response.json();
	return loadedData;
};