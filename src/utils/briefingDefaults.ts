import { BriefingData, StepMeta } from '../types';

export const WHATSAPP_TARGET_NUMBER = '5533991031052';
export const WHATSAPP_DISPLAY_NUMBER = '(33) 99103-1052';
export const WHATSAPP_CONTACT_NAME = 'Gomes Studio';

export const STEPS: StepMeta[] = [
  {
    id: 1,
    numberStr: '01',
    title: 'Sobre Você',
    shortTitle: 'Sobre Você',
    subtitle: 'Precisamos de algumas informações para saber com quem estamos falando.',
    icon: 'User',
  },
  {
    id: 2,
    numberStr: '02',
    title: 'Sobre o Negócio',
    shortTitle: 'O Negócio',
    subtitle: 'Queremos entender melhor o seu negócio, sua atuação e onde ele está presente.',
    icon: 'Building2',
  },
  {
    id: 3,
    numberStr: '03',
    title: 'Objetivo',
    shortTitle: 'Objetivo',
    subtitle: 'Essa resposta nos ajuda a entender qual experiência faz mais sentido para o seu negócio.',
    icon: 'Target',
  },
  {
    id: 4,
    numberStr: '04',
    title: 'Sobre o Projeto',
    shortTitle: 'Projeto',
    subtitle: 'Agora vamos entender o conteúdo que sua página precisa ter.',
    icon: 'Layers',
  },
  {
    id: 5,
    numberStr: '05',
    title: 'Referências e Estilo',
    shortTitle: 'Referências',
    subtitle: 'Referências ajudam a entender o estilo visual que você deseja.',
    icon: 'Sparkles',
  },
  {
    id: 6,
    numberStr: '06',
    title: 'Materiais',
    shortTitle: 'Materiais',
    subtitle: 'Se você já possui materiais, eles podem nos ajudar a entender melhor a identidade do seu negócio.',
    icon: 'FolderUp',
  },
  {
    id: 7,
    numberStr: '07',
    title: 'Contato e Direcionamento',
    shortTitle: 'Contato',
    subtitle: 'Vamos definir o principal caminho para o visitante entrar em contato com sua empresa.',
    icon: 'Send',
  },
  {
    id: 8,
    numberStr: '08',
    title: 'Finalização',
    shortTitle: 'Finalização',
    subtitle: 'Confira suas informações antes de enviar o briefing.',
    icon: 'CheckCircle2',
  },
];

export const initialBriefingData: BriefingData = {
  // Etapa 01 — Sobre Você
  sobreVoce: {
    nome: '',
    email: '',
    whatsapp: '',
  },

  // Etapa 02 — Sobre o Negócio
  sobreNegocio: {
    nomeEmpresa: '',
    segmento: '',
    instagram: '',
    siteAtual: '',
    cidade: '',
    estado: '',
    regioesAtendimento: '',
    outrasRegioes: '',
    possuiEnderecoFisico: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    exibirMapa: '',
    descricaoAtuacao: '',
  },

  // Etapa 03 — Objetivo
  objetivo: {
    principal: '',
    outroDescricao: '',
  },

  // Etapa 04 — Sobre o Projeto
  projeto: {
    produtosServicos: '',
    infoIndispensaveis: '',
    possuiTextos: '',
    possuiIdentidadeVisual: '',
  },

  // Etapa 05 — Referências e Estilo
  referenciasEstilo: {
    sitesGosta: '',
    estilos: [],
    naoGosta: '',
  },

  // Etapa 06 — Materiais
  materiais: {
    statusItens: {
      logo: '',
      fotos: '',
      videos: '',
      textos: '',
      redesSociais: '',
      identidadeVisual: '',
      catalogo: '',
    },
    linkDrive: '',
    arquivosUpload: [],
    observacoes: '',
  },

  // Etapa 07 — Contato e Direcionamento
  contato: {
    canalPrincipal: '',
    canalPrincipalValor: '',
    whatsapp: '',
    instagram: '',
    telefone: '',
    email: '',
    outro: '',
  },

  // Etapa 08 — Informações Adicionais & Finalização
  informacoesAdicionais: {
    detalhesExtras: '',
    concordouPrivacidade: false,
  },

  // Backwards compatibility legacy fields
  tipoProjeto: 'Landing page profissional',
  empresa: {
    nome: '',
    segmento: '',
    cidadeEstado: '',
    endereco: '',
    googleMapsLink: '',
  },
  identidadeVisual: {
    logoNome: '',
    logoUrl: '',
    slogan: '',
    coresPrincipais: '',
    estiloSite: [],
    sitesReferencia: '',
  },
  midia: {
    arquivosInfo: '',
    linksImagens: '',
    observacoes: '',
    uploadedImages: [],
  },
  contatos: {
    whatsapp: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    email: '',
    outros: '',
  },
  sobre: {
    historia: '',
    sobreNos: '',
  },
  produtosServicos: [],
  planos: { possuiPlanos: '', detalhes: '' },
  agendamento: { possuiAgendamento: '', canais: [], maisInformacoes: '' },
  horarios: { segundaSexta: '', sabados: '', domingosFeriados: '' },
  localizacao: { enderecoExibicao: '', pontoReferencia: '', exibirMapa: '' },
  diferenciais: { itens: '' },
  fraseEfeito: { frasePrincipal: '' },
  botoesAcoes: { selecionados: [] },
  dominio: { possuiDominio: '', nomeDominio: '' },
  paginasSite: { selecionadas: [] },
  referencias: { gosta: '', naoQuer: '' },
  adicionais: { outrasInfo: '' },
  checklist: { confirmou: false, anexouArquivos: false },
};

