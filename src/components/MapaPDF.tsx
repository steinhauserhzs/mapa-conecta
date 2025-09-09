import React from 'react';

interface MapaData {
  header: {
    name: string;
    birth: string;
    anoReferencia: number;
    dataGeracao: string;
  };
  numeros: {
    expressao: number;
    motivacao: number;
    impressao: number;
    destino: number;
    ano_pessoal: number;
    numero_psiquico?: number;
    dia_nascimento_natural?: number;
    dia_nascimento_reduzido?: number;
    grau_ascensao?: number;
  };
  textos: Record<string, {
    title: string;
    body: string;
  }>;
  debug?: any;
}

interface MapaPDFProps {
  data: MapaData;
}

const Section = ({ title, body }: { title: string; body: string }) => (
  <section className="px-12 py-12 break-before-page min-h-screen flex flex-col">
    <h2 className="text-4xl font-bold mb-8 text-primary border-b-2 border-primary/20 pb-4">
      {title}
    </h2>
    <div className="flex-1 prose prose-lg prose-neutral max-w-none leading-relaxed">
      <div className="whitespace-pre-wrap text-justify">{body}</div>
    </div>
  </section>
);

export default function MapaPDF({ data }: MapaPDFProps) {
  const { header, numeros, textos } = data;
  
  // Define section order for display
  const secaoOrdem = [
    'motivacao', 'expressao', 'impressao', 'destino', 'ano_pessoal',
    'numero_psiquico', 'dia_nascimento', 'grau_ascensao', 
    'cores_favoraveis', 'dias_favoraveis'
  ];

  // Get available sections in defined order
  const secoesDisponiveis = secaoOrdem.filter(secao => textos[secao]);

  return (
    <div className="w-[794px] mx-auto bg-background text-foreground font-serif" id="mapa-para-pdf">
      {/* CAPA */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/30"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-primary/20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10"></div>
        </div>
        
        <div className="text-center z-10 max-w-2xl px-8">
          <h1 className="text-6xl font-bold tracking-wide mb-4 text-primary">
            Mapa Numerológico
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <h2 className="text-3xl font-semibold mb-6 text-muted-foreground">
            Cabalístico
          </h2>
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 shadow-lg border">
            <p className="text-2xl font-medium mb-2">{header.name}</p>
            <p className="text-lg text-muted-foreground mb-4">{header.birth}</p>
            <p className="text-sm text-muted-foreground">
              Ano de Referência: {header.anoReferencia}
            </p>
          </div>
        </div>
      </section>

      {/* SUMÁRIO/OS SEUS NÚMEROS */}
      <section className="px-12 py-16 min-h-screen flex flex-col justify-center">
        <h2 className="text-5xl font-bold mb-12 text-center text-primary">
          Os Seus Números
        </h2>
        
        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Expressão</span>
              <span className="text-3xl font-bold text-primary">{numeros.expressao}</span>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Motivação</span>
              <span className="text-3xl font-bold text-primary">{numeros.motivacao}</span>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Impressão</span>
              <span className="text-3xl font-bold text-primary">{numeros.impressao}</span>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Destino</span>
              <span className="text-3xl font-bold text-primary">{numeros.destino}</span>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Ano Pessoal</span>
              <span className="text-3xl font-bold text-primary">{numeros.ano_pessoal}</span>
            </div>
          </div>

          {/* Additional numbers if available */}
          {numeros.numero_psiquico && (
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Número Psíquico</span>
                <span className="text-3xl font-bold text-primary">{numeros.numero_psiquico}</span>
              </div>
            </div>
          )}
          
          {numeros.dia_nascimento_natural && (
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Dia Nascimento</span>
                <span className="text-3xl font-bold text-primary">{numeros.dia_nascimento_natural}</span>
              </div>
            </div>
          )}
          
          {numeros.grau_ascensao && (
            <div className="bg-card rounded-lg p-6 shadow-md border border-border">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Grau Ascensão</span>
                <span className="text-3xl font-bold text-primary">{numeros.grau_ascensao}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Gerado em: {new Date(header.dataGeracao).toLocaleString('pt-BR')}
          </p>
        </div>
      </section>

      {/* SEÇÕES DINÂMICAS */}
      {secoesDisponiveis.map((secao) => (
        <Section 
          key={secao}
          title={textos[secao].title}
          body={textos[secao].body}
        />
      ))}
      
      {/* RODAPÉ FINAL */}
      <section className="px-12 py-16 text-center break-before-page min-h-screen flex flex-col justify-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-primary">
            Sobre Este Mapa
          </h3>
          <div className="prose prose-lg max-w-none text-justify">
            <p className="mb-6">
              Este mapa numerológico foi calculado usando o método cabalístico tradicional, 
              considerando os valores específicos das letras e suas modificações por acentos 
              e sinais diacríticos.
            </p>
            <p className="mb-6">
              Os números mestres 11 e 22 foram preservados conforme a tradição numerológica, 
              mantendo sua vibração especial quando presentes nos cálculos.
            </p>
            <p className="text-muted-foreground text-sm">
              Mapa gerado pelo Sistema de Numerologia Cabalística Jé Fêrraz
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}