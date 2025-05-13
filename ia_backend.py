from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Permitir requisições do frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique o domínio do seu frontend!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = "AIzaSyBB-IsXJ3eRHGXUqUk-pVOR1oNwsIFiqnE"
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def build_prompt(pergunta, company, data):
    return f'''
Você é um assistente virtual especializado em sustentabilidade corporativa.
Responda de forma breve, direta e prática, com no máximo 3 frases.

Dados da empresa:
Empresa: {company["name"]}
Setor: {company["industry"]}
Tamanho: {company["size"]}
Localização: {company["location"]}

Consumo de energia (2020-2023): {", ".join([f'{e["year"]}: {e["value"]} kWh ({e["source"]})' for e in data["energyConsumption"]])}
Emissões de carbono (Escopo 1): {", ".join([f'{e["year"]}: {e["value"]} t' for e in data["carbonEmissions"] if e["scope"] == "Escopo 1"])}
Emissões de carbono (Escopo 2): {", ".join([f'{e["year"]}: {e["value"]} t' for e in data["carbonEmissions"] if e["scope"] == "Escopo 2"])}
Resíduos perigosos: {", ".join([f'{e["year"]}: {e["value"]} t' for e in data["wasteGeneration"] if e["type"] == "Perigoso"])}
Resíduos não perigosos: {", ".join([f'{e["year"]}: {e["value"]} t' for e in data["wasteGeneration"] if e["type"] == "Não Perigoso"])}
Fornecedores: {", ".join([f'{f["name"]} ({f["sustainabilityRating"]}, {f["location"]})' for f in data["supplierData"]])}

Pergunta do usuário: {pergunta}
'''.strip()

@app.post("/ia")
async def ia_endpoint(request: Request):
    body = await request.json()
    pergunta = body["pergunta"]
    company = body["company"]
    data = body["data"]

    prompt = build_prompt(pergunta, company, data)
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    response = requests.post(GEMINI_URL, json=payload)
    resposta = response.json()
    texto = (
        resposta.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "Nenhuma resposta recebida da IA.")
    )
    return {"resposta": texto}

@app.get("/company")
def get_company():
    return {
        "name": "ACME Corp",
        "industry": "Fabricação",
        "size": "Grande",
        "location": "São Paulo, Brasil"
    }

@app.get("/sustainability")
def get_sustainability():
    return {
        "energyConsumption": [
            {"year": 2020, "value": 1200, "source": "Rede"},
            {"year": 2021, "value": 1300, "source": "Rede"},
            {"year": 2022, "value": 1100, "source": "Rede"},
            {"year": 2023, "value": 900, "source": "Renovável"},
        ],
        "carbonEmissions": [
            {"year": 2020, "value": 600, "scope": "Escopo 1"},
            {"year": 2021, "value": 650, "scope": "Escopo 1"},
            {"year": 2022, "value": 550, "scope": "Escopo 1"},
            {"year": 2023, "value": 400, "scope": "Escopo 1"},
            {"year": 2020, "value": 300, "scope": "Escopo 2"},
            {"year": 2021, "value": 320, "scope": "Escopo 2"},
            {"year": 2022, "value": 280, "scope": "Escopo 2"},
            {"year": 2023, "value": 200, "scope": "Escopo 2"},
        ],
        "wasteGeneration": [
            {"year": 2020, "value": 250, "type": "Perigoso"},
            {"year": 2021, "value": 270, "type": "Perigoso"},
            {"year": 2022, "value": 240, "type": "Perigoso"},
            {"year": 2023, "value": 200, "type": "Perigoso"},
            {"year": 2020, "value": 400, "type": "Não Perigoso"},
            {"year": 2021, "value": 420, "type": "Não Perigoso"},
            {"year": 2022, "value": 380, "type": "Não Perigoso"},
            {"year": 2023, "value": 350, "type": "Não Perigoso"},
        ],
        "supplierData": [
            {"name": "Fornecedor A", "sustainabilityRating": "Médio", "location": "China"},
            {"name": "Fornecedor B", "sustainabilityRating": "Alto", "location": "Brasil"},
            {"name": "Fornecedor C", "sustainabilityRating": "Baixo", "location": "EUA"},
        ],
        "reports": [
            {"id": "report-1", "title": "Relatório de Sustentabilidade 2022", "date": "2023-03-15", "type": "Abrangente"},
            {"id": "report-2", "title": "Análise da Pegada de Carbono", "date": "2023-02-20", "type": "Específico"},
        ],
    } 