"use server"

import { getQuestionRandomQuestion } from "@/service/random-question"

// Resgata a questão
export const SendQuestionsAndAnswers = async (currentState: any, formData: FormData) => {
    try {
        // Salva os ids recebidos (string)
        const stringIds = formData.get("id_array");

        // confere se stringIds existe e é string, se sim converte para numero e passa pra um array
        const arrayIds = typeof stringIds === "string" ? stringIds.split(",").map(Number) : [];

        // Consulta via service serve side (utilizado o primeiro id)
        const response = await getQuestionRandomQuestion(arrayIds[0])
        console.log("acabou")

        // Valida se não retornou a questão
        if (response.question == null) {
            return {
                // Retorna msg de que não foi retornado nada
                error: response.message || "Nenhuma questão encontrada."
            }
        }

        // Valida se não tem erro
        if (response.erro) {
            return {
                // Retorna msg de erro
                error: response.message || "Erro ao buscar a questão."
            }
        }

        // Caso passe por todas as validações, cai no caso de sucesso e retorna a msg e a questão
        return {
            message: response.message,
            question: response.question
        }
    } catch (error) {
        console.log('erro durante o envio das repostas: in action')
        // Retorna um estado de erro para o useActionState
        return {
            error: "Ocorreu um erro ao processar a solicitação."
        }
    }
}