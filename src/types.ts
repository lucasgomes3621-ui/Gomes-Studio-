export interface UploadedMediaItem {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  type: string;
  url?: string;
  fullUrl?: string;
  uploading?: boolean;
  uploaded?: boolean;
}

export interface BriefingData {
  // Tipo de Projeto Escolhido
  tipoProjeto: 'Landing page essencial' | 'Landing page profissional' | 'Pagina completa profissional' | '';
  // 1. Informações da Empresa
  empresa: {
    nome: string;
    segmento: string;
    cidadeEstado: string;
    endereco: string;
    googleMapsLink: string;
  };
  // 2. Identidade Visual
  identidadeVisual: {
    logoNome: string;
    logoUrl: string;
    logoBase64?: string;
    logoCloudUrl?: string;
    logoSize?: number;
    slogan: string;
    coresPrincipais: string;
    estiloSite: string[];
    sitesReferencia: string;
  };
  // 3. Fotos e Vídeos
  midia: {
    arquivosInfo: string;
    linksImagens: string;
    observacoes: string;
    uploadedImages: UploadedMediaItem[];
  };
  // 4. Redes Sociais e Contatos
  contatos: {
    whatsapp: string;
    instagram: string;
    facebook: string;
    tiktok: string;
    email: string;
    outros: string;
  };
  // 5. Sobre a Empresa
  sobre: {
    historia: string;
    sobreNos: string;
  };
  // 6. Produtos e/ou Serviços
  produtosServicos: Array<{
    nome: string;
    descricao: string;
    preco: string;
  }>;
  // 7. Planos e Valores
  planos: {
    possuiPlanos: 'Sim' | 'Não' | '';
    detalhes: string;
  };
  // 8. Agendamento
  agendamento: {
    possuiAgendamento: 'Sim' | 'Não' | '';
    canais: string[];
    maisInformacoes: string;
  };
  // 9. Horário de Funcionamento
  horarios: {
    segundaSexta: string;
    sabados: string;
    domingosFeriados: string;
  };
  // 10. Localização
  localizacao: {
    enderecoExibicao: string;
    pontoReferencia: string;
    exibirMapa: 'Sim' | 'Não' | '';
  };
  // 11. Diferenciais da Empresa
  diferenciais: {
    itens: string;
  };
  // 12. Frase de Efeito
  fraseEfeito: {
    frasePrincipal: string;
  };
  // 13. Botões e Ações
  botoesAcoes: {
    selecionados: string[];
  };
  // 14. Domínio
  dominio: {
    possuiDominio: 'Sim' | 'Não' | 'Não sei' | '';
    nomeDominio: string;
  };
  // 15. Páginas do Site
  paginasSite: {
    selecionadas: string[];
  };
  // 16. Referências e Ideias
  referencias: {
    gosta: string;
    naoQuer: string;
  };
  // 17. Informações Adicionais
  adicionais: {
    outrasInfo: string;
  };
  // Checklist
  checklist: {
    confirmou: boolean;
    anexouArquivos: boolean;
  };
}

export interface SectionMeta {
  id: number;
  key: string;
  title: string;
  shortTitle: string;
  icon: string;
  description?: string;
}
