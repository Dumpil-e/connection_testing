import { switchTelnet} from "@/infra/telnet/switchTelnet";
import { parseCableDiagOutput } from "./parser";
import { CableDiagResult } from "./types";


export async function getCableDiag(address: string, port?: string): Promise<CableDiagResult[]> {
    const command = port ? `cable_diag ports ${port}` : `cable_diag ports all`;
    const raw = await switchTelnet(address, command);
    const parsed = parseCableDiagOutput(raw);
    return parsed;
}