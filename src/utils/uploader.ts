/**
 * Cloud and Server Uploader Utility
 * Uploads media assets automatically so direct links can be shared effortlessly via WhatsApp and PDF.
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  fullUrl?: string;
  error?: string;
}

export async function uploadBriefingPDF(pdfBase64: string, companyName: string): Promise<UploadResult> {
  try {
    const response = await fetch('/api/upload-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdfBase64,
        companyName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload do PDF falhou: status ${response.status}`);
    }

    const json = await response.json();
    return {
      success: true,
      url: json.url,
      fullUrl: json.fullUrl,
    };
  } catch (error: any) {
    console.error('Falha ao salvar PDF no servidor:', error);
    return {
      success: false,
      error: error?.message || 'Erro ao gerar link online do PDF.',
    };
  }
}

export async function uploadMediaItem(name: string, dataUrl: string, type?: string): Promise<UploadResult> {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        dataUrl,
        type: type || 'image/jpeg',
      }),
    });

    if (!response.ok) {
      throw new Error(`Upload falhou: status ${response.status}`);
    }

    const json = await response.json();
    return {
      success: true,
      url: json.url,
      fullUrl: json.fullUrl,
    };
  } catch (error: any) {
    console.error('Falha ao enviar imagem para a nuvem:', error);
    return {
      success: false,
      error: error?.message || 'Erro de conexão no upload.',
    };
  }
}

export async function saveBriefingSnapshot(clientName: string, briefingData: any): Promise<{ id: string; galleryUrl: string } | null> {
  try {
    const response = await fetch('/api/briefing/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName,
        briefingData,
      }),
    });

    if (!response.ok) return null;
    const json = await response.json();
    return { id: json.id, galleryUrl: json.galleryUrl };
  } catch (e) {
    console.error('Erro ao registrar briefing:', e);
    return null;
  }
}

export interface EmailSendResult {
  success: boolean;
  recipient?: string;
  previewUrl?: string;
  error?: string;
}

export async function sendBriefingByEmail(
  briefingData: any,
  pdfBase64?: string,
  messageText?: string,
  targetEmail: string = 'lucasgomes3621@gmail.com'
): Promise<EmailSendResult> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        briefingData,
        pdfBase64,
        messageText,
        targetEmail,
      }),
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.error || 'Falha ao enviar e-mail.');
    }

    return {
      success: true,
      recipient: json.recipient,
      previewUrl: json.previewUrl,
    };
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error);
    return {
      success: false,
      error: error?.message || 'Erro de conexão no envio do e-mail.',
    };
  }
}

