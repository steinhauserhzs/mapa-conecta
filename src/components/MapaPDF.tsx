import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface MapaData {
  header: {
    titulo?: string;
    subtitulo?: string;
    nome?: string;
    name?: string;
    dataNascimento?: string;
    birth?: string;
    dataGeracao?: string;
    anoReferencia?: number;
    orientacao?: string;
  };
  numeros: {
    motivacao?: number;
    impressao?: number;
    expressao?: number;
    destino?: number;
    missao?: number;
    psiquico?: number;
    anoPessoal?: number;
    ano_pessoal?: number;
    mesPessoal?: number;
    diaPessoal?: number;
    anjoEspecial?: string;
    licoesCarmicas?: number[];
    dividasCarmicas?: number[];
    tendenciasOcultas?: number[];
    respostaSubconsciente?: number;
    ciclosVida?: number[];
    desafios?: number[];
    momentos?: number[];
  };
  textos?: any;
  complementares?: {
    cores?: any;
    pedras?: any;
    profissoes?: any;
    saude?: any;
  };
  metadados?: {
    versaoConteudo?: string;
    totalTextos?: number;
    angeloEncontrado?: boolean;
    calculosCompletos?: boolean;
  };
}

interface MapaPDFProps {
  data: MapaData;
  isEditing?: boolean;
  editedTexts?: Record<string, { title: string; body: string }>;
  onEdit?: (section: string, field: string) => void;
}

