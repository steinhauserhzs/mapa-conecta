import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CompleteNumerologyResultProps {
  result: any;
}

export const CompleteNumerologyResult: React.FC<CompleteNumerologyResultProps> = ({ result }) => {
  if (!result) return null;

  const { header, numeros, complementares, metadados } = result;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{header?.titulo}</CardTitle>
          <CardDescription className="text-lg font-medium">{header?.subtitulo}</CardDescription>
          <div className="text-sm text-muted-foreground space-y-1">
            <div><strong>Nome:</strong> {header?.nome}</div>
            <div><strong>Data de Nascimento:</strong> {header?.dataNascimento}</div>
            <div><strong>Data de Geração:</strong> {header?.dataGeracao}</div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic text-muted-foreground text-center">
            "{header?.orientacao}"
          </p>
        </CardContent>
      </Card>

      {/* Main Numbers Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Números Principais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {numeros?.motivacao && (
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary">{numeros.motivacao.numero}</div>
                <div className="text-sm font-medium">Motivação</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {numeros.motivacao.explicacao}
                </div>
              </div>
            )}
            
            {numeros?.impressao && (
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <div className="text-3xl font-bold text-secondary">{numeros.impressao.numero}</div>
                <div className="text-sm font-medium">Impressão</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {numeros.impressao.explicacao}
                </div>
              </div>
            )}
            
            {numeros?.expressao && (
              <div className="text-center p-4 bg-accent/5 rounded-lg">
                <div className="text-3xl font-bold text-accent">{numeros.expressao.numero}</div>
                <div className="text-sm font-medium">Expressão</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {numeros.expressao.explicacao}
                </div>
              </div>
            )}
            
            {numeros?.destino && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-3xl font-bold">{numeros.destino.numero}</div>
                <div className="text-sm font-medium">Destino</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {numeros.destino.explicacao}
                </div>
              </div>
            )}
            
            {numeros?.missao && (
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{numeros.missao.numero}</div>
                <div className="text-sm font-medium">Missão</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {numeros.missao.explicacao}
                </div>
              </div>
            )}
            
            {numeros?.psiquico && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{numeros.psiquico.numero}</div>
                <div className="text-sm font-medium">Psíquico</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {numeros.psiquico.explicacao}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Karmic Information */}
        {(numeros?.licoesCarmicas || numeros?.dividasCarmicas) && (
          <Card>
            <CardHeader>
              <CardTitle>Informações Cármicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {numeros?.licoesCarmicas && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Lições Cármicas</h4>
                  <div className="flex flex-wrap gap-1">
                    {numeros.licoesCarmicas.numeros?.map((num: number, idx: number) => (
                      <Badge key={idx} variant="outline">{num}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {numeros.licoesCarmicas.explicacao}
                  </p>
                </div>
              )}
              
              {numeros?.dividasCarmicas && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Dívidas Cármicas</h4>
                  <div className="flex flex-wrap gap-1">
                    {numeros.dividasCarmicas.numeros?.map((num: number, idx: number) => (
                      <Badge key={idx} variant="destructive">{num}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {numeros.dividasCarmicas.explicacao}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Hidden Tendencies */}
        {numeros?.tendenciasOcultas && (
          <Card>
            <CardHeader>
              <CardTitle>Tendências Ocultas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-2">
                {numeros.tendenciasOcultas.numeros?.map((num: number, idx: number) => (
                  <Badge key={idx} variant="secondary">{num}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {numeros.tendenciasOcultas.explicacao}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Life Cycles */}
      {numeros?.ciclosVida && (
        <Card>
          <CardHeader>
            <CardTitle>Ciclos de Vida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {numeros.ciclosVida.primeiro && (
                <div className="p-4 border rounded-lg">
                  <div className="text-center mb-2">
                    <div className="text-2xl font-bold">{numeros.ciclosVida.primeiro.numero}</div>
                    <div className="text-sm font-medium">{numeros.ciclosVida.primeiro.fase}</div>
                    <div className="text-xs text-muted-foreground">{numeros.ciclosVida.primeiro.periodo}</div>
                  </div>
                  <p className="text-xs">{numeros.ciclosVida.primeiro.conteudo}</p>
                </div>
              )}
              
              {numeros.ciclosVida.segundo && (
                <div className="p-4 border rounded-lg">
                  <div className="text-center mb-2">
                    <div className="text-2xl font-bold">{numeros.ciclosVida.segundo.numero}</div>
                    <div className="text-sm font-medium">{numeros.ciclosVida.segundo.fase}</div>
                    <div className="text-xs text-muted-foreground">{numeros.ciclosVida.segundo.periodo}</div>
                  </div>
                  <p className="text-xs">{numeros.ciclosVida.segundo.conteudo}</p>
                </div>
              )}
              
              {numeros.ciclosVida.terceiro && (
                <div className="p-4 border rounded-lg">
                  <div className="text-center mb-2">
                    <div className="text-2xl font-bold">{numeros.ciclosVida.terceiro.numero}</div>
                    <div className="text-sm font-medium">{numeros.ciclosVida.terceiro.fase}</div>
                    <div className="text-xs text-muted-foreground">{numeros.ciclosVida.terceiro.periodo}</div>
                  </div>
                  <p className="text-xs">{numeros.ciclosVida.terceiro.conteudo}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complementary Information */}
      {complementares && (
        <Card>
          <CardHeader>
            <CardTitle>Correspondências Numerológicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {complementares.cores && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Cores Harmônicas</h4>
                  <div className="space-y-1 text-xs">
                    {complementares.cores.coresMotivacao?.length > 0 && (
                      <div>Motivação: {complementares.cores.coresMotivacao.join(', ')}</div>
                    )}
                    {complementares.cores.coresExpressao?.length > 0 && (
                      <div>Expressão: {complementares.cores.coresExpressao.join(', ')}</div>
                    )}
                    {complementares.cores.coresDestino?.length > 0 && (
                      <div>Destino: {complementares.cores.coresDestino.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}
              
              {complementares.pedras && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Pedras e Cristais</h4>
                  <div className="space-y-1 text-xs">
                    {complementares.pedras.pedrasMotivacao?.length > 0 && (
                      <div>Motivação: {complementares.pedras.pedrasMotivacao.join(', ')}</div>
                    )}
                    {complementares.pedras.pedrasExpressao?.length > 0 && (
                      <div>Expressão: {complementares.pedras.pedrasExpressao.join(', ')}</div>
                    )}
                    {complementares.pedras.pedrasDestino?.length > 0 && (
                      <div>Destino: {complementares.pedras.pedrasDestino.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}
              
              {complementares.profissoes && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Profissões Ideais</h4>
                  <div className="space-y-1 text-xs">
                    {complementares.profissoes.profissoesExpressao?.length > 0 && (
                      <div>Expressão: {complementares.profissoes.profissoesExpressao.join(', ')}</div>
                    )}
                    {complementares.profissoes.profissoesDestino?.length > 0 && (
                      <div>Destino: {complementares.profissoes.profissoesDestino.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}
              
              {complementares.saude && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">Orientações de Saúde</h4>
                  <div className="space-y-1 text-xs">
                    {complementares.saude.cuidadosExpressao?.length > 0 && (
                      <div>Expressão: {complementares.saude.cuidadosExpressao.join(', ')}</div>
                    )}
                    {complementares.saude.cuidadosDestino?.length > 0 && (
                      <div>Destino: {complementares.saude.cuidadosDestino.join(', ')}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cabalistic Angel */}
      {numeros?.anjoEspecial && (
        <Card>
          <CardHeader>
            <CardTitle>Anjo Cabalístico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">{numeros.anjoEspecial.nome}</div>
              <p className="text-sm text-muted-foreground mb-4">{numeros.anjoEspecial.explicacao}</p>
              
              {numeros.anjoEspecial.conteudo && (
                <ScrollArea className="h-32 w-full rounded border p-4 text-left">
                  <p className="text-xs whitespace-pre-wrap">{numeros.anjoEspecial.conteudo}</p>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      {metadados && (
        <Card>
          <CardHeader>
            <CardTitle>Informações do Mapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div>Versão: {metadados.versaoConteudo}</div>
              <div>Textos carregados: {metadados.totalTextos}</div>
              <div>Anjo encontrado: {metadados.angeloEncontrado ? 'Sim' : 'Não'}</div>
              <div>Cálculos completos: {metadados.calculosCompletos ? 'Sim' : 'Não'}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};