/**
 * Calculates progress across the 8 steps
 */
export function calculateProgress(data: BriefingData): {
  filledCount: number;
  totalCount: number;
  percentage: number;
  stepsCompleted: boolean[];
} {
  const stepsCompleted: boolean[] = [
    // Step 1: Sobre Você (Nome + Email + WhatsApp)
    Boolean(data.sobreVoce?.nome?.trim() && data.sobreVoce?.email?.trim() && data.sobreVoce?.whatsapp?.trim()),

    // Step 2: Sobre o Negócio (Nome da empresa + (Segmento ou Cidade ou Descrição))
    Boolean(data.sobreNegocio?.nomeEmpresa?.trim() && (data.sobreNegocio?.segmento?.trim() || data.sobreNegocio?.cidade?.trim() || data.sobreNegocio?.descricaoAtuacao?.trim())),

    // Step 3: Objetivo (Objetivo principal selecionado)
    Boolean(data.objetivo?.principal),

    // Step 4: Projeto (Produtos/serviços, info indispensáveis ou posse de textos)
    Boolean(data.projeto?.produtosServicos?.trim() || data.projeto?.infoIndispensaveis?.trim() || data.projeto?.possuiTextos),

    // Step 5: Referências e Estilo (Sites que gosta ou estilos selecionados)
    Boolean(data.referenciasEstilo?.sitesGosta?.trim() || (data.referenciasEstilo?.estilos && data.referenciasEstilo.estilos.length > 0)),

    // Step 6: Materiais (Upload feito, ou link drive, ou status de materiais marcados)
    Boolean(
      (data.materiais?.arquivosUpload && data.materiais.arquivosUpload.length > 0) ||
      data.materiais?.linkDrive?.trim() ||
      (data.materiais?.statusItens && Object.values(data.materiais.statusItens).some(v => Boolean(v)))
    ),

    // Step 7: Contato e Direcionamento (Canal principal definido)
    Boolean(data.contato?.canalPrincipal),

    // Step 8: Finalização (Termo de privacidade aceito)
    Boolean(data.informacoesAdicionais?.concordouPrivacidade),
  ];

  const filledCount = stepsCompleted.filter(Boolean).length;
  const totalCount = 8;
  const percentage = Math.round((filledCount / totalCount) * 100);

  return {
    filledCount,
    totalCount,
    percentage,
    stepsCompleted,
  };
}

/**
 * Formats WhatsApp submission message organized strictly by the 8 professional steps
 */
