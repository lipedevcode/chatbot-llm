# Arquitetura Docker — chatbot-llm

## Visão Geral

A aplicação roda em **3 containers** orquestrados pelo Docker Compose, todos na mesma rede Docker interna. Apenas o container `frontend` expõe uma porta para o exterior.

```
Browser (usuário)
  │
  │  HTTP :80
  ▼
┌─────────────────────────────────────────────────────┐
│  Container: frontend                                │
│  Imagem: nginx:1.27-alpine + React build estático   │
│  Porta exposta: 80                                  │
│                                                     │
│  /* → serve /usr/share/nginx/html (SPA)             │
│  /api/* → proxy_pass http://backend:8080            │
└───────────────────────────┬─────────────────────────┘
                            │ rede Docker interna
                            ▼
┌─────────────────────────────────────────────────────┐
│  Container: backend                                 │
│  Imagem: eclipse-temurin:21-jre-alpine              │
│  Porta: 8080 (interna, não exposta)                 │
│  Spring Boot 4 + LangChain4j + Spring Security      │
└───────────────────────────┬─────────────────────────┘
                            │ rede Docker interna
                            ▼
┌─────────────────────────────────────────────────────┐
│  Container: postgres                                │
│  Imagem: postgres:16-alpine                         │
│  Porta: 5432 (interna, não exposta)                 │
│  Volume: postgres_data (persistência em disco)      │
└─────────────────────────────────────────────────────┘
```

---

## Fluxo de uma requisição

### 1. Carregamento do SPA

```
Browser → GET http://<EC2-IP>/
        → nginx serve index.html + assets React
        → Browser executa o React SPA localmente
```

### 2. Chamada de API (ex: enviar mensagem)

```
React SPA (browser) → POST http://<EC2-IP>/api/v1/chat/message
                     → nginx recebe na porta 80
                     → proxy_pass http://backend:8080/api/v1/chat/message
                     → Spring Boot processa e retorna resposta
                     → nginx devolve ao browser
```

O backend nunca é acessado diretamente pelo browser — todo tráfego passa pelo nginx.

---

## Containers em detalhe

### `frontend`

Construído com Dockerfile multi-stage:

| Stage | Imagem base | O que faz |
|---|---|---|
| `builder` | `node:22-alpine` | `npm ci` + `npm run build` → gera `dist/` |
| final | `nginx:1.27-alpine` | Serve os arquivos de `dist/` e faz proxy de `/api/` |

O arquivo `frontend/nginx.conf` define duas regras:
- **`/api/`** — proxy reverso para o backend (sem expor a porta 8080)
- **`/`** — serve os arquivos estáticos com fallback para `index.html` (necessário para o React Router funcionar)

### `backend`

Construído com Dockerfile multi-stage:

| Stage | Imagem base | O que faz |
|---|---|---|
| `builder` | `maven:3.9-eclipse-temurin-21-alpine` | `mvn dependency:go-offline` + `mvn package` |
| final | `eclipse-temurin:21-jre-alpine` | Executa o `.jar` gerado |

O `dependency:go-offline` é executado antes de copiar o código-fonte. Isso cria uma **camada de cache do Docker** com todas as dependências Maven — rebuilds futuros só re-executam o Maven se o `pom.xml` mudar.

### `postgres`

Usa a imagem oficial `postgres:16-alpine`. Pontos importantes:

- **Healthcheck**: o `backend` só sobe depois que o postgres responde `pg_isready`, evitando falhas de conexão na inicialização.
- **Volume `postgres_data`**: os dados sobrevivem a `docker compose down`. Para apagar os dados, use `docker compose down -v`.
- **URL interna**: o backend acessa o banco via `jdbc:postgresql://postgres:5432/chatbot_llm` — `postgres` é o nome do serviço no Compose, que resolve via DNS interno do Docker.

---

## Variáveis de ambiente

Todas as variáveis sensíveis ficam em um arquivo `.env` (nunca commitado). Copie `.env.example` e preencha:

```bash
cp .env.example .env
```

| Variável | Usado por | Descrição |
|---|---|---|
| `CHATBOT_LLM_DB_USERNAME` | backend, postgres | Usuário do PostgreSQL |
| `CHATBOT_LLM_DB_PASSWORD` | backend, postgres | Senha do PostgreSQL |
| `POSTGRES_DB` | backend, postgres | Nome do banco (padrão: `chatbot_llm`) |
| `API_KEY_GEMINI` | backend | Chave da API Google Gemini |
| `JWT_SECRET_KEY_CHATBOT_LLM` | backend | Segredo JWT (Base64, mín. 256 bits) |

A variável `CHATBOT_LLM_DB_URL` **não** fica no `.env` — ela é construída automaticamente no `docker-compose.yml` usando o hostname interno `postgres`.

---

## Comandos essenciais

```bash
# Primeira vez / após mudar código
docker compose up --build -d

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend

# Parar tudo (dados preservados)
docker compose down

# Parar tudo e apagar o banco de dados
docker compose down -v

# Rebuildar só o backend
docker compose build backend
docker compose up -d backend
```

---

## Deploy na EC2

1. Instalar Docker e Docker Compose na instância
2. Clonar o repositório
3. Criar o `.env` a partir do `.env.example`
4. Liberar a porta **80** no Security Group da EC2
5. Executar `docker compose up --build -d`

O backend (8080) e o banco (5432) **não precisam** de regras de entrada no Security Group — eles ficam isolados na rede interna Docker.
