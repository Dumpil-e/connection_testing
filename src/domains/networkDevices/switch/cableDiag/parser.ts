import { CableDiagResult, CableDiagPair } from './types'

export function parseCableDiagOutput(raw: string): CableDiagResult[] {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const results: CableDiagResult[] = [];

    const headerIndex = lines.findIndex(l => l.startsWith('Port'));
    const dataLines = lines.slice(headerIndex + 2);

    for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        const match = line.match(/^(\d+)\s+\S+\s+(Link(?: Down| Up)?|Link)\s+(.*?)\s+(\d+|-)$/);
        if (!match) continue;

        const port = parseInt(match[1], 10);
        const linkStatus = match[2];
        const testResult = match[3].trim();
        const cableLength = match[4] !== '-' ? parseInt(match[4], 10) : null;

        const pairs: CableDiagPair[] = [];

        if (testResult === 'OK') {
            pairs.push({
                pair: 'Overall',
                status: 'OK',
                distance: cableLength,
            });
        } else {
            const pairLines = [testResult];
            while (i + 1 < dataLines.length && dataLines[i + 1].startsWith('Pair')) {
                pairLines.push(dataLines[++i].trim());
            }

            for (const pairLine of pairLines) {
                const pairMatch = pairLine.match(/(Pair\d+)\s+(\w+)(?:\s+at\s+(\d+)\s+M)?/);
                if (pairMatch) {
                    const [, pair, status, distanceStr] = pairMatch;
                    pairs.push({
                        pair,
                        status,
                        distance: distanceStr ? parseInt(distanceStr, 10) : null,
                    });
                }
            }
        }

        results.push({ port, linkStatus, pairs });
    }

    return results;
}