import React from 'react';
import styles from './preloader.module.css';

export const Preloader = () => (
  <body className={styles.page}>
    <main className={styles.main}>
      <div className={styles.preloader} />
    </main>
  </body>
);
