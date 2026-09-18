import { jsPDF } from 'jspdf';
import { BriefingData } from '../types';

export function generateBriefingPDF(data: BriefingData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  const checkPageBreak = (neededSpace: number = 15) => {
    if (y + neededSpace > pageHeight - 20) {
      doc.addPage();
      y = 15;
      drawPageHeaderMini();
    }
  };

  const drawPageHeaderMini = () => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 8, 'F');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`GOMES STUDIO • BRIEFING - ${data.empresa.nome || 'PROJETO WEB'}`, margin, 5.5);
    doc.text('Desenvolvimento: Gomes Studio', pageWidth - margin, 5.5, { align: 'right' });
    y = 15;
  };

  // --- CAPA / CABEÇALHO PRINCIPAL ---
  doc.setFillColor(11, 19, 38); // Deep Navy
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

  // Header Title with Brand
  doc.setTextColor(56, 189, 248); // Sky blue
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOMES STUDIO', margin + 6, y + 8.5);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('BRIEFING DE DESENVOLVIMENTO DE SITE', margin + 6, y + 15);

  // Subtitle
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const companyTitle = data.empresa.nome ? data.empresa.nome.toUpperCase() : 'NOVO CLIENTE';
  doc.text(`CLIENTE: ${companyTitle}`, margin + 6, y + 21);

  // Metadata line
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Design que Conecta, Soluções que Impulsionam  |  ${today}`, margin + 6, y + 26.5);
  doc.text('Desenvolvimento: Gomes Studio', margin + 6, y + 31);

  y += 40;

  // Project Type Banner in PDF
  if (data.tipoProjeto) {
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, 'F');
    doc.setFillColor(0, 102, 255);
    doc.roundedRect(margin + 2, y + 2, 6, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('★', margin + 5, y + 6, { align: 'center' });

    doc.setTextColor(56, 189, 248);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('TIPO DE PROJETO:', margin + 11, y + 6.5);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.text(data.tipoProjeto.toUpperCase(), margin + 45, y + 6.5);
    y += 14;
  }

  // Helper function to draw section header
  const drawSectionHeader = (title: string, iconNumber: string) => {
    checkPageBreak(14);
    doc.setFillColor(30, 41, 59); // slate-800
    doc.roundedRect(margin, y, contentWidth, 7.5, 1.5, 1.5, 'F');

    doc.setFillColor(16, 185, 129); // Emerald badge
    doc.roundedRect(margin + 2, y + 1.2, 5, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(iconNumber, margin + 4.5, y + 4.7, { align: 'center' });

    doc.setTextColor(248, 250, 252);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 9, y + 5);

    y += 10.5;
  };

  // Helper for field rows
  const drawField = (label: string, value: string | undefined | null, defaultValue: string = 'Não informado') => {
    const val = value && value.trim() ? value.trim() : defaultValue;
    if (val === 'Não informado' && defaultValue === '') return;

    checkPageBreak(8);

    doc.setTextColor(71, 85, 105); // slate-600
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin + 3, y);

    const labelWidth = doc.getTextWidth(`${label}: `);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFont('helvetica', 'normal');

    // Multi-line text wrapping
    const textLines = doc.splitTextToSize(val, contentWidth - labelWidth - 8);
    doc.text(textLines, margin + 3 + labelWidth, y);

    y += textLines.length * 4.2 + 1.5;
  };

  // Helper for block text
  const drawTextBlock = (label: string, text: string | undefined) => {
    if (!text || !text.trim()) return;
    checkPageBreak(15);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin + 3, y);
    y += 4;

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(text.trim(), contentWidth - 6);
    doc.text(textLines, margin + 3, y);
    y += textLines.length * 4 + 2;
  };

  // 1. INFORMAÇÕES DA EMPRESA
  drawSectionHeader('1. INFORMAÇÕES DA EMPRESA', '1');
  drawField('Nome da Empresa', data.empresa.nome);
  drawField('Ramo / Segmento', data.empresa.segmento);
  drawField('Cidade / Estado', data.empresa.cidadeEstado);
  drawField('Endereço Completo', data.empresa.endereco);
  drawField('Link do Google Maps', data.empresa.googleMapsLink, '');
  y += 2;

  // 2. IDENTIDADE VISUAL
  drawSectionHeader('2. IDENTIDADE VISUAL & DESIGN', '2');
  drawField('Logo Nome / Arquivo', data.identidadeVisual.logoNome, '');
  if (data.identidadeVisual.logoCloudUrl) {
    drawField('Link da Logo (Salva na Nuvem)', data.identidadeVisual.logoCloudUrl, '');
  } else if (data.identidadeVisual.logoUrl && !data.identidadeVisual.logoUrl.startsWith('data:')) {
    drawField('Link da Logo / Imagem', data.identidadeVisual.logoUrl, '');
  }
  drawField('Slogan', data.identidadeVisual.slogan, '');
  drawField('Cores Principais', data.identidadeVisual.coresPrincipais, '');
  drawField(
    'Estilo do Site',
    data.identidadeVisual.estiloSite.length > 0
      ? data.identidadeVisual.estiloSite.join(', ')
      : 'Não selecionado'
  );
  drawTextBlock('Sites de Referência / Inspiração', data.identidadeVisual.sitesReferencia);
  y += 2;

  // 3. FOTOS E VÍDEOS
  drawSectionHeader('3. FOTOS, VÍDEOS & ARQUIVOS', '3');
  if (data.midia.uploadedImages && data.midia.uploadedImages.length > 0) {
    checkPageBreak(12);
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`✓ Fotos Anexadas e Salvas na Nuvem (${data.midia.uploadedImages.length} itens):`, margin + 3, y);
    y += 4;

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    data.midia.uploadedImages.forEach((img, idx) => {
      checkPageBreak(8);
      const sizeKb = (img.size / 1024).toFixed(1);
      const cloudLink = img.fullUrl || (img.url ? (typeof window !== 'undefined' ? `${window.location.origin}${img.url}` : img.url) : null);
      if (cloudLink) {
        doc.setFont('helvetica', 'bold');
        doc.text(`  • [Foto ${idx + 1}] ${img.name} (${sizeKb} KB):`, margin + 3, y);
        y += 3.5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(37, 99, 235);
        doc.text(`    ${cloudLink}`, margin + 5, y);
        doc.setTextColor(51, 65, 85);
        y += 4;
      } else {
        doc.text(`  • [Foto ${idx + 1}] ${img.name} (${sizeKb} KB)`, margin + 3, y);
        y += 3.8;
      }
    });
    y += 1.5;
  }
  drawTextBlock('Links Diretos das Imagens', data.midia.linksImagens);
  drawField('Pasta na Nuvem (Drive, Dropbox, OneDrive)', data.midia.arquivosInfo, '');
  drawTextBlock('Observações sobre Mídia', data.midia.observacoes);
  y += 2;

  // 4. REDES SOCIAIS E CONTATOS
  drawSectionHeader('4. REDES SOCIAIS E CONTATOS', '4');
  drawField('WhatsApp Principal', data.contatos.whatsapp);
  drawField('Instagram', data.contatos.instagram, '');
  drawField('Facebook', data.contatos.facebook, '');
  drawField('TikTok', data.contatos.tiktok, '');
  drawField('E-mail Comercial', data.contatos.email, '');
  drawField('Outros Contatos', data.contatos.outros, '');
  y += 2;

  // 5. SOBRE A EMPRESA
  if (data.sobre.historia || data.sobre.sobreNos) {
    drawSectionHeader('5. SOBRE A EMPRESA', '5');
    drawTextBlock('História da Empresa', data.sobre.historia);
    drawTextBlock('Texto "Sobre Nós" / Resumo', data.sobre.sobreNos);
    y += 2;
  }

  // 6. PRODUTOS E SERVIÇOS
  const validProducts = data.produtosServicos.filter(p => p.nome.trim() !== '');
  if (validProducts.length > 0) {
    drawSectionHeader('6. PRINCIPAIS PRODUTOS E SERVIÇOS', '6');
    validProducts.forEach((prod, i) => {
      checkPageBreak(12);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin + 2, y - 1, contentWidth - 4, 7, 1, 1, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`Item ${i + 1}: ${prod.nome}`, margin + 5, y + 3.5);

      if (prod.preco) {
        doc.setTextColor(16, 185, 129);
        doc.text(`R$ ${prod.preco}`, pageWidth - margin - 5, y + 3.5, { align: 'right' });
      }
      y += 8.5;

      if (prod.descricao) {
        drawTextBlock('Descrição', prod.descricao);
      }
      y += 1;
    });
    y += 2;
  }

  // 7. PLANOS E VALORES
  if (data.planos.possuiPlanos || data.planos.detalhes) {
    drawSectionHeader('7. PLANOS E VALORES', '7');
    drawField('Possui Planos / Pacotes?', data.planos.possuiPlanos);
    drawTextBlock('Detalhes dos Planos', data.planos.detalhes);
    y += 2;
  }

  // 8. AGENDAMENTO
  if (data.agendamento.possuiAgendamento || data.agendamento.canais.length > 0) {
    drawSectionHeader('8. AGENDAMENTO ONLINE', '8');
    drawField('Terá Sistema de Agendamento?', data.agendamento.possuiAgendamento);
    drawField(
      'Canais de Agendamento',
      data.agendamento.canais.length > 0 ? data.agendamento.canais.join(', ') : ''
    );
    drawTextBlock('Mais Informações de Agendamento', data.agendamento.maisInformacoes);
    y += 2;
  }

  // 9. HORÁRIOS
  if (data.horarios.segundaSexta || data.horarios.sabados || data.horarios.domingosFeriados) {
    drawSectionHeader('9. HORÁRIO DE FUNCIONAMENTO', '9');
    drawField('Segunda a Sexta', data.horarios.segundaSexta, '');
    drawField('Sábados', data.horarios.sabados, '');
    drawField('Domingos e Feriados', data.horarios.domingosFeriados, '');
    y += 2;
  }

  // 10. LOCALIZAÇÃO
  if (data.localizacao.enderecoExibicao || data.localizacao.exibirMapa) {
    drawSectionHeader('10. LOCALIZAÇÃO NO SITE', '10');
    drawField('Endereço a ser exibido no site', data.localizacao.enderecoExibicao);
    drawField('Ponto de Referência', data.localizacao.pontoReferencia, '');
    drawField('Exibir Mapa Interativo?', data.localizacao.exibirMapa, '');
    y += 2;
  }

  // 11. DIFERENCIAIS
  if (data.diferenciais.itens) {
    drawSectionHeader('11. DIFERENCIAIS DA EMPRESA', '11');
    drawTextBlock('Por que o cliente deve escolher a sua empresa', data.diferenciais.itens);
    y += 2;
  }

  // 12. FRASE DE EFEITO
  if (data.fraseEfeito.frasePrincipal) {
    drawSectionHeader('12. FRASE DE EFEITO (HEADLINE)', '12');
    drawTextBlock('Frase Principal de Impacto', data.fraseEfeito.frasePrincipal);
    y += 2;
  }

  // 13. BOTÕES E AÇÕES
  if (data.botoesAcoes.selecionados.length > 0) {
    drawSectionHeader('13. BOTÕES E CHAMADAS PARA AÇÃO (CTAs)', '13');
    drawField('Botões Principais', data.botoesAcoes.selecionados.join(', '));
    y += 2;
  }

  // 14. DOMÍNIO
  drawSectionHeader('14. REGISTRO DE DOMÍNIO', '14');
  drawField('Possui domínio registrado?', data.dominio.possuiDominio || 'Não informado');
  drawField('Nome do Domínio', data.dominio.nomeDominio, '');
  y += 2;

  // 15. PÁGINAS DO SITE
  if (data.paginasSite.selecionadas.length > 0) {
    drawSectionHeader('15. ESTRUTURA DE PÁGINAS', '15');
    drawField('Páginas / Seções Desejadas', data.paginasSite.selecionadas.join(', '));
    y += 2;
  }

  // 16. REFERÊNCIAS E IDEIAS
  if (data.referencias.gosta || data.referencias.naoQuer) {
    drawSectionHeader('16. REFERÊNCIAS & PREFERÊNCIAS', '16');
    drawTextBlock('O que você GOSTA (Cores, animações, referências)', data.referencias.gosta);
    drawTextBlock('O que você NÃO QUER no site', data.referencias.naoQuer);
    y += 2;
  }

  // 17. ADICIONAIS
  if (data.adicionais.outrasInfo) {
    drawSectionHeader('17. INFORMAÇÕES ADICIONAIS', '17');
    drawTextBlock('Observações Finais', data.adicionais.outrasInfo);
    y += 2;
  }

  // CHECKLIST
  drawSectionHeader('18. CHECKLIST & CONFIRMAÇÃO', '18');
  drawField('Dados e informações conferidos pelo cliente?', data.checklist.confirmou ? 'Sim, confirmado' : 'Não confirmado');
  drawField('Todos os arquivos/fotos foram preparados?', data.checklist.anexouArquivos ? 'Sim, anexados' : 'Pendente');
  y += 4;

  // Final confirmation footer block
  checkPageBreak(22);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Desenvolvimento do Projeto: Gomes Studio', margin + 5, y + 6);

  doc.setTextColor(16, 185, 129);
  doc.text('Canal Oficial de Atendimento: WhatsApp', margin + 5, y + 11);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Este documento serve como registro oficial de briefing para início da criação do website.', margin + 5, y + 15);

  // Add Page Numbers to all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Página ${i} de ${totalPages} • Gomes Studio • Briefing de Desenvolvimento`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Save File
  const safeName = (data.empresa.nome || 'Briefing')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_');
  doc.save(`Briefing_${safeName}.pdf`);
}

