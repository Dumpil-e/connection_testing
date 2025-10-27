import net from 'net';
import 'dotenv/config';

const username = process.env.TELNET_USERNAME;
const password = process.env.TELNET_PASSWORD;

export async function switchTelnet(address: string, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        let buffer = '';
        let commandOutput = '';
        let stage = 0;

        const send = (data: string) => {
            socket.write(data);
        };

        socket.setEncoding('utf8');
        socket.setTimeout(15000);

        socket.on('data', data => {
            buffer += data;

            if (stage >= 3) {
                commandOutput += data;
            }

            if (stage === 0 && /User(Name)?[:]/i.test(buffer)) {
                send(`${username}\r\n`);
                buffer = '';
                stage = 1;
            } else if (stage === 1 && /Pass(Word)?[:]/i.test(buffer)) {
                send(`${password}\r\n`);
                buffer = '';
                stage = 2;
            } else if (stage === 2 && /[#>]\s*$/.test(buffer)) {
                send('disable clipaging\r\n');
                buffer = '';
                stage = 3;
            } else if (stage === 3 && /[#>]\s*$/.test(buffer)) {
                send(`${command}\r\n`);
                buffer = '';
                stage = 4;
            } else if (stage === 4 && /[#>]\s*$/.test(buffer)) {
                send('enable clipaging\r\n');
                buffer = '';
                stage = 5;
            } else if (stage === 5 && /[#>]\s*$/.test(buffer)) {
                socket.end();
                resolve(commandOutput.trim());
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
