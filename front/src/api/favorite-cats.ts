import { request } from "../utils/request";

interface Cat {
  id: string;
  url: string;
}

export const readFavoriteCats = async (token: string): Promise<Cat[]> => {
  const loadedCats = await request('/likes', token);
  
  return loadedCats.map((cat: { cat_id: string }) => ({
    id: cat.cat_id,
    url: `https://cdn2.thecatapi.com/images/${cat.cat_id}.jpg`,
  }));
};

export const createFavoriteCat = async (catId: string, token: string | null): Promise<void> => {
  await request('/likes', token, 'POST', { cat_id: catId });
};

export const deleteFavoriteCat = async (catId: string, token: string | null): Promise<void> => {
  await request(`/likes/${catId}`, token, 'DELETE');
};