"use client"

import { Input } from "@/components/ui/input"
import { useConfigurationQuestion } from "@/store/configuration-question"


export default function QuestionConfigAmount() {

    // Responsavel por resgatar o valor da quantidade de questões
    const amount_question = useConfigurationQuestion((state) => state.amount_question);
    // Responsavel por setar resgatar o valor da quantidade de questões
    const setAmountQuestion = useConfigurationQuestion((state) => state.setAmountQuestion)


    // Valida se esta dentro do intervalo
    const handleChangeAmountQuestion = (e : any) => {
        if(e < 1){
            e = 1;
        }
        if(e > 20){
            e = 20
        }
        setAmountQuestion(e);
    }
    return (
        <div>
            <div className="flex sm:flex-col  gap-1.5 mt-5 text-start">
                <p className="md:w-full  font-medium text-gray-900 ">Quantidade de questões.</p>
                <Input
                className="w-40 border-gray-400 text-gray-900"
                type="number"
                value={amount_question}
                onChange={(e) => handleChangeAmountQuestion(e.target.value)}
                />
            </div>
        </div>
    )
}