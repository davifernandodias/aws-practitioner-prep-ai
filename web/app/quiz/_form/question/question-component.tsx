"use client"

import { useActionState } from "react"
import { SendQuestionsAndAnswers } from "./action"

export default function QuestionComponent () {

    const [state, action, isPeding] = useActionState(SendQuestionsAndAnswers, null)
    return (
        <div>
            <form action={action}>

            </form>
        </div>
    )
}