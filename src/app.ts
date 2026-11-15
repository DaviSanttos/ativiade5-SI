import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';
import { cifrar, decifrar } from './vernam';

const LIMITE_TEXTO_CLARO = 255;
const LIMITE_TEXTO_CIFRADO = 2048;
const LIMITE_CHAVE = 255;
const BITS_POR_BYTE = 8;

const especificacaoOpenApi = parse(
  readFileSync(join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8'),
);

function validarCampoString(valor: unknown, campo: string, limite: number): string | null {
  if (typeof valor !== 'string') {
    return `O campo "${campo}" é obrigatório e deve ser uma string.`;
  }

  if (valor.length === 0) {
    return `O campo "${campo}" não pode estar vazio.`;
  }

  if (valor.length > limite) {
    return `O campo "${campo}" deve ter no máximo ${limite} caracteres.`;
  }

  return null;
}

function validarTextoCifrado(valor: unknown): string | null {
  const erro = validarCampoString(valor, 'textoCifrado', LIMITE_TEXTO_CIFRADO);

  if (erro) {
    return erro;
  }

  const texto = valor as string;

  if (texto.length % BITS_POR_BYTE !== 0) {
    return 'O campo "textoCifrado" deve ter uma quantidade de bits múltipla de 8.';
  }

  if (!/^[01]+$/.test(texto)) {
    return 'O campo "textoCifrado" deve conter apenas caracteres 0 e 1.';
  }

  return null;
}

export function criarApp() {
  const app = express();

  app.use(express.json());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(especificacaoOpenApi));

  app.get('/', (_req, res) => {
    res.json({
      nome: 'API de Cifra de Vernam',
      versao: '1.0.1',
      documentacao: 'GET /docs',
      endpoints: {
        cifrar: 'POST /cifrar',
        decifrar: 'POST /decifrar',
      },
    });
  });

  app.post('/cifrar', (req, res) => {
    const { textoClaro, chave } = req.body ?? {};
    const erro =
      validarCampoString(textoClaro, 'textoClaro', LIMITE_TEXTO_CLARO) ??
      validarCampoString(chave, 'chave', LIMITE_CHAVE);

    if (erro) {
      return res.status(400).json({ erro });
    }

    return res.json({ textoCifrado: cifrar(textoClaro as string, chave as string) });
  });

  app.post('/decifrar', (req, res) => {
    const { textoCifrado, chave } = req.body ?? {};
    const erro =
      validarTextoCifrado(textoCifrado) ??
      validarCampoString(chave, 'chave', LIMITE_CHAVE);

    if (erro) {
      return res.status(400).json({ erro });
    }

    return res.json({ textoClaro: decifrar(textoCifrado as string, chave as string) });
  });

  app.use((_req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada.' });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof SyntaxError) {
      return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
    }

    console.error(err);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  });

  return app;
}
