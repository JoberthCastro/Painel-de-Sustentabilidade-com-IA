# 🌱 Painel de Sustentabilidade com IA

Este projeto é um **dashboard corporativo de sustentabilidade** impulsionado por **Inteligência Artificial (Google Gemini)**. Permite **análise de dados ambientais**, **interações inteligentes via chat** e **geração automática de relatórios em PDF**, ajudando empresas a monitorar, entender e reduzir seu impacto ambiental.

---

## 🚀 Tecnologias Utilizadas

### 🖥️ Frontend — [React (Vite)](https://react.dev/)
- **Recharts:** Visualização de dados em gráficos interativos.
- **jsPDF:** Geração e exportação de relatórios em PDF.

### 🧠 Backend — [FastAPI (Python)](https://fastapi.tiangolo.com/)
- **Google Gemini API:** Processamento de linguagem natural para análise contextual e criação de relatórios inteligentes.
- **CORS Middleware:** Comunicação segura e controlada entre frontend e backend.

---

## 🧭 Estrutura do Projeto

```bash
Painel-de-Sustentabilidade-com-IA/
├── src/
│   └── App.jsx           # Componente principal da interface React
├── ia_backend.py         # Backend com FastAPI e integração com IA
├── package.json          # Dependências e scripts do frontend
├── requirements.txt      # Dependências do backend Python
└── README.md             # Documentação do projeto
```

---

## 🔄 Fluxo de Comunicação

1. **Frontend (React):**
   - Exibe dashboards, gráficos e interface de chat com IA.
   - Envia requisições HTTP ao backend para dados e geração de relatórios.
   - Usa `jsPDF` para exportar relatórios em PDF.

2. **Backend (FastAPI):**
   - Endpoints REST disponíveis:
     - `/company` — Dados da empresa
     - `/sustainability` — Indicadores ambientais (energia, carbono, resíduos etc.)
     - `/ia` — Recebe perguntas, processa com IA e retorna respostas
   - Token da API da Gemini mantido seguro no backend.

3. **Google Gemini API:**
   - Recebe prompts do backend.
   - Gera respostas inteligentes, análises e sugestões para os relatórios.

---

## 🛠️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd Painel-de-Sustentabilidade-com-IA
```

### 2. Instale as dependências do backend (Python)
```bash
pip install -r requirements.txt
```

> Caso `requirements.txt` não esteja configurado:
```bash
pip install fastapi uvicorn requests
```

### 3. Instale as dependências do frontend (Node.js)
```bash
npm install
```

### 4. Instale a biblioteca jsPDF
```bash
npm install jspdf
```

### 5. Execute o backend
```bash
uvicorn ia_backend:app --reload
```

### 6. Execute o frontend
```bash
npm run dev
```

### 7. Acesse no navegador
```
http://localhost:5173
```

---

## 📊 Funcionalidades

| Recurso                         | Descrição                                                                 |
|----------------------------------|---------------------------------------------------------------------------|
| 🌍 **Dashboard Sustentável**     | Visualização de dados ambientais (energia, carbono, resíduos, etc.)       |
| 📈 **Gráficos e KPIs**           | Indicadores de performance em tempo real                                  |
| 🤖 **Chat com IA**               | Permite perguntas e análises personalizadas via Google Gemini             |
| 📝 **Geração de Relatórios**     | Criação automática de relatórios inteligentes em PDF                      |
| 💡 **Análises Avançadas**        | Detecção de desperdícios, duplicidades e sugestões de melhoria            |

---

## ⚠️ Observações

- O backend está configurado com **CORS aberto** (`allow_origins=["*"]`). Em produção, restrinja para domínios específicos.
- O **token da API do Google Gemini** é armazenado e protegido no backend. **Nunca exponha no frontend.**
- O projeto está pronto para **integrações futuras** com serviços como:
  - Google Drive
  - Google BigQuery
  - Looker Studio

---

## 📬 Suporte

Caso tenha dúvidas, sugestões ou deseje contribuir, sinta-se à vontade para:
- Abrir uma issue no repositório
- Entrar em contato diretamente
