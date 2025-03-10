document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("output");
    const errorLog = document.getElementById("errorLog");
    const status = document.getElementById("status");  // Adicionando a área de status
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

        // Exibe "Processando..." enquanto a requisição está sendo feita
        output.style.display = "none";  // Esconde o campo de output
        status.style.display = "block";  // Exibe a área de status
        status.innerHTML = "🔄 Processando...";

        errorLog.style.display = "none";  // Esconde a área de erro

        if (!niche) {
            errorLog.style.display = "block";
            errorLog.innerHTML = "<strong>Erro:</strong> O nicho não pode estar vazio!";
            return;
        }

        try {
            // Exibe que está enviando a solicitação
            status.innerHTML = "🔄 Enviando solicitação para OpenAI...";

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

            // Verifica se houve erro na resposta da API
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error ? errorData.error.message : "Erro desconhecido da API.");
            }

            const data = await response.json();
            output.style.display = "block";  // Exibe o campo de output
            status.style.display = "none";   // Esconde o status de processamento
            output.innerHTML = `<strong>✅ Roteiro Gerado:</strong> <br> ${data.choices[0].text}`;
        } catch (error) {
            status.style.display = "none";  // Esconde o status de processamento
            errorLog.style.display = "block";  // Exibe o log de erro
            errorLog.innerHTML = `<strong>❌ Erro:</strong> ${error.message}`;
            output.innerHTML = ''; // Limpa o campo de output caso haja erro
        }
    });
});
