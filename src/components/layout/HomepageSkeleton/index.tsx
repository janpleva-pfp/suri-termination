import React, { memo } from 'react';

import { Container } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

import styles from './index.module.scss';

interface Props {
  className?: string;
  style?: React.CSSProperties;
}
export const HomepageSkeleton: React.FC<Props> = (props) => {
  const { className, style } = props;
  return (
    <Container className={className} style={style}>
      <Skeleton className={styles.nav} />
      <div className="text-center">
        <Skeleton className={styles.title} />
        <Skeleton className={styles.field} />
        <Skeleton className={styles.field} />
        <Skeleton className={styles.field} />
        <Skeleton className={styles.field} />
      </div>
    </Container>
  );
};
export default memo(HomepageSkeleton);
