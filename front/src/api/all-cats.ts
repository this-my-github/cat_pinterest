import { CAT_URL } from "../constanst/url";

export const readAllCats = async () => {
	const API_KEY = import.meta.env.VITE_API_KEY;

	const response = await fetch(`${CAT_URL}?limit=15&api_key=${API_KEY}`);
	if (!response.ok) {
	  throw new Error('Ошибка при получении котиков');
	}
	return response.json();
  };