import { jsPDF } from 'jspdf';
import { BriefingData } from '../types';

export function buildBriefingPDFDoc(data: BriefingData): jsPDF {
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

  const clientName = data.sobreVoce?.nome || data.empresa?.nome || 'Cliente';
  const companyName = data.sobreNegocio?.nomeEmpresa || data.empresa?.nome || clientName;

  const checkPageBreak = (neededSpace: number = 16) => {
    if (y + neededSpace > pageHeight - 18) {
      doc.addPage();
      y = 15;
      drawPageHeaderMini();
    }
  };

  const drawPageHeaderMini = () => {
    doc.setFillColor(11, 19, 38);
    doc.rect(0, 0, pageWidth, 8, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`GOMES STUDIO • BRIEFING DE PRESENÇA DIGITAL - ${companyName.toUpperCase()}`, margin, 5.5);
    doc.text('gomesstudio.com', pageWidth - margin, 5.5, { align: 'right' });
    y = 15;
  };

  // --- HEADER HERO ---
  doc.setFillColor(7, 10, 16);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'F');
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'S');

  // Eyebrow Brand
  doc.setTextColor(56, 189, 248);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('GOMES STUDIO', margin + 6, y + 8);

  // Main Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('BRIEFING DE PRESENÇA DIGITAL', margin + 6, y + 15);

  // Subtitle
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`EMPRESA: ${companyName.toUpperCase()}  |  CONTATO: ${clientName}`, margin + 6, y + 21.5);

  // Date and Slogan
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  const dateStr = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`"Design que conecta, soluções que impulsionam"  •  Gerado em ${dateStr}`, margin + 6, y + 27.5);
  doc.text('WhatsApp Oficial: (33) 99103-1052  •  https://lucasgomes3621-ui.github.io/Gomes-Studio-/', margin + 6, y + 32);

  y += 42;

  // Helper function to draw section header
  const drawSectionHeader = (numberStr: string, title: string) => {
    checkPageBreak(14);
    doc.setFillColor(15, 23, 42); // slate-900
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setDrawColor(30, 41, 59);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'S');

    doc.setFillColor(0, 102, 255);
    doc.roundedRect(margin + 1.5, y + 1.5, 4, 4, 1, 1, 'F');

    doc.setTextColor(56, 189, 248);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(numberStr, margin + 8, y + 5);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.text(title.toUpperCase(), margin + 16, y + 5);
    y += 10;
  };

  const drawRow = (label: string, value: string | undefined | null) => {
    if (!value || !value.trim()) return;
    checkPageBreak(9);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin + 3, y);

    doc.setTextColor(241, 245, 249);
    doc.setFont('helvetica', 'normal');
    const labelWidth = doc.getTextWidth(`${label}: `);
    const textLines = doc.splitTextToSize(value.trim(), contentWidth - labelWidth - 8);

    if (textLines.length === 1) {
      doc.text(textLines[0], margin + 3 + labelWidth, y);
      y += 5.5;
    } else {
      y += 4.5;
      textLines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin + 6, y);
        y += 4.5;
      });
      y += 1;
    }
  };

  const drawTextBlock = (label: string, text: string | undefined | null) => {
    if (!text || !text.trim()) return;
    checkPageBreak(12);
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 3, y);
    y += 4.5;

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const splitLines = doc.splitTextToSize(text.trim(), contentWidth - 8);
    splitLines.forEach((line: string) => {
      checkPageBreak(6);
      doc.text(line, margin + 5, y);
      y += 4.2;
    });
    y += 2.5;
  };

  // --- 01. SOBRE VOCÊ ---
  drawSectionHeader('01', 'Sobre Você');
  drawRow('Nome do Responsável', data.sobreVoce?.nome);
  drawRow('E-mail de Contato', data.sobreVoce?.email);
  drawRow('WhatsApp', data.sobreVoce?.whatsapp);
  y += 3;

  // --- 02. SOBRE O NEGÓCIO ---
  drawSectionHeader('02', 'Sobre o Negócio');
  drawRow('Nome da Empresa', data.sobreNegocio?.nomeEmpresa);
  drawRow('Ramo / Segmento', data.sobreNegocio?.segmento);
  drawRow('Instagram Oficial', data.sobreNegocio?.instagram);
  drawRow('Site Atual', data.sobreNegocio?.siteAtual);
  
  const cidadeUf = [data.sobreNegocio?.cidade, data.sobreNegocio?.estado].filter(Boolean).join(' - ');
  drawRow('Cidade / UF', cidadeUf);
  drawRow('Regiões Atendidas', data.sobreNegocio?.regioesAtendimento);
  drawRow('Detalhes das Regiões', data.sobreNegocio?.outrasRegioes);

  if (data.sobreNegocio?.possuiEnderecoFisico === 'Sim') {
    const enderecoCompleto = [
      data.sobreNegocio.endereco,
      data.sobreNegocio.numero ? `nº ${data.sobreNegocio.numero}` : '',
      data.sobreNegocio.complemento,
      data.sobreNegocio.bairro,
      data.sobreNegocio.cep ? `CEP: ${data.sobreNegocio.cep}` : '',
    ].filter(Boolean).join(', ');
    drawRow('Endereço Físico', enderecoCompleto);
    drawRow('Exibir Mapa Interativo', data.sobreNegocio.exibirMapa);
  } else if (data.sobreNegocio?.possuiEnderecoFisico === 'Não') {
    drawRow('Endereço Físico na Página', 'Não');
  }

  drawTextBlock('O que a empresa faz / Proposta de valor:', data.sobreNegocio?.descricaoAtuacao);
  y += 3;

  // --- 03. OBJETIVO DA PÁGINA ---
  drawSectionHeader('03', 'Objetivo da Página');
  drawRow('Principal Objetivo', data.objetivo?.principal);
  drawTextBlock('Detalhes do Objetivo:', data.objetivo?.outroDescricao);
  y += 3;

  // --- 04. SOBRE O PROJETO ---
  drawSectionHeader('04', 'Sobre o Projeto');
  drawTextBlock('Produtos / Serviços em Destaque:', data.projeto?.produtosServicos);
  drawTextBlock('Informações Indispensáveis na Página:', data.projeto?.infoIndispensaveis);
  drawRow('Possui Textos Prontos', data.projeto?.possuiTextos);
  drawRow('Possui Identidade Visual', data.projeto?.possuiIdentidadeVisual);
  y += 3;

  // --- 05. REFERÊNCIAS E ESTILO ---
  drawSectionHeader('05', 'Referências e Estilo');
  drawTextBlock('Páginas / Sites de Referência:', data.referenciasEstilo?.sitesGosta);
  if (data.referenciasEstilo?.estilos && data.referenciasEstilo.estilos.length > 0) {
    drawRow('Estilos Visuais Escolhidos', data.referenciasEstilo.estilos.join(', '));
  }
  drawTextBlock('O que NÃO gostaria que aparecesse:', data.referenciasEstilo?.naoGosta);
  y += 3;

  // --- 06. MATERIAIS ---
  drawSectionHeader('06', 'Materiais Disponíveis');
  if (data.materiais?.statusItens) {
    const labels: Record<string, string> = {
      logo: 'Logotipo',
      fotos: 'Fotos',
      videos: 'Vídeos',
      textos: 'Textos',
      redesSociais: 'Redes Sociais',
      identidadeVisual: 'Identidade Visual',
      catalogo: 'Catálogo / Apresentação',
    };
    const items = Object.entries(data.materiais.statusItens).filter(([_, val]) => Boolean(val));
    if (items.length > 0) {
      const summary = items.map(([k, v]) => `${labels[k] || k}: ${v}`).join('  |  ');
      drawTextBlock('Status dos Materiais:', summary);
    }
  }
  drawRow('Link Nuvem (Drive/Dropbox)', data.materiais?.linkDrive);
  if (data.materiais?.arquivosUpload && data.materiais.arquivosUpload.length > 0) {
    drawRow('Arquivos Enviados no Briefing', `${data.materiais.arquivosUpload.length} arquivo(s) registrado(s)`);
  }
  drawTextBlock('Observações sobre Materiais:', data.materiais?.observacoes);
  y += 3;

  // --- 07. CONTATO E DIRECIONAMENTO ---
  drawSectionHeader('07', 'Contato e Direcionamento');
  drawRow('Principal Canal de Conversão', data.contato?.canalPrincipal);
  drawRow('Dado do Canal Principal', data.contato?.canalPrincipalValor);
  drawRow('WhatsApp', data.contato?.whatsapp);
  drawRow('Instagram', data.contato?.instagram);
  drawRow('Telefone Comercial', data.contato?.telefone);
  drawRow('E-mail de Contato', data.contato?.email);
  drawRow('Outro Canal', data.contato?.outro);
  y += 3;

  // --- 08. INFORMAÇÕES ADICIONAIS ---
  drawSectionHeader('08', 'Informações Adicionais');
  drawTextBlock('Detalhes e Observações Finais:', data.informacoesAdicionais?.detalhesExtras || 'Nenhuma observação adicional.');
  drawRow('Concordância com Uso de Dados', data.informacoesAdicionais?.concordouPrivacidade ? 'Sim (Termos Aceitos)' : 'Pendente');
  y += 6;

  // --- RODAPÉ FINAL ---
  checkPageBreak(20);
  doc.setFillColor(11, 19, 38);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'F');
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'S');

  doc.setTextColor(56, 189, 248);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('GOMES STUDIO • DESIGN QUE CONECTA, SOLUÇÕES QUE IMPULSIONAM', margin + 5, y + 6);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Documento gerado automaticamente pelo Briefing de Presença Digital. Todos os direitos reservados.', margin + 5, y + 11.5);

  return doc;
}

export function generateBriefingPDF(data: BriefingData): void {
  const doc = buildBriefingPDFDoc(data);
  const companyName = (data.sobreNegocio?.nomeEmpresa || data.sobreVoce?.nome || 'Cliente')
    .replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Briefing_Presenca_Digital_${companyName}.pdf`);
}

export function getBriefingPDFBase64(data: BriefingData): string {
  const doc = buildBriefingPDFDoc(data);
  const dataUri = doc.output('datauristring');
  const commaIndex = dataUri.indexOf(',');
  return commaIndex !== -1 ? dataUri.substring(commaIndex + 1) : dataUri;
}
