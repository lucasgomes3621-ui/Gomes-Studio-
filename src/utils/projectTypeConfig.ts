import { BriefingData } from '../types';

export type ProjectType = BriefingData['tipoProjeto'];

export interface SectionOption {
  id: string;
  label: string;
  minLevel: 1 | 2 | 3;
  tierBadge?: string;
  description?: string;
}

export interface ProjectTypeConfig {
  tipo: ProjectType;
  level: 1 | 2 | 3;
  badge: string;
  tagline: string;
  shortDescription: string;
  idealPara: string;
  destaques: string[];
  // Seção 2: Identidade Visual
  secao2: {
    estilos: Array<{ nome: string; minLevel: 1 | 2 | 3; tag?: string }>;
    sugestoesCores: string[];
    notaGuia: string;
  };
  // Seção 10: Localização e Mapa
  secao10: {
    permiteMapaInterativo: boolean;
    defaultExibirMapa: 'Sim' | 'Não' | '';
    notaExplicativa: string;
    badgeStatus: string;
  };
  // Seção 13: Botões e Ações (CTAs)
  secao13: {
    botoesRecomendados: string[];
    todosBotoes: Array<{ nome: string; minLevel: 1 | 2 | 3; tag?: string; desc?: string }>;
    limiteRecomendado: string;
    notaGuia: string;
  };
  // Seção 15: Páginas e Seções
  secao15: {
    secoesRecomendadas: string[];
    todasSecoes: Array<{ nome: string; minLevel: 1 | 2 | 3; tag?: string; desc?: string }>;
    notaGuia: string;
  };
  // Outras seções relevantes
  secao6Servicos: {
    limiteRecomendado: string;
    dica: string;
  };
  secao8Agendamento: {
    canalRecomendado: string;
    dica: string;
  };
}