export function formatWhatsAppMessage(data: BriefingData, pdfDirectUrl?: string): string {
  const lines: string[] = [];

  lines.push('📋 *BRIEFING DE PRESENÇA DIGITAL · GOMES STUDIO*');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('✨ _Vamos criar a página certa para o seu objetivo._');
  lines.push('');

  // 01 Sobre Você
  lines.push('👤 *01. SOBRE VOCÊ*');
  lines.push(`• Nome: ${data.sobreVoce?.nome || data.empresa?.nome || 'Não informado'}`);
  if (data.sobreVoce?.email) lines.push(`• E-mail: ${data.sobreVoce.email}`);
  if (data.sobreVoce?.whatsapp) lines.push(`• WhatsApp: ${data.sobreVoce.whatsapp}`);
  lines.push('');

  // 02 Sobre o Negócio
  lines.push('🏢 *02. SOBRE O NEGÓCIO*');
  lines.push(`• Empresa: ${data.sobreNegocio?.nomeEmpresa || data.empresa?.nome || 'Não informado'}`);
  if (data.sobreNegocio?.segmento) lines.push(`• Segmento: ${data.sobreNegocio.segmento}`);
  if (data.sobreNegocio?.instagram) lines.push(`• Instagram: ${data.sobreNegocio.instagram}`);
  if (data.sobreNegocio?.siteAtual) lines.push(`• Site Atual: ${data.sobreNegocio.siteAtual}`);
  
  const localizacaoArr = [data.sobreNegocio?.cidade, data.sobreNegocio?.estado].filter(Boolean);
  if (localizacaoArr.length > 0) lines.push(`• Localização: ${localizacaoArr.join(' - ')}`);
  if (data.sobreNegocio?.regioesAtendimento) lines.push(`• Regiões de Atendimento: ${data.sobreNegocio.regioesAtendimento}`);
  if (data.sobreNegocio?.outrasRegioes) lines.push(`• Cidades/Regiões: ${data.sobreNegocio.outrasRegioes}`);

  if (data.sobreNegocio?.possuiEnderecoFisico === 'Sim') {
    const endParts = [
      data.sobreNegocio.endereco,
      data.sobreNegocio.numero ? `nº ${data.sobreNegocio.numero}` : '',
      data.sobreNegocio.complemento,
      data.sobreNegocio.bairro,
      data.sobreNegocio.cep ? `CEP: ${data.sobreNegocio.cep}` : '',
    ].filter(Boolean);
    if (endParts.length > 0) lines.push(`• Endereço Físico: ${endParts.join(', ')}`);
    if (data.sobreNegocio.exibirMapa) lines.push(`• Exibir Mapa no Site: ${data.sobreNegocio.exibirMapa}`);
  }

  if (data.sobreNegocio?.descricaoAtuacao) {
    lines.push(`• O que a empresa faz: ${data.sobreNegocio.descricaoAtuacao}`);
  }
  lines.push('');

  // 03 Objetivo
  lines.push('🎯 *03. OBJETIVO DA PÁGINA*');
  if (data.objetivo?.principal) {
    lines.push(`• Principal Objetivo: ${data.objetivo.principal}`);
  }
  if (data.objetivo?.outroDescricao) {
    lines.push(`• Detalhes do Objetivo: ${data.objetivo.outroDescricao}`);
  }
  lines.push('');

  // 04 Sobre o Projeto
  lines.push('📦 *04. SOBRE O PROJETO*');
  if (data.projeto?.produtosServicos) {
    lines.push(`• Produtos/Serviços na Página:\n  ${data.projeto.produtosServicos}`);
  }
  if (data.projeto?.infoIndispensaveis) {
    lines.push(`• Informações Indispensáveis:\n  ${data.projeto.infoIndispensaveis}`);
  }
  if (data.projeto?.possuiTextos) {
    lines.push(`• Possui Textos Prontos: ${data.projeto.possuiTextos}`);
  }
  if (data.projeto?.possuiIdentidadeVisual) {
    lines.push(`• Identidade Visual: ${data.projeto.possuiIdentidadeVisual}`);
  }
  lines.push('');

  // 05 Referências e Estilo
  lines.push('✨ *05. REFERÊNCIAS E ESTILO*');
  if (data.referenciasEstilo?.sitesGosta) {
    lines.push(`• Páginas que Gosta: ${data.referenciasEstilo.sitesGosta}`);
  }
  if (data.referenciasEstilo?.estilos && data.referenciasEstilo.estilos.length > 0) {
    lines.push(`• Estilos Escolhidos: ${data.referenciasEstilo.estilos.join(', ')}`);
  }
  if (data.referenciasEstilo?.naoGosta) {
    lines.push(`• O que NÃO Gostaria: ${data.referenciasEstilo.naoGosta}`);
  }
  lines.push('');

  // 06 Materiais
  lines.push('📁 *06. MATERIAIS*');
  if (data.materiais?.statusItens) {
    const statusLabels: Record<string, string> = {
      logo: 'Logotipo',
      fotos: 'Fotos',
      videos: 'Vídeos',
      textos: 'Textos',
      redesSociais: 'Redes Sociais',
      identidadeVisual: 'Identidade Visual',
      catalogo: 'Catálogo / Apresentação',
    };
    const statusEntries = Object.entries(data.materiais.statusItens).filter(([_, val]) => Boolean(val));
    if (statusEntries.length > 0) {
      lines.push('• Status dos Materiais:');
      statusEntries.forEach(([key, val]) => {
        lines.push(`  - ${statusLabels[key] || key}: ${val}`);
      });
    }
  }

  if (data.materiais?.linkDrive) {
    lines.push(`• Link Nuvem (Drive/OneDrive): ${data.materiais.linkDrive}`);
  }

  if (data.materiais?.arquivosUpload && data.materiais.arquivosUpload.length > 0) {
    lines.push(`• Arquivos Anexados (${data.materiais.arquivosUpload.length} itens):`);
    data.materiais.arquivosUpload.forEach((file, idx) => {
      const kb = (file.size / 1024).toFixed(0);
      const directUrl = file.fullUrl || (file.url ? (typeof window !== 'undefined' ? `${window.location.origin}${file.url}` : file.url) : null);
      if (directUrl) {
        lines.push(`  - [Item ${idx + 1}] ${file.name} (${kb} KB): ${directUrl}`);
      } else {
        lines.push(`  - [Item ${idx + 1}] ${file.name} (${kb} KB)`);
      }
    });
  }

  if (data.materiais?.observacoes) {
    lines.push(`• Obs sobre Materiais: ${data.materiais.observacoes}`);
  }
  lines.push('');

  // 07 Contato e Direcionamento
  lines.push('📲 *07. CONTATO E DIRECIONAMENTO*');
  if (data.contato?.canalPrincipal) {
    lines.push(`• Canal Principal de Conversão: ${data.contato.canalPrincipal}`);
    if (data.contato.canalPrincipalValor) {
      lines.push(`• Dado do Canal Principal: ${data.contato.canalPrincipalValor}`);
    }
  }
  const outrosCanais: string[] = [];
  if (data.contato?.whatsapp && data.contato.canalPrincipal !== 'WhatsApp') outrosCanais.push(`WhatsApp: ${data.contato.whatsapp}`);
  if (data.contato?.instagram && data.contato.canalPrincipal !== 'Instagram') outrosCanais.push(`Instagram: ${data.contato.instagram}`);
  if (data.contato?.telefone && data.contato.canalPrincipal !== 'Telefone') outrosCanais.push(`Telefone: ${data.contato.telefone}`);
  if (data.contato?.email && data.contato.canalPrincipal !== 'E-mail') outrosCanais.push(`E-mail: ${data.contato.email}`);
  if (data.contato?.outro && data.contato.canalPrincipal !== 'Outro') outrosCanais.push(`Outro: ${data.contato.outro}`);
  if (outrosCanais.length > 0) {
    lines.push(`• Canais Complementares: ${outrosCanais.join(' | ')}`);
  }
  lines.push('');

  // 08 Informações Adicionais
  if (data.informacoesAdicionais?.detalhesExtras) {
    lines.push('📝 *08. INFORMAÇÕES ADICIONAIS*');
    lines.push(data.informacoesAdicionais.detalhesExtras);
    lines.push('');
  }

  // Link do PDF anexado
  if (pdfDirectUrl) {
    lines.push('📄 *DOCUMENTO OFICIAL DO BRIEFING (PDF):*');
    lines.push(`🔗 ${pdfDirectUrl}`);
    lines.push('');
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('🚀 _Desenvolvido por Gomes Studio_');
  lines.push('🌐 https://lucasgomes3621-ui.github.io/Gomes-Studio-/');

  return lines.join('\n');
}

export function getDirectWhatsAppUrl(
  data: BriefingData,
  targetPhone: string = WHATSAPP_TARGET_NUMBER,
  pdfDirectUrl?: string
): string {
  const cleanPhone = targetPhone.replace(/\D/g, '');
  const formatted = formatWhatsAppMessage(data, pdfDirectUrl);
  const encoded = encodeURIComponent(formatted);

  if (cleanPhone) {
    const fullPhone = cleanPhone.startsWith('55') || cleanPhone.length > 11 ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${fullPhone}?text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

export function formatEmailBody(data: BriefingData): string {
  return formatWhatsAppMessage(data);
}

export function getDirectEmailUrls(data: BriefingData, targetEmail: string = 'lucasgomes3621@gmail.com') {
  const companyName = data.sobreNegocio?.nomeEmpresa || data.sobreVoce?.nome || 'Novo Cliente';
  const subject = `Briefing de Presença Digital: ${companyName} - Gomes Studio`;
  const body = formatEmailBody(data);

  const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    mailtoUrl,
    gmailWebUrl,
    subject,
    body,
  };
}
