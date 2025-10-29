export interface showPortsResult {
    ports: portGroup[];
}

export interface portGroup {
    port: number; // физический номер порта
    statuses: portStatus[]; // логические варианты: обычный, медь, оптика
}

export interface portStatus {
    type?: 'C' | 'F' | 'default'; // подтип, если есть
    state: string;
    setting: string;
    connection: string;
    addressLearning: string;
}