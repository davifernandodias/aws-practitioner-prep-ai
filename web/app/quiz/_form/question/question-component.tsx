"use client";

import { useActionState, useEffect, useState } from "react";
import { SendQuestionsAndAnswers } from "./action";
import { Progress } from "@/components/ui/progress";
import { useConfigurationQuestion } from "@/store/configuration-question";
import { ModeToggle } from "@/components/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";


export default function QuestionComponent() {
    // Estado para acompanhar o envio da resposta e o carregamento
    const [state, action, isPending] = useActionState(SendQuestionsAndAnswers, null);
    // Resgata a quantidade de perguntas definidas
    const amount_question = useConfigurationQuestion((state) => state.amount_question);
    // Controla a página atual (inicia em 0)
    const [pageIndex, setPageIndex] = useState(0);
    // Controla o progresso da barra
    const [progress, setProgress] = useState(0);
    // Controla o dialog quando finaliza as perguntas
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // Controla resgate das perguntas
    const [initializeQuestions, setInitializeQuestion] = useState(0);
    // Responsável por adicionar ID sem duplicar
    const setIdQuestion = useConfigurationQuestion((state) => state.setIdQuestion);
    // Resgata o array dos ids já inseridos na lista
    const id_questions = useConfigurationQuestion((state) => state.id_questions);
    // Controla o carregamento incial quando entra na pagina
    const [isPedingInitialRequest, setPedingInitialRequest] = useState(false);
    // Controla o tempo esperado apos inicializar a questão
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    // Valida se a pagina inicializa sendo assim chama a consulta das questões
    useEffect(() => {
        if (initializeQuestions === 0) {
            let numberRandom;
            do {
                numberRandom = Math.floor(Math.random() * 300) + 1;
            } while (id_questions.includes(numberRandom));

            // Adiciona o novo ID
            setIdQuestion([...id_questions, numberRandom]);
            // Marca que inicializou para não repetir
            setInitializeQuestion(1);

            // Dispara a request para action
            handleRequestInitialQuestion(numberRandom);
        }
    }, []);

    // Atualiza o progresso sempre que pageIndex ou amount_question mudar
    useEffect(() => {
        if (amount_question > 0) {
            // Calcula o progresso: (índice atual + 1) / total de perguntas * 100
            const newProgress = ((pageIndex + 1) / amount_question) * 100;
            // Garante que não passe de 100%
            setProgress(Math.min(newProgress, 100));
        }
    }, [pageIndex, amount_question]);

    // Reponsavel por realizar primeira consulta na action
    const handleRequestInitialQuestion = async (id: number) => {
        // Ativa o peding
        setPedingInitialRequest(true);
        const formData = new FormData();
        // Envia só o ID atual para simplicidade
        formData.append("id_array", id.toString());
        // Chama a action
        try{
            await action(formData);

        // Apos resgatar a pergunta, passa a ser false
        }finally{
            setPedingInitialRequest(false);
        }
    }

    // Responsavel por controlar a paginação
    const handleNextQuestion = () => {
        // Valida se a pagina atual e menor do que a pagina final - 1 (se for menor que dizer que está dentro do limite)
        if (isButtonDisabled) return;

        // Trava o botão
        setIsButtonDisabled(true);


        // libera o botão depois de 1 minuto (60000 ms)
        setTimeout(() => {
            setIsButtonDisabled(false);
        }, 60000);


        if (pageIndex < amount_question - 1) {
            // Seta o pageIndex  + 1
            setPageIndex((prev) => prev + 1);

            // Inicializa variavel de controle para salvar no array
            let numberRandom;
            do {
                numberRandom = Math.floor(Math.random() * 300) + 1;
            } while (id_questions.includes(numberRandom));

            // Adiciona outro numero aleatorio, no inicio do array
            setIdQuestion([numberRandom, ...id_questions]);
            // Se não, sobe o dialog
        } else {
            setIsDialogOpen(true);
        }
    }

    return (

        <div className="m-5 sm:m-10">
            <form action={action} onSubmit={handleNextQuestion}>
                {isPending && isPedingInitialRequest ? <>carregando</> : <>carregou</>}
                {/* Exibe erro ou questão, se disponível */}
                {state?.error && <p className="text-red-500">{state.error}</p>}
                <input type="hidden" value={id_questions.join(",")} name="id_array" />
                <div className="flex flex-col gap-8 font-sans">
                    <div className="flex justify-between">
                        <p className="font-sans">
                            Pergunta {pageIndex + 1}/{amount_question}
                        </p>
                        <ModeToggle />
                    </div>
                    <div>
                        <Progress value={progress} className="dark:bg-white" />
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="font-medium font-sans text-xl">
                            {
                               isPedingInitialRequest || isPending && <Skeleton className="w-full h-10 bg-gray-200 dark:bg-[#151515]"/>
                            }
                            {
                                !isPedingInitialRequest && !isPending && state?.question && (
                                    <>
                                        <p>
                                            {state?.question.title}
                                        </p>
                                    </>
                                )
                            }
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-2">
                                {
                                    isPedingInitialRequest || isPending && (<Skeleton className="w-full h-7 bg-gray-200 dark:bg-[#151515]"/>)
                                }
                                {
                                    !isPedingInitialRequest && !isPending && (
                                        <>
                                            <Checkbox className="border-gray-800" />
                                            <p>
                                                {state?.question.response.alternative_a}
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                            <div className="flex items-center gap-2">
                                {
                                    isPedingInitialRequest || isPending && (<Skeleton className="w-full h-7 bg-gray-200 dark:bg-[#151515]" />)
                                }
                                {
                                    !isPedingInitialRequest && !isPending && (
                                        <>
                                            <Checkbox className="border-gray-800" />
                                            <p>
                                                {state?.question.response.alternative_b}
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                            <div className="flex items-center gap-2">
                                {
                                    isPedingInitialRequest || isPending && (<Skeleton className="w-full h-7 bg-gray-200 dark:bg-[#151515]"/>)
                                }
                                {
                                    !isPedingInitialRequest && !isPending && (
                                        <>
                                            <Checkbox className="border-gray-800" />
                                            <p>
                                                {state?.question.response.alternative_c}
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                            <div className="flex items-center gap-2">
                                {
                                    isPedingInitialRequest || isPending && (<Skeleton className="w-full h-7 bg-gray-200 dark:bg-[#151515]"/>)
                                }
                                {
                                    !isPedingInitialRequest && !isPending && (
                                        <>
                                            <Checkbox className="border-gray-800" />
                                            <p>
                                                {state?.question.response.alternative_d}
                                            </p>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={isButtonDisabled || isPending || isPedingInitialRequest}
                      className={`cursor-pointer ${isButtonDisabled ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {isPending ? (
                        <Spinner size={"small"} className="w-4.5 h-4 dark:text-black text-white" />
                      ) : (
                        "Verificar Resposta"
                      )}
                    </Button>
                </div>
            </form>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Fim das perguntas</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você chegou à última pergunta. Quer continuar praticando ou analisar seus acertos por tópicos e outros detalhes?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" onClick={() => setPageIndex(0)}>
                            Continuar praticando
                        </AlertDialogCancel>
                        <AlertDialogAction className="cursor-pointer" onClick={() => alert("teste")}>
                            Mostrar meus domínios
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}