export const PROJECT_TYPES_CONFIG: Record<Exclude<ProjectType, ''>, ProjectTypeConfig> = {
  'Landing page essencial': {
    tipo: 'Landing page essencial',
    level: 1,
    badge: 'Presença Ágil',
    tagline: 'Rápida, direta e focada em contato imediato',
    shortDescription: 'Ideal para profissionais e negócios que precisam de uma presença digital rápida, objetiva e com foco total em mensagens diretas no WhatsApp.',
    idealPara: 'Profissionais liberais, prestadores de serviço e novos negócios.',
    destaques: [
      'Página única focada em contato',
      'Apresentação & Serviços principais',
      '100% Otimizado para celular',
    ],
    secao2: {
      estilos: [
        { nome: 'Moderno & Direto ao Ponto', minLevel: 1, tag: 'Essencial' },
        { nome: 'Minimalista & Clean', minLevel: 1, tag: 'Essencial' },
        { nome: 'Dark Cyber & Tech (Gomes Studio)', minLevel: 1, tag: 'Destaque' },
        { nome: 'Corporativo & Seguro', minLevel: 1 },
        { nome: 'Sofisticado & Elegante', minLevel: 2, tag: 'Profissional' },
      ],
      sugestoesCores: [
        'Dark Cyber (Preto & Ciano Gomes Studio)',
        'Usar as Cores da Minha Logo',
        'Azul Marinho & Branco Corporativo',
        'Verde Esmeralda & Branco Clean',
      ],
      notaGuia: 'No plano Essencial, aplicamos a identidade com alta legibilidade, contraste e velocidade máxima no celular.',
    },
    secao10: {
      permiteMapaInterativo: false,
      defaultExibirMapa: 'Não',
      notaExplicativa: 'No modelo Essencial, a localização é exibida como endereço em destaque com botão direto para rota no Google Maps. O mapa interativo dinâmico embutido é um recurso dos planos Profissional e Página Completa.',
      badgeStatus: 'Endereço + Link de Rota no Maps',
    },
    secao13: {
      botoesRecomendados: [
        'Falar no WhatsApp (Alta Conversão)',
        'Ligar Agora',
        'Como Chegar (Google Maps)',
      ],
      todosBotoes: [
        { nome: 'Falar no WhatsApp (Alta Conversão)', minLevel: 1, tag: 'Principal' },
        { nome: 'Ligar Agora', minLevel: 1, tag: 'Rápido' },
        { nome: 'Como Chegar (Google Maps)', minLevel: 1, tag: 'Rota' },
        { nome: 'Solicitar Orçamento Personalizado', minLevel: 2, tag: 'Profissional' },
        { nome: 'Agendar Horário / Consulta', minLevel: 2, tag: 'Profissional' },
        { nome: 'Ver Cardápio / Catálogo', minLevel: 2, tag: 'Profissional' },
      ],
      limiteRecomendado: 'Recomendado selecionar até 3 botões principais para evitar dispersão do cliente.',
      notaGuia: 'Foco total nas ações mais diretas que levam o cliente rapidamente para o WhatsApp ou chamada.',
    },
    secao15: {
      secoesRecomendadas: [
        'Hero / Início com Apresentação de Impacto',
        'Sobre Nós & Apresentação do Negócio',
        'Vitrine de Serviços / Produtos / Cardápio',
        'Localização, Horários & Contato Direto',
        'Botão Fixo Flutuante do WhatsApp',
      ],
      todasSecoes: [
        { nome: 'Hero / Início com Apresentação de Impacto', minLevel: 1, tag: 'Essencial', desc: 'Apresentação inicial forte com chamada clara' },
        { nome: 'Sobre Nós & Apresentação do Negócio', minLevel: 1, tag: 'Essencial', desc: 'Apresentação curta e confiável da empresa' },
        { nome: 'Vitrine de Serviços / Produtos / Cardápio', minLevel: 1, tag: 'Essencial', desc: 'Até 3 a 4 serviços principais em destaque' },
        { nome: 'Localização, Horários & Contato Direto', minLevel: 1, tag: 'Essencial', desc: 'Endereço, horários e botão de rota no Maps' },
        { nome: 'Botão Fixo Flutuante do WhatsApp', minLevel: 1, tag: 'Essencial', desc: 'Botão fixo no rodapé para contato imediato' },
        { nome: 'Diferenciais & Por Que Nos Escolher', minLevel: 2, tag: 'Profissional', desc: 'Lista de diferenciais competitivos e garantias' },
        { nome: 'Depoimentos de Clientes & Prova Social', minLevel: 2, tag: 'Profissional', desc: 'Avaliações reais de clientes para gerar autoridade' },
        { nome: 'Galeria de Fotos / Trabalhos Realizados', minLevel: 2, tag: 'Profissional', desc: 'Fotos dos seus trabalhos, estrutura ou produtos' },
        { nome: 'Localização, Horários & Mapa Interativo', minLevel: 2, tag: 'Profissional', desc: 'Mapa Google Maps interativo embutido no site' },
        { nome: 'FAQ (Perguntas Frequentes com Sanfona)', minLevel: 2, tag: 'Profissional', desc: 'Respostas para as principais dúvidas dos clientes' },
      ],
      notaGuia: 'Estrutura compacta de 4 a 5 seções vitais. Garante carregamento instantâneo e alta taxa de contato.',
    },
    secao6Servicos: {
      limiteRecomendado: 'Até 3 a 4 serviços ou produtos principais.',
      dica: 'Destaque seus carros-chefes mais procurados.',
    },
    secao8Agendamento: {
      canalRecomendado: 'Via WhatsApp Direto',
      dica: 'Agendamento direto pelo WhatsApp é o mais eficiente para este formato.',
    },
  },

  'Landing page profissional': {
    tipo: 'Landing page profissional',
    level: 2,
    badge: '⭐ Carro-Chefe Gomes Studio',
    tagline: 'Autoridade visual, vitrine detalhada e alta conversão',
    shortDescription: 'Carro-chefe da Gomes Studio. Foco em autoridade visual, vitrine detalhada de produtos/serviços, prova social estratégica e alta taxa de conversão.',
    idealPara: 'Empresas, especialistas e marcas que querem se destacar da concorrência e passar credibilidade máxima.',
    destaques: [
      'Design exclusivo & autoridade visual',
      'Vitrine de produtos ou serviços com detalhes',
      'Prova social, depoimentos & CTAs estratégicos',
      'Mapa interativo Google Maps integrado',
    ],
    secao2: {
      estilos: [
        { nome: 'Moderno & Alta Conversão', minLevel: 1, tag: '⭐ Recomendado' },
        { nome: 'Dark Cyber & Tech', minLevel: 1, tag: 'Gomes Studio' },
        { nome: 'Sofisticado & Elegante', minLevel: 2, tag: 'Alta Autoridade' },
        { nome: 'Minimalista & Clean', minLevel: 1 },
        { nome: 'Corporativo & Seguro', minLevel: 1 },
      ],
      sugestoesCores: [
        'Dark Cyber (Preto & Ciano Gomes Studio)',
        'Preto & Dourado Premium',
        'Azul Marinho & Branco Corporativo',
        'Verde Esmeralda & Branco Clean',
        'Usar as Cores da Minha Logo',
      ],
      notaGuia: 'No plano Profissional, o design é milimetricamente alinhado com contraste, micro-interações e autoridade da sua marca.',
    },
    secao10: {
      permiteMapaInterativo: true,
      defaultExibirMapa: 'Sim',
      notaExplicativa: 'Mapa interativo do Google Maps totalmente disponível e embutido no layout do site, permitindo zoom, navegação e rota direta.',
      badgeStatus: '✓ Mapa Interativo Google Maps Incluso',
    },
    secao13: {
      botoesRecomendados: [
        'Falar no WhatsApp (Alta Conversão)',
        'Solicitar Orçamento Personalizado',
        'Agendar Horário / Consulta via WhatsApp',
        'Ver Cardápio / Catálogo em PDF ou Link',
        'Como Chegar (Google Maps)',
        'Ligar Agora',
      ],
      todosBotoes: [
        { nome: 'Falar no WhatsApp (Alta Conversão)', minLevel: 1, tag: 'Principal' },
        { nome: 'Solicitar Orçamento Personalizado', minLevel: 2, tag: 'Conversão' },
        { nome: 'Agendar Horário / Consulta via WhatsApp', minLevel: 2, tag: 'Agendamento' },
        { nome: 'Ver Cardápio / Catálogo em PDF ou Link', minLevel: 2, tag: 'Vitrine' },
        { nome: 'Como Chegar (Google Maps)', minLevel: 1, tag: 'Localização' },
        { nome: 'Ligar Agora', minLevel: 1, tag: 'Chamada' },
        { nome: 'Ver Depoimentos / Avaliações', minLevel: 2, tag: 'Prova Social' },
      ],
      limiteRecomendado: 'Distribuição estratégica de CTAs ao longo da rolagem da página.',
      notaGuia: 'Permite capturar o visitante em diferentes momentos de interesse enquanto ele consome a página.',
    },
    secao15: {
      secoesRecomendadas: [
        'One Page Contínua (Design Exclusivo Gomes Studio)',
        'Hero / Início com Apresentação de Impacto',
        'Sobre Nós & Apresentação do Negócio',
        'Vitrine de Serviços / Produtos / Cardápio',
        'Diferenciais & Por Que Nos Escolher',
        'Depoimentos de Clientes & Prova Social',
        'Galeria de Fotos / Trabalhos Realizados',
        'Localização, Horários & Mapa Interativo',
        'Botão Fixo Flutuante do WhatsApp',
      ],
      todasSecoes: [
        { nome: 'One Page Contínua (Design Exclusivo Gomes Studio)', minLevel: 2, tag: 'Padrão Studio', desc: 'Fluxo contínuo sem quebras de navegação' },
        { nome: 'Hero / Início com Apresentação de Impacto', minLevel: 1, tag: 'Essencial', desc: 'Headline chamativa, promessa clara e botão principal' },
        { nome: 'Sobre Nós & Apresentação do Negócio', minLevel: 1, tag: 'Essencial', desc: 'História, credibilidade e propósito da sua marca' },
        { nome: 'Vitrine de Serviços / Produtos / Cardápio', minLevel: 1, tag: 'Essencial', desc: 'Apresentação detalhada com descrições e benefícios' },
        { nome: 'Diferenciais & Por Que Nos Escolher', minLevel: 2, tag: 'Profissional', desc: 'Pontos fortes que eliminam a concorrência' },
        { nome: 'Depoimentos de Clientes & Prova Social', minLevel: 2, tag: 'Profissional', desc: 'Depoimentos e avaliações 5 estrelas' },
        { nome: 'Galeria de Fotos / Trabalhos Realizados', minLevel: 2, tag: 'Profissional', desc: 'Portfólio visual com fotos de alta qualidade' },
        { nome: 'Localização, Horários & Mapa Interativo', minLevel: 2, tag: 'Profissional', desc: 'Mapa Google Maps embutido no site' },
        { nome: 'FAQ (Perguntas Frequentes com Sanfona)', minLevel: 2, tag: 'Profissional', desc: 'Elimina as principais dúvidas antes do contato' },
        { nome: 'Botão Fixo Flutuante do WhatsApp', minLevel: 1, tag: 'Essencial', desc: 'Visível em qualquer ponto da rolagem' },
      ],
      notaGuia: 'Estrutura completa com 8 a 9 blocos estratégicos. É o formato mais vendido e eficaz da Gomes Studio.',
    },
    secao6Servicos: {
      limiteRecomendado: 'Até 6 a 8 itens detalhados com descrição e diferenciais.',
      dica: 'Permite cards com títulos, parágrafos explicativos e valores/orçamentos.',
    },
    secao8Agendamento: {
      canalRecomendado: 'WhatsApp Direto ou Formulário Integrado',
      dica: 'Combina botão direto no WhatsApp com opção de agendador online se desejar.',
    },
  },

  'Pagina completa profissional': {
    tipo: 'Pagina completa profissional',
    level: 3,
    badge: 'Institucional Completo',
    tagline: 'Arquitetura expansiva, multisseções e presença corporativa',
    shortDescription: 'Website institucional completo para empresas que necessitam de navegação estruturada, catálogo robusto e presença corporativa de alto nível.',
    idealPara: 'Empresas consolidadas, clínicas, indústrias, imobiliárias e escritórios de grande porte.',
    destaques: [
      'Estrutura corporativa profunda',
      'Múltiplas seções ou páginas dedicadas',
      'FAQ avançado, mapa interativo e contatos',
      'Políticas de Privacidade e conformidade LGPD',
    ],
    secao2: {
      estilos: [
        { nome: 'Corporativo & Seguro', minLevel: 1, tag: 'Institucional' },
        { nome: 'Moderno & Alta Conversão', minLevel: 1 },
        { nome: 'Dark Cyber & Tech', minLevel: 1, tag: 'Gomes Studio' },
        { nome: 'Sofisticado & Elegante', minLevel: 2 },
        { nome: 'Minimalista & Clean', minLevel: 1 },
        { nome: 'Institucional Premium / Portal', minLevel: 3, tag: 'Completo' },
      ],
      sugestoesCores: [
        'Azul Marinho & Branco Corporativo',
        'Dark Cyber (Preto & Ciano Gomes Studio)',
        'Preto & Dourado Premium',
        'Verde Esmeralda & Branco Clean',
        'Usar as Cores da Minha Logo',
      ],
      notaGuia: 'No plano Completo, a identidade é tratada com rigor corporativo, mantendo unidade entre todas as seções e páginas.',
    },
    secao10: {
      permiteMapaInterativo: true,
      defaultExibirMapa: 'Sim',
      notaExplicativa: 'Mapa interativo do Google Maps incluso com suporte para endereço principal, rotas integradas e múltiplas unidades se aplicável.',
      badgeStatus: '✓ Mapa Interativo Corporativo Incluso',
    },
    secao13: {
      botoesRecomendados: [
        'Falar no WhatsApp (Alta Conversão)',
        'Solicitar Orçamento Personalizado',
        'Agendar Horário / Consulta via WhatsApp',
        'Ver Cardápio / Catálogo em PDF ou Link',
        'Como Chegar (Google Maps)',
        'Ligar Agora',
        'Solicitar Proposta Comercial / B2B via WhatsApp',
      ],
      todosBotoes: [
        { nome: 'Falar no WhatsApp (Alta Conversão)', minLevel: 1, tag: 'Principal' },
        { nome: 'Solicitar Orçamento Personalizado', minLevel: 2, tag: 'Comercial' },
        { nome: 'Agendar Horário / Consulta via WhatsApp', minLevel: 2, tag: 'Agendamento' },
        { nome: 'Ver Cardápio / Catálogo em PDF ou Link', minLevel: 2, tag: 'Produtos' },
        { nome: 'Como Chegar (Google Maps)', minLevel: 1, tag: 'Localização' },
        { nome: 'Ligar Agora', minLevel: 1, tag: 'Chamada' },
        { nome: 'Solicitar Proposta Comercial / B2B via WhatsApp', minLevel: 3, tag: 'Institucional' },
        { nome: 'Falar com Atendimento / Recepção', minLevel: 3, tag: 'Institucional' },
      ],
      limiteRecomendado: 'Ecossistema completo de CTAs diretos para WhatsApp, chamada ou rota.',
      notaGuia: 'Cobre desde leads rápidos de WhatsApp até solicitações formais de orçamento e propostas.',
    },
    secao15: {
      secoesRecomendadas: [
        'Menu Superior de Navegação Completo',
        'Hero / Início com Apresentação de Impacto',
        'Sobre Nós & Apresentação do Negócio',
        'Vitrine de Serviços / Produtos / Cardápio',
        'Diferenciais & Por Que Nos Escolher',
        'Depoimentos de Clientes & Prova Social',
        'Galeria de Fotos / Trabalhos Realizados',
        'Localização, Horários & Mapa Interativo',
        'FAQ (Perguntas Frequentes com Sanfona)',
        'Página ou Seção Dedicada de Contato & Mapa Ampliado',
        'Rodapé Institucional Completo com Dados da Empresa',
        'Botão Fixo Flutuante do WhatsApp',
      ],
      todasSecoes: [
        { nome: 'Menu Superior de Navegação Completo', minLevel: 3, tag: 'Institucional', desc: 'Menu fixo ou retrátil com links para cada seção' },
        { nome: 'Hero / Início com Apresentação de Impacto', minLevel: 1, tag: 'Essencial', desc: 'Apresentação visual marcante com título forte' },
        { nome: 'Sobre Nós & Apresentação do Negócio', minLevel: 1, tag: 'Essencial', desc: 'História, credibilidade e propósito da sua marca' },
        { nome: 'Vitrine de Serviços / Produtos / Cardápio', minLevel: 1, tag: 'Essencial', desc: 'Apresentação estruturada dos serviços ou linhas de produtos' },
        { nome: 'Diferenciais & Por Que Nos Escolher', minLevel: 2, tag: 'Profissional', desc: 'Destaques e garantias que reforçam a autoridade' },
        { nome: 'Depoimentos de Clientes & Prova Social', minLevel: 2, tag: 'Profissional', desc: 'Depoimentos reais para transmitir confiança imediata' },
        { nome: 'Galeria de Fotos / Trabalhos Realizados', minLevel: 2, tag: 'Profissional', desc: 'Fotos dos trabalhos, instalações ou produtos' },
        { nome: 'Localização, Horários & Mapa Interativo', minLevel: 2, tag: 'Profissional', desc: 'Mapa Google Maps interativo com rota direta' },
        { nome: 'FAQ (Perguntas Frequentes com Sanfona)', minLevel: 2, tag: 'Profissional', desc: 'Sanfona com respostas às perguntas mais comuns' },
        { nome: 'Página ou Seção Dedicada de Contato & Mapa Ampliado', minLevel: 3, tag: 'Institucional', desc: 'Área com dados completos, rota e formulário/WhatsApp' },
        { nome: 'Catálogo de Serviços / Produtos com Filtros por Categorias', minLevel: 3, tag: 'Institucional', desc: 'Navegação por categorias de produtos ou especialidades' },
        { nome: 'Rodapé Institucional Completo com Dados da Empresa', minLevel: 3, tag: 'Institucional', desc: 'Dados fiscais, endereço, direitos autorais e links úteis' },
        { nome: 'Botão Fixo Flutuante do WhatsApp', minLevel: 1, tag: 'Essencial', desc: 'Atendimento prioritário em tempo real' },
      ],
      notaGuia: 'Website institucional multi-seções de alta autoridade. Entrega arquitetura corporativa limpa, profissional e 100% executável pela Gomes Studio.',
    },
    secao6Servicos: {
      limiteRecomendado: 'Catálogo completo sem limites rígidos, categorizado.',
      dica: 'Estruturação por departamentos, especialidades ou linhas de produtos.',
    },
    secao8Agendamento: {
      canalRecomendado: 'Múltiplos canais: WhatsApp, Formulário Corporativo e Calendário',
      dica: 'Flexibilidade para diferentes perfis de clientes e parceiros.',
    },
  },
};

