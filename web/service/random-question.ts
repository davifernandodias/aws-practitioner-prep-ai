import { promises as fs } from 'fs';
import path from "path";

/**
 * @param id number
 * @return Question
 */
export async function getQuestionRandomQuestion(id: number, group_by_topic?: string, level_of_complexity?: number) : Promise<IResponseGetRandomQuestion> {
  try {
    // Resolve o caminho exato do arquivo JSON
    const resolvePath = path.resolve(process.cwd(), "data/data_question.json");

    // Responsável por ler o arquivo
    const data = await fs.readFile(resolvePath, "utf8");

    // Converte para JSON
    const dataJson = await JSON.parse(data);


    // Verifica se não retornou o json, retorna código 0 (representa o erro)
    if (!dataJson) {
      return {
        sucess: false,
        message:"Ocorreu um erro para buscar a pergunta, entre em contato com desenvolvedor.",
        question: false,
        erro: true,
        code: 1
      };
    }

    // Retorna corretamente a questão com base no id que foi recebido e o código 1 (representa sucesso)
    return {
      sucess: true,
      message: "Questão criada com sucesso.",
      question: dataJson[id],
      erro: false,
      code: 0
    };

  } catch (error) {

    // Retorna o erro e código 2 (representa erro inesperado)
    return {
      sucess: false,
      message: "Erro durante a criação das perguntas, entre em contato com desenvolvedor.",
      question: false,
      erro: error,
      code: 2
    };
  }
}
