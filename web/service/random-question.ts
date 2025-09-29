import { promises as fs } from "fs";
import path from "path";

export async function getQuestionRandomQuestion(
  id: number,
  group_by_topic?: string,
  level_of_complexity?: number
) {
  try {
    // Caminhos possíveis (ordem de prioridade)
    const possiblePaths = [
      path.join(process.cwd(), "data/data_question.json"),
      path.join(process.cwd(), "public/data/data_question.json"),
      path.join(process.cwd(), "public/data_question.json"),
      path.join(process.cwd(), "/data_question.json")
    ];

    let resolvePath = null;

    // Verifica qual existe (local ou produção)
    for (const p of possiblePaths) {
      try {
        await fs.access(p);
        resolvePath = p;
        break;
      } catch {}
    }

    if (!resolvePath) {
      return {
        sucess: false,
        message: "Arquivo data_question.json não encontrado.",
        question: false,
        erro: true,
        code: 1,
      };
    }

    const data = await fs.readFile(resolvePath, "utf8");
    const dataJson = JSON.parse(data);

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
