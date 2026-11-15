# API de Cifra de Vernam

API REST desenvolvida em **Node.js + TypeScript** para **cifrar** e **decifrar** mensagens usando a **Cifra de Vernam** (XOR entre os bytes do texto e os bytes da chave).

O texto cifrado é retornado como uma sequência de bits, com **8 bits por byte**, conforme especificação da atividade.

## Integrantes

- Vitor Alves — BT3049671
- Davi Celso — bt3049477

> Se o trabalho for individual, remova a linha do segundo integrante.

## Como funciona

Cada byte do texto claro é combinado com um byte da chave usando a operação XOR (`^`). A chave deve ter exatamente o mesmo tamanho do texto, em bytes, e é usada uma única vez, sem repetição.

Exemplo prático:

```text
textoClaro:  "OLA"
chave:       "CHT"
textoCifrado: "000011000000010000010101"
```

O processo é simétrico: aplicar a mesma chave e o mesmo XOR sobre o texto cifrado recupera o texto original.

## Tecnologias

- Node.js 18+
- TypeScript
- Express
- Swagger UI Express + YAML (documentação OpenAPI)
- `node:test` com `tsx` (testes automatizados)

## Pré-requisitos

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
| `chave` | Obrigatório, string não vazia, no máximo 255 caracteres, mesmo tamanho em bytes do texto |
| `textoCifrado` | Obrigatório, apenas `0` e `1`, quantidade de bits múltipla de 8, no máximo 2048 bits, mesmo tamanho em bytes do texto decifrado |

O texto é processado em UTF-8. A comparação de tamanho entre mensagem e chave é feita em **bytes**, então caracteres acentuados podem ocupar mais de um byte.

Entradas inválidas retornam HTTP 400 com uma mensagem explicativa:

```json
{
  "erro": "A chave deve ter o mesmo tamanho, em bytes, da mensagem"
}
```

## .zip para entrega

Para executar o projeto após descompactar:

```bash
npm install
npm run build
npm start
```