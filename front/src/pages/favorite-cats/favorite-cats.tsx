import { useEffect, useState } from 'react';
import { Cats } from '../../components/cats/cats';
import { readFavoriteCats } from '../../api/favorite-cats';
import { Navigate } from 'react-router-dom';

interface ICat {
  id: string;
  url: string;
}

export const FavoriteCats: React.FC = () => {
  const [favoriteCats, setFavoriteCats] = useState<ICat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  const fetchFavouriteCats = async () => {
    setIsLoading(true);
    try {
      const cats: ICat[] = await readFavoriteCats(token);
      setFavoriteCats(cats);
    } catch (e) {
      setError('Ошибка при получении котиков');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavouriteCats();
  }, []);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Cats cats={favoriteCats} isFavouritePage={true} />
  );
};