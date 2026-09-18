import { BriefingData, SectionMeta } from '../types';

export const WHATSAPP_TARGET_NUMBER = '5533991031052';
export const WHATSAPP_DISPLAY_NUMBER = '';
export const WHATSAPP_CONTACT_NAME = 'Gomes Studio';

export const initialBriefingData: BriefingData = {
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
  produtosServicos: [
    { nome: '', descricao: '', preco: '' },
    { nome: '', descricao: '', preco: '' },
    { nome: '', descricao: '', preco: '' },
  ],
  planos: {
    possuiPlanos: '',
    detalhes: '',
  },
  agendamento: {
    possuiAgendamento: '',
    canais: [],
    maisInformacoes: '',
  },
  horarios: {
    segundaSexta: '',
    sabados: '',
    domingosFeriados: '',
  },
  localizacao: {
    enderecoExibicao: '',
    pontoReferencia: '',
    exibirMapa: '',
  },
  diferenciais: {
    itens: '',
  },
  fraseEfeito: {
    frasePrincipal: '',
  },
  botoesAcoes: {
    selecionados: [],
  },
  dominio: {
    possuiDominio: '',
    nomeDominio: '',
  },
  paginasSite: {
    selecionadas: [],
  },
  referencias: {
    gosta: '',
    naoQuer: '',
  },
  adicionais: {
    outrasInfo: '',
  },
  checklist: {
    confirmou: false,
    anexouArquivos: false,
  },
};

export const SECTIONS: SectionMeta[] = [
  { id: 1, key: 'empresa', title: '1. Informações da Empresa', shortTitle: 'Empresa', icon: 'Building2' },
  { id: 2, key: 'identidadeVisual', title: '2. Identidade Visual', shortTitle: 'Identidade', icon: 'Palette' },
  { id: 3, key: 'midia', title: '3. Fotos e Vídeos', shortTitle: 'Mídias', icon: 'Camera' },
  { id: 4, key: 'contatos', title: '4. Redes Sociais e Contatos', shortTitle: 'Contatos', icon: 'Share2' },
  { id: 5, key: 'sobre', title: '5. Sobre a Empresa', shortTitle: 'Sobre', icon: 'Info' },
  { id: 6, key: 'produtosServicos', title: '6. Produtos e/ou Serviços', shortTitle: 'Produtos', icon: 'ShoppingBag' },
  { id: 7, key: 'planos', title: '7. Planos e Valores', shortTitle: 'Planos', icon: 'CreditCard' },
  { id: 8, key: 'agendamento', title: '8. Agendamento', shortTitle: 'Agendamento', icon: 'Calendar' },
  { id: 9, key: 'horarios', title: '9. Horário de Funcionamento', shortTitle: 'Horários', icon: 'Clock' },
  { id: 10, key: 'localizacao', title: '10. Localização', shortTitle: 'Localização', icon: 'MapPin' },
  { id: 11, key: 'diferenciais', title: '11. Diferenciais da Empresa', shortTitle: 'Diferenciais', icon: 'Star' },
  { id: 12, key: 'fraseEfeito', title: '12. Frase de Efeito', shortTitle: 'Frase Topo', icon: 'Quote' },
  { id: 13, key: 'botoesAcoes', title: '13. Botões e Ações', shortTitle: 'Botões CTA', icon: 'MousePointerClick' },
  { id: 14, key: 'dominio', title: '14. Domínio', shortTitle: 'Domínio', icon: 'Globe' },
  { id: 15, key: 'paginasSite', title: '15. Páginas do Site', shortTitle: 'Páginas', icon: 'Layout' },
  { id: 16, key: 'referencias', title: '16. Referências e Ideias', shortTitle: 'Ideias', icon: 'Lightbulb' },
  { id: 17, key: 'adicionais', title: '17. Informações Adicionais', shortTitle: 'Adicionais', icon: 'FileText' },
];

