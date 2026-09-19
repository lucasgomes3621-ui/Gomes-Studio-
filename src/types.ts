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

export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StepMeta {
  id: StepId;
  numberStr: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: string;
}

export interface BriefingData {
  // Etapa 01 — Sobre Você
  sobreVoce: {
    nome: string;
    email: string;
    whatsapp: string;
  };

  // Etapa 02 — Sobre o Negócio
  sobreNegocio: {
    nomeEmpresa: string;
    segmento: string;
    instagram: string;
    siteAtual: string;
    // Localização e Área de Atuação
    cidade: string;
    estado: string;
    regioesAtendimento: 'Minha cidade / região' | 'Outras cidades' | 'Todo o Brasil' | 'Atendimento online / sem localização específica' | '';
    outrasRegioes: string;
    // Endereço Físico
    possuiEnderecoFisico: 'Sim' | 'Não' | '';
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cep: string;
    exibirMapa: 'Sim' | 'Não' | '';
    // O que a empresa faz
    descricaoAtuacao: string;
  };

  // Etapa 03 — Objetivo
  objetivo: {
    principal:
      | 'APRESENTAR MINHA EMPRESA'
      | 'DIVULGAR MEUS SERVIÇOS'
      | 'DIVULGAR UM PRODUTO'
      | 'RECEBER CONTATOS'
      | 'RECEBER PEDIDOS'
      | 'DIVULGAR UMA CAMPANHA'
      | 'OUTRO'
      | '';
    outroDescricao: string;
  };

  // Etapa 04 — Sobre o Projeto
  projeto: {
    produtosServicos: string;
    infoIndispensaveis: string;
    possuiTextos: 'Sim, já tenho' | 'Tenho parte do conteúdo' | 'Não, preciso de orientação' | '';
    possuiIdentidadeVisual: 'Sim, tenho logo e identidade visual' | 'Tenho apenas o logo' | 'Ainda não tenho' | 'Preciso de orientação' | '';
  };

  // Etapa 05 — Referências e Estilo
  referenciasEstilo: {
    sitesGosta: string;
    estilos: string[]; // Minimalista, Moderno, Elegante, Sofisticado, Comercial, Criativo, Tecnológico
    naoGosta: string;
  };

  // Etapa 06 — Materiais
  materiais: {
    statusItens: {
      logo: string;
      fotos: string;
      videos: string;
      textos: string;
      redesSociais: string;
      identidadeVisual: string;
      catalogo: string;
    };
    linkDrive: string;
    arquivosUpload: UploadedMediaItem[];
    observacoes: string;
  };

  // Etapa 07 — Contato e Direcionamento
  contato: {
    canalPrincipal: 'WhatsApp' | 'Instagram' | 'Telefone' | 'E-mail' | 'Outro' | '';
    canalPrincipalValor: string;
    whatsapp: string;
    instagram: string;
    telefone: string;
    email: string;
    outro: string;
  };

  // Etapa 08 — Informações Adicionais & Finalização
  informacoesAdicionais: {
    detalhesExtras: string;
    concordouPrivacidade: boolean;
  };

  // Legacy mappings for backwards compatibility if needed
  tipoProjeto?: 'Landing page essencial' | 'Landing page profissional' | 'Pagina completa profissional' | '';
  empresa?: any;
  identidadeVisual?: any;
  midia?: any;
  contatos?: any;
  sobre?: any;
  produtosServicos?: any[];
  planos?: any;
  agendamento?: any;
  horarios?: any;
  localizacao?: any;
  diferenciais?: any;
  fraseEfeito?: any;
  botoesAcoes?: any;
  dominio?: any;
  paginasSite?: any;
  referencias?: any;
  adicionais?: any;
  checklist?: any;
}
