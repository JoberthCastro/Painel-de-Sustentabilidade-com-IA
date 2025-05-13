import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Mock API functions (simulando backend)
const api = {
    getCompanyData: async () => ({
        name: 'ACME Corp',
        industry: 'Fabricação',
        size: 'Grande',
        location: 'São Paulo, Brasil',
    }),
    getSustainabilityData: async () => ({
        energyConsumption: [
            { year: 2020, value: 1200, source: 'Rede' },
            { year: 2021, value: 1300, source: 'Rede' },
            { year: 2022, value: 1100, source: 'Rede' },
            { year: 2023, value: 900, source: 'Renovável' },
        ],
        carbonEmissions: [
            { year: 2020, value: 600, scope: 'Escopo 1' },
            { year: 2021, value: 650, scope: 'Escopo 1' },
            { year: 2022, value: 550, scope: 'Escopo 1' },
            { year: 2023, value: 400, scope: 'Escopo 1' },
            { year: 2020, value: 300, scope: 'Escopo 2' },
            { year: 2021, value: 320, scope: 'Escopo 2' },
            { year: 2022, value: 280, scope: 'Escopo 2' },
            { year: 2023, value: 200, scope: 'Escopo 2' },
        ],
        wasteGeneration: [
            { year: 2020, value: 250, type: 'Perigoso' },
            { year: 2021, value: 270, type: 'Perigoso' },
            { year: 2022, value: 240, type: 'Perigoso' },
            { year: 2023, value: 200, type: 'Perigoso' },
            { year: 2020, value: 400, type: 'Não Perigoso' },
            { year: 2021, value: 420, type: 'Não Perigoso' },
            { year: 2022, value: 380, type: 'Não Perigoso' },
            { year: 2023, value: 350, type: 'Não Perigoso' },
        ],
        supplierData: [
            { name: 'Fornecedor A', sustainabilityRating: 'Médio', location: 'China' },
            { name: 'Fornecedor B', sustainabilityRating: 'Alto', location: 'Brasil' },
            { name: 'Fornecedor C', sustainabilityRating: 'Baixo', location: 'EUA' },
        ],
        reports: [
            { id: 'report-1', title: 'Relatório de Sustentabilidade 2022', date: '2023-03-15', type: 'Abrangente' },
            { id: 'report-2', title: 'Análise da Pegada de Carbono', date: '2023-02-20', type: 'Específico' },
        ],
    }),
};

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
                {cards.map((c, i) => (
                    <StatCard key={c.title} {...c} />
                ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#2563eb', fontSize: 16 }}>Consumo de Energia</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Tendência anual e detalhamento da fonte</div>
                    <ResponsiveContainer width="100%" height={200}>
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
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#7c3aed', fontSize: 16 }}>Emissões de Carbono</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Tendência anual por escopo</div>
                    <ResponsiveContainer width="100%" height={200}>
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
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#f59e42', fontSize: 16 }}>Geração de Resíduos</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Quebra anual por tipo</div>
                    <ResponsiveContainer width="100%" height={200}>
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
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#7c3aed', fontSize: 16 }}>Sustentabilidade dos Fornecedores</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Classificação de sustentabilidade dos principais fornecedores</div>
                    <table style={{ width: '100%', fontSize: 15, color: '#222', borderCollapse: 'collapse' }}>
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
    );
}

function DadosTab({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
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

function AnaliseTab() {
  const [showReport, setShowReport] = useState(false);
  const relatorio =
    '## Relatório de Análise de Sustentabilidade\n\n**Principais Descobertas:**\n* O consumo de energia diminuiu 20% de 2020 a 2023, com uma mudança para fontes renováveis.\n* As emissões de carbono (Escopo 1) também diminuíram 33% no mesmo período, indicando progresso positivo.\n* A geração de resíduos mostra uma tendência de queda, principalmente para resíduos perigosos.\n* O Fornecedor B tem a maior classificação de sustentabilidade, o que é um aspecto positivo da cadeia de suprimentos.\n\n**Recomendações:**\n1. Continue investindo em fontes de energia renováveis para reduzir ainda mais as emissões de carbono.\n2. Implemente estratégias para minimizar a geração de resíduos, com foco em resíduos não perigosos.\n3. Envolva-se com os fornecedores para melhorar a sustentabilidade geral da cadeia de suprimentos.\n4. Considere definir metas de sustentabilidade mais ambiciosas e acompanhar o progresso em relação a elas.';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#2563eb', fontSize: 20 }}>Análise com IA</div>
      <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>Insights e recomendações gerados por inteligência artificial</div>
      {showReport && (
        <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-line', fontSize: 15, color: '#222', marginBottom: 24 }}>
          {relatorio}
        </div>
      )}
      <button
        style={{ marginTop: showReport ? 0 : 24, padding: '10px 24px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22' }}
        onClick={() => setShowReport(true)}
        disabled={showReport}
      >
        Analisar Dados
      </button>
    </div>
  );
}

function RelatoriosTab({ data }) {
  const [uploaded, setUploaded] = useState(null);
  const [custom, setCustom] = useState({ title: '', content: '' });
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {data.reports.map(r => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb', minWidth: 220 }}>
            <div style={{ fontWeight: 600, color: '#2563eb' }}>{r.title}</div>
            <div style={{ color: '#888', fontSize: 14 }}>{r.date}</div>
            <div style={{ color: '#555', fontSize: 14, marginTop: 8 }}>Tipo: {r.type}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#7c3aed' }}>Enviar Relatório</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Envie um novo relatório de sustentabilidade</div>
        <input type="file" onChange={e => setUploaded(e.target.files[0])} />
        <button style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22' }}>Enviar Relatório</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px #0001', border: '1px solid #e5e7eb' }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#10b981' }}>Criar Relatório Personalizado</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Gere um novo relatório com dados personalizados</div>
        <input type="text" placeholder="Título do Relatório" value={custom.title} onChange={e => setCustom({ ...custom, title: e.target.value })} style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }} />
        <textarea placeholder="Conteúdo do Relatório" value={custom.content} onChange={e => setCustom({ ...custom, content: e.target.value })} style={{ width: '100%', minHeight: 80, marginBottom: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }} />
        <button style={{ padding: '8px 20px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #10b98122' }}>Gerar Relatório</button>
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
        (async () => {
            setCompany(await api.getCompanyData());
            setData(await api.getSustainabilityData());
        })();
    }, []);
    if (!company || !data) return <div style={{ textAlign: 'center', marginTop: 80 }}>Carregando...</div>;
    return (
        <div style={{ minHeight: '100vh', background: '#f4f6fa', fontFamily: 'Inter, sans-serif', width: '100vw' }}>
            {/* Header */}
            <div style={{ width: '100%', background: '#fff', boxShadow: '0 2px 8px #0001', padding: '0 0 1.5rem 0', marginBottom: 32 }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2.5rem 2rem 0 2rem', display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 'bold', color: '#22223b', margin: 0, letterSpacing: '-1px' }}>
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
            <div style={{ padding: '0 2rem 2rem 2rem', width: '100%' }}>
                {tab === 'overview' && <Overview company={company} data={data} />}
                {tab === 'data' && <DadosTab data={data} />}
                {tab === 'analysis' && <AnaliseTab />}
                {tab === 'reports' && <RelatoriosTab data={data} />}
            </div>
        </div>
    );
}
