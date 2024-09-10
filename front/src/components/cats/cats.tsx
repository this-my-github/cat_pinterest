import { useState } from 'react';
import styles from './cats.module.css';
import { createFavoriteCat, deleteFavoriteCat } from '../../api/favorite-cats';
import { Navigate } from 'react-router-dom';

interface Cat {
    id: string;
    url: string;
}

interface CatsProps {
cats: Cat[];
isFavouritePage?: boolean;
}

export const Cats = ({ cats, isFavouritePage = true }: CatsProps) => {
    const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
    const [clickedCatId, setClickedCatId] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);

    const token = sessionStorage.getItem('token');

    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const target = event.target as HTMLImageElement;
        
        target.src = target.src.slice(0, -3) + 'gif';
    };
  
    const onClickIcon = async (catId: string) => {
    try {
        const isCatClicked = clickedCatId.includes(catId);

        if (isFavouritePage) {
            if (isCatClicked) {
                await createFavoriteCat(catId, token)
                setClickedCatId((prev) => prev.filter(id => id !== catId))
            } else {
                await deleteFavoriteCat(catId, token)
                setClickedCatId((prev) => [...prev, catId])
            }
        } else {
            if (isCatClicked) {
                await deleteFavoriteCat(catId, token)
                setClickedCatId((prev) => prev.filter(id => id !== catId))
            } else {
                await createFavoriteCat(catId, token)
                setClickedCatId((prev) => [...prev, catId])
            }
        }
    } catch (e) {
        const error = e as Error;
        if (error.message === 'Unauthorized') {
            setRedirectToLogin(true);
          }
      
        setError('Ошибка при обновлении котика в любимых');
      }
    }

    const getIcon = (catId: string) => {
        const isClicked = clickedCatId.includes(catId);
        const isHovered = hoveredCatId === catId;
      
        return isFavouritePage 
        ? (isClicked || isHovered ? '♡' : '♥') 
        : (isClicked || isHovered ? '♥' : '♡');
      };

    if (redirectToLogin) {
        return <Navigate to="/login" />;
    }

  return (
    <div className={styles.container}>
        {error && <div className={styles.error}>{error}</div>}
        {cats.map((cat, i) => (
            <div
            key={cat.id + i}
            className={`${styles.catCard} ${
                clickedCatId?.includes(cat.id) ? styles.clicked : ''
            }`}

            >
            <img
                src={cat.url}
                alt={`Cat ${cat.id}`}
                onError={handleImageError}
            />
            <div             
                className={`${styles.icon} ${
                    clickedCatId?.includes(cat.id) ? styles.iconСlicked : ''
                }`}

                onMouseEnter={() => setHoveredCatId(cat.id)}
                onMouseLeave={() => setHoveredCatId(null)}
                onClick={() => onClickIcon(cat.id)}
            >
                {getIcon(cat.id)}
            </div>
            </div>
        ))}
    </div>
  );
}