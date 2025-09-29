import dataJson from '../data/data_question.json';

export async function getQuestionRandomQuestion(
  id: number,
  group_by_topic?: string,
  level_of_complexity?: number
) {
  try {

    return {
      sucess: true,
      message: "Questão criada com sucesso.",
      question: dataJson[id],
      erro: false,
      code: 0,
    };
  } catch (error) {
    return {
      sucess: false,
      message:
        "Erro durante a criação das perguntas, entre em contato com o desenvolvedor.",
      question: false,
      erro: error,
      code: 2,
    };
  }
}
