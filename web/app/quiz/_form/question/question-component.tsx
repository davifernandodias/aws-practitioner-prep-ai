"use client"

import { startTransition, useActionState, useEffect, useState } from "react"
import { SendQuestionsAndAnswers } from "./action"
import { useConfigurationQuestion } from "@/store/configuration-question"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { ModeToggle } from "@/components/mode-toggle"
import { Progress } from "@/components/ui/progress"
import { TextAnimate } from "@/components/ui/text-animate"

export default function QuestionComponent() {
  // Estado para acompanhar o envio da resposta e o carregamento
  const [state, action, isPending] = useActionState(SendQuestionsAndAnswers, null)
  // Resgata a quantidade de perguntas definidas
  const amount_question = useConfigurationQuestion((state) => state.amount_question)
  // Controla a página atual (inicia em 0)
  const [pageIndex, setPageIndex] = useState(0)
  // Controla o progresso da barra
  const [progress, setProgress] = useState(0)
  // Controla o dialog quando finaliza as perguntas
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // Controla resgate das perguntas
  const [initializeQuestions, setInitializeQuestion] = useState(0)
  // Responsável por adicionar ID sem duplicar
  const setIdQuestion = useConfigurationQuestion((state) => state.setIdQuestion)
  // Resgata o array dos ids já inseridos na lista
  const id_questions = useConfigurationQuestion((state) => state.id_questions)
  // Controla o carregamento inicial quando entra na página
  const [isPendingInitialRequest, setPendingInitialRequest] = useState(false)
  // Controla o tempo esperado após inicializar a questão
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  // Controla quando deve mostrar a resposta
  const [showResponse, setShowResponse] = useState(false)

  // Valida se a página inicializa, sendo assim chama a consulta das questões
  useEffect(() => {
    if (initializeQuestions === 0) {
      let numberRandom
      do {
        numberRandom = 1
      } while (id_questions.includes(numberRandom))
      console.log("cai no useeffect")
      // Adiciona o novo ID
      setIdQuestion([...id_questions, numberRandom])
      // Marca que inicializou para não repetir
      setInitializeQuestion(1)

      // Dispara a request para action
      handleRequestInitialQuestion(numberRandom)
    }
  }, [])

  // Atualiza o progresso sempre que pageIndex ou amount_question mudar
  useEffect(() => {
    if (amount_question > 0) {
      // Calcula o progresso: (índice atual + 1) / total de perguntas * 100
      const newProgress = ((pageIndex + 1) / amount_question) * 100
      // Garante que não passe de 100%
      setProgress(Math.min(newProgress, 100))
    }
  }, [pageIndex, amount_question])

  // Responsável por realizar primeira consulta na action
  const handleRequestInitialQuestion = (id: number) => {
    setPendingInitialRequest(true)
    const formData = new FormData()
    formData.append("id_array", id.toString())

    startTransition(() => {
      try {
        action(formData)
      } finally {
        setPendingInitialRequest(false)
      }
    })
  }

  // Responsável por controlar a paginação
  const handleNextQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    // Se já estiver true (resposta já está visivel)
    if (showResponse) {
      //Valida se a pagina atual e menor do que a pagina final - 1 (se for menor que dizer que está dentro do limite)
      if (pageIndex < amount_question - 1) {
        // Seta o pageIndex  + 1
        setPageIndex((prev) => prev + 1)
      } else {
        setIsDialogOpen(true)
      }
    }

    // Mostra resposta
    setShowResponse(!showResponse)
  }

  // Seta a question com as restrições
  const question: Question | null = state?.question && typeof state.question !== "boolean" ? state.question : null

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        className="max-w-4xl mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <form action={action} className="space-y-8">
          {/* Elemento do topo */}
          {!isPending && question ? (
            <>
              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground tracking-wide">
                    PERGUNTA {pageIndex + 1} DE {amount_question}
                  </span>
                </div>
                <ModeToggle />
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="origin-left"
              >
                <Progress value={progress} className="h-1.5 bg-muted/30 rounded-full overflow-hidden" />
              </motion.div>

              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="space-y-6">
                  <h1 className="text-2xl font-semibold leading-tight text-balance">{question.title}</h1>

                  <div className="space-y-4">
                    {question.response.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.4 + index * 0.1,
                          ease: "easeOut",
                        }}
                        className="group"
                      >
                        <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-border transition-all duration-300 cursor-pointer">
                          <Checkbox className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                          <span className="text-base leading-relaxed flex-1 group-hover:text-foreground transition-colors duration-200">
                            {item.alternative}
                          </span>
                        </div>

                        <AnimatePresence>
                          {showResponse && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, y: -10 }}
                              animate={{ opacity: 1, height: "auto", y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -10 }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeInOut",
                              }}
                              className="overflow-hidden"
                            >
                              <div
                                className={`mt-3 p-4 rounded-lg border-l-4 ${
                                  item.rep
                                    ? "bg-green-50 border-l-green-400 dark:bg-green-950/30 dark:border-l-green-500"
                                    : "bg-red-50 border-l-red-400 dark:bg-red-950/30 dark:border-l-red-500"
                                } backdrop-blur-sm`}
                              >
                                <TextAnimate
                                  animate="blurInUp"
                                  by="character"
                                  once
                                  className={`text-sm leading-relaxed ${
                                    item.rep ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                                  }`}
                                >
                                  {item.because}
                                </TextAnimate>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              className="flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center space-y-4">
                <Spinner size="small" className="mx-auto" />
                <p className="text-muted-foreground">Carregando pergunta...</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center pt-4"
          >
            <Button
              type="button"
              disabled={isButtonDisabled || isPending || isPendingInitialRequest}
              className={`w-full py-3 text-base font-medium rounded-b-sm transition-all duration-300 cursor-pointer ${
                isButtonDisabled || isPending || isPendingInitialRequest
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-lg active:scale-95"
              }`}
              onClick={handleNextQuestion}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner size="small" className="w-4 h-4" />
                  <span>Processando...</span>
                </div>
              ) : (
                <motion.span
                  key={showResponse ? "next" : "show"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {showResponse ? "Próxima pergunta" : "Ver resposta"}
                </motion.span>
              )}
            </Button>
          </motion.div>
        </form>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent className="rounded-2xl border-border/50 backdrop-blur-sm">
            <AlertDialogHeader className="space-y-4">
              <AlertDialogTitle className="text-xl font-semibold">
                Parabéns! Você completou todas as perguntas
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-relaxed text-muted-foreground">
                Você chegou à última pergunta. Quer continuar praticando ou analisar seus acertos por tópicos e outros
                detalhes?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 pt-4">
              <AlertDialogCancel
                className="rounded-xl px-6 py-2.5 hover:bg-muted/80 transition-colors duration-200"
                onClick={() => setPageIndex(0)}
              >
                Continuar praticando
              </AlertDialogCancel>
              <AlertDialogAction
                className="rounded-xl px-6 py-2.5 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                onClick={() => alert("teste")}
              >
                Mostrar meus domínios
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  )
}
