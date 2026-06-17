import dynamic from 'next/dynamic';

const TinaAdmin = dynamic(
  () => import('tinacms').then((mod) => mod.TinaAdmin),
  { ssr: false }
);

export default TinaAdmin;

