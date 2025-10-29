import { switchTelnet} from "@/infra/telnet/switchTelnet";
import { parseShowPortsOutput} from "./parser";
import { showPortsResult} from "./types";

export async function getPortInfo(address: string, port?: string): Promise<showPortsResult>  {
    const command: string = port? `show ports ${port}` : 'show ports';
    const raw = await switchTelnet(address, command);
    const parsed =  parseShowPortsOutput(raw);
    return parsed;
}