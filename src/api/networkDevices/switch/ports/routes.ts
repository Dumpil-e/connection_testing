import express from 'express';
import { getPortInfoHandler} from "./controller";

const router = express.Router();
router.get('/', getPortInfoHandler)

export default router;