const BITS_POR_BYTE = 8;

function aplicarChave(dados: Buffer, chave: Buffer): Buffer {
  const resultado = Buffer.alloc(dados.length);

  for (let i = 0; i < dados.length; i++) {
    resultado[i] = dados[i] ^ chave[i % chave.length];
  }

  return resultado;
}

export function cifrar(textoClaro: string, chave: string): string {
  const dados = Buffer.from(textoClaro, 'utf8');
  const chaveBytes = Buffer.from(chave, 'utf8');

  if (chaveBytes.length === 0) {
    throw new Error('A chave não pode ser vazia.');
  }

  const cifrado = aplicarChave(dados, chaveBytes);

  return Array.from(cifrado)
    .map((byte) => byte.toString(2).padStart(BITS_POR_BYTE, '0'))
    .join('');
}

export function decifrar(textoCifrado: string, chave: string): string {
  const chaveBytes = Buffer.from(chave, 'utf8');

  if (chaveBytes.length === 0) {
    throw new Error('A chave não pode ser vazia.');
  }

  if (textoCifrado.length === 0 || textoCifrado.length % BITS_POR_BYTE !== 0) {
    throw new Error('O texto cifrado deve conter uma quantidade de bits múltipla de 8.');
  }

  if (!/^[01]+$/.test(textoCifrado)) {
    throw new Error('O texto cifrado deve conter apenas caracteres 0 e 1.');
  }

  const totalBytes = textoCifrado.length / BITS_POR_BYTE;
  const cifrado = Buffer.alloc(totalBytes);

  for (let i = 0; i < totalBytes; i++) {
    const inicio = i * BITS_POR_BYTE;
    cifrado[i] = parseInt(textoCifrado.slice(inicio, inicio + BITS_POR_BYTE), 2);
  }

  return aplicarChave(cifrado, chaveBytes).toString('utf8');
}
