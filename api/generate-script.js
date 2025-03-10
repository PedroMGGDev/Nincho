import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { niche, platform } = req.body;

    // Verifique se o nicho e a plataforma foram enviados corretamente
    if (!niche || !platform) {
      return res.status(400).json({ error: 'Nicho e plataforma são obrigatórios!' });
    }

    const apiKey = process.env.OPENAI_API_KEY; // Pega a chave da API do Vercel

    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API não configurada no Vercel.' });
    }

    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: `Crie um roteiro para um vídeo sobre ${niche} para a plataforma ${platform}.`,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao acessar a OpenAI.');
      }

      const data = await response.json();
      return res.json({ script: data.choices[0].text });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