export function calculateProgress(data: BriefingData): { filledCount: number; totalCount: number; percentage: number } {
  let filled = 0;
  const total = 17;

  if (data.empresa.nome || data.empresa.segmento) filled++;
  if (data.identidadeVisual.logoUrl || data.identidadeVisual.logoNome || data.identidadeVisual.coresPrincipais || data.identidadeVisual.estiloSite.length > 0) filled++;
  if (data.midia.linksImagens || data.midia.observacoes || data.midia.arquivosInfo || (data.midia.uploadedImages && data.midia.uploadedImages.length > 0)) filled++;
  if (data.contatos.whatsapp || data.contatos.instagram || data.contatos.email) filled++;
  if (data.sobre.historia || data.sobre.sobreNos) filled++;
  if (data.produtosServicos.some(p => p.nome.trim() !== '')) filled++;
  if (data.planos.possuiPlanos || data.planos.detalhes) filled++;
  if (data.agendamento.possuiAgendamento || data.agendamento.canais.length > 0) filled++;
  if (data.horarios.segundaSexta || data.horarios.sabados) filled++;
  if (data.localizacao.enderecoExibicao || data.localizacao.exibirMapa) filled++;
  if (data.diferenciais.itens) filled++;
  if (data.fraseEfeito.frasePrincipal) filled++;
  if (data.botoesAcoes.selecionados.length > 0) filled++;
  if (data.dominio.possuiDominio || data.dominio.nomeDominio) filled++;
  if (data.paginasSite.selecionadas.length > 0) filled++;
  if (data.referencias.gosta || data.referencias.naoQuer) filled++;
  if (data.adicionais.outrasInfo) filled++;

  return {
    filledCount: filled,
    totalCount: total,
    percentage: Math.round((filled / total) * 100),
  };
}