export function buildBriefingPDFDocument(data: BriefingData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  const checkPageBreak = (neededSpace: number = 15) => {
    if (y + neededSpace > pageHeight - 20) {
      doc.addPage();
      y = 15;
      drawPageHeaderMini();
    }
  };

  const drawPageHeaderMini = () => {
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 8, 'F');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`BRIEFING PROFISSIONAL - ${data.empresa.nome || 'PROJETO WEB'}`, margin, 5.5);
    doc.text('Desenvolvimento: Gomes Studio', pageWidth - margin, 5.5, { align: 'right' });
    y = 15;
  };

  // --- CAPA / CABEÇALHO PRINCIPAL ---
  doc.setFillColor(11, 19, 38);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('BRIEFING DE DESENVOLVIMENTO DE SITE', margin + 6, y + 9);

  doc.setTextColor(56, 189, 248);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const companyTitle = data.empresa.nome ? data.empresa.nome.toUpperCase() : 'NOVO CLIENTE';
  doc.text(`CLIENTE / EMPRESA: ${companyTitle}`, margin + 6, y + 16);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Gerado em: ${today}  |  Segmento: ${data.empresa.segmento || 'Não informado'}`, margin + 6, y + 23);
  doc.text('Desenvolvimento: Gomes Studio', margin + 6, y + 28);

  y += 38;

  const drawSectionHeader = (title: string, iconNumber: string) => {
    checkPageBreak(14);
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(margin, y, contentWidth, 7.5, 1.5, 1.5, 'F');

    doc.setFillColor(16, 185, 129);
    doc.roundedRect(margin + 2, y + 1.2, 5, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(iconNumber, margin + 4.5, y + 4.7, { align: 'center' });

    doc.setTextColor(248, 250, 252);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 9, y + 5);

    y += 10.5;
  };

  const drawField = (label: string, value: string | undefined | null, defaultValue: string = 'Não informado') => {
    const val = value && value.trim() ? value.trim() : defaultValue;
    if (val === 'Não informado' && defaultValue === '') return;

    checkPageBreak(8);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin + 3, y);

    const labelWidth = doc.getTextWidth(`${label}: `);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');

    const textLines = doc.splitTextToSize(val, contentWidth - labelWidth - 8);
    doc.text(textLines, margin + 3 + labelWidth, y);

    y += textLines.length * 4.2 + 1.5;
  };

  const drawTextBlock = (label: string, text: string | undefined) => {
    if (!text || !text.trim()) return;
    checkPageBreak(15);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin + 3, y);
    y += 4;

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    const textLines = doc.splitTextToSize(text.trim(), contentWidth - 6);
    doc.text(textLines, margin + 3, y);
    y += textLines.length * 4 + 2;
  };

  // 1. INFORMAÇÕES DA EMPRESA
  drawSectionHeader('1. INFORMAÇÕES DA EMPRESA', '1');
  drawField('Nome da Empresa', data.empresa.nome);
  drawField('Ramo / Segmento', data.empresa.segmento);
  drawField('Cidade / Estado', data.empresa.cidadeEstado);
  drawField('Endereço Completo', data.empresa.endereco);
  drawField('Link do Google Maps', data.empresa.googleMapsLink, '');
  y += 2;

  // 2. IDENTIDADE VISUAL
  drawSectionHeader('2. IDENTIDADE VISUAL & DESIGN', '2');
  drawField('Logo Nome / Arquivo', data.identidadeVisual.logoNome, '');
  if (data.identidadeVisual.logoCloudUrl) {
    drawField('Link da Logo (Salva na Nuvem)', data.identidadeVisual.logoCloudUrl, '');
  } else if (data.identidadeVisual.logoUrl && !data.identidadeVisual.logoUrl.startsWith('data:')) {
    drawField('Link da Logo / Imagem', data.identidadeVisual.logoUrl, '');
  }
  drawField('Slogan', data.identidadeVisual.slogan, '');
  drawField('Cores Principais', data.identidadeVisual.coresPrincipais, '');
  drawField(
    'Estilo do Site',
    data.identidadeVisual.estiloSite.length > 0
      ? data.identidadeVisual.estiloSite.join(', ')
      : 'Não selecionado'
  );
  drawTextBlock('Sites de Referência / Inspiração', data.identidadeVisual.sitesReferencia);
  y += 2;

  // 3. FOTOS E VÍDEOS
  drawSectionHeader('3. FOTOS, VÍDEOS & ARQUIVOS', '3');
  if (data.midia.uploadedImages && data.midia.uploadedImages.length > 0) {
    checkPageBreak(12);
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`✓ Fotos Anexadas e Salvas na Nuvem (${data.midia.uploadedImages.length} itens):`, margin + 3, y);
    y += 4;

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    data.midia.uploadedImages.forEach((img, idx) => {
      checkPageBreak(8);
      const sizeKb = (img.size / 1024).toFixed(1);
      const cloudLink = img.fullUrl || (img.url ? (typeof window !== 'undefined' ? `${window.location.origin}${img.url}` : img.url) : null);
      if (cloudLink) {
        doc.setFont('helvetica', 'bold');
        doc.text(`  • [Foto ${idx + 1}] ${img.name} (${sizeKb} KB):`, margin + 3, y);
        y += 3.5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(37, 99, 235);
        doc.text(`    ${cloudLink}`, margin + 5, y);
        doc.setTextColor(51, 65, 85);
        y += 4;
      } else {
        doc.text(`  • [Foto ${idx + 1}] ${img.name} (${sizeKb} KB)`, margin + 3, y);
        y += 3.8;
      }
    });
    y += 1.5;
  }
  drawTextBlock('Links Diretos das Imagens', data.midia.linksImagens);
  drawField('Pasta na Nuvem (Drive, Dropbox, OneDrive)', data.midia.arquivosInfo, '');
  drawTextBlock('Observações sobre Mídia', data.midia.observacoes);
  y += 2;

  // 4. REDES SOCIAIS E CONTATOS
  drawSectionHeader('4. REDES SOCIAIS E CONTATOS', '4');
  drawField('WhatsApp Principal', data.contatos.whatsapp);
  drawField('Instagram', data.contatos.instagram, '');
  drawField('Facebook', data.contatos.facebook, '');
  drawField('TikTok', data.contatos.tiktok, '');
  drawField('E-mail Comercial', data.contatos.email, '');
  drawField('Outros Contatos', data.contatos.outros, '');
  y += 2;

  // 5. SOBRE A EMPRESA
  if (data.sobre.historia || data.sobre.sobreNos) {
    drawSectionHeader('5. SOBRE A EMPRESA', '5');
    drawTextBlock('História da Empresa', data.sobre.historia);
    drawTextBlock('Texto "Sobre Nós" / Resumo', data.sobre.sobreNos);
    y += 2;
  }

  // 6. PRODUTOS E SERVIÇOS
  const validProducts = data.produtosServicos.filter(p => p.nome.trim() !== '');
  if (validProducts.length > 0) {
    drawSectionHeader('6. PRINCIPAIS PRODUTOS E SERVIÇOS', '6');
    validProducts.forEach((prod, i) => {
      checkPageBreak(12);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin + 2, y - 1, contentWidth - 4, 7, 1, 1, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`Item ${i + 1}: ${prod.nome}`, margin + 5, y + 3.5);

      if (prod.preco) {
        doc.setTextColor(16, 185, 129);
        doc.text(`R$ ${prod.preco}`, pageWidth - margin - 5, y + 3.5, { align: 'right' });
      }
      y += 8.5;

      if (prod.descricao) {
        drawTextBlock('Descrição', prod.descricao);
      }
      y += 1;
    });
    y += 2;
  }

  // 7. PLANOS E VALORES
  if (data.planos.possuiPlanos || data.planos.detalhes) {
    drawSectionHeader('7. PLANOS E VALORES', '7');
    drawField('Possui Planos / Pacotes?', data.planos.possuiPlanos);
    drawTextBlock('Detalhes dos Planos', data.planos.detalhes);
    y += 2;
  }

  // 8. AGENDAMENTO
  if (data.agendamento.possuiAgendamento || data.agendamento.canais.length > 0) {
    drawSectionHeader('8. AGENDAMENTO ONLINE', '8');
    drawField('Terá Sistema de Agendamento?', data.agendamento.possuiAgendamento);
    drawField(
      'Canais de Agendamento',
      data.agendamento.canais.length > 0 ? data.agendamento.canais.join(', ') : ''
    );
    drawTextBlock('Mais Informações de Agendamento', data.agendamento.maisInformacoes);
    y += 2;
  }

  // 9. HORÁRIOS
  if (data.horarios.segundaSexta || data.horarios.sabados || data.horarios.domingosFeriados) {
    drawSectionHeader('9. HORÁRIO DE FUNCIONAMENTO', '9');
    drawField('Segunda a Sexta', data.horarios.segundaSexta, '');
    drawField('Sábados', data.horarios.sabados, '');
    drawField('Domingos e Feriados', data.horarios.domingosFeriados, '');
    y += 2;
  }

  // 10. LOCALIZAÇÃO
  if (data.localizacao.enderecoExibicao || data.localizacao.exibirMapa) {
    drawSectionHeader('10. LOCALIZAÇÃO NO SITE', '10');
    drawField('Endereço a ser exibido no site', data.localizacao.enderecoExibicao);
    drawField('Ponto de Referência', data.localizacao.pontoReferencia, '');
    drawField('Exibir Mapa Interativo?', data.localizacao.exibirMapa, '');
    y += 2;
  }

  // 11. DIFERENCIAIS
  if (data.diferenciais.itens) {
    drawSectionHeader('11. DIFERENCIAIS DA EMPRESA', '11');
    drawTextBlock('Por que o cliente deve escolher a sua empresa', data.diferenciais.itens);
    y += 2;
  }

  // 12. FRASE DE EFEITO
  if (data.fraseEfeito.frasePrincipal) {
    drawSectionHeader('12. FRASE DE EFEITO (HEADLINE)', '12');
    drawTextBlock('Frase Principal de Impacto', data.fraseEfeito.frasePrincipal);
    y += 2;
  }

  // 13. BOTÕES E AÇÕES
  if (data.botoesAcoes.selecionados.length > 0) {
    drawSectionHeader('13. BOTÕES E CHAMADAS PARA AÇÃO (CTAs)', '13');
    drawField('Botões Principais', data.botoesAcoes.selecionados.join(', '));
    y += 2;
  }

  // 14. DOMÍNIO
  drawSectionHeader('14. REGISTRO DE DOMÍNIO', '14');
  drawField('Possui domínio registrado?', data.dominio.possuiDominio || 'Não informado');
  drawField('Nome do Domínio', data.dominio.nomeDominio, '');
  y += 2;

  // 15. PÁGINAS DO SITE
  if (data.paginasSite.selecionadas.length > 0) {
    drawSectionHeader('15. ESTRUTURA DE PÁGINAS', '15');
    drawField('Páginas / Seções Desejadas', data.paginasSite.selecionadas.join(', '));
    y += 2;
  }

  // 16. REFERÊNCIAS E IDEIAS
  if (data.referencias.gosta || data.referencias.naoQuer) {
    drawSectionHeader('16. REFERÊNCIAS & PREFERÊNCIAS', '16');
    drawTextBlock('O que você GOSTA (Cores, animações, referências)', data.referencias.gosta);
    drawTextBlock('O que você NÃO QUER no site', data.referencias.naoQuer);
    y += 2;
  }

  // 17. ADICIONAIS
  if (data.adicionais.outrasInfo) {
    drawSectionHeader('17. INFORMAÇÕES ADICIONAIS', '17');
    drawTextBlock('Observações Finais', data.adicionais.outrasInfo);
    y += 2;
  }

  // CHECKLIST
  drawSectionHeader('18. CHECKLIST & CONFIRMAÇÃO', '18');
  drawField('Dados e informações conferidos pelo cliente?', data.checklist.confirmou ? 'Sim, confirmado' : 'Não confirmado');
  drawField('Todos os arquivos/fotos foram preparados?', data.checklist.anexouArquivos ? 'Sim, anexados' : 'Pendente');
  y += 4;

  // Final confirmation footer block
  checkPageBreak(22);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Desenvolvimento do Projeto: Gomes Studio', margin + 5, y + 6);

  doc.setTextColor(16, 185, 129);
  doc.text('Canal Oficial de Atendimento: WhatsApp', margin + 5, y + 11);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Este documento serve como registro oficial de briefing para início da criação do website.', margin + 5, y + 15);

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Página ${i} de ${totalPages} • Gomes Studio • Briefing de Desenvolvimento`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  return doc;
}

export function getBriefingPDFBase64(data: BriefingData): string {
  const doc = buildBriefingPDFDocument(data);
  return doc.output('datauristring');
}

