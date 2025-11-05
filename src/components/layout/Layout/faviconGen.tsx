import { memo } from 'react';

const FaviconGen = ({ website }: { website: string }) => {
  return (
    <>
      <link href={`/favicons/favicon_${website}_180x180.png`} rel="apple-touch-icon" sizes="180x180" />
      <link href={`/favicons/favicon_${website}_32x32.png`} rel="icon" sizes="32x32" type="image/png" />
      <link href={`/favicons/favicon_${website}_16x16.png`} rel="icon" sizes="16x16" type="image/png" />
    </>
  );
};
export default memo(FaviconGen);
