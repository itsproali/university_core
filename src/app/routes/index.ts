import express from 'express';
import { TestRoutes } from '../modules/test/test.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '',
    routes: TestRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
