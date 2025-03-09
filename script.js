document.addEventListener("DOMContentLoaded", function () {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    alert("Erro: Chave da API não encontrada. Verifique as variáveis de ambiente na Vercel.");
    return;
  }

  document.getElementById("gerar").addEventListener("click", async function () {
    const niche = document.getElementById("niche").value;
    const platform = document.getElementById("platform").value;
    const output = document.getElementById("output");
    const errorLog = document.getElementById("errorLog");

    output.innerHTML = "Gerando roteiro...";
    errorLog.innerHTML = "";

    try {
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

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      output.innerHTML = `<strong>Roteiro Gerado:</strong> <br> ${data.choices[0].text}`;
    } catch (error) {
      errorLog.innerHTML = `<strong>Erro:</strong> ${error.message}`;
    }
  });
});
