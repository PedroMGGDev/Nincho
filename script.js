document.addEventListener("DOMContentLoaded", function () {
  const output = document.getElementById("output");
  const errorLog = document.getElementById("errorLog");

  // Verifica se a chave da API está correta
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    errorLog.innerHTML = "<strong>Erro:</strong> Chave da API não encontrada. Verifique as variáveis de ambiente na Vercel.";
    return;
  }

  document.getElementById("gerar").addEventListener("click", async function () {
    const niche = document.getElementById("niche").value;
    const platform = document.getElementById("platform").value;

    output.innerHTML = "⏳ Gerando roteiro...";
    errorLog.innerHTML = ""; // Limpa erros anteriores

    // Se o usuário não escrever um nicho, mostra um erro
    if (!niche.trim()) {
      errorLog.innerHTML = "<strong>Erro:</strong> O nicho não pode estar vazio!";
      return;
    }

    try {
      errorLog.innerHTML = "🔹 Enviando solicitação para OpenAI..."; // Mostra status na página

      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "text-davinci-003",
          prompt: `Crie um roteiro para um vídeo sobre ${niche} para a plataforma ${platform}.`,
          max_tokens: 150
        })
      });

      errorLog.innerHTML = "🔹 Resposta recebida da OpenAI."; // Atualiza status

      const data = await response.json();

      // Se houver erro na resposta, mostra na tela
      if (!response.ok) {
        throw new Error(data.error ? data.error.message : "Erro desconhecido da API.");
      }

      // Exibe o roteiro gerado na tela
      output.innerHTML = `<strong>✅ Roteiro Gerado:</strong> <br> ${data.choices[0].text}`;
    } catch (error) {
      errorLog.innerHTML = `<strong>❌ Erro:</strong> ${error.message}`;
    }
  });
});
