# API de Cifra de Vernam

API REST desenvolvida em **Node.js + TypeScript** para **cifrar** e **decifrar** mensagens usando a **Cifra de Vernam** (XOR entre os bytes do texto e os bytes da chave).

O texto cifrado é retornado como uma sequência de bits, com **8 bits por byte**, conforme especificação da atividade.

## Integrantes

- Vitor Alves — BT3049671
- Davi Celso — bt3049477

> Se o trabalho for individual, remova a linha do segundo integrante.

## Como funciona

Cada byte do texto claro é combinado com um byte da chave usando a operação XOR:

Exemplo pratico:

```text
textoClaro:  "OLA"
chave:       "CHT"
textoCifrado: "000011000000010000010101"
```

Caso a chave seja menor que o texto, ela é reutilizada ciclicamente. Recomenda-se usar uma chave com o mesmo tamanho do texto.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

Na raiz do projeto, execute:

```bash
npm install
```

## Execução

### Modo desenvolvimento

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

### Documentação (Swagger)

Com a API rodando, acesse `http://localhost:3000/docs` para abrir a interface do Swagger UI.

### Modo produção

```bash
npm run build
npm start
```

Para usar outra porta, defina a variável de ambiente `PORT`:

O servidor escuta em `0.0.0.0`, permitindo o acesso de outros computadores do laboratório pelo endereço `http://IP-DO-SERVIDOR:3000`.

## Endpoints

### `POST /cifrar`

Cifra uma mensagem.

**Corpo da requisição:**

```json
{
  "textoClaro": "OLA",
  "chave": "CHT"
}
```

**Resposta (200):**

```json
{
  "textoCifrado": "000011000000010000010101"
}
```

### `POST /decifrar`

Decifra uma mensagem cifrada.

**Corpo da requisição:**

```json
{
  "textoCifrado": "000011000000010000010101",
  "chave": "CHT"
}
```

**Resposta (200):**

```json
{
  "textoClaro": "OLA"
}
```

## Regras de validação

| Campo | Regra |
| --- | --- |
| `textoClaro` | Obrigatório, string não vazia, no máximo 255 caracteres |
| `chave` | Obrigatório, string não vazia, no máximo 255 caracteres |
| `textoCifrado` | Obrigatório, apenas `0` e `1`, quantidade de bits múltipla de 8, no máximo 2048 caracteres |

O texto é processado em UTF-8. Para mensagens simples em ASCII, cada caractere corresponde a 8 bits.

## Estrutura do projeto

```text
api-cifra-vernam/
├── docs/
│   └── openapi.yaml
├── src/
│   ├── app.ts          # Configuração das rotas e validações
│   ├── index.ts        # Inicialização do servidor
│   ├── vernam.ts       # Implementação da Cifra de Vernam
│   └── vernam.test.ts  # Testes automatizados
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## Geração do arquivo .zip para entrega

O `.zip` **não deve conter** `node_modules/` nem `dist/` (arquivos compilados/instalados). Na raiz do projeto, execute:

```powershell
Compress-Archive -Path package.json,package-lock.json,tsconfig.json,.gitignore,README.md,src,docs `
  -DestinationPath ..\api-cifra-vernam.zip -Force
```

Também é possível compactar a pasta pelo Explorador de Arquivos, removendo antes as pastas `node_modules` e `dist`.

Para executar o projeto após descompactar:

```bash
npm install
npm run build
npm start
```
