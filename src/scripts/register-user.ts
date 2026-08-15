import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { admin } from '../config/firebase.js';

const promptPassword = (prompt: string): Promise<string> => {
  if (!stdin.isTTY || !stdin.setRawMode) {
    const readline = createInterface({ input: stdin, output: stdout });
    return readline.question(prompt).finally(() => readline.close());
  }

  return new Promise((resolve, reject) => {
    let password = '';
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const finish = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
      stdout.write('\n');
    };

    const onData = (key: string) => {
      if (key === '\u0003') {
        finish();
        reject(new Error('Registro cancelado'));
        return;
      }
      if (key === '\r' || key === '\n') {
        finish();
        resolve(password);
        return;
      }
      if (key === '\u007f' || key === '\b') {
        if (password.length > 0) {
          password = password.slice(0, -1);
          stdout.write('\b \b');
        }
        return;
      }
      if (key >= ' ') {
        password += key;
        stdout.write('*');
      }
    };

    stdin.on('data', onData);
  });
};

const registerUser = async () => {
  const readline = createInterface({ input: stdin, output: stdout });
  const email = (process.env.REGISTER_USER_EMAIL || await readline.question('Correo: ')).trim();
  readline.close();

  const password = process.env.REGISTER_USER_PASSWORD || await promptPassword('Contraseña: ');
  if (!email) throw new Error('El correo es obligatorio');
  if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres');

  const user = await admin.auth().createUser({ email, password });
  console.log(`Usuario registrado: ${user.email} (${user.uid})`);
};

registerUser().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Error desconocido';
  console.error(`No se pudo registrar el usuario: ${message}`);
  process.exitCode = 1;
});