const MapaPDF: React.FC<MapaPDFProps> = ({ data, isEditing = false, editedTexts = {}, onEdit }) => {
  const isV3Format = data.metadados?.versaoConteudo === 'v3.0' || data.textos?.motivacao?.titulo;
  
  const renderEditButton = (section: string, field: string) => {
    if (!isEditing || !onEdit) return null;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(section, field)}
        className="ml-2 h-6 w-6 p-0"
      >
        <Edit2 className="h-3 w-3" />
      </Button>
    );
  };

  const getEditedText = (section: string, field: string, originalText: string) => {
    return editedTexts[section]?.[field] || originalText;
  };

  // Função para renderizar números básicos
  const renderNumerosBasicos = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {data.numeros.motivacao && (
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">{data.numeros.motivacao}</div>
          <div className="text-sm font-medium">Motivação</div>
        </div>
      )}
      {data.numeros.impressao && (
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{data.numeros.impressao}</div>
          <div className="text-sm font-medium">Impressão</div>
        </div>
      )}
      {data.numeros.expressao && (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">{data.numeros.expressao}</div>
          <div className="text-sm font-medium">Expressão</div>
        </div>
      )}
      {data.numeros.destino && (
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-3xl font-bold text-orange-600">{data.numeros.destino}</div>
          <div className="text-sm font-medium">Destino</div>
        </div>
      )}
      {data.numeros.missao && (
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-3xl font-bold text-red-600">{data.numeros.missao}</div>
          <div className="text-sm font-medium">Missão</div>
        </div>
      )}
      {data.numeros.psiquico && (
        <div className="text-center p-4 bg-indigo-50 rounded-lg">
          <div className="text-3xl font-bold text-indigo-600">{data.numeros.psiquico}</div>
          <div className="text-sm font-medium">Psíquico</div>
        </div>
      )}
      {(data.numeros.anoPessoal || data.numeros.ano_pessoal) && (
        <div className="text-center p-4 bg-amber-50 rounded-lg">
          <div className="text-3xl font-bold text-amber-600">
            {data.numeros.anoPessoal || data.numeros.ano_pessoal}
          </div>
          <div className="text-sm font-medium">Ano Pessoal</div>
        </div>
      )}
      {data.numeros.anjoEspecial && (
        <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg col-span-2 md:col-span-3 border border-yellow-200">
          <div className="text-xl font-bold text-yellow-700 mb-1">{data.numeros.anjoEspecial}</div>
          <div className="text-sm font-medium text-yellow-600">Anjo Cabalístico</div>
        </div>
      )}
    </div>
  );

  // Função para renderizar seção de texto
  const renderSecaoTexto = (titulo: string, conteudo: any, secao?: string) => {
    if (!conteudo) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            {titulo}
            {secao && renderEditButton(secao, 'title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conteudo.explicacao && (
            <div className="mb-4 p-3 bg-muted/50 rounded-md">
              <p className="text-sm italic text-muted-foreground">
                {conteudo.explicacao}
              </p>
            </div>
          )}
          
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {getEditedText(secao || '', 'body', conteudo.conteudo || conteudo.body || 'Conteúdo em desenvolvimento.')}
            </div>
          </div>

          {/* Informações adicionais para v3.0 */}
          {conteudo.cores && conteudo.cores.length > 0 && (
            <div className="mt-4 p-3 bg-purple-50 rounded-md">
              <h4 className="font-semibold text-purple-700 mb-2">Cores Harmônicas:</h4>
              <div className="flex flex-wrap gap-2">
                {conteudo.cores.map((cor: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    {cor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {conteudo.pedras && conteudo.pedras.length > 0 && (
            <div className="mt-4 p-3 bg-emerald-50 rounded-md">
              <h4 className="font-semibold text-emerald-700 mb-2">Pedras e Cristais:</h4>
              <div className="flex flex-wrap gap-2">
                {conteudo.pedras.map((pedra: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs">
                    {pedra}
                  </span>
                ))}
              </div>
            </div>
          )}

          {conteudo.profissoes && conteudo.profissoes.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <h4 className="font-semibold text-blue-700 mb-2">Profissões Ideais:</h4>
              <div className="flex flex-wrap gap-2">
                {conteudo.profissoes.map((prof: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {prof}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white" id="mapa-pdf">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-primary/20">
        <h1 className="text-3xl font-bold mb-2 text-primary">
          {data.header.titulo || "Estudo Numerológico Pessoal"}
        </h1>
        <h2 className="text-lg text-muted-foreground mb-4">
          {data.header.subtitulo || "(Mapa Numerológico Cabalístico)"}
        </h2>
        
        <div className="space-y-2">
          <p className="text-xl font-semibold">
            Nome: <span className="text-primary">
              {data.header.nome || data.header.name}
            </span>
          </p>
          <p className="text-lg">
            Data de Nascimento: <span className="font-medium">
              {data.header.dataNascimento || data.header.birth}
            </span>
          </p>
          {(data.header.anoReferencia || data.header.dataGeracao) && (
            <p className="text-sm text-muted-foreground">
              Gerado em: {data.header.dataGeracao ? 
                new Date(data.header.dataGeracao).toLocaleDateString('pt-BR') : 
                new Date().toLocaleDateString('pt-BR')
              } {data.header.anoReferencia && `| Ano de Referência: ${data.header.anoReferencia}`}
            </p>
          )}
        </div>

        {/* Orientação Cabalística */}
        {data.header.orientacao && (
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm italic text-amber-800 leading-relaxed">
              {data.header.orientacao}
            </p>
          </div>
        )}
      </div>

      {/* Os Seus Números */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Os Seus Números</h2>
        {renderNumerosBasicos()}
      </div>

      {/* Seções principais - Formato v3.0 */}
      {isV3Format && data.textos && (
        <div className="space-y-6">
          {data.textos.motivacao && renderSecaoTexto(
            `Motivação ${data.textos.motivacao.numero || ''}`, 
            data.textos.motivacao, 
            'motivacao'
          )}
          
          {data.textos.impressao && renderSecaoTexto(
            `Impressão ${data.textos.impressao.numero || ''}`, 
            data.textos.impressao, 
            'impressao'
          )}
          
          {data.textos.expressao && renderSecaoTexto(
            `Expressão ${data.textos.expressao.numero || ''}`, 
            data.textos.expressao, 
            'expressao'
          )}
          
          {data.textos.destino && renderSecaoTexto(
            `Destino ${data.textos.destino.numero || ''}`, 
            data.textos.destino, 
            'destino'
          )}
          
          {data.textos.missao && renderSecaoTexto(
            `Missão ${data.textos.missao.numero || ''}`, 
            data.textos.missao, 
            'missao'
          )}

          {data.textos.psiquico && renderSecaoTexto(
            `Número Psíquico ${data.textos.psiquico.numero || ''}`, 
            data.textos.psiquico, 
            'psiquico'
          )}

          {/* Anjo Cabalístico */}
          {data.textos.anjoEspecial && (
            <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-700">
                  {data.textos.anjoEspecial.titulo} - {data.textos.anjoEspecial.nome}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p><strong>Categoria:</strong> {data.textos.anjoEspecial.categoria}</p>
                  <p><strong>Domínio:</strong> {data.textos.anjoEspecial.explicacao}</p>
                  {data.textos.anjoEspecial.invocacao1 && (
                    <p><strong>Horário de Invocação:</strong> {data.textos.anjoEspecial.invocacao1}</p>
                  )}
                  {data.textos.anjoEspecial.salmo && (
                    <p><strong>Salmo:</strong> {data.textos.anjoEspecial.salmo}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lições Cármicas */}
          {data.textos.licoesCarmicas && data.textos.licoesCarmicas.numeros.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-primary">
                  Lições Cármicas: {data.textos.licoesCarmicas.numeros.join(', ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm italic text-muted-foreground">
                    {data.textos.licoesCarmicas.explicacao}
                  </p>
                </div>
                <div className="space-y-4">
                  {data.textos.licoesCarmicas.licoes.map((licao: any, idx: number) => (
                    <div key={idx} className="p-3 bg-orange-50 rounded-md">
                      <h4 className="font-semibold text-orange-700 mb-2">Lição {licao.numero}:</h4>
                      <p className="text-sm text-orange-800">{licao.licao}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ciclos de Vida */}
          {data.textos.ciclosVida && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-primary">Ciclos de Vida</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm italic text-muted-foreground">
                    {data.textos.ciclosVida.explicacao}
                  </p>
                </div>
                <div className="space-y-4">
                  {data.textos.ciclosVida.primeiro && (
                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-semibold text-blue-700 mb-2">
                        Primeiro Ciclo - Número {data.textos.ciclosVida.primeiro.numero}
                      </h4>
                      <p className="text-sm text-blue-600 mb-2">
                        <strong>{data.textos.ciclosVida.primeiro.periodo}</strong> - {data.textos.ciclosVida.primeiro.fase}
                      </p>
                      <p className="text-sm text-blue-800">{data.textos.ciclosVida.primeiro.conteudo}</p>
                    </div>
                  )}
                  
                  {data.textos.ciclosVida.segundo && (
                    <div className="p-4 bg-green-50 rounded-md">
                      <h4 className="font-semibold text-green-700 mb-2">
                        Segundo Ciclo - Número {data.textos.ciclosVida.segundo.numero}
                      </h4>
                      <p className="text-sm text-green-600 mb-2">
                        <strong>{data.textos.ciclosVida.segundo.periodo}</strong> - {data.textos.ciclosVida.segundo.fase}
                      </p>
                      <p className="text-sm text-green-800">{data.textos.ciclosVida.segundo.conteudo}</p>
                    </div>
                  )}
                  
                  {data.textos.ciclosVida.terceiro && (
                    <div className="p-4 bg-purple-50 rounded-md">
                      <h4 className="font-semibold text-purple-700 mb-2">
                        Terceiro Ciclo - Número {data.textos.ciclosVida.terceiro.numero}
                      </h4>
                      <p className="text-sm text-purple-600 mb-2">
                        <strong>{data.textos.ciclosVida.terceiro.periodo}</strong> - {data.textos.ciclosVida.terceiro.fase}
                      </p>
                      <p className="text-sm text-purple-800">{data.textos.ciclosVida.terceiro.conteudo}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {data.textos.anoPessoal && renderSecaoTexto(
            data.textos.anoPessoal.titulo, 
            data.textos.anoPessoal, 
            'anoPessoal'
          )}
        </div>
      )}

      {/* Fallback para formato antigo */}
      {!isV3Format && data.textos && (
        <div className="space-y-6">
          {Object.entries(data.textos).map(([section, content]: [string, any]) => (
            <Card key={section} className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-primary capitalize">
                  {content.title || section.replace('_', ' ')}
                  {renderEditButton(section, 'title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {getEditedText(section, 'body', content.body || 'Conteúdo em desenvolvimento.')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Informações complementares v3.0 */}
      {data.complementares && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-primary">Informações Complementares</h2>
          
          {data.complementares.cores && (
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Cores Harmônicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{data.complementares.cores.explicacao}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.complementares.cores.coresMotivacao && (
                    <div>
                      <h4 className="font-semibold mb-2">Motivação:</h4>
                      <div className="flex flex-wrap gap-1">
                        {data.complementares.cores.coresMotivacao.map((cor: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {cor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Footer com metadados */}
      {data.metadados && (
        <div className="mt-8 pt-6 border-t border-primary/20 text-center text-xs text-muted-foreground">
          <p>
            Mapa gerado com {data.metadados.totalTextos || 0} textos numerológicos v{data.metadados.versaoConteudo || '1.0'}
            {data.metadados.angeloEncontrado && ' • Anjo Cabalístico incluído'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapaPDF;