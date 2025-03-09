document.getElementById('generate').addEventListener('click', generateScript);

async function generateScript() {
  const niche = document.getElementById('niche').value;
  const platform = document.getElementById('platform').value;
  const scriptResult = document.getElementById('scriptResult');
  const errorLogs = document.getElementById('errorLogs');
  
  // Limpar resultado e logs de erro
  scriptResult.innerHTML = '';
  errorLogs.textContent = '';

  if (!niche) {
    logError("Por favor, insira o nicho.");
    return;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY`  // Substitua YOUR_API_KEY pela sua chave de API da OpenAI
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Crie um roteiro para um vídeo sobre ${niche} para a plataforma ${platform}.`,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar o roteiro');
    }

    const data = await response.json();
    scriptResult.innerHTML = `<p><strong>Roteiro:</strong> ${data.choices[0].text}</p>`;
  } catch (error) {
    logError(error.message);
  }
}

function logError(message) {
  const errorLogs = document.getElementById('errorLogs');
  const currentLogs = errorLogs.textContent;
  errorLogs.textContent = `${currentLogs}\n${new Date().toLocaleString()} - ${message}`;
}
