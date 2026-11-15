import { criarApp } from './app';

const PORTA = Number(process.env.PORT) || 3000;

criarApp().listen(PORTA, '0.0.0.0', () => {
  console.log(`API de Cifra de Vernam disponível em http://localhost:${PORTA}`);
  console.log(`Swagger disponível em http://localhost:${PORTA}/docs`);
});
