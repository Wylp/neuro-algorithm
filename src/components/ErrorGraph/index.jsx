`use client`

import { Card, Title, LineChart } from "@tremor/react";
import { useMemo } from "react"

const ErrorGraph = ({
    TrainingHistory,
}) => {

    const chartData = useMemo(() => {
        return TrainingHistory.map((data, index) => ({
            epoch: index + 1,
            "Percentual de Erro": data.filter(data => !data.output_is_correct).length / data.length * 100,
            "Percentual de Acerto": data.filter(data => data.output_is_correct).length / data.length * 100,
        }))
    }, [TrainingHistory])

    const valueFormatter = (value) => {
        return `${value.toFixed(2)}%`
    }

    return (
        <Card>
            <Title className="text-center">Gráfico de Erro/Acerto</Title>
            <LineChart
                className="mt-6"
                data={chartData}
                index="epoch"
                categories={["Percentual de Erro", "Percentual de Acerto"]}
                colors={["red", "emerald"]}
                valueFormatter={valueFormatter}
                yAxisWidth={40}
            />
        </Card>
    )

}

ErrorGraph.displayName = "ErrorGraph"

export default ErrorGraph