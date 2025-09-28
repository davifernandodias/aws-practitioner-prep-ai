"use server"

import { getQuestionRandomQuestion } from "@/service/random-question";




// Action que dispara a busca pro service que retorna a questão com base no id aleatório
export const SendQuestionsAndAnswers = async (currentState: unknown, formData: FormData) => {
    try {
        // Salva os ids recebidos (string)
        const stringIds = formData.get("id_array");

        // confere se stringIds existe e é string, se sim converte para numero e passa pra um array
        const arrayIds = typeof stringIds === "string" ? stringIds.split(",").map(Number) : [];

        // Consulta via service serve side (utilizado o primeiro id)
        const response = await getQuestionRandomQuestion(arrayIds[0])

        // Verifica se retornou algum tipo de erro
        if(response.code != 0 || response.erro || !response.sucess){

            // Retorna a mensagem recebida
            return {
                error: response.message,
                question: false
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