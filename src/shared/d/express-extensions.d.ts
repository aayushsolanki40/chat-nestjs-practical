// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      [key: string]: any;
    };
  }
}
