import { BriefingData } from '../types';

export const sampleBriefingData: BriefingData = {
  // Etapa 01 — Sobre Você
  sobreVoce: {
    nome: 'Carolina Mendonça',
    email: 'carolina@clinicavitalle.com.br',
    whatsapp: '(33) 99876-5432',
  },

  // Etapa 02 — Sobre o Negócio
  sobreNegocio: {
    nomeEmpresa: 'Clínica Vitalle Saúde Integrada',
    segmento: 'Saúde, Fisioterapia & Estética Avançada',
    instagram: '@clinicavitalle.oficial',
    siteAtual: '',
    cidade: 'Nanuque',
    estado: 'MG',
    regioesAtendimento: 'Minha cidade / região',
    outrasRegioes: 'Nanuque, Serra dos Aimorés e Extremo Sul da Bahia',
    possuiEnderecoFisico: 'Sim',
    endereco: 'Av. Santos Dumont',
    numero: '450',
    complemento: 'Sala 204, Edifício Horizonte',
    bairro: 'Centro',
    cep: '39860-000',
    exibirMapa: 'Sim',
    descricaoAtuacao:
      'Somos uma clínica especializada em fisioterapia integrativa, pilates clínico e dermatologia estética. Nosso foco é oferecer um atendimento humanizado, tecnologia de ponta e resultados que melhoram a qualidade de vida e autoestima dos nossos pacientes.',
  },

  // Etapa 03 — Objetivo
  objetivo: {
    principal: 'RECEBER CONTATOS',
    outroDescricao: '',
  },

  // Etapa 04 — Sobre o Projeto
  projeto: {
    produtosServicos:
      '1. Fisioterapia Ortopédica e Recuperação Funcional\n2. Pilates Clínico em aparelhos\n3. Tratamentos de Estética Facial e Corporal\n4. Avaliação Bioimpedância e Consulta Personalizada',
    infoIndispensaveis:
      'Depoimentos reais de pacientes satisfeitos, lista de convênios/atendimentos particulares aceitos, qualificações da equipe de especialistas e botão direto para agendamento no WhatsApp.',
    possuiTextos: 'Tenho parte do conteúdo',
    possuiIdentidadeVisual: 'Sim, tenho logo e identidade visual',
  },

  // Etapa 05 — Referências e Estilo
  referenciasEstilo: {
    sitesGosta: 'https://linear.app, https://clinicaalbert.com.br, layout clean da Apple Health',
    estilos: ['Moderno', 'Elegante', 'Minimalista'],
    naoGosta: 'Cores muito saturadas, poluição visual com excesso de pop-ups ou animações que deixem a página lenta.',
  },

  // Etapa 06 — Materiais
  materiais: {
    statusItens: {
      logo: 'Tenho',
      fotos: 'Tenho',
      videos: 'Em desenvolvimento',
      textos: 'Tenho',
      redesSociais: 'Tenho',
      identidadeVisual: 'Tenho',
      catalogo: 'Em desenvolvimento',
    },
    linkDrive: 'https://drive.google.com/drive/folders/vitalle-materiais-site',
    arquivosUpload: [],
    observacoes: 'Temos sessão de fotos profissionais em alta resolução na pasta do Drive acima.',
  },

  // Etapa 07 — Contato e Direcionamento
  contato: {
    canalPrincipal: 'WhatsApp',
    canalPrincipalValor: '(33) 99876-5432 (Atendimento e Agendamentos)',
    whatsapp: '(33) 99876-5432',
    instagram: '@clinicavitalle.oficial',
    telefone: '(33) 3621-1234',
    email: 'atendimento@clinicavitalle.com.br',
    outro: '',
  },

  // Etapa 08 — Informações Adicionais & Finalização
  informacoesAdicionais: {
    detalhesExtras:
      'Gostaríamos que a página tivesse uma paleta com tons suaves de azul e verde sage, transmitindo serenidade e autoridade clínica. O público principal são pessoas que buscam alívio de dores ou cuidados com bem-estar.',
    concordouPrivacidade: true,
  },
};
