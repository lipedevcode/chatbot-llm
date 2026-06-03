import type { History } from "../interfaces/database";

export const mockHistoryList: History[] = [
  {
    id: 1,
    session: {
      memoryId: 101,
      messages: JSON.stringify([
        { role: "user", content: "O que é React?" },
        {
          role: "assistant",
          content:
            "React é uma biblioteca JavaScript para construir interfaces de usuário.",
        },
        { role: "user", content: "O que são hooks no React?" },
        {
          role: "assistant",
          content:
            "Hooks são funções especiais que permitem usar estado em componentes funcionais.",
        },
        { role: "user", content: "Como otimizar performance no React?" },
        {
          role: "assistant",
          content:
            "Use React.memo, useMemo e useCallback para evitar re-renders desnecessários.",
        },
        { role: "user", content: "Quando usar useMemo?" },
        {
          role: "assistant",
          content:
            "Quando um cálculo for custoso e seus inputs raramente mudarem.",
        },
        { role: "user", content: "E useCallback?" },
        {
          role: "assistant",
          content:
            "Para memorizar funções e evitar referências novas a cada render.",
        },
      ]),
    },
    prompts: [
      {
        id: 1,
        text: "O que é React?",
        response: {
          id: 1,
          text: "React é uma biblioteca JavaScript para construir interfaces de usuário de forma declarativa e baseada em componentes.",
        },
      },
      {
        id: 2,
        text: "O que são hooks no React?",
        response: {
          id: 2,
          text: "Hooks são funções especiais que permitem usar estado e outros recursos em componentes funcionais.",
        },
      },
      {
        id: 3,
        text: "Como otimizar performance no React?",
        response: {
          id: 3,
          text: "Use React.memo, useMemo e useCallback para evitar re-renders desnecessários.",
        },
      },
      {
        id: 4,
        text: "Quando usar useMemo?",
        response: {
          id: 4,
          text: "Use useMemo quando um cálculo for custoso e seus inputs raramente mudarem.",
        },
      },
      {
        id: 5,
        text: "E useCallback?",
        response: {
          id: 5,
          text: "useCallback memoriza funções para evitar referências novas a cada render, útil ao passar callbacks para componentes filhos.",
        },
      },
    ],
  },
  {
    id: 2,
    session: {
      memoryId: 102,
      messages: JSON.stringify([
        { role: "user", content: "O que é Tailwind CSS?" },
        {
          role: "assistant",
          content:
            "Tailwind é um framework CSS utilitário para estilizar diretamente no HTML.",
        },
        { role: "user", content: "Como funciona o dark mode no Tailwind?" },
        {
          role: "assistant",
          content:
            "Basta adicionar a classe dark: nos elementos e configurar o mode no tailwind.config.",
        },
      ]),
    },
    prompts: [
      {
        id: 6,
        text: "O que é Tailwind CSS?",
        response: {
          id: 6,
          text: "Tailwind é um framework CSS utilitário que permite estilizar elementos diretamente no HTML com classes pré-definidas.",
        },
      },
      {
        id: 7,
        text: "Como funciona o dark mode no Tailwind?",
        response: {
          id: 7,
          text: "Basta adicionar o prefixo dark: nas classes e configurar a estratégia de dark mode no tailwind.config.js.",
        },
      },
    ],
  },
  {
    id: 3,
    session: {
      memoryId: 103,
      messages: JSON.stringify([
        { role: "user", content: "Quais as vantagens do TypeScript?" },
        {
          role: "assistant",
          content:
            "TypeScript adiciona tipagem estática ao JavaScript, tornando o código mais seguro e fácil de manter.",
        },
        { role: "user", content: "Como tipar um array de objetos?" },
        {
          role: "assistant",
          content:
            "Você pode usar interface[] ou Array<interface> para tipar arrays de objetos.",
        },
      ]),
    },
    prompts: [
      {
        id: 8,
        text: "Quais as vantagens do TypeScript?",
        response: {
          id: 8,
          text: "TypeScript adiciona tipagem estática ao JavaScript, tornando o código mais seguro e fácil de manter em projetos grandes.",
        },
      },
      {
        id: 9,
        text: "Como tipar um array de objetos?",
        response: {
          id: 9,
          text: "Você pode usar MinhaInterface[] ou Array<MinhaInterface> para tipar arrays de objetos em TypeScript.",
        },
      },
    ],
  },
  {
    id: 4,
    session: {
      memoryId: 104,
      messages: JSON.stringify([
        { role: "user", content: "O que é Docker?" },
        {
          role: "assistant",
          content:
            "Docker é uma plataforma para criar e executar aplicações em containers isolados.",
        },
        { role: "user", content: "Qual a diferença entre imagem e container?" },
        {
          role: "assistant",
          content:
            "A imagem é o template estático; o container é a instância em execução dessa imagem.",
        },
        { role: "user", content: "Como usar Docker Compose?" },
        {
          role: "assistant",
          content:
            "Docker Compose usa um arquivo docker-compose.yml para definir e orquestrar múltiplos containers.",
        },
      ]),
    },
    prompts: [
      {
        id: 10,
        text: "O que é Docker?",
        response: {
          id: 10,
          text: "Docker é uma plataforma para criar, distribuir e executar aplicações em containers isolados.",
        },
      },
      {
        id: 11,
        text: "Qual a diferença entre imagem e container?",
        response: {
          id: 11,
          text: "A imagem é o template estático e imutável; o container é a instância em execução dessa imagem.",
        },
      },
      {
        id: 12,
        text: "Como usar Docker Compose?",
        response: {
          id: 12,
          text: "Docker Compose usa um arquivo docker-compose.yml para definir e orquestrar múltiplos containers de forma declarativa.",
        },
      },
    ],
  },
];
