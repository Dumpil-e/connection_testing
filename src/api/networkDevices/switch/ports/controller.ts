import { Request, Response, NextFunction } from 'express';
import { getPortInfo} from "@/domains/networkDevices/switch/ports/service";

export async function getPortInfoHandler ( req: Request, res: Response, next: NextFunction ) {
    try {
        const { address, port } = req.query;
        if (!address || typeof address !== 'string') {
            return res.status(400).send({error: 'Missing or invalid address'});
        }
        const result = await getPortInfo(address, port as string);
        res.json(result);

    } catch (err) {
        next(err);
    }
}