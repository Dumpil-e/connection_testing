import { VlanInfo } from './types';

export function parseFullVlanOutput(raw: string): VlanInfo {
    const lines = raw.split('\n').map(line => line.trim()).filter(Boolean);

    const trunkState = lines.find(l => l.startsWith('VLAN Trunk State'))?.split(':')[1]?.trim() || '';
    const trunkMemberPorts = lines.find(l => l.startsWith('VLAN Trunk Member Ports'))?.split(':')[1]?.trim() || '';
    const totalEntries = parseInt(lines.find(l => l.startsWith('Total Entries'))?.split(':')[1]?.trim() || '0', 10);

    const vlanBlocks = raw.split(/VID\s+:\s*/).slice(1);

    const vlans = vlanBlocks.map(block => {
        const vlan: any = {};
        const blockLines = block.split('\n').map(l => l.trim()).filter(Boolean);

        const firstLine = blockLines[0];
        const vidMatch = firstLine.match(/^(\d+)/);
        if (vidMatch) vlan.vid = vidMatch[1];

        for (const line of blockLines) {
            const regex = /([A-Za-z\s]+?)\s*:\s*([^\s:][^:]*?)(?=\s{2,}[A-Za-z\s]+?\s*:|$)/g;
            const matches = [...line.matchAll(regex)];

            for (const match of matches) {
                const key = match[1].trim();
                const value = match[2].trim();
                assignVlanField(vlan, key, value);
            }
        }

        return vlan;
    });

    return {
        trunkState,
        trunkMemberPorts,
        totalEntries,
        vlans,
    };
}

function assignVlanField(vlan: any, key: string, value: string) {
    switch (key) {
        case 'VLAN Name': vlan.vlanName = value; break;
        case 'VLAN Type': vlan.vlanType = value; break;
        case 'Advertisement': vlan.advertisement = value; break;
        case 'Member Ports': vlan.memberPorts = value; break;
        case 'Static Ports': vlan.staticPorts = value; break;
        case 'Current Tagged Ports': vlan.currentTaggedPorts = value; break;
        case 'Current Untagged Ports': vlan.currentUntaggedPorts = value; break;
        case 'Static Tagged Ports': vlan.staticTaggedPorts = value; break;
        case 'Static Untagged Ports': vlan.staticUntaggedPorts = value; break;
        case 'Forbidden Ports': vlan.forbiddenPorts = value; break;
    }
}

// TODO: заменить any на Partial<VlanEntry>
// TODO: вынести assignVlanField в utils.ts
