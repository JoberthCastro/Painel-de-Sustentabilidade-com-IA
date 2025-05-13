import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import jsPDF from 'jspdf';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const CARD_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7C3AED', '#F472B6', '#F59E42'];
const CARD_ICONS = [
  '🏢', // Empresa
  '🏭', // Setor
  '👥', // Tamanho
  '📍', // Localização
  '⚡', // Energia
  '🌱', // Carbono
  '🗑️', // Resíduos
];

function StatCard({ title, value, unit }) {
    return (
        <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 2px 8px #0001',
            border: '1px solid #e5e7eb',
            minWidth: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
            transition: 'box-shadow 0.2s',
        }}>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{title}</div>
            <div style={{ fontWeight: 700, fontSize: 24, color: '#22223b' }}>{value} {unit && <span style={{ fontSize: 15, color: '#888' }}>{unit}</span>}</div>
        </div>
    );
}

function Overview({ company, data }) {
    const totalEnergy = data.energyConsumption.find(e => e.year === 2023)?.value || 0;
    const totalCarbon = data.carbonEmissions.filter(e => e.year === 2023).reduce((a, c) => a + c.value, 0);
    const totalWaste = data.wasteGeneration.filter(e => e.year === 2023).reduce((a, c) => a + c.value, 0);
    const hazardous = data.wasteGeneration.filter(e => e.year === 2023 && e.type === 'Perigoso').reduce((a, c) => a + c.value, 0);
    const nonHazardous = data.wasteGeneration.filter(e => e.year === 2023 && e.type === 'Não Perigoso').reduce((a, c) => a + c.value, 0);

    const cards = [
        { title: 'Nome da Empresa', value: company.name },
        { title: 'Setor', value: company.industry },
        { title: 'Tamanho da Empresa', value: company.size },
        { title: 'Localização', value: company.location },
        { title: 'Consumo Total de Energia (2023)', value: totalEnergy, unit: 'kWh' },
        { title: 'Emissões Totais de Carbono (2023)', value: totalCarbon, unit: 'toneladas CO2' },
        { title: 'Total de Resíduos Gerados (2023)', value: totalWaste, unit: 'toneladas' },
    ];

    return (
        <div style={{ 
            width: '100%', 
            minWidth: 0,
            margin: '0 auto', 
            boxSizing: 'border-box', 
            padding: '0 24px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 32,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            background: '#fff'
        }}>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: 20, 
                width: '100%',
                minWidth: 0
            }}>
                {cards.map((c, i) => (
                    <StatCard key={c.title} {...c} />
                ))}
            </div>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: 24, 
                width: '100%',
                minWidth: 0
            }}>
                <div style={{ 
                    background: '#fff', 
                    borderRadius: 12, 
                    padding: 24, 
                    boxShadow: '0 2px 8px #0001', 
                    border: '1px solid #e5e7eb',
                    minWidth: 0
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#2563eb', fontSize: 16 }}>Consumo de Energia</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Tendência anual e detalhamento da fonte</div>
                    <div style={{ width: '100%', height: 200, minWidth: 0 }}>
                        <ResponsiveContainer>
                            <BarChart data={data.energyConsumption}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" name="Rede" fill="#2563eb" />
                                <Bar dataKey={d => d.source === 'Renovável' ? d.value : 0} name="Renovável" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div style={{ 
                    background: '#fff', 
                    borderRadius: 12, 
                    padding: 24, 
                    boxShadow: '0 2px 8px #0001', 
                    border: '1px solid #e5e7eb',
                    minWidth: 0
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#7c3aed', fontSize: 16 }}>Emissões de Carbono</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Tendência anual por escopo</div>
                    <div style={{ width: '100%', height: 200, minWidth: 0 }}>
                        <ResponsiveContainer>
                            <LineChart data={data.carbonEmissions.reduce((acc, curr) => {
                                let found = acc.find(a => a.year === curr.year);
                                if (!found) {
                                    found = { year: curr.year };
                                    acc.push(found);
                                }
                                found[curr.scope] = curr.value;
                                return acc;
                            }, [])}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Escopo 1" stroke="#7c3aed" name="Escopo 1" strokeWidth={2.5} />
                                <Line type="monotone" dataKey="Escopo 2" stroke="#10b981" name="Escopo 2" strokeWidth={2.5} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div style={{ 
                    background: '#fff', 
                    borderRadius: 12, 
                    padding: 24, 
                    boxShadow: '0 2px 8px #0001', 
                    border: '1px solid #e5e7eb',
                    minWidth: 0
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#f59e42', fontSize: 16 }}>Geração de Resíduos</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Quebra anual por tipo</div>
                    <div style={{ width: '100%', height: 200, minWidth: 0 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={[
                                    { name: 'Perigoso', value: hazardous },
                                    { name: 'Não Perigoso', value: nonHazardous },
                                ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                    <Cell key="Perigoso" fill="#2563eb" />
                                    <Cell key="Não Perigoso" fill="#10b981" />
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div style={{ 
                    background: '#fff', 
                    borderRadius: 12, 
                    padding: 24, 
                    boxShadow: '0 2px 8px #0001', 
                    border: '1px solid #e5e7eb', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    minWidth: 0
                }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#7c3aed', fontSize: 16 }}>Sustentabilidade dos Fornecedores</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Classificação de sustentabilidade dos principais fornecedores</div>
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: 15, color: '#222', borderCollapse: 'collapse', minWidth: 400 }}>
                            <thead>
                                <tr style={{ color: '#888', fontWeight: 400 }}>
                                    <th align="left">Fornecedor</th>
                                    <th align="left">Classificação</th>
                                    <th align="left">Localização</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.supplierData.map(s => (
                                    <tr key={s.name}>
                                        <td>{s.name}</td>
                                        <td>{s.sustainabilityRating}</td>
                                        <td>{s.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DadosTab({ data }) {
  return (
    <div style={{ 
        width: '100%', 
        minWidth: 0,
        margin: '0 auto', 
        boxSizing: 'border-box', 
        padding: '0 24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 32, 
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#fff'
    }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#2563eb', fontSize: 17 }}>Consumo de Energia</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Registros detalhados de consumo de energia</div>
        <table style={{ width: '100%', fontSize: 15, color: '#222', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#6b7280', fontWeight: 600, background: '#f3f4f6' }}>
              <th align="left">Ano</th>
              <th align="left">Valor (kWh)</th>
              <th align="left">Fonte</th>
            </tr>
          </thead>
          <tbody>
            {data.energyConsumption.map((e, i) => (
              <tr key={i}>
                <td>{e.year}</td>
                <td>{e.value}</td>
                <td>{e.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#7c3aed', fontSize: 17 }}>Emissões de Carbono</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Registros detalhados de emissões de carbono</div>
        <table style={{ width: '100%', fontSize: 15, color: '#222', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#6b7280', fontWeight: 600, background: '#f3f4f6' }}>
              <th align="left">Ano</th>
              <th align="left">Valor (toneladas CO2)</th>
              <th align="left">Escopo</th>
            </tr>
          </thead>
          <tbody>
            {data.carbonEmissions.map((e, i) => (
              <tr key={i}>
                <td>{e.year}</td>
                <td>{e.value}</td>
                <td>{e.scope}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#f59e42', fontSize: 17 }}>Geração de Resíduos</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Registros detalhados de geração de resíduos</div>
        <table style={{ width: '100%', fontSize: 15, color: '#222', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#6b7280', fontWeight: 600, background: '#f3f4f6' }}>
              <th align="left">Ano</th>
              <th align="left">Valor (toneladas)</th>
              <th align="left">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {data.wasteGeneration.map((e, i) => (
              <tr key={i}>
                <td>{e.year}</td>
                <td>{e.value}</td>
                <td>{e.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const GEMINI_API_KEY = 'AIzaSyBB-IsXJ3eRHGXUqUk-pVOR1oNwsIFiqnE';

async function obterRespostaGemini(pergunta, company, data) {
  const response = await fetch("http://localhost:8000/ia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pergunta, company, data }),
  });
  const dataResp = await response.json();
  return dataResp.resposta || "Nenhuma resposta recebida da IA.";
}

function AnaliseTab({ company, data }) {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([
    { sender: 'ia', text: 'Olá! Sou o assistente de sustentabilidade. Posso analisar seus dados e sugerir melhorias em energia, carbono, resíduos e fornecedores. Como posso ajudar?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setChat(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const resposta = await obterRespostaGemini(input, company, data);
      setChat(prev => [...prev, { sender: 'ia', text: resposta }]);
    } catch (e) {
      setChat(prev => [...prev, { sender: 'ia', text: 'Erro ao conectar com a IA.' }]);
    }
    setLoading(false);
    setInput('');
  };

  return (
    <div style={{ 
        width: '100%', 
        minWidth: 0,
        height: '100%', 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        background: '#fff', 
        padding: 0, 
        margin: 0, 
        flex: 1, 
        boxSizing: 'border-box',
        overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ padding: '24px 24px 0 24px', flexShrink: 0, width: '100%' }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: '#2563eb', fontSize: 22 }}>Análise com IA</div>
        <div style={{ fontSize: 15, color: '#888', marginBottom: 0 }}>Chat de sustentabilidade corporativa</div>
      </div>
      {/* Área de mensagens */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: '#f7f9fa',
        borderRadius: 0,
        margin: '18px 0 0 0',
        padding: '0 24px',
        overflowY: 'auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {chat.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '12px 0' }}>
            <span style={{
              display: 'inline-block',
              background: msg.sender === 'user' ? '#2563eb' : '#22c55e',
              color: msg.sender === 'user' ? '#fff' : '#222',
              borderRadius: 12,
              padding: '12px 18px',
              maxWidth: '80%',
              wordBreak: 'break-word',
              fontSize: 16,
              boxShadow: '0 2px 8px #0001',
            }}>
              <b>{msg.sender === 'user' ? 'Você' : 'IA'}:</b> {msg.text}
            </span>
          </div>
        ))}
        {loading && <div><i>IA está digitando...</i></div>}
      </div>
      {/* Input */}
      <div style={{
        display: 'flex',
        gap: 10,
        padding: '18px 24px 24px 24px',
        borderTop: '1px solid #f0f0f0',
        background: '#fff',
        borderRadius: 0,
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <input
          type="text"
          value={input}
          disabled={loading}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Pergunte sobre energia, carbono, resíduos..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: '1.5px solid #bbb',
            fontSize: 16,
            background: '#fff',
            color: '#222',
            height: 40,
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{
          padding: '12px 28px',
          borderRadius: 8,
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          fontSize: 16,
          fontWeight: 600,
          boxSizing: 'border-box'
        }}>
          Enviar
        </button>
      </div>
    </div>
  );
}

async function gerarRelatorioIA(company, data) {
  // Prompt especial para análise de desperdícios
  const pergunta = `Gere um relatório detalhado de sustentabilidade, apontando problemas como duplicidade de documentos no Google Drive, videochamadas desnecessárias, desperdícios e outras oportunidades de melhoria. Liste os principais pontos encontrados e sugestões práticas. Seja objetivo e use linguagem executiva.`;
  const response = await fetch("http://localhost:8000/ia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pergunta, company, data }),
  });
  const dataResp = await response.json();
  return dataResp.resposta || "Nenhuma resposta recebida da IA.";
}

function RelatoriosTab({ data, company }) {
  const [loading, setLoading] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [erro, setErro] = useState(null);

  const handleGerar = async () => {
    setLoading(true);
    setErro(null);
    setRelatorio(null);
    try {
      const texto = await gerarRelatorioIA(company, data);
      setRelatorio(texto);
    } catch (e) {
      setErro('Erro ao gerar relatório com a IA.');
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório de Sustentabilidade (IA)', 14, 20);
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(relatorio, 180);
    doc.text(lines, 14, 35);
    doc.save('relatorio-sustentabilidade-ia.pdf');
  };

  return (
    <div style={{
      width: '100%',
      minWidth: 0,
      margin: '0 auto',
      boxSizing: 'border-box',
      padding: '0 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 32,
      height: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: '#fff',
      justifyContent: 'flex-start',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        boxShadow: '0 2px 8px #0001',
        border: '1px solid #e5e7eb',
        maxWidth: 700,
        width: '100%',
        marginTop: 24,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#2563eb', marginBottom: 8 }}>Relatório Inteligente de Sustentabilidade</div>
        <div style={{ fontSize: 15, color: '#888', marginBottom: 8, textAlign: 'center' }}>
          Gere automaticamente um relatório em PDF com análise de desperdícios, duplicidades e oportunidades de melhoria, usando IA.
        </div>
        <button
          onClick={handleGerar}
          disabled={loading}
          style={{
            padding: '14px 36px',
            borderRadius: 8,
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            fontSize: 17,
            fontWeight: 600,
            boxShadow: '0 2px 8px #2563eb22',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 8,
          }}
        >
          {loading ? 'Gerando Relatório...' : 'Gerar Relatório com IA'}
        </button>
        {erro && <div style={{ color: 'red', fontSize: 15 }}>{erro}</div>}
        {relatorio && (
          <>
            <div style={{
              background: '#f3f4f6',
              borderRadius: 8,
              padding: 20,
              color: '#222',
              fontSize: 16,
              width: '100%',
              whiteSpace: 'pre-line',
              marginBottom: 8,
              boxSizing: 'border-box',
              textAlign: 'left',
              border: '1px solid #e5e7eb',
            }}>
              <b>Resumo do Relatório:</b>
              <br />
              {relatorio}
            </div>
            <button
              onClick={handleDownloadPDF}
              style={{
                padding: '12px 28px',
                borderRadius: 8,
                background: '#10b981',
                color: '#fff',
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: '0 2px 8px #10b98122',
                cursor: 'pointer',
                marginTop: 4,
              }}
            >
              Baixar PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const TABS = [
    { key: 'overview', label: 'Visão Geral' },
    { key: 'data', label: 'Dados' },
    { key: 'analysis', label: 'Análise' },
    { key: 'reports', label: 'Relatórios' },
];

export default function App() {
    const [company, setCompany] = useState(null);
    const [data, setData] = useState(null);
    const [tab, setTab] = useState('overview');
    useEffect(() => {
        async function fetchData() {
            const companyResp = await fetch("http://localhost:8000/company");
            const company = await companyResp.json();
            const dataResp = await fetch("http://localhost:8000/sustainability");
            const data = await dataResp.json();
            setCompany(company);
            setData(data);
        }
        fetchData();
    }, []);
    if (!company || !data) return <div style={{ textAlign: 'center', marginTop: 80 }}>Carregando...</div>;
    return (
        <div style={{ 
            minHeight: '100vh', 
            height: '100vh', 
            width: '100vw',
            background: '#fff', 
            fontFamily: 'Inter, sans-serif', 
            display: 'flex', 
            flexDirection: 'column', 
            boxSizing: 'border-box', 
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{ 
                width: '100%', 
                background: '#fff', 
                boxShadow: '0 2px 8px #0001', 
                padding: '0 0 1.5rem 0', 
                marginBottom: 32,
                flexShrink: 0
            }}>
                <div style={{ 
                    maxWidth: 1400, 
                    margin: '0 auto', 
                    padding: '2.5rem 2rem 0 2rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 24,
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    <h1 style={{ 
                        fontSize: '2.4rem', 
                        fontWeight: 'bold', 
                        color: '#22223b', 
                        margin: 0, 
                        letterSpacing: '-1px' 
                    }}>
                        Painel de Sustentabilidade
                    </h1>
                    <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                style={{
                                    flex: 1,
                                    padding: '1rem 0',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: tab === t.key ? '#2563eb' : '#f3f4f6',
                                    color: tab === t.key ? '#fff' : '#22223b',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: 17,
                                    transition: 'all 0.2s',
                                    boxShadow: tab === t.key ? '0 2px 8px #2563eb22' : 'none',
                                    letterSpacing: '0.5px',
                                    borderBottom: tab === t.key ? '3px solid #10b981' : 'none',
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {/* Conteúdo */}
            <div style={{ 
                flex: 1, 
                minHeight: 0, 
                width: '100%',
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden',
                background: '#fff',
                boxSizing: 'border-box'
            }}>
                {tab === 'overview' && <Overview company={company} data={data} />}
                {tab === 'data' && <DadosTab data={data} />}
                {tab === 'analysis' && <AnaliseTab company={company} data={data} />}
                {tab === 'reports' && <RelatoriosTab data={data} company={company} />}
            </div>
        </div>
    );
}