import { switchTelnet, parseFullVlanOutput } from '@/telnet';
import { VlanInfo, VlanEntry } from '@/telnet/types/vlan';

export async function getVlanInfo(address: string, vlanId?: string): Promise<VlanInfo | VlanEntry | null> {
    const raw = await switchTelnet(address, 'show vlan');
    const parsed = parseFullVlanOutput(raw);

    if (vlanId) {
        return parsed.vlans.find(v => v.vid === vlanId) || null;
    }

    return parsed;
}