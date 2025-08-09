import { useConfigurationQuestion } from '@/store/configuration-question';
import { promises as fs } from 'fs';
import path from "path";

/**
 * @param id number
 * @return Question
 */
export async function getQuestionRandomQuestion(id: number, group_by_topic?: string, level_of_complexity?: number) {
  try {

    // Resolve o caminho exato do arquivo JSON
    const resolvePath = path.resolve(process.cwd(), "data/data_question.json");

    // Responsável por ler o arquivo
    const data = await fs.readFile(resolvePath, "utf8");

    // Converte para JSON
    const dataJson = await JSON.parse(data);

    // Faz validação se retornou algo (quem tem toba tem medo)
    if(!dataJson){
      return {
        sucess: false,
        message: "Ocorreu algum erro durante a criação da pergunta, entre em contato com desenvolvedor.",
        question: null
      }
    }

    // Retorna apenas o registro buscado
    return {
      sucess: true,
      message: "Questão criada com sucesso.",
      question: dataJson[id]
    }

  } catch (error) {
    // Retorna o erro tratado
    return  {
      message: "Erro durante a criação das perguntas, entre em contato com desenvolvedor.",
      erro: error
    };
  }
}
