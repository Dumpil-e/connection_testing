import { parseFullVlanOutput } from './parser';
import { switchTelnet } from '@/infra/telnet/switchTelnet';
import { VlanInfo } from './types';

export async function getVlanInfo(address: string, vlanId?: string): Promise<VlanInfo> {
    const command = vlanId ? `show vlan vlanid ${vlanId}` : 'show vlan';
    const raw = await switchTelnet(address, command);
    const parsed = parseFullVlanOutput(raw);

    // TODO: фильтровать vlans по vlanId, но сохранять структуру VlanInfo
    return parsed;
}