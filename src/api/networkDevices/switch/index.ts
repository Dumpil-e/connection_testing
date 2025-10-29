import express from 'express';
import vlanRoutes from './vlan/routes';
import cableDiagRoutes from './cableDiag/routes';
import portRoutes from '@/api/networkDevices/switch/ports/routes';

const router = express.Router();
router.use('/vlan', vlanRoutes);
router.use('/cable_diag', cableDiagRoutes)
router.use('/ports', portRoutes)

// TODO: добавить маршруты для cable_diag, mac и других команд

export default router;