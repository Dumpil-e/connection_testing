import express from 'express';
import vlanRoutes from './vlan/routes';
import cableDiagRoutes from './cableDiag/routes';

const router = express.Router();
router.use('/vlan', vlanRoutes);
router.use('/cable_diag', cableDiagRoutes)

// TODO: добавить маршруты для cable_diag, mac и других команд

export default router;