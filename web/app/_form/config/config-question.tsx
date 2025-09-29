"use client"

import { Input } from "@/components/ui/input"
import { useConfigurationQuestion } from "@/store/configuration-question"


export default function QuestionConfigAmount() {

    // Responsavel por resgatar o valor da quantidade de questões
    const amount_question = useConfigurationQuestion((state) => state.amount_question);
    // Responsavel por setar resgatar o valor da quantidade de questões
    const setAmountQuestion = useConfigurationQuestion((state) => state.setAmountQuestion)


    // Valida se esta dentro do intervalo
    const handleChangeAmountQuestion = (e : string) => {
        let num = Number(e);

        if(num < 1){
            num = 1;
        }
        if(num > 20){
            num = 20
        }
        setAmountQuestion(num);
    }
    return (
        <div>
            <div className="flex sm:flex-col  gap-1.5 mt-5 text-start">
                <p className="md:w-full  font-medium dark:text-white ">Quantidade de questões.</p>
                <Input
                className="w-40 border-gray-400 text-gray-900 dark:text-white"
                type="number"
                value={amount_question}
                onChange={(e) => handleChangeAmountQuestion(e.target.value)}
                />
            </div>
        </div>
    )
}