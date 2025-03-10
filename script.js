document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("output");
    const errorLog = document.getElementById("errorLog");
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Variável da Vercel

    // Testa se a API Key está disponível
    if (!apiKey) {
        errorLog.style.display = "block";
        errorLog.innerHTML = "<strong>Erro:</strong> Chave da API não encontrada. Configure a variável NEXT_PUBLIC_OPENAI_API_KEY na Vercel.";
        return;
    }

    document.getElementById("gerar").addEventListener("click", async function () {
        const niche = document.getElementById("niche").value.trim();
        const platform = document.getElementById("platform").value;

        // Exibe "Processando..." na tela enquanto o script está sendo executado
        output.style.display = "block";
        output.innerHTML = "🔄 Processando...";

        errorLog.style.display = "none";  // Esconde a área de erro

        if (!niche) {
            errorLog.style.display = "block";
            errorLog.innerHTML = "<strong>Erro:</strong> O nicho não pode estar vazio!";
            return;
        }

        try {
            // Exibe que está enviando a solicitação
            errorLog.style.display = "none"; // Limpa os logs de erro
            output.innerHTML = "🔄 Enviando solicitação para OpenAI...";

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

            // Exibe mensagem após receber a resposta
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error ? errorData.error.message : "Erro desconhecido da API.");
            }

            const data = await response.json();
            output.innerHTML = `<strong>✅ Roteiro Gerado:</strong> <br> ${data.choices[0].text}`;
        } catch (error) {
            errorLog.style.display = "block";
            errorLog.innerHTML = `<strong>❌ Erro:</strong> ${error.message}`;
            output.innerHTML = ''; // Limpa o campo de output caso haja erro
        }
    });
});
