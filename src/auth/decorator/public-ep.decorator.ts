import { SetMetadata } from '@nestjs/common';
export const PUBLIC_KEY = 'public-ep';
export const Public = () => SetMetadata(PUBLIC_KEY, true);
