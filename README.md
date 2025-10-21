# Caixa Eletrônico - Desafio ATM

Este é um projeto que simula o funcionamento de um caixa eletrônico simples. O sistema é capaz de calcular a menor quantidade de cédulas necessárias para um saque, utilizando uma abordagem otimizada baseada em programação dinâmica.

## Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/oarthurfc/desafio-atm.git
   ```

2. **Instale as Dependências**:
   ```bash
   npm install
   ```

3. **Inicie o Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```

- Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar a aplicação.
- Ou faça requisições para [http://localhost:3000/api/saque](http://localhost:3000/api/saque) passando o parâmetro ```valor``` no body.

4. **Executar os Testes**:
   - Para rodar todos os testes:
     ```bash
     npm test
     ```
   - Para rodar os testes em modo "watch":
     ```bash
     npm run test:watch
     ```
   - Para verificar a cobertura dos testes:
     ```bash
     npm run test:coverage
     ```

## API - Endpoint `/api/saque`

### Requisição

A API aceita requisições do tipo `POST` com o seguinte formato no corpo da requisição:

```json
{
  "valor": 150
}
```

- **`valor`**: Número inteiro representando o valor a ser sacado.

### Resposta

A resposta será um objeto JSON contendo a quantidade de cédulas necessárias para compor o valor solicitado. Exemplo:

```json
{
  "100": 1,
  "50": 1,
  "20": 0,
  "10": 0,
  "5": 0,
  "2": 0
}
```

Caso ocorra algum erro, a API retornará um objeto de erro com o código HTTP apropriado. Exemplo de erro:

```json
{
  "error": "Não é possível sacar este valor com as cédulas disponíveis",
  "code": "IMPOSSIBLE_WITHDRAWAL"
}
```

### Tratamento de Exceções

A API realiza validações rigorosas para garantir a integridade das requisições:

- **Formato Inválido**: Caso o corpo da requisição não seja um JSON válido ou não contenha o campo `valor`, a API retorna um erro com código `INVALID_REQUEST`.
- **Valor Inválido**: Caso o valor seja negativo, não inteiro ou impossível de ser sacado com as cédulas disponíveis, a API retorna erros específicos como `NEGATIVE`, `NOT_INTEGER` ou `IMPOSSIBLE_WITHDRAWAL`.
- **Erro Interno**: Qualquer erro inesperado é tratado e retorna uma mensagem genérica com código `INTERNAL_ERROR`.

## Principais desafios

O principal desafio deste projeto foi lidar com cenários de valores possíveis, começando por valores impossíveis de serem sacados (ex.: 1, 3). O desafio se intensificou ainda mais ao lidar com números que, teoricamente, poderiam ser sacados de acordo com as cédulas disponíveis, mas produziam resultados incorretos com o algoritmo inicial (ex.: 6, 8, 11, 16, 17, etc.).

Após pesquisa, descobri que este é um problema clássico em [Greedy algorithm](https://en.wikipedia.org/wiki/Greedy_algorithm), conhecido como o ["Problema do Troco"](https://en.wikipedia.org/wiki/Change-making_problem). Embora uma abordagem "greedy" funcione para alguns casos, ela falha em outros. A solução ideal envolve programação dinâmica, o que aumenta a complexidade do algoritmo de $O(n)$ para $O(\text{valor} \times m)$, onde $m$ é o número de denominações disponíveis.

Optei por implementar a solução com programação dinâmica, priorizando a correção e robustez, mesmo com o aumento da complexidade computacional. Essa decisão garantiu que o algoritmo pudesse lidar com todos os casos de borda de forma eficaz.

## Tecnologias Utilizadas

- **Next.js**: Framework para construção da aplicação.
- **Jest**: Ferramenta de testes para garantir a qualidade do código.
- **TypeScript**: Linguagem utilizada para maior segurança e escalabilidade do código.

## Estrutura do Projeto

- **API**: Endpoint `/api/saque` para processar os pedidos de saque.
- **Serviços**: Lógica de distribuição de cédulas implementada com programação dinâmica.
- **Componentes**: Interface amigável para interação com o usuário.
- **Testes**: Cobertura completa para serviços, validações e integração.