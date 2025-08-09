import { create } from 'zustand';



// Inicialmente os valores como 100 == (100%) e de acordo com as respostas, se errar vai descontando o valor
export const useMeasurementTopics = create<MeasurementTopics>((set) => ({
  compute: 100,
  storage: 100,
  database: 100,
  networking_and_content_delivery: 100,
  security_identity_and_compliance: 100,

  setCompute: (value) => set({ compute: value }),
  setStorage: (value) => set({ storage: value }),
  setDatabase: (value) => set({ database: value }),
  setNetworkingAndContentDelivery: (value) =>
    set({ networking_and_content_delivery: value }),
  setSecurityIdentityAndCompliance: (value) =>
    set({ security_identity_and_compliance: value }),
}));


// Configuração inicial das questões
export const useConfigurationQuestion = create<ConfigurationState>((set) => ({
  amount_question: 5,
  id_questions: [],
  setAmountQuestion: (value) => set({ amount_question: value }),
  setIdQuestion: (value) => set({ id_questions: value })
}));