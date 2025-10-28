import { Response, Request, NextFunction } from 'express';
import { getCableDiag} from "@/domains/networkDevices/switch/cableDiag/service";

export async function getCableDiagHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const { address, port } = req.query;
        if (!address || typeof address !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid address' });
        }
        const result = await getCableDiag(address, port as string || undefined);
        res.json(result);
    } catch(err) {
        next(err)
    }
}