export function getPlanConfig(tipo: ProjectType): ProjectTypeConfig {
  if (!tipo || !PROJECT_TYPES_CONFIG[tipo as Exclude<ProjectType, ''>]) {
    return PROJECT_TYPES_CONFIG['Landing page profissional'];
  }
  return PROJECT_TYPES_CONFIG[tipo as Exclude<ProjectType, ''>];
}

export function getPlanLevel(tipo: ProjectType): 1 | 2 | 3 {
  const config = getPlanConfig(tipo);
  return config.level;
}

export function getTierRequiredName(minLevel: 1 | 2 | 3): string {
  if (minLevel === 3) return 'Página Completa';
  if (minLevel === 2) return 'Plano Profissional';
  return 'Plano Essencial';
}

/**
 * Master catalog of all sections with required plan tiers.
 * Aligned strictly with Gomes Studio capabilities (Landing Page Profissional, Institucional, etc.).
 * Unrealistic/complex features (Blog/Notícias periódico, LGPD jurídica avançada, área de ouvidoria)
 * have been refined or removed so we don't promise what cannot be delivered.
 */
export const MASTER_SECTIONS_CATALOG: Array<{
  nome: string;
  minLevel: 1 | 2 | 3;
  tag?: string;
  desc?: string;
}> = [
  // Nível 1 - Essencial
  { nome: 'Hero / Início com Apresentação de Impacto', minLevel: 1, tag: 'Essencial', desc: 'Apresentação inicial forte com chamada clara' },
  { nome: 'Sobre Nós & Apresentação do Negócio', minLevel: 1, tag: 'Essencial', desc: 'História, credibilidade e propósito da sua marca' },
  { nome: 'Vitrine de Serviços / Produtos / Cardápio', minLevel: 1, tag: 'Essencial', desc: 'Apresentação direta dos serviços ou produtos principais' },
  { nome: 'Localização, Horários & Contato Direto', minLevel: 1, tag: 'Essencial', desc: 'Endereço, horários de funcionamento e botão de rota direta' },
  { nome: 'Botão Fixo Flutuante do WhatsApp', minLevel: 1, tag: 'Essencial', desc: 'Botão sempre visível no canto da tela para contato imediato' },

  // Nível 2 - Profissional (Carro-Chefe Gomes Studio)
  { nome: 'One Page Contínua (Design Exclusivo Gomes Studio)', minLevel: 2, tag: '⭐ Carro-Chefe', desc: 'Estrutura contínua fluida com alta conversão e micro-interações' },
  { nome: 'Diferenciais & Por Que Nos Escolher', minLevel: 2, tag: '⭐ Profissional', desc: 'Pontos fortes e motivos para o cliente escolher sua empresa' },
  { nome: 'Depoimentos de Clientes & Prova Social', minLevel: 2, tag: '⭐ Profissional', desc: 'Avaliações reais e depoimentos para gerar confiança e autoridade' },
  { nome: 'Galeria de Fotos / Trabalhos Realizados', minLevel: 2, tag: '⭐ Profissional', desc: 'Fotos dos seus trabalhos, estrutura física ou produtos em destaque' },
  { nome: 'Localização, Horários & Mapa Interativo', minLevel: 2, tag: '⭐ Profissional', desc: 'Mapa Google Maps interativo embutido diretamente na página' },
  { nome: 'FAQ (Perguntas Frequentes com Sanfona)', minLevel: 2, tag: '⭐ Profissional', desc: 'Perguntas e respostas dinâmicas sanfonadas para tirar dúvidas comuns' },

  // Nível 3 - Completo (Institucional Multi-Páginas / Seções Expandidas)
  { nome: 'Menu Superior de Navegação Completo', minLevel: 3, tag: 'Institucional', desc: 'Menu com links rápidos para rolar ou navegar entre todas as seções' },
  { nome: 'Página ou Seção Dedicada de Contato & Mapa Ampliado', minLevel: 3, tag: 'Institucional', desc: 'Área exclusiva para dados de atendimento, rota e mapa expandido' },
  { nome: 'Catálogo de Serviços / Produtos com Filtros por Categorias', minLevel: 3, tag: 'Institucional', desc: 'Divisão organizada em abas ou categorias para facilitar a busca' },
  { nome: 'Rodapé Institucional Completo com Dados da Empresa', minLevel: 3, tag: 'Institucional', desc: 'CNPJ, endereço completo, direitos autorais e links de contato' },
];

