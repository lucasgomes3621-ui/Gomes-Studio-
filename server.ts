import express from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const BRIEFINGS_DIR = path.join(process.cwd(), 'briefings_data');
const DEFAULT_TARGET_EMAIL = process.env.TARGET_EMAIL || 'lucasgomes3621@gmail.com';

// Ensure storage directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(BRIEFINGS_DIR)) {
  fs.mkdirSync(BRIEFINGS_DIR, { recursive: true });
}

// Helper to create a nodemailer transporter
async function getEmailTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Fallback to ethereal test transporter or local logging
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn('Could not create ethereal test account, using json transport', err);
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }
}

async function startServer() {
  const app = express();

  // Middleware for parsing large JSON base64 payloads (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Static uploads serving
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Upload / Save Generated PDF Endpoint
  app.post('/api/upload-pdf', (req, res) => {
    try {
      const { pdfBase64, companyName } = req.body;
      if (!pdfBase64) {
        return res.status(400).json({ error: 'Nenhum dado de PDF fornecido.' });
      }

      const rawBase64 = pdfBase64.includes('base64,') ? pdfBase64.split('base64,')[1] : pdfBase64;
      const buffer = Buffer.from(rawBase64, 'base64');

      const safeName = (companyName || 'Cliente').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
      const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const fileName = `Briefing_${safeName}_${uniqueSuffix}.pdf`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(filePath, buffer);

      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
      const fullUrl = `${protocol}://${host}/uploads/${fileName}`;
      const relativeUrl = `/uploads/${fileName}`;

      return res.json({
        success: true,
        fileName,
        url: relativeUrl,
        fullUrl,
        size: buffer.length,
      });
    } catch (err: any) {
      console.error('Erro ao salvar PDF:', err);
      return res.status(500).json({ error: 'Falha ao salvar PDF no servidor.', details: err.message });
    }
  });

  // Upload single file endpoint
  app.post('/api/upload', (req, res) => {
    try {
      const { name, dataUrl, type } = req.body;
      if (!dataUrl || !name) {
        return res.status(400).json({ error: 'Arquivo inválido ou sem dados base64.' });
      }

      // Extract base64 content
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = '.jpg';

      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], 'base64');
        const mimeType = matches[1];
        if (mimeType.includes('png')) extension = '.png';
        else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = '.jpg';
        else if (mimeType.includes('webp')) extension = '.webp';
        else if (mimeType.includes('pdf')) extension = '.pdf';
        else if (mimeType.includes('svg')) extension = '.svg';
      } else {
        const rawBase64 = dataUrl.includes('base64,') ? dataUrl.split('base64,')[1] : dataUrl;
        buffer = Buffer.from(rawBase64, 'base64');
      }

      // Sanitize filename
      const safeBaseName = name.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
      const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const fileName = `${uniqueSuffix}_${safeBaseName}${extension}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(filePath, buffer);

      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
      const fullUrl = `${protocol}://${host}/uploads/${fileName}`;
      const relativeUrl = `/uploads/${fileName}`;

      return res.json({
        success: true,
        fileName,
        url: relativeUrl,
        fullUrl,
        size: buffer.length,
      });
    } catch (err: any) {
      console.error('Erro no upload:', err);
      return res.status(500).json({ error: 'Falha ao salvar arquivo no servidor.', details: err.message });
    }
  });

  // Send briefing by email with PDF attachment
  app.post('/api/send-email', async (req, res) => {
    try {
      const { briefingData, pdfBase64, messageText, targetEmail } = req.body;
      const recipient = targetEmail || DEFAULT_TARGET_EMAIL;
      const companyName = briefingData?.empresa?.nome || 'Novo Cliente';
      const safeName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '_');

      // Save a local JSON backup of the briefing submission
      const submissionId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const backupPath = path.join(BRIEFINGS_DIR, `briefing_${submissionId}_${safeName}.json`);
      fs.writeFileSync(
        backupPath,
        JSON.stringify(
          {
            submissionId,
            companyName,
            recipient,
            briefingData,
            createdAt: new Date().toISOString(),
          },
          null,
          2
        )
      );

      // Prepare PDF Attachment
      const attachments: any[] = [];
      if (pdfBase64) {
        const base64Data = pdfBase64.includes('base64,') ? pdfBase64.split('base64,')[1] : pdfBase64;
        attachments.push({
          filename: `Briefing_${companyName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`,
          content: Buffer.from(base64Data, 'base64'),
          contentType: 'application/pdf',
        });
      }

      // Build media links summary for HTML
      const uploadedImages = briefingData?.midia?.uploadedImages || [];
      const mediaHtmlList = uploadedImages
        .map((img: any, idx: number) => {
          const directUrl = img.fullUrl || (img.url ? `${req.protocol}://${req.headers.host || `localhost:${PORT}`}${img.url}` : '');
          return `<li style="margin-bottom: 6px;">
            <strong>Foto ${idx + 1}:</strong> ${img.name} (${(img.size / 1024).toFixed(0)} KB) 
            ${directUrl ? `- <a href="${directUrl}" target="_blank" style="color: #3b82f6; text-decoration: underline;">Visualizar / Baixar Imagem</a>` : ''}
          </li>`;
        })
        .join('');

      const logoCloudUrl = briefingData?.identidadeVisual?.logoCloudUrl;

      // Build HTML email template
      const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1326; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 680px; margin: 0 auto;">
          <div style="border-bottom: 2px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
            <span style="background-color: #10b981; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase;">
              Novo Briefing Recebido
            </span>
            <h1 style="color: #ffffff; font-size: 22px; margin: 10px 0 4px 0;">
              ${companyName}
            </h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">
              Segmento: <strong>${briefingData?.empresa?.segmento || 'Não informado'}</strong> | Cidade: <strong>${briefingData?.empresa?.cidadeEstado || 'Não informada'}</strong>
            </p>
          </div>

          <div style="background-color: #131b2e; border: 1px solid #222a3d; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <h3 style="color: #38bdf8; font-size: 14px; margin-top: 0; margin-bottom: 10px;">
              📱 Contatos do Cliente
            </h3>
            <p style="margin: 4px 0; font-size: 13px; color: #cbd5e1;">
              <strong>WhatsApp:</strong> ${briefingData?.contatos?.whatsapp || 'Não informado'}
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #cbd5e1;">
              <strong>E-mail:</strong> ${briefingData?.contatos?.email || 'Não informado'}
            </p>
            <p style="margin: 4px 0; font-size: 13px; color: #cbd5e1;">
              <strong>Instagram:</strong> ${briefingData?.contatos?.instagram || 'Não informado'}
            </p>
          </div>

          ${
            logoCloudUrl || uploadedImages.length > 0
              ? `
          <div style="background-color: #131b2e; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <h3 style="color: #10b981; font-size: 14px; margin-top: 0; margin-bottom: 10px;">
              📷 Mídias e Identidade Visual Anexadas (${uploadedImages.length} fotos salvas)
            </h3>
            ${
              logoCloudUrl
                ? `<p style="margin: 4px 0 10px 0; font-size: 13px; color: #cbd5e1;">
                    <strong>Logotipo do Projeto:</strong> <a href="${logoCloudUrl}" target="_blank" style="color: #38bdf8; text-decoration: underline; font-weight: bold;">Abrir Logo em Alta Resolução</a>
                  </p>`
                : ''
            }
            ${
              uploadedImages.length > 0
                ? `<ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #94a3b8;">
                    ${mediaHtmlList}
                  </ul>`
                : ''
            }
            ${
              briefingData?.midia?.arquivosInfo
                ? `<p style="margin-top: 10px; font-size: 12px; color: #f59e0b;">
                    <strong>Link do Drive/Nuvem:</strong> <a href="${briefingData.midia.arquivosInfo}" target="_blank" style="color: #fbbf24;">${briefingData.midia.arquivosInfo}</a>
                  </p>`
                : ''
            }
          </div>
          `
              : ''
          }

          <div style="background-color: #131b2e; border: 1px solid #222a3d; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <h3 style="color: #f8fafc; font-size: 14px; margin-top: 0; margin-bottom: 12px;">
              📄 Resumo Completo das Respostas
            </h3>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 12px; line-height: 1.6; color: #cbd5e1; background-color: #0b1326; padding: 12px; border-radius: 6px; border: 1px solid #1e293b; max-height: 400px; overflow-y: auto;">${messageText || 'Relatório gerado em anexo.'}</pre>
          </div>

          <div style="text-align: center; padding-top: 12px; border-top: 1px solid #1e293b; color: #64748b; font-size: 11px;">
            <p style="margin: 0 0 6px 0;">📎 O relatório oficial completo em <strong>PDF</strong> está anexado a esta mensagem.</p>
            <p style="margin: 0;">Briefing Profissional • Desenvolvido para Lucas Gomes</p>
          </div>
        </div>
      `;

      const transporter = await getEmailTransporter();
      const mailOptions = {
        from: process.env.SMTP_FROM || `"Briefing Profissional" <no-reply@briefing.local>`,
        to: recipient,
        subject: `📝 Novo Briefing: ${companyName} - Projeto de Website`,
        text: messageText || `Novo briefing recebido de ${companyName}. Confira o anexo em PDF.`,
        html: htmlContent,
        attachments,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Briefing email sent:', info.messageId || 'Success');

      let previewUrl = null;
      if (nodemailer.getTestMessageUrl(info)) {
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Ethereal Email Preview URL:', previewUrl);
      }

      return res.json({
        success: true,
        recipient,
        messageId: info.messageId,
        previewUrl,
        backupSaved: true,
      });
    } catch (err: any) {
      console.error('Erro ao enviar email de briefing:', err);
      return res.status(500).json({
        success: false,
        error: 'Erro no envio do e-mail.',
        details: err.message,
      });
    }
  });

  // Save complete briefing snapshot for online gallery view
  app.post('/api/briefing/save', (req, res) => {
    try {
      const { briefingData, clientName } = req.body;
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const filePath = path.join(BRIEFINGS_DIR, `${id}.json`);

      fs.writeFileSync(filePath, JSON.stringify({ id, clientName, briefingData, createdAt: new Date().toISOString() }, null, 2));

      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
      const galleryUrl = `${protocol}://${host}/galeria/${id}`;

      return res.json({
        success: true,
        id,
        galleryUrl,
      });
    } catch (err: any) {
      console.error('Erro ao salvar briefing:', err);
      return res.status(500).json({ error: 'Erro ao registrar briefing.' });
    }
  });

  // Retrieve briefing snapshot
  app.get('/api/briefing/:id', (req, res) => {
    try {
      const { id } = req.params;
      const filePath = path.join(BRIEFINGS_DIR, `${id}.json`);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Briefing não encontrado.' });
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      return res.json(JSON.parse(raw));
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao carregar dados.' });
    }
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