export function formatWhatsAppMessage(data: BriefingData, pdfDirectUrl?: string): string {
  const lines: string[] = [];

  lines.push('📋 *BRIEFING PROFISSIONAL DO SITE - GOMES STUDIO*');
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  if (data.tipoProjeto) {
    lines.push(`🚀 *PROJETO:* ${data.tipoProjeto.toUpperCase()}`);
    lines.push('━━━━━━━━━━━━━━━━━━━━');
  }
  lines.push('');

  // 1
  lines.push('🏢 *1. Informações da Empresa*');
  lines.push(`• Nome: ${data.empresa.nome || 'Não informado'}`);
  if (data.empresa.segmento) lines.push(`• Ramo/Segmento: ${data.empresa.segmento}`);
  if (data.empresa.cidadeEstado) lines.push(`• Cidade/UF: ${data.empresa.cidadeEstado}`);
  if (data.empresa.endereco) lines.push(`• Endereço: ${data.empresa.endereco}`);
  if (data.empresa.googleMapsLink) lines.push(`• Link Maps: ${data.empresa.googleMapsLink}`);
  lines.push('');

  // 2
  lines.push('🎨 *2. Identidade Visual*');
  if (data.identidadeVisual.logoNome) lines.push(`• Logo: ${data.identidadeVisual.logoNome}`);
  if (data.identidadeVisual.logoCloudUrl) {
    lines.push(`• Link do Logo (Nuvem): ${data.identidadeVisual.logoCloudUrl}`);
  } else if (data.identidadeVisual.logoUrl && !data.identidadeVisual.logoUrl.startsWith('data:')) {
    lines.push(`• Link do Logo/Imagem: ${data.identidadeVisual.logoUrl}`);
  } else if (data.identidadeVisual.logoUrl && data.identidadeVisual.logoUrl.startsWith('data:')) {
    lines.push(`• Logo Anexada: Imagem selecionada (${data.identidadeVisual.logoNome || 'logo'})`);
  }
  if (data.identidadeVisual.slogan) lines.push(`• Slogan: ${data.identidadeVisual.slogan}`);
  if (data.identidadeVisual.coresPrincipais) lines.push(`• Cores Principais: ${data.identidadeVisual.coresPrincipais}`);
  if (data.identidadeVisual.estiloSite.length > 0) lines.push(`• Estilo: ${data.identidadeVisual.estiloSite.join(', ')}`);
  if (data.identidadeVisual.sitesReferencia) lines.push(`• Sites Referência: ${data.identidadeVisual.sitesReferencia}`);
  lines.push('');

  // 3
  const hasGalleryImages = data.midia.uploadedImages && data.midia.uploadedImages.length > 0;
  if (data.midia.linksImagens || data.midia.arquivosInfo || data.midia.observacoes || hasGalleryImages) {
    lines.push('📷 *3. Fotos e Vídeos*');
    if (hasGalleryImages) {
      lines.push(`• Fotos Anexadas (${data.midia.uploadedImages.length} arquivos salvos na nuvem):`);
      data.midia.uploadedImages.forEach((img, idx) => {
        const kb = (img.size / 1024).toFixed(0);
        const directUrl = img.fullUrl || (img.url ? (typeof window !== 'undefined' ? `${window.location.origin}${img.url}` : img.url) : null);
        if (directUrl) {
          lines.push(`  - [Foto ${idx + 1}] ${img.name} (${kb} KB): ${directUrl}`);
        } else {
          lines.push(`  - [Foto ${idx + 1}] ${img.name} (${kb} KB)`);
        }
      });
    }
    if (data.midia.linksImagens) lines.push(`• Links das Imagens: ${data.midia.linksImagens}`);
    if (data.midia.arquivosInfo) lines.push(`• Pasta na Nuvem (Drive/Dropbox): ${data.midia.arquivosInfo}`);
    if (data.midia.observacoes) lines.push(`• Observações: ${data.midia.observacoes}`);
    lines.push('');
  }

  // 4
  lines.push('📱 *4. Redes Sociais e Contatos*');
  if (data.contatos.whatsapp) lines.push(`• WhatsApp: ${data.contatos.whatsapp}`);
  if (data.contatos.instagram) lines.push(`• Instagram: ${data.contatos.instagram}`);
  if (data.contatos.facebook) lines.push(`• Facebook: ${data.contatos.facebook}`);
  if (data.contatos.tiktok) lines.push(`• TikTok: ${data.contatos.tiktok}`);
  if (data.contatos.email) lines.push(`• E-mail: ${data.contatos.email}`);
  if (data.contatos.outros) lines.push(`• Outros Contatos: ${data.contatos.outros}`);
  lines.push('');

  // 5
  if (data.sobre.historia || data.sobre.sobreNos) {
    lines.push('ℹ️ *5. Sobre a Empresa*');
    if (data.sobre.historia) lines.push(`• História: ${data.sobre.historia}`);
    if (data.sobre.sobreNos) lines.push(`• Sobre Nós: ${data.sobre.sobreNos}`);
    lines.push('');
  }

  // 6
  const validProducts = data.produtosServicos.filter(p => p.nome.trim() !== '');
  if (validProducts.length > 0) {
    lines.push('🛍️ *6. Principais Produtos/Serviços*');
    validProducts.forEach((prod, i) => {
      lines.push(`• Item ${i + 1}: ${prod.nome}${prod.preco ? ` (R$ ${prod.preco})` : ''}`);
      if (prod.descricao) lines.push(`  Desc: ${prod.descricao}`);
    });
    lines.push('');
  }

  // 7
  if (data.planos.possuiPlanos || data.planos.detalhes) {
    lines.push('💳 *7. Planos e Valores*');
    lines.push(`• Possui Planos: ${data.planos.possuiPlanos || 'Não especificado'}`);
    if (data.planos.detalhes) lines.push(`• Detalhes: ${data.planos.detalhes}`);
    lines.push('');
  }

  // 8
  if (data.agendamento.possuiAgendamento || data.agendamento.canais.length > 0) {
    lines.push('📅 *8. Agendamento*');
    lines.push(`• Terá Agendamento: ${data.agendamento.possuiAgendamento || 'Não'}`);
    if (data.agendamento.canais.length > 0) lines.push(`• Canais: ${data.agendamento.canais.join(', ')}`);
    if (data.agendamento.maisInformacoes) lines.push(`• Info: ${data.agendamento.maisInformacoes}`);
    lines.push('');
  }

  // 9
  if (data.horarios.segundaSexta || data.horarios.sabados || data.horarios.domingosFeriados) {
    lines.push('⏰ *9. Horário de Funcionamento*');
    if (data.horarios.segundaSexta) lines.push(`• Seg a Sex: ${data.horarios.segundaSexta}`);
    if (data.horarios.sabados) lines.push(`• Sábados: ${data.horarios.sabados}`);
    if (data.horarios.domingosFeriados) lines.push(`• Dom/Feriados: ${data.horarios.domingosFeriados}`);
    lines.push('');
  }

  // 10
  if (data.localizacao.enderecoExibicao || data.localizacao.exibirMapa) {
    lines.push('📍 *10. Localização no Site*');
    if (data.localizacao.enderecoExibicao) lines.push(`• Endereço Exibição: ${data.localizacao.enderecoExibicao}`);
    if (data.localizacao.pontoReferencia) lines.push(`• Ponto de Ref: ${data.localizacao.pontoReferencia}`);
    if (data.localizacao.exibirMapa) lines.push(`• Exibir Mapa: ${data.localizacao.exibirMapa}`);
    lines.push('');
  }

  // 11
  if (data.diferenciais.itens) {
    lines.push('⭐ *11. Diferenciais da Empresa*');
    lines.push(`${data.diferenciais.itens}`);
    lines.push('');
  }

  // 12
  if (data.fraseEfeito.frasePrincipal) {
    lines.push('💬 *12. Frase de Efeito (Topo)*');
    lines.push(`"${data.fraseEfeito.frasePrincipal}"`);
    lines.push('');
  }

  // 13
  if (data.botoesAcoes.selecionados.length > 0) {
    lines.push('🔘 *13. Botões e Ações de Destaque*');
    lines.push(`• ${data.botoesAcoes.selecionados.join(', ')}`);
    lines.push('');
  }

  // 14
  lines.push('🌐 *14. Domínio*');
  lines.push(`• Possui Domínio: ${data.dominio.possuiDominio || 'Não'}`);
  if (data.dominio.nomeDominio) lines.push(`• Domínio: ${data.dominio.nomeDominio}`);
  lines.push('');

  // 15
  if (data.paginasSite.selecionadas.length > 0) {
    lines.push('📑 *15. Páginas do Site*');
    lines.push(`• ${data.paginasSite.selecionadas.join(', ')}`);
    lines.push('');
  }

  // 16
  if (data.referencias.gosta || data.referencias.naoQuer) {
    lines.push('💡 *16. Referências e Ideias*');
    if (data.referencias.gosta) lines.push(`• O que gosta: ${data.referencias.gosta}`);
    if (data.referencias.naoQuer) lines.push(`• O que NÃO quer: ${data.referencias.naoQuer}`);
    lines.push('');
  }

  // 17
  if (data.adicionais.outrasInfo) {
    lines.push('📄 *17. Informações Adicionais*');
    lines.push(`${data.adicionais.outrasInfo}`);
    lines.push('');
  }

  // Checklist
  lines.push('✅ *Checklist Final*');
  lines.push(`• Dados confirmados: ${data.checklist.confirmou ? 'Sim' : 'Não'}`);
  lines.push(`• Mídias/Logo: ${data.checklist.anexouArquivos ? 'Anexadas / Prontas para envio' : 'Enviar na conversa do WhatsApp'}`);
  lines.push('');

  // Attached PDF link if generated
  if (pdfDirectUrl) {
    lines.push('📄 *ARQUIVO PDF OFICIAL GERADO:*');
    lines.push(`🔗 ${pdfDirectUrl}`);
    lines.push('');
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push('✨ _Enviado via Briefing Gomes Studio_');

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
  const lines: string[] = [];

  lines.push('Olá Gomes Studio!');
  lines.push('');
  lines.push('Estou enviando o Briefing e os arquivos de mídia para a criação do nosso site.');
  lines.push('');
  lines.push('📌 ANEXOS NESTE E-MAIL:');
  lines.push('• Fotos, vídeos e arquivo da logo em alta resolução anexados.');
  lines.push('');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('RESUMO DAS INFORMAÇÕES PREENCHIDAS:');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push(formatWhatsAppMessage(data));

  return lines.join('\n');
}

export function getDirectEmailUrls(data: BriefingData, targetEmail: string = 'lucasgomes3621@gmail.com') {
  const companyName = data.empresa.nome || 'Novo Cliente';
  const subject = `Briefing & Mídias do Site: ${companyName}`;
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