/**
 * Master catalog of all buttons with required plan tiers.
 * Aligned with real front-end actions achievable by Gomes Studio.
 */
export const MASTER_BUTTONS_CATALOG: Array<{
  nome: string;
  minLevel: 1 | 2 | 3;
  tag?: string;
  desc?: string;
}> = [
  // Nível 1 - Essencial
  { nome: 'Falar no WhatsApp (Alta Conversão)', minLevel: 1, tag: 'Essencial', desc: 'Abre conversa com mensagem inicial personalizada no WhatsApp' },
  { nome: 'Ligar Agora', minLevel: 1, tag: 'Essencial', desc: 'Inicia chamada telefônica direta no celular do visitante' },
  { nome: 'Como Chegar (Google Maps)', minLevel: 1, tag: 'Essencial', desc: 'Abre trajeto direto no aplicativo do Google Maps ou Waze' },

  // Nível 2 - Profissional
  { nome: 'Solicitar Orçamento Personalizado', minLevel: 2, tag: '⭐ Profissional', desc: 'Direciona para WhatsApp com dados para orçamento sob medida' },
  { nome: 'Agendar Horário / Consulta via WhatsApp', minLevel: 2, tag: '⭐ Profissional', desc: 'Encaminha para agendamento de atendimento ou consulta' },
  { nome: 'Ver Cardápio / Catálogo em PDF ou Link', minLevel: 2, tag: '⭐ Profissional', desc: 'Abre catálogo, cardápio digital ou tabela de serviços' },
  { nome: 'Ver Depoimentos / Avaliações', minLevel: 2, tag: '⭐ Profissional', desc: 'Rola a página suavemente até a seção de avaliações de clientes' },

  // Nível 3 - Completo
  { nome: 'Solicitar Proposta Comercial / B2B via WhatsApp', minLevel: 3, tag: 'Institucional', desc: 'Encaminha solicitação de atendimento corporativo' },
  { nome: 'Falar com Atendimento / Recepção', minLevel: 3, tag: 'Institucional', desc: 'Botão de contato com a equipe de recepção ou vendas' },
];

