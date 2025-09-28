

// Resposta tem uma estrutura de array, sendo nele a alterantiva (opção) que usuário vai escolher, because (motivo) de ser a resposta certa ou a errada e a rep que seria se está correta ou não
// true = resposta certa
// false = resposta incorreta
type ResponseItem = {
  because: string,
  alternative: string,
  rep: boolean
}



// Questão tem uma estrutura simples, formado pelo seu id, titulo, grupo (segurança, computação etc..) e se aceita duas alternativas e o array de objectos da resposta
type Question = {
  id: number;
  title: string;
  group_by_topic: string;
  accept_two_alternatives: boolean;
  level_of_complexity: number;
  response: Array<ResponseItem>;
};


// Controlador implementado no store, basicamente e a lógica que consegue controlar quais questões deve buscar no json, a lógica e simples, e similar a redação do enem
// Começa com 100% e de acordo o erro do usuario vai diminuindo e o mesmo vale para acerto que no caso aumenta o valor
type MeasurementTopics = {
  compute: number;
  storage: number;
  database: number;
  networking_and_content_delivery: number;
  security_identity_and_compliance: number;

  setCompute: (value: number) => void;
  setStorage: (value: number) => void;
  setDatabase: (value: number) => void;
  setNetworkingAndContentDelivery: (value: number) => void;
  setSecurityIdentityAndCompliance: (value: number) => void;
};

// Também implementado no store, aguarda o valor da quantidade de questões vai ser apresentado no quiz
type ConfigurationState = {
  amount_question: number;
  id_questions: number[];
  setAmountQuestion: (value: number) => void;
  setIdQuestion: (value: number[]) => void;
};
