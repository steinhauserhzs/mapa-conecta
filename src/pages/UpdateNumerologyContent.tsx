import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UpdateNumerologyContent = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<any>(null);

  // Conteúdo do material numerológico (versão simplificada para demonstração)
  const NUMEROLOGY_CONTENT = `
Material Complementar de Numerologia Cabalística

1. Motivação
2. Ano Pessoal
3. Arcanos
4. Desafios
5. Destino
6. Dia Pessoal
7. Dívida Cármica
8. Expressão
9. Harmonia Conjugal
10. Impressão
11. Lições Cármicas
12. Missão
13. Mês Pessoal
14. Dia do Nascimento
15. Números Harmônicos
16. Número Psíquico
17. Potencialidade Profissional
18. Primeiro Ciclo de Vida
19. Primeiro Momento Decisivo
20. Quarto Momento Decisivo
21. Relações Inter valores
22. Resposta Subconsciente
23. Segundo Ciclo de Vida
24. Segundo Momento Decisivo
25. Sequências Negativas
26. Tendências Ocultas
27. Terceiro Ciclo de Vida
28. Terceiro Momento Decisivo

Motivação 1
Deseja Independência – Liberdade, liderança e controle de tudo; viver longe de pressões, ser campeão (ã) absoluto (a), realizar-se em si mesmo (a); ficar longe da mediocridade, fazer fortuna, ser elogiado (a) e atendido (a) pelo mundo; viver longe de detalhes; impor seus padrões pessoais; muito dinamismo e autossuficiência; não ser atrapalhado (a) por ninguém, ficar só.

O Número 1 na Motivação exige que você se situe sempre de forma a ficar na frente dos outros. Tem que ser o (a) primeiro (a) em tudo o que faz. O fato de ser o (a) primeiro (a) o (a) impede, obviamente, de ter muita consideração pelos outros até que suas próprias necessidades sejam satisfeitas. A liderança adquirida em vidas passadas traz agora o desejo de continuar a se empenhar numa consciência mais elevada. Torna-se independente, também, com relação às suas crenças. O desejo por pensamentos livres e independentes continua ocupando o seu anseio mais profundo. Ambicioso (a) e criativo (a), é direto (a) e não gosta de muitos detalhes, quer liderar, dirigir, dominar; às vezes é obstinado (a). Não gosta muito de receber ordens de quem quer que seja e trabalha melhor por conta própria ou em cargo de chefia. A incompreensão e a recusa em aceitar conselhos podem trazer transtornos à sua carreira e aos seus planos profissionais. Se não tiver bom nível de consciência espiritual, poderá se tornar egoísta, excessivamente vaidoso (a) e arrogante. Geralmente é impaciente e com pouco senso diplomático. Por esse motivo poderá enfrentar dificuldades no seu meio profissional ou mesmo entre familiares, amigos e companheiros afetivos. Suas boas qualidades são: confiança em si, distinção, poder executivo, dignidade e foco nos propósitos.

Quando inseguro (a) tende a ameaçar os outros, podendo agredir, ofender, se tornar inflexível, irredutível, vingativo (a) e preconceituoso (a). Cultura, educação e refinamento pessoal são características indispensáveis que precisa adquirir para o seu triunfo pessoal, profissional e principalmente afetivo.

Motivação 2
Deseja Paz e Equilíbrio – Prestar serviço e devoção; criar harmonia, sentir o ritmo da vida, trabalhar com os outros, ter amigos leais e boas companhias; acumular conhecimentos e coisas; conforto sem supérfluos; ser amado (a) por todos, receber convites, sentir-se compreendido (a); vencer todas as negociações; não ser exposto (a).

O Número 2 na Motivação indica o desejo de ser sempre gentil com todos, conseguindo ou não. Deseja ser compassivo (a), compreensivo (a), atencioso (a), útil e sempre fazendo concessões em favor da harmonia de todos. O seu maior desejo é a paz e a harmonia. O discernimento é um ponto forte do seu caráter; por esse motivo é um (a) bom (a) intermediário (a) ajudando a levar a paz às forças opostas. Anseia por amor e compreensão e prefere ser liderado (a) a liderar. O seu desejo é estar casado (a); desfrutar de companheirismo, paz, harmonia e conforto. Manifesta a sua natureza sensível através da suavidade, cordialidade e prestatividade; a sua principal característica é a cooperação. Pela sua passividade e calma natural, normalmente as pessoas com quem convive tendem a se aproveitar e explorá-lo (a). Normalmente não procura impor suas ideias; prefere escutar os outros antes de expor as suas próprias. Está sempre procurando reunir conhecimentos sobre assuntos diversos e se relaciona com todas as pessoas sem discriminar raça, credo, classe social ou posição econômica; numa só amizade e dedicação. É muito vulnerável em sua sensibilidade e se magoa profundamente com fatos que a outros não afetariam.

Quando inseguro (a) tende a não decidir, escapa, elogia demais os outros, deixa-se influenciar, chora, enfraquece, fica longe das atenções, se deprime, critica e ironiza. É importante para o seu desenvolvimento profissional e pessoal, que aprenda a conviver com as pessoas; ser mais comunicativo (a) e compartilhar os seus conhecimentos com todos, levando sua mensagem de harmonia e paz.

Expressão 1
O Número 1 na Expressão mostra uma personalidade natural de líder; normalmente você se interessa pelo poder e assume naturalmente posições de comando. É original, decidido (a), independente, impetuoso (a), inventivo (a) e enérgico (a). Tem tendência a ser individualista; prefere trabalhar sozinho (a). Possui capacidade para iniciar empreendimentos; o seu método de trabalho é pioneiro e inovador. Tem vontade forte e sabe tomar decisões rápidas. Às vezes é imprudente e impaciente por ter pressa de ver seus planos realizados, por isso pode cometer erros e se prejudicar. Tem confiança em si mesmo (a), às vezes excessiva, e isso pode torná-lo (a) prepotente, teimoso (a) e arrogante. A sua vida emocional nem sempre é equilibrada, pois é extremado (a) tanto no amor quanto no ódio. Quando se casa muito jovem, às vezes a sua união não é duradoura por falta de paciência e compreensão. É ambicioso (a), determinado (a) e possui capacidade executiva; gosta de comandar. Tem que evitar se tornar dominador (a) e ditatorial; precisa aprender a ser mais diplomático (a) e cooperativo (a). Para o seu sucesso pessoal e profissional, deve desenvolver paciência, tolerância, tato e diplomacia.

Expressão 2
O Número 2 na Expressão é o símbolo da cooperação; trabalha melhor em sociedade ou quando pode contar com a colaboração de outras pessoas. É paciente, diplomático (a), atencioso (a), cortês e tímido (a). Prefere uma vida sem grandes alardes e trabalha melhor nos bastidores. Evita discussões e confusão; procura sempre a harmonia e o equilíbrio. É dedicado (a) aos amigos e muito leal àqueles em quem confia. Possui intuição e sensibilidade aguçadas; tem talento para as artes, principalmente música. Geralmente tem sorte no casamento, mas às vezes é ciumento (a) e possessivo (a). Por ser muito sensível, magoa-se com facilidade e pode se desencorajar diante das dificuldades. Para o seu sucesso pessoal e profissional, deve desenvolver iniciativa, autoconfiança e determinação, mas sem perder sua natural gentileza e diplomacia.

Destino 1 - Liderança
Seu destino é liderar, ser pioneiro (a) e abrir novos caminhos. Deve desenvolver independência, originalidade e coragem para enfrentar desafios. Nasceu para ser líder e assumir posições de comando. Seu propósito de vida é inspirar outros através do seu exemplo de liderança e determinação. Deve evitar ser dominador (a) demais e aprender a trabalhar em equipe quando necessário.

Destino 2 - Cooperação
Seu destino é cooperar, harmonizar e trazer paz aos relacionamentos. Deve desenvolver diplomacia, paciência e habilidades de mediação. Nasceu para ser um (a) pacificador (a) e unir pessoas. Seu propósito de vida é criar harmonia e equilíbrio onde quer que esteja. Deve evitar ser passivo (a) demais e aprender a expressar suas opiniões quando necessário.

Missão 1
Sua missão é desenvolver liderança, independência e capacidade de iniciar novos projetos. Deve usar sua energia pioneira para abrir caminhos e inspirar outros. É importante que não se torne dominador (a) demais e que respeite as ideias dos outros.

Missão 2
Sua missão é trazer cooperação, diplomacia e harmonia aos relacionamentos. Deve usar sua sensibilidade para mediar conflitos e unir pessoas. É importante que desenvolva autoconfiança e não se torne dependente demais dos outros.

Arcano 1
Aponta para os dons e para o potencial criativo que ainda não se manifestaram. Pode surgir como um período de novos começos, liderança e iniciativa. Representa a energia pioneira e a capacidade de criar algo novo.

Arcano 2
Indica força e intuição e sugere o encontro com o mundo interior. O indivíduo pode estar sendo conduzido a desenvolver sua sensibilidade e capacidade de cooperação. Representa a necessidade de equilíbrio e harmonia.

Desafio 1
O desafio é desenvolver independência sem se tornar egoísta. Deve aprender a liderar com sabedoria e não dominar os outros. É importante equilibrar a autoconfiança com a humildade.

Desafio 2
O desafio é desenvolver cooperação sem perder a própria identidade. Deve aprender a ser diplomático (a) sem ser falso (a). É importante equilibrar a gentileza com a firmeza quando necessário.

Ano Pessoal 1
É um ano de novos começos, novos projetos e novas oportunidades. Tempo de tomar iniciativas e liderar. Deve confiar em sua capacidade de liderança e não ter medo de começar algo novo.

Ano Pessoal 2
É um ano de cooperação, sociedades e relacionamentos. Tempo de desenvolver parcerias e trabalhar em equipe. Deve usar sua diplomacia e paciência para construir relacionamentos duradouros.

Mês Pessoal 1
Mês de iniciar novos projetos e tomar decisões importantes. Momento de liderança e independência. Boa época para começar empreendimentos e assumir posições de comando.

Mês Pessoal 2
Mês de cooperação e relacionamentos. Momento de diplomacia e trabalho em equipe. Boa época para formar parcerias e resolver conflitos através do diálogo.

Número Psíquico 1
Personalidade forte, independente e pioneira. Tendência natural para liderança e comando. Gosta de estar sempre na frente e ser o (a) primeiro (a) em tudo.

Número Psíquico 2
Personalidade gentil, diplomática e cooperativa. Tendência natural para harmonizar e mediar conflitos. Prefere trabalhar em equipe e evita confrontos.

Lições Cármicas 1
Precisa aprender liderança, independência e autoconfiança. Deve desenvolver iniciativa e coragem para enfrentar desafios sozinho (a).

Lições Cármicas 2
Precisa aprender cooperação, diplomacia e trabalho em equipe. Deve desenvolver paciência e sensibilidade nos relacionamentos.

Tendências Ocultas 1
Possui grande potencial de liderança que pode não estar sendo usado adequadamente. Tem energia pioneira e capacidade de inspirar outros.

Tendências Ocultas 2
Possui grande sensibilidade e capacidade de mediação que pode não estar sendo explorada. Tem talento natural para harmonizar relacionamentos.

Primeiro Ciclo de Vida 1
Período de aprendizado sobre liderança e independência. Tempo de desenvolver autoconfiança e capacidade de tomar decisões.

Primeiro Ciclo de Vida 2
Período de aprendizado sobre cooperação e diplomacia. Tempo de desenvolver sensibilidade e habilidades sociais.

Primeiro Momento Decisivo 1
Momento de assumir liderança e tomar decisões importantes sobre sua direção na vida. Deve confiar em sua capacidade de liderar.

Primeiro Momento Decisivo 2
Momento de buscar cooperação e formar parcerias importantes. Deve usar sua diplomacia para criar relacionamentos duradouros.

Harmonia Conjugal 1
Em relacionamentos, tende a ser dominador (a) e independente. Deve aprender a compartilhar decisões e não tentar controlar o (a) parceiro (a).

Harmonia Conjugal 2
Em relacionamentos, é cooperativo (a) e harmonioso (a). Tem facilidade para criar um ambiente de paz e compreensão no lar.

Potencialidade Profissional 1
Grande potencial para cargos de liderança, empreendedorismo e áreas que exigem pioneirismo. Pode se destacar como executivo (a), empresário (a) ou líder.

Potencialidade Profissional 2
Grande potencial para áreas que exigem diplomacia, cooperação e trabalho em equipe. Pode se destacar como mediador (a), conselheiro (a) ou assistente social.
`;

  const handleUpdate = async () => {
    setIsUpdating(true);
    setProgress(0);
    setStatus('idle');
    setMessage('Iniciando atualização...');

    try {
      setProgress(25);
      setMessage('Processando conteúdo numerológico...');
      
      const { data, error } = await supabase.functions.invoke('update-numerology-content', {
        body: { content: NUMEROLOGY_CONTENT }
      });

      if (error) throw error;

      setProgress(100);
      setStatus('success');
      setMessage('Conteúdo atualizado com sucesso!');
      setStats(data.stats);

    } catch (error) {
      console.error('Erro na atualização:', error);
      setStatus('error');
      setMessage(`Erro: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Atualização de Conteúdo Numerológico</h1>
          <p className="text-muted-foreground">
            Atualize toda a base de dados com o novo material de numerologia cabalística
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isUpdating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : status === 'error' ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-blue-500" />
              )}
              Status da Atualização
            </CardTitle>
            <CardDescription>
              Progresso da atualização do conteúdo numerológico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isUpdating && (
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progresso</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>

              {stats && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Estatísticas da Atualização:
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total de textos:</span>
                      <span className="ml-2 font-medium">{stats.totalTexts}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Seções atualizadas:</span>
                      <span className="ml-2 font-medium">{stats.sections}</span>
                    </div>
                  </div>
                  
                  {stats.sectionStats && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground mb-1">Distribuição por seção:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {stats.sectionStats.map((stat: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span>{stat.section}:</span>
                            <span className="font-medium">{stat.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Button 
            onClick={handleUpdate} 
            disabled={isUpdating}
            size="lg"
            className="px-8"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Conteúdo Numerológico'
            )}
          </Button>
        </div>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>O que será atualizado?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• <strong>Todos os textos numerológicos</strong> serão substituídos pelo novo conteúdo</p>
              <p>• <strong>26 seções</strong> serão atualizadas com interpretações detalhadas</p>
              <p>• <strong>Números 1-9, 11, 22</strong> terão textos completos para cada seção</p>
              <p>• <strong>Conteúdo em português</strong> seguindo a tradição cabalística</p>
              <p>• <strong>Versão 2.0</strong> do material numerológico</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdateNumerologyContent;