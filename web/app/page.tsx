"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import QuestionConfigAmount from "./_form/config/config-question";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [isPeding, setPeding] = useState(false);
  const titles = ["errando.", "acertando."];
  const router = useRouter();


  useEffect(() => {
    if (titles.length === 0) return;
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber]);


  // Responsavel por redirecionar para a rota de perguntas
  const handleRedirectToQuestions = () => {

    // Define o spinner no botão
    setPeding(true);

    // Delay para redirecionar
    setTimeout(() => {
      router.push("/quiz");
    }, 2000);
  }

  return (
    <div className="w-full">
      <div className="container mx-auto relative">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4" aria-label="Introdução ao quiz">
              Vem com a gente que esse quiz vai te deixar afiado ;p
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">Aqui você aprende</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titleNumber}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{ type: "spring", stiffness: 50 }}
                  >
                    {titles[titleNumber]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Este projeto é um quiz simples e prático para te ajudar a entender, de forma mais leve, como funcionam os serviços da Amazon Web Services.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button
              size="lg"
              className="gap-4 cursor-pointer"
              variant="outline"
              aria-label="Iniciar o quiz"
              onClick={handleRedirectToQuestions}
            >
            {isPeding
              ? (
                 <>
                  Iniciar Quiz <Spinner size={"small"} className="w-4.5 h-4"/>
                 </>
                )
              : (
                  <>
                    Iniciar Quiz <MoveRight className="w-4 h-4" />
                  </>
                )
              }
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  className="gap-4 cursor-pointer"
                  aria-label="Abrir configurações do quiz"
                >
                  Configurações <Settings className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Configurações do Quiz</AlertDialogTitle>
                  <AlertDialogDescription>
                    Defina abaixo quantidade de questões que deseja realizar.
                    <QuestionConfigAmount />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                  <AlertDialogAction className="cursor-pointer">Salvar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}