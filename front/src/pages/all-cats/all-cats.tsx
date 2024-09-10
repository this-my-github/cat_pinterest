import { useEffect, useState } from 'react';
import { Cats } from '../../components/cats/cats';
import { readAllCats } from '../../api/all-cats';
import styles from './all-cats.module.css';

interface ICat {
    id: string;
    url: string;
  }

export const AllCats = () => {
    const [cats, setCats] = useState<ICat[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
  
    const fetchCats = async () => {
      setIsLoading(true);
      try {
        const loadedCats = await readAllCats();
        setCats((prev) => [...prev, ...loadedCats]);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchCats();
    }, []);

  if (isLoading) return <div className={styles.loader}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error.message}</div>;

  return (
    <div className={styles.container}>
        <Cats cats={cats} isFavouritePage={false} />
        <button className={styles.loadedButton} onClick={fetchCats} disabled={isLoading}>
            {isLoading ? 'Загрузка...' : '...загружаем ещё котиков...'}
        </button>
    </div>
    )
};