import type { History } from "../interfaces/database";

export const mockHistoryList: History[] = [
  {
    id: 1,
    session: {
      messages: JSON.stringify([
        { role: "user", content: "O que é React?" },
        { role: "assistant", content: "React é uma biblioteca JavaScript para construir interfaces de usuário." },
        { role: "user", content: "O que são hooks no React?" },
        { role: "assistant", content: "Hooks são funções especiais que permitem usar estado em componentes funcionais." },
        { role: "user", content: "Como otimizar performance no React?" },
        { role: "assistant", content: "Use React.memo, useMemo e useCallback para evitar re-renders desnecessários." },
        { role: "user", content: "Quando usar useMemo?" },
        { role: "assistant", content: "Quando um cálculo for custoso e seus inputs raramente mudarem." },
        { role: "user", content: "E useCallback?" },
        { role: "assistant", content: "Para memorizar funções e evitar referências novas a cada render." },
      ]),
    },
    prompts: [
      {
        text: "O que é React?",
        response: { text: "React é uma biblioteca JavaScript para construir interfaces de usuário de forma declarativa e baseada em componentes." },
      },
      {
        text: "O que são hooks no React?",
        response: { text: "Hooks são funções especiais que permitem usar estado e outros recursos em componentes funcionais." },
      },
      {
        text: "Como otimizar performance no React?",
        response: { text: "Use React.memo, useMemo e useCallback para evitar re-renders desnecessários." },
      },
      {
        text: "Quando usar useMemo?",
        response: { text: "Use useMemo quando um cálculo for custoso e seus inputs raramente mudarem." },
      },
      {
        text: "E useCallback?",
        response: { text: "useCallback memoriza funções para evitar referências novas a cada render, útil ao passar callbacks para componentes filhos." },
      },{
        text: "O que é React?",
        response: { text: "React é uma biblioteca JavaScript para construir interfaces de usuário de forma declarativa e baseada em componentes." },
      },
      {
        text: "O que são hooks no React?",
        response: { text: "Hooks são funções especiais que permitem usar estado e outros recursos em componentes funcionais." },
      },
      {
        text: "Como otimizar performance no React?",
        response: { text: "Use React.memo, useMemo e useCallback para evitar re-renders desnecessários." },
      },
      {
        text: "Quando usar useMemo?",
        response: { text: "Use useMemo quando um cálculo for custoso e seus inputs raramente mudarem." },
      },
      {
        text: "E useCallback?",
        response: { text: "useCallback memoriza funções para evitar referências novas a cada render, útil ao passar callbacks para componentes filhos." },
      },
    ],
  },
  {
    id: 2,
    session: {
      messages: JSON.stringify([
        { role: "user", content: "O que é Tailwind CSS?" },
        { role: "assistant", content: "Tailwind é um framework CSS utilitário para estilizar diretamente no HTML." },
        { role: "user", content: "Como funciona o dark mode no Tailwind?" },
        { role: "assistant", content: "Basta adicionar a classe dark: nos elementos e configurar o mode no tailwind.config." },
      ]),
    },
    prompts: [
      {
        text: "O que é Tailwind CSS?",
        response: { text: "Tailwind é um framework CSS utilitário que permite estilizar elementos diretamente no HTML com classes pré-definidas." },
      },
      {
        text: "Como funciona o dark mode no Tailwind?",
        response: { text: "Basta adicionar o prefixo dark: nas classes e configurar a estratégia de dark mode no tailwind.config.js." },
      },
    ],
  },
  {
    id: 3,
    session: {
      messages: JSON.stringify([
        { role: "user", content: "Quais as vantagens do TypeScript?" },
        { role: "assistant", content: "TypeScript adiciona tipagem estática ao JavaScript, tornando o código mais seguro e fácil de manter." },
        { role: "user", content: "Como tipar um array de objetos?" },
        { role: "assistant", content: "Você pode usar interface[] ou Array<interface> para tipar arrays de objetos." },
      ]),
    },
    prompts: [
      {
        text: "Quais as vantagens do TypeScript?",
        response: { text: "TypeScript adiciona tipagem estática ao JavaScript, tornando o código mais seguro e fácil de manter em projetos grandes." },
      },
      {
        text: "Como tipar um array de objetos?",
        response: { text: "Você pode usar MinhaInterface[] ou Array<MinhaInterface> para tipar arrays de objetos em TypeScript." },
      },
    ],
  },
  {
    id: 4,
    session: {
      messages: JSON.stringify([
        { role: "user", content: "O que é Docker?" },
        { role: "assistant", content: "Docker é uma plataforma para criar e executar aplicações em containers isolados." },
        { role: "user", content: "Qual a diferença entre imagem e container?" },
        { role: "assistant", content: "A imagem é o template estático; o container é a instância em execução dessa imagem." },
        { role: "user", content: "Como usar Docker Compose?" },
        { role: "assistant", content: "Docker Compose usa um arquivo docker-compose.yml para definir e orquestrar múltiplos containers." },
      ]),
    },
    prompts: [
      {
        text: "O que é Docker?",
        response: { text: "Docker é uma plataforma para criar, distribuir e executar aplicações em containers isolados." },
      },
      {
        text: "Qual a diferença entre imagem e container?",
        response: { text: "A imagem é o template estático e imutável; o container é a instância em execução dessa imagem." },
      },
      {
        text: "Como usar Docker Compose?",
        response: { text: "Docker Compose usa um arquivo docker-compose.yml para definir e orquestrar múltiplos containers de forma declarativa." },
      },
    ],
  },
];