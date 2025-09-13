import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfessionalNumerologyMapProps {
  result: any;
  texts: { [key: string]: any };
  angel: any;
}

export function ProfessionalNumerologyMap({ result, texts, angel }: ProfessionalNumerologyMapProps) {
  if (!result) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Índice do Mapa Numerológico Profissional
  const sections = [
    { title: "Motivação", number: result.motivacao, key: `motivacao-${result.motivacao}` },
    { title: "Impressão", number: result.impressao, key: `impressao-${result.impressao}` },
    { title: "Expressão", number: result.expressao, key: `expressao-${result.expressao}` },
    { title: "Destino", number: result.destino, key: `destino-${result.destino}` },
    { title: "Missão", number: result.missao, key: `missao-${result.missao}` },
    { title: "Número Psíquico", number: result.psiquico, key: `psiquico-${result.psiquico}` },
    { title: "Seu Anjo Cabalístico", number: null, key: "anjo" },
    { title: "Lições Cármicas", number: result.licoesCarmicas, key: "licoes-carmicas" },
    { title: "Dívidas Cármicas", number: result.dividasCarmicas, key: "dividas-carmicas" },
    { title: "Tendências Ocultas", number: result.tendenciasOcultas, key: "tendencias-ocultas" },
    { title: "Resposta Subconsciente", number: result.respostaSubconsciente, key: `resposta-subconsciente-${result.respostaSubconsciente}` },
    { title: "Ciclos de Vida", number: result.ciclosVida, key: "ciclos-vida" },
    { title: "Desafios", number: result.desafios, key: "desafios" },
    { title: "Momentos Decisivos", number: result.momentos, key: "momentos" },
    { title: "Ano Pessoal", number: result.anoPessoal, key: `ano-pessoal-${result.anoPessoal}` },
    { title: "Mês Pessoal", number: result.mesPessoal, key: `mes-pessoal-${result.mesPessoal}` },
    { title: "Dia Pessoal", number: result.diaPessoal, key: `dia-pessoal-${result.diaPessoal}` },
    { title: "Números Harmônicos", number: null, key: "numeros-harmonicos" },
    { title: "Harmonia Conjugal", number: null, key: "harmonia-conjugal" },
    { title: "Triângulo da Vida", number: null, key: "triangulo-vida" },
    { title: "Profissões Ideais", number: null, key: "profissoes" },
    { title: "Saúde e Bem-Estar", number: null, key: "saude" },
    { title: "Cores e Pedras Favoráveis", number: null, key: "correspondencias" },
    { title: "Conclusão", number: null, key: "conclusao" },
    { title: "Sumário dos Arcanos", number: null, key: "sumario-arcanos" }
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho Profissional */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-primary/5">
          <CardTitle className="text-2xl font-bold text-primary">
            MAPA NUMEROLÓGICO CABALÍSTICO COMPLETO
          </CardTitle>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Elaborado através da Numerologia Cabalística Tradicional</p>
            <p>Data de Geração: {formatDate(new Date())}</p>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
              <div><strong>Nome:</strong> {result.nome}</div>
              <div><strong>Data de Nascimento:</strong> {result.dataNascimento}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Índice Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">ÍNDICE DO MAPA NUMEROLÓGICO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <div key={section.key} className="flex justify-between items-center p-2 hover:bg-muted/50 rounded">
                <span className="font-medium">{index + 1}. {section.title}</span>
                {section.number !== null && (
                  <Badge variant="outline">
                    {Array.isArray(section.number) ? section.number.join(', ') : section.number}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seção 1: Motivação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>1. MOTIVAÇÃO {result.motivacao}</span>
            <Badge variant="default" className="text-lg px-3 py-1">{result.motivacao}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">O que você realmente deseja na vida</p>
            {texts[`motivacao-${result.motivacao}`] ? (
              <div className="whitespace-pre-line leading-relaxed">
                {texts[`motivacao-${result.motivacao}`].body}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                A Motivação {result.motivacao} representa seus desejos mais profundos e o que realmente o move na vida.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Impressão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>2. IMPRESSÃO {result.impressao}</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">{result.impressao}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">A primeira impressão que você causa</p>
            {texts[`impressao-${result.impressao}`] ? (
              <div className="whitespace-pre-line leading-relaxed">
                {texts[`impressao-${result.impressao}`].body}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                A Impressão {result.impressao} revela como as pessoas o veem no primeiro encontro.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 3: Expressão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>3. EXPRESSÃO {result.expressao}</span>
            <Badge variant="outline" className="text-lg px-3 py-1">{result.expressao}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Como você se expressa no mundo</p>
            {texts[`expressao-${result.expressao}`] ? (
              <div className="whitespace-pre-line leading-relaxed">
                {texts[`expressao-${result.expressao}`].body}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                A Expressão {result.expressao} mostra seus talentos naturais e como você se manifesta.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 4: Destino */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>4. DESTINO {result.destino}</span>
            <Badge variant="destructive" className="text-lg px-3 py-1">{result.destino}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Sua missão de vida e propósito maior</p>
            {texts[`destino-${result.destino}`] ? (
              <div className="whitespace-pre-line leading-relaxed">
                {texts[`destino-${result.destino}`].body}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                O Destino {result.destino} revela o caminho que você deve seguir nesta vida.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 5: Missão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>5. MISSÃO {result.missao}</span>
            <Badge variant="default" className="text-lg px-3 py-1">{result.missao}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Sua missão espiritual nesta encarnação</p>
            {texts[`missao-${result.missao}`] ? (
              <div className="whitespace-pre-line leading-relaxed">
                {texts[`missao-${result.missao}`].body}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                A Missão {result.missao} é o resultado da união entre sua Expressão e Destino.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 6: Número Psíquico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>6. NÚMERO PSÍQUICO {result.psiquico}</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">{result.psiquico}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Sua personalidade interna e características psíquicas</p>
            {texts[`psiquico-${result.psiquico}`] ? (
              <div className="whitespace-pre-line leading-relaxed">
                {texts[`psiquico-${result.psiquico}`].body}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                O Número Psíquico {result.psiquico} revela sua natureza interna e modo de ser.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 7: Anjo Cabalístico */}
      <Card>
        <CardHeader>
          <CardTitle>7. SEU ANJO CABALÍSTICO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2">{angel?.name || 'Anjo Protetor'}</h3>
              <Badge variant="outline" className="text-sm">{angel?.category || 'Hierarquia Celestial'}</Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium text-primary mb-2">Domínio e Proteção:</p>
                <p className="leading-relaxed">
                  {angel?.domain_description || 'Este anjo oferece proteção e orientação especial em sua jornada espiritual.'}
                </p>
              </div>
              
              {angel?.invocation_time_1 && (
                <div>
                  <p className="font-medium text-primary mb-2">Horários de Invocação:</p>
                  <p className="text-sm"><strong>Período 1:</strong> {angel.invocation_time_1}</p>
                  <p className="text-sm"><strong>Período 2:</strong> {angel.invocation_time_2}</p>
                </div>
              )}
              
              {angel?.psalm_reference && (
                <div>
                  <p className="font-medium text-primary mb-2">Salmo de Conexão:</p>
                  <p className="text-sm italic">{angel.psalm_reference}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 8: Lições Cármicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>8. LIÇÕES CÁRMICAS</span>
            <div className="flex gap-1">
              {result.licoesCarmicas?.map((licao: number) => (
                <Badge key={licao} variant="outline">{licao}</Badge>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Lições que você veio aprender nesta vida</p>
            {result.licoesCarmicas?.length > 0 ? (
              <div className="space-y-4">
                {result.licoesCarmicas.map((licao: number) => (
                  <div key={licao} className="border-l-4 border-primary/30 pl-4">
                    <h4 className="font-semibold mb-2">Lição Cármica {licao}</h4>
                    {texts[`licao-carmica-${licao}`] ? (
                      <div className="whitespace-pre-line leading-relaxed">
                        {texts[`licao-carmica-${licao}`].body}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Esta lição cármica representa uma área de crescimento importante em sua vida.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                Você não possui lições cármicas pendentes - sua alma já aprendeu essas lições.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 9: Dívidas Cármicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>9. DÍVIDAS CÁRMICAS</span>
            <div className="flex gap-1">
              {result.dividasCarmicas?.map((divida: number) => (
                <Badge key={divida} variant="destructive">{divida}</Badge>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Débitos espirituais de vidas passadas</p>
            {result.dividasCarmicas?.length > 0 ? (
              <div className="space-y-4">
                {result.dividasCarmicas.map((divida: number) => (
                  <div key={divida} className="border-l-4 border-destructive/30 pl-4">
                    <h4 className="font-semibold mb-2">Dívida Cármica {divida}</h4>
                    {texts[`divida-carmica-${divida}`] ? (
                      <div className="whitespace-pre-line leading-relaxed">
                        {texts[`divida-carmica-${divida}`].body}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Esta dívida cármica requer atenção especial e trabalho de transformação.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 font-medium">
                ✅ Você não possui dívidas cármicas pendentes - sua alma está em equilíbrio.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 10: Tendências Ocultas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>10. TENDÊNCIAS OCULTAS</span>
            <div className="flex gap-1">
              {result.tendenciasOcultas?.map((tendencia: number) => (
                <Badge key={tendencia} variant="secondary">{tendencia}</Badge>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Aspectos ocultos de sua personalidade</p>
            {result.tendenciasOcultas?.length > 0 ? (
              <div className="space-y-4">
                {result.tendenciasOcultas.map((tendencia: number) => (
                  <div key={tendencia} className="border-l-4 border-secondary/30 pl-4">
                    <h4 className="font-semibold mb-2">Tendência Oculta {tendencia}</h4>
                    {texts[`tendencia-oculta-${tendencia}`] ? (
                      <div className="whitespace-pre-line leading-relaxed">
                        {texts[`tendencia-oculta-${tendencia}`].body}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Esta tendência emerge em momentos de pressão, revelando aspectos ocultos de sua natureza.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                Suas tendências ocultas não são dominantes em sua personalidade atual.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 11: Ciclos de Vida */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>11. CICLOS DE VIDA</span>
            <div className="flex gap-1">
              {result.ciclosVida?.map((ciclo: number, index: number) => (
                <Badge key={index} variant="outline">{ciclo}</Badge>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">As três grandes fases da sua vida</p>
            {result.ciclosVida?.length === 3 && (
              <div className="space-y-6">
                <div className="border-l-4 border-blue-400/30 pl-4">
                  <h4 className="font-semibold mb-2">Primeiro Ciclo - Juventude (0-28 anos): {result.ciclosVida[0]}</h4>
                  {texts[`ciclo-vida-${result.ciclosVida[0]}`] ? (
                    <div className="whitespace-pre-line leading-relaxed">
                      {texts[`ciclo-vida-${result.ciclosVida[0]}`].body}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Período de formação e desenvolvimento da personalidade básica.
                    </p>
                  )}
                </div>

                <div className="border-l-4 border-green-400/30 pl-4">
                  <h4 className="font-semibold mb-2">Segundo Ciclo - Maturidade (28-56 anos): {result.ciclosVida[1]}</h4>
                  {texts[`ciclo-vida-${result.ciclosVida[1]}`] ? (
                    <div className="whitespace-pre-line leading-relaxed">
                      {texts[`ciclo-vida-${result.ciclosVida[1]}`].body}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Fase de realização profissional e consolidação de conquistas.
                    </p>
                  )}
                </div>

                <div className="border-l-4 border-purple-400/30 pl-4">
                  <h4 className="font-semibold mb-2">Terceiro Ciclo - Idade Avançada (56+ anos): {result.ciclosVida[2]}</h4>
                  {texts[`ciclo-vida-${result.ciclosVida[2]}`] ? (
                    <div className="whitespace-pre-line leading-relaxed">
                      {texts[`ciclo-vida-${result.ciclosVida[2]}`].body}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Período de sabedoria, reflexão e contribuição espiritual.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 12: Desafios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>12. DESAFIOS</span>
            <div className="flex gap-1">
              {result.desafios?.map((desafio: number, index: number) => (
                <Badge key={index} variant="destructive">{desafio}</Badge>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Os principais obstáculos a superar</p>
            {result.desafios?.length >= 3 && (
              <div className="space-y-4">
                <div className="border-l-4 border-orange-400/30 pl-4">
                  <h4 className="font-semibold mb-2">Primeiro Desafio: {result.desafios[0]}</h4>
                  {texts[`desafio-${result.desafios[0]}`] ? (
                    <div className="whitespace-pre-line leading-relaxed">
                      {texts[`desafio-${result.desafios[0]}`].body}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Este desafio estará presente na primeira metade da vida.
                    </p>
                  )}
                </div>

                <div className="border-l-4 border-red-400/30 pl-4">
                  <h4 className="font-semibold mb-2">Segundo Desafio: {result.desafios[1]}</h4>
                  {texts[`desafio-${result.desafios[1]}`] ? (
                    <div className="whitespace-pre-line leading-relaxed">
                      {texts[`desafio-${result.desafios[1]}`].body}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Este desafio aparece na segunda metade da vida.
                    </p>
                  )}
                </div>

                <div className="border-l-4 border-purple-600/30 pl-4">
                  <h4 className="font-semibold mb-2">Desafio Principal: {result.desafios[2]}</h4>
                  {texts[`desafio-${result.desafios[2]}`] ? (
                    <div className="whitespace-pre-line leading-relaxed">
                      {texts[`desafio-${result.desafios[2]}`].body}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Este é o desafio mais importante de toda a vida.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 13: Momentos Decisivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>13. MOMENTOS DECISIVOS</span>
            <div className="flex gap-1">
              {result.momentos?.map((momento: number, index: number) => (
                <Badge key={index} variant="outline">{momento}</Badge>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="font-medium text-primary mb-3">Os quatro momentos de maior importância em sua vida</p>
            {result.momentos?.length >= 4 && (
              <div className="space-y-4">
                {result.momentos.map((momento: number, index: number) => (
                  <div key={index} className="border-l-4 border-primary/30 pl-4">
                    <h4 className="font-semibold mb-2">
                      {index === 0 && "Primeiro"} 
                      {index === 1 && "Segundo"} 
                      {index === 2 && "Terceiro"} 
                      {index === 3 && "Quarto"} 
                      Momento Decisivo: {momento}
                    </h4>
                    {texts[`momento-decisivo-${momento}`] ? (
                      <div className="whitespace-pre-line leading-relaxed">
                        {texts[`momento-decisivo-${momento}`].body}
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Este momento traz oportunidades importantes de crescimento e transformação.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 14: Conclusão */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">24. CONCLUSÃO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none text-center">
            <p className="text-lg leading-relaxed">
              Este mapa numerológico oferece um guia completo para o autoconhecimento e desenvolvimento pessoal. 
              Use essas informações como orientação em sua jornada de crescimento espiritual e realização pessoal.
            </p>
            <Separator className="my-6" />
            <p className="text-sm text-muted-foreground">
              Elaborado através da Numerologia Cabalística Tradicional • {formatDate(new Date())}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}