/**
 * Master catalog of visual styles with required plan tiers.
 * Directly grounded on the aesthetics demonstrated on the Gomes Studio site.
 */
export const MASTER_STYLES_CATALOG: Array<{
  nome: string;
  minLevel: 1 | 2 | 3;
  tag?: string;
}> = [
  // Nível 1 - Essencial
  { nome: 'Dark Cyber & Tech (Identidade Gomes Studio)', minLevel: 1, tag: 'Gomes Studio' },
  { nome: 'Moderno & Alta Conversão', minLevel: 1, tag: 'Essencial' },
  { nome: 'Minimalista & Clean', minLevel: 1, tag: 'Essencial' },
  { nome: 'Impactante & Forte', minLevel: 1, tag: 'Essencial' },

  // Nível 2 - Profissional
  { nome: 'Sofisticado & Elegante', minLevel: 2, tag: '⭐ Profissional' },
  { nome: 'Corporativo & Seguro', minLevel: 2, tag: '⭐ Profissional' },
  { nome: 'Clean & Médico / Saúde / Estética', minLevel: 2, tag: '⭐ Profissional' },
  { nome: 'Aconchegante & Comercial', minLevel: 2, tag: '⭐ Profissional' },

  // Nível 3 - Completo
  { nome: 'Institucional Premium Multi-Seções', minLevel: 3, tag: 'Institucional' },
];

