import express from 'express';
import { getCableDiagHandler } from './controller';

const router = express.Router();
router.get('/', getCableDiagHandler);

export default router;