import express from 'express';
import { getVlanInfo } from './getVlanInfo';

const router = express.Router();

router.get('/vlan', async (req, res, next) => {
    try {
        const { address, vlanId } = req.query;
        const result = await getVlanInfo(address as string, vlanId as string | undefined);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
