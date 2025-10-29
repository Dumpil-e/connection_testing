import net from 'net';
import 'dotenv/config';

const username = process.env.TELNET_USERNAME;
const password = process.env.TELNET_PASSWORD;

// Перегрузка - может быть или одна или массив команд
export async function switchTelnet(address: string, command: string): Promise<string>;
export async function switchTelnet(address: string, commands: string[]): Promise<string[]>;

// Реализация
export async function switchTelnet(address: string, input: string | string[]): Promise<string | string[]> {
    const commands = typeof input === 'string' ? [input] : input;

    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        const results: string[] = [];
        let buffer = '';
        let stage = 0;
        let currentCommandIndex = 0;
        let currentOutput = '';

        const send = (data: string) => socket.write(data);

        socket.setEncoding('utf8');
        socket.setTimeout(15000);

        socket.on('data', data => {
            buffer += data;

            const promptReady = /[#>]\s*$/.test(buffer);

            switch (stage) {
                case 0:
                    if (/User(Name)?[:]/i.test(buffer)) {
                        send(`${username}\r\n`);
                        buffer = '';
                        stage = 1;
                    }
                    break;
                case 1:
                    if (/Pass(Word)?[:]/i.test(buffer)) {
                        send(`${password}\r\n`);
                        buffer = '';
                        stage = 2;
                    }
                    break;
                case 2:
                    if (promptReady) {
                        send('disable clipaging\r\n');
                        buffer = '';
                        stage = 3;
                    }
                    break;
                case 3:
                    if (promptReady) {
                        send(commands[currentCommandIndex] + '\r\n');
                        buffer = '';
                        currentOutput = '';
                        stage = 4;
                    }
                    break;
                case 4:
                    currentOutput += data;
                    if (promptReady) {
                        results.push(currentOutput.trim());
                        currentCommandIndex++;
                        buffer = '';
                        currentOutput = '';
                        if (currentCommandIndex < commands.length) {
                            send(commands[currentCommandIndex] + '\r\n');
                        } else {
                            send('enable clipaging\r\n');
                            stage = 5;
                        }
                    }
                    break;
                case 5:
                    if (promptReady) {
                        socket.end();
                        resolve(typeof input === 'string' ? results[0] : results);
                    }
                    break;
            }
        });

        socket.on('error', err => {
            socket.destroy();
            reject(new Error(`Telnet socket error: ${err.message}`));
        });

        socket.on('timeout', () => {
            socket.destroy();
            reject(new Error('Telnet socket timeout'));
        });

        socket.connect(23, address);
    });
}
