export async function generateAnswer(prompt) {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3.2:3b",
            prompt,
            stream: false,
            options: {
                temperature: 0.3,
                num_predict: 500,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama LLM failed: ${response.statusText}`);
    }

    const data = await response.json();

    return data.response;
}