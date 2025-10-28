export interface VlanEntry {
    vid: string;
    vlanName: string;
    vlanType: string;
    advertisement: string;
    memberPorts: string;
    staticPorts: string;
    currentTaggedPorts: string;
    currentUntaggedPorts: string;
    staticTaggedPorts: string;
    staticUntaggedPorts: string;
    forbiddenPorts: string;
}

export interface VlanInfo {
    trunkState: string;
    trunkMemberPorts: string;
    totalEntries: number;
    vlans: VlanEntry[];
}
