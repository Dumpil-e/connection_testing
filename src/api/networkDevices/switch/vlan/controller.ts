import { Request, Response, NextFunction } from 'express';
import { getVlanInfo } from '@/domains/networkDevices/switch/vlan/service';

export async function getVlanInfoHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { address, vlan_id } = req.query;
        //TODO: Сделать проверку не на тип а на структуру адреса
        if (!address || typeof address !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid address' });
        }

        const result = await getVlanInfo(address, vlan_id as string | undefined);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

