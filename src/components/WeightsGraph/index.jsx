`use client`

import { Card, Title, LineChart } from "@tremor/react";
import { useMemo, useState } from "react"

const all_colors = ["slate", "emerald", "stone", "gray", "zinc", "neutral", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"];

const WeightsGraph = ({
    TrainingHistory,
}) => {

    const {
        categories,
        colors,
    } = useMemo(() => {
        const categories = []
        const colors = []

        const {
            new_weights,
        } = TrainingHistory[0][0]

        const keys_to_print = new_weights.length - 1

        for (let i = 0; i < keys_to_print; i++) {
            categories.push(`W${i + 1}`)
            colors.push(all_colors[i] || "slate")
        }

        return { categories, colors }
    }, [TrainingHistory])

    const chartData = useMemo(() => {

        return TrainingHistory.map((data, index) => {

            const {
                new_weights,
            } = data[data.length - 1]

            const keys_to_print = new_weights.length - 1

            const keys = Array.from({length: keys_to_print}).reduce((acc, _, index) => {
                acc[`W${index + 1}`] = new_weights[index]
                return acc
            }, {})

            return {
                epoch: index + 1,
                ...keys
            }
        })
    }, [TrainingHistory])

    const valueFormatter = (value) => {
        return `${value.toFixed(2)}`
    }

    return (
        <Card>
            <Title className="text-center">Gráfico de Erro/Acerto</Title>
            <LineChart
                className="mt-6"
                data={chartData}
                index="epoch"
                categories={categories}
                colors={colors}
                valueFormatter={valueFormatter}
                yAxisWidth={40}
            />
        </Card>
    )

}

WeightsGraph.displayName = "WeightsGraph"

export default WeightsGraph