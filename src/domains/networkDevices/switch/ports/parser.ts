import { showPortsResult, portGroup, portStatus} from "@/domains/networkDevices/switch/ports/types";

export function parseShowPortsOutput(raw: string): showPortsResult {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const ports = new Map<number, portGroup>();

    const headerIndex = lines.findIndex(l => l.startsWith('Port'));
    if (headerIndex === -1) return { ports: [] };

    const dataLines = lines.slice(headerIndex + 2);

    for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        const tokens = line.split(/\s{2,}/); // разделение по двойным пробелам

        const portMatch = tokens[0]?.match(/^(\d+)(?:\((C|F)\))?$/);
        if (!portMatch) continue;

        const port = parseInt(portMatch[1], 10);
        const type = portMatch[2] ?? 'default';

        const nextLine = dataLines[i + 1]?.trim();

        const isExtraLine =
            nextLine &&
            !nextLine.match(/^\d/) &&
            !nextLine.startsWith('Notes:') &&
            !nextLine.startsWith('Pair') &&
            !nextLine.startsWith('Port') &&
            !nextLine.startsWith('-----');

        const status: portStatus = {
            type: type as 'C' | 'F' | 'default',
            state: tokens[1] ?? '',
            setting: tokens[2] ?? '',
            connection: tokens[3] ?? '',
            addressLearning: tokens[4] ?? ''
        };

        if (isExtraLine) {
            status.setting += ` ${nextLine}`;
            i++; // пропускаем доп. строку
        }

        if (!ports.has(port)) {
            ports.set(port, { port, statuses: [] });
        }

        ports.get(port)!.statuses.push(status);
    }

    return {
        ports: Array.from(ports.values()).sort((a, b) => a.port - b.port)
    };
}