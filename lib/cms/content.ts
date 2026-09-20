import { cache } from 'react';
import { connection } from 'next/server';
import { readContent } from './storage';
export const getContent = cache(async () => {
  await connection();
  return readContent();
});
