import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css';

export const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.container}>
      <nav>
        <Link
          className={`${styles.linkToPage} ${location.pathname === '/' ? styles.active : ''}`}
          to="/"
        >
          Все коты
        </Link>
        <Link
          className={`${styles.linkToPage} ${location.pathname === '/favorites' ? styles.active : ''}`}
          to="/favorites"
        >
          Любимые коты
        </Link>
      </nav>
    </header>
  );
};