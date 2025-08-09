
type Response = {
  alternative_a: string;
  becase_a: string;
  alternative_b: string;
  becase_b: string;
  alternative_c: string;
  becase_c: string;
  alternative_d: string;
  becase_d: string;
};

type Question = {
  id: number;
  title: string;
  group_by_topic: string;
  accept_two_alternatives: boolean;
  level_of_complexity: number;
  response: Response;
};


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


type ConfigurationState = {
  amount_question: number;
  id_questions: number[];
  setAmountQuestion: (value: number) => void;
  setIdQuestion: (value: number[]) => void;
};