/**
 * Sanitizes existing user selections when switching plans.
 * IMPORTANT: NEVER auto-checks any option! The client marks what they choose.
 * Only prunes (removes) options that exceed the new plan level.
 */
export function sanitizeSelectionsForPlan(
  prev: BriefingData,
  newPlan: Exclude<ProjectType, ''>
): BriefingData {
  const newLevel = getPlanLevel(newPlan);

  // Preserve user's manual selections, but remove any that exceed the new plan's level
  const filteredPages = (prev.paginasSite?.selecionadas || []).filter((pageName) => {
    const sec = MASTER_SECTIONS_CATALOG.find((s) => s.nome === pageName);
    return sec ? sec.minLevel <= newLevel : true;
  });

  const filteredButtons = (prev.botoesAcoes?.selecionados || []).filter((btnName) => {
    const btn = MASTER_BUTTONS_CATALOG.find((b) => b.nome === btnName);
    return btn ? btn.minLevel <= newLevel : true;
  });

  const filteredStyles = (prev.identidadeVisual?.estiloSite || []).filter((styleName) => {
    const sty = MASTER_STYLES_CATALOG.find((s) => s.nome === styleName);
    return sty ? sty.minLevel <= newLevel : true;
  });

  // If new plan is Essencial and map was 'Sim', reset to 'Não'
  let nextExibirMapa = prev.localizacao?.exibirMapa;
  if (newLevel === 1 && nextExibirMapa === 'Sim') {
    nextExibirMapa = 'Não';
  }

  return {
    ...prev,
    tipoProjeto: newPlan,
    localizacao: {
      ...prev.localizacao,
      exibirMapa: nextExibirMapa,
    },
    paginasSite: {
      ...prev.paginasSite,
      selecionadas: filteredPages,
    },
    botoesAcoes: {
      ...prev.botoesAcoes,
      selecionados: filteredButtons,
    },
    identidadeVisual: {
      ...prev.identidadeVisual,
      estiloSite: filteredStyles,
    },
  };
}

/**
 * Kept for backward compatibility, delegates strictly to sanitizeSelectionsForPlan
 * to ensure NO automatic marking occurs.
 */
export function applyPlanPreset(
  prev: BriefingData,
  newPlan: Exclude<ProjectType, ''>
): BriefingData {
  return sanitizeSelectionsForPlan(prev, newPlan);
}
