import express from 'express';
import { getVlanInfoHandler } from './controller';

const router = express.Router();
router.get('/', getVlanInfoHandler);

export default router;