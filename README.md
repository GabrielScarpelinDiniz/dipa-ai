# Unipar Dashboard
&emsp;Essa dashboard foi desenvolvida como um extra para a entrega do projeto final do módulo 3 de análise de dados e modelos preditivos. Ela conta com gráficos dinâmicos e interativos, que permitem a visualização de dados de forma mais clara e intuitiva. Toda a plataforma foi desenvolvida utilizando o framework Next.js, que é baseado em React, e o pacote de gráficos da Shadcn. O projeto não foi realizado um deploy, mas é possível rodá-lo localmente seguindo os passos abaixo.

## Como rodar o projeto
&emsp;Para rodar o projeto, é necessário ter o Node.js instalado na máquina. Caso não tenha, é possível baixá-lo [aqui](https://nodejs.org/en/). Após a instalação, basta seguir os passos abaixo:

1. Clone o repositório:
```bash
git clone (url)
```
2. Entre na pasta do projeto:
```bash
cd dipa-ai
```
3. Instale as dependências:
```bash
npm install
```
4. Com o postgreSQL instalado, crie um banco de dados chamado `unipar` e rode é necessário rodar alguns scripts para criar as tabelas, por serem dados sensíveis, não é possível liberar o acesso a eles e deve ser solicitado individualmente para o autor do projeto.

5. Rode o projeto:
```bash
npx next dev
```
6. Abra o navegador e acesse o endereço `http://localhost:3000/`.

## Estrutura do projeto
&emsp;O projeto foi dividido em algumas pastas, cada uma com sua responsabilidade. Abaixo, é possível ver a estrutura do projeto:

- `components`: Contém os componentes que são utilizados na construção da dashboard.
- `app`: Contém as páginas da aplicação.
- `types`: Contém os tipos de dados utilizados na aplicação (typescript).

## Tecnologias utilizadas
- [Next.js](https://nextjs.org/)
- [React](https://pt-br.reactjs.org/)
- [Shadcn](https://shadcn.github.io/react-shadcn/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/en/)
- [Vercel](https://vercel.com/)

## Autor
- [Gabriel Scarpelin Diniz]()
- [Pedro Pinheiro]()
- [Anna Ricciopo]()
- [Yanomã Piont]()
- [Iasmim]()
- [Ana Carolina]()
- [Paulo Henrique]()

## Conclusão
&emsp;Com a finalização do projeto, foi possível aprender muito sobre a construção de dashboards e a utilização de gráficos interativos. A utilização do Next.js facilitou muito o desenvolvimento, pois ele é baseado em React e possui uma série de funcionalidades que ajudam na criação de aplicações web. Além disso, a utilização do Shadcn foi essencial para a criação dos gráficos, pois ele é um pacote muito completo e fácil de utilizar. Por fim, a utilização do TypeScript foi essencial para a tipagem dos dados e para a organização do código. Com isso, foi possível criar uma aplicação mais robusta e com menos erros.

### Recomendações para o futuro
- Realizar o deploy da aplicação.
- Adicionar mais gráficos e funcionalidades.
- Melhorar a responsividade da aplicação.
- Adicionar testes automatizados.
- Refatorar o código para melhorar a organização e a legibilidade. (devido ao tempo, o código foi feito de forma rápida e pode ser melhorado)