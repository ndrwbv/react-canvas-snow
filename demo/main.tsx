import { createRoot } from 'react-dom/client';
import { Snow } from '../src';

createRoot(document.getElementById('root')!).render(
  <Snow style={{ position: 'fixed', inset: 0 }} />,
);
