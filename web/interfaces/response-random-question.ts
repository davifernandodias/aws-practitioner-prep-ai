interface IResponseGetRandomQuestion {
    sucess: boolean;
    message: string;
    question: Question|boolean;
    erro: boolean|unknown;
    code: number;
}