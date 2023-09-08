'use client'
import {
    PlusCircleIcon,
    AcademicCapIcon,
    XIcon
} from "@heroicons/react/outline";

import { 
    Callout 
} from "@tremor/react";

const EmptyState = () => {
    return (
        <>
            <Callout className="mt-4" title="Necessário Iniciar o Treinamento" icon={AcademicCapIcon} color="teal">
                Para realizar o treinamento é necessário que você adicione os dados de treinamento na tabela acima.
            </Callout>
        </>
    )
}

export default EmptyState