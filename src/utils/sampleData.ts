import { BriefingData } from '../types';

export const sampleBriefingData: BriefingData = {
  tipoProjeto: 'Landing page profissional',
  empresa: {
    nome: 'Nexus Inovação Digital',
    segmento: 'Consultoria e Soluções Tecnológicas',
    cidadeEstado: 'São Paulo - SP',
    endereco: 'Av. Paulista, 1000, Bela Vista, Sala 82',
    googleMapsLink: 'https://maps.app.goo.gl/nexusdigital',
  },
  identidadeVisual: {
    logoNome: 'logo-nexus.png',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
    slogan: 'Transformando ideias em software de alto impacto',
    coresPrincipais: 'Azul Marinho (#0B1326), Azul Royal (#2563EB) e Branco Gelo',
    estiloSite: ['Moderno', 'Minimalista'],
    sitesReferencia: 'https://stripe.com, https://linear.app',
  },
  midia: {
    arquivosInfo: 'Fotos da equipe e escritório no Google Drive',
    linksImagens: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c\nhttps://images.unsplash.com/photo-1497366216548-37526070297c',
    observacoes: 'Preferência por imagens com boa iluminação e aspecto clean profissional.',
    uploadedImages: [],
  },
  contatos: {
    whatsapp: '(11) 98765-4321',
    instagram: '@nexusdigital.br',
    facebook: 'facebook.com/nexusdigital',
    tiktok: '',
    email: 'contato@nexusdigital.com.br',
    outros: 'LinkedIn: linkedin.com/company/nexus-digital',
  },
  sobre: {
    historia: 'Fundada em 2020 por especialistas em engenharia de software e design de interfaces para acelerar negócios com tecnologia moderna.',
    sobreNos: 'Somos um estúdio focado na entrega de produtos digitais robustos, ágeis e escaláveis para empresas inovadoras.',
  },
  produtosServicos: [
    {
      nome: 'Desenvolvimento Web & Landing Pages',
      descricao: 'Criação de websites ultra-rápidos, responsivos e otimizados para conversão.',
      preco: '2.500,00',
    },
    {
      nome: 'Sistemas & Plataformas SaaS',
      descricao: 'Arquitetura e desenvolvimento de aplicações web completas em nuvem.',
      preco: '8.900,00',
    },
    {
      nome: 'Consultoria de UI/UX Design',
      descricao: 'Redesenho de interfaces focado em usabilidade e experiência do usuário.',
      preco: '1.800,00',
    },
  ],
  planos: {
    possuiPlanos: 'Sim',
    detalhes: 'Plano Start (Essencial), Plano Pro (Completo) e Enterprise (Personalizado sob medida)',
  },
  agendamento: {
    possuiAgendamento: 'Sim',
    canais: ['Via WhatsApp', 'Via Formulário'],
    maisInformacoes: 'Agendamento de reuniões diagnósticas de 30 minutos.',
  },
  horarios: {
    segundaSexta: '08:30 às 18:30',
    sabados: '09:00 às 13:00 (Plantão de suporte)',
    domingosFeriados: 'Fechado',
  },
  localizacao: {
    enderecoExibicao: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    pontoReferencia: 'Próximo à estação Trianon-Masp do Metrô',
    exibirMapa: 'Sim',
  },
  diferenciais: {
    itens: '1. Carregamento em menos de 1 segundo\n2. Suporte humano direto via WhatsApp\n3. Garantia de 3 meses pós-entrega\n4. Design exclusivo sem templates genéricos',
  },
  fraseEfeito: {
    frasePrincipal: 'Leve sua empresa para o próximo nível digital com soluções modernas e eficientes.',
  },
  botoesAcoes: {
    selecionados: ['Falar no WhatsApp', 'Solicitar Orçamento', 'Agendar / Marcar Consulta'],
  },
  dominio: {
    possuiDominio: 'Sim',
    nomeDominio: 'nexusdigital.com.br',
  },
  paginasSite: {
    selecionadas: ['One Page (Tudo em uma página)', 'Início (Home)', 'Sobre Nós', 'Serviços / Produtos', 'Contato'],
  },
  referencias: {
    gosta: 'Tipografia elegante, tema escuro suave, animações sutis ao rolar e botões bem visíveis.',
    naoQuer: 'Páginas poluídas com excesso de popups, cores berrantes ou textos longos sem hierarquia.',
  },
  adicionais: {
    outrasInfo: 'Queremos integrar o pixel do Facebook e Google Analytics 4 assim que a página for ao ar.',
  },
  checklist: {
    confirmou: true,
    anexouArquivos: true,
  },
};
