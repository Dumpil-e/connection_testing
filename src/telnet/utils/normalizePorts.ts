export function normalizePorts(portStr: string): number[] {
    if (!portStr) return [];
    return portStr
        .split(',')
        .flatMap(part => {
            const [start, end] = part.split('-').map(Number);
            if (isNaN(start)) return [];
            return end ? Array.from({ length: end - start + 1 }, (_, i) => start + i) : [start];
        });
}
