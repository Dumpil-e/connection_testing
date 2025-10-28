export interface CableDiagResult {
    port: number;
    linkStatus: string;
    pairs: CableDiagPair[]; // всегда массив, даже если просто OK
}

export interface CableDiagPair {
    pair: string;           // "Pair1", "Pair2", или "Overall"
    status: string;         // "Open", "Short", "OK", etc.
    distance: number | null; // в метрах, null если не указано
}