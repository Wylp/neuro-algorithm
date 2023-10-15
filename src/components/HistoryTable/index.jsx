`use client`

import { Card, NumberInput, Title, CategoryBar, Callout, Subtitle, Metric, Text, Flex } from "@tremor/react";
import { useMemo, useState } from "react"
import { MathpixMarkdown, MathpixLoader } from 'mathpix-markdown-it';

const HistoryTable = ({
    TrainingHistory,
}) => {

    const [epochCount, setEpochCount] = useState(1);

    const epoch_data = TrainingHistory[epochCount - 1]

    const has_data = Array.isArray(epoch_data) && epoch_data.length > 0

    const current_percent = has_data ? epoch_data?.filter(data => data.output_is_correct).length / epoch_data.length * 100 : 0;

    const final_train = TrainingHistory[TrainingHistory.length - 1]
    const final_weights = Array.isArray(final_train) ? final_train[final_train.length - 1].new_weights : []

    const EpochToRender = useMemo(() => {
        const render = () => (
            <Card>
                {has_data ?
                    Array.isArray(epoch_data) && epoch_data.map((data, index) => (
                        <Callout
                            key={index}
                            className="flex flex-row w-full my-4"
                            color={data?.output_is_correct ? "emerald" : "rose"}
                        >
                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                Linha: {index + 1}
                            </Subtitle>

                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                X = [{data?.array_data_to_train?.join(", ")}] (Sendo X0 o último elemento)
                            </Subtitle>
                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                W = [{data?.old_weights?.join(", ")}] (Sendo W0 o último elemento)
                            </Subtitle>
                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                |X|² = {data?.array_data_to_train?.map(x => x ** 2).join(" + ")} = {data?.array_data_to_train?.map(x => x ** 2).reduce((a, b) => a + b, 0)}
                            </Subtitle>

                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                S (Saída Intermediária) = {data?.array_data_to_train?.map((x, i) => `(${x} * ${data?.old_weights[i]})`).join(" + ")} = {data?.Sum_of_all_inputs_with_weights}
                            </Subtitle>

                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                D (Desejado) = {data?.expected}
                            </Subtitle>

                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                Y (Saída Final [Pós-Rele-Function])) = {data?.output}
                            </Subtitle>

                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                E (Erro) = ({data?.expected}) - ({data?.output}) = {data?.error}
                            </Subtitle>

                            <Subtitle
                                className="flex flex-row my-3 justify-between w-full"
                            >
                                <MathpixLoader>
                                    <MathpixMarkdown
                                        text={`$W _ { k + 1 } = W _ { k } + \\alpha E _ { k } \\frac { X } { |x| ^ { 2 } }$`}
                                        fontSize={33}
                                    />
                                </MathpixLoader>
                            </Subtitle>

                            <Subtitle
                                className="flex flex-row my-2 justify-between"
                            >
                                W = [{data?.new_weights?.join(", ")}]
                            </Subtitle>

                        </Callout>
                    ))
                    :
                    <Callout
                        title="Necessário selecionar época"
                        color="rose"
                        className="flex w-full space-x-0 my-4"
                    >
                        Selecione a época que deseja visualizar para a demonstração dos Calculos.
                    </Callout>
                }

                <CategoryBar
                    values={[40, 30, 20, 10]}
                    colors={["rose", "orange", "yellow", "emerald"]}
                    markerValue={current_percent}
                    className="w-full h-8"
                />
            </Card>
        )
        return render
    }, [has_data, current_percent, epoch_data])

    EpochToRender.displayName = "EpochToRender";

    return (
        <>
            <Card className="flex flex-col w-full space-x-0 my-2">
                <div className="flex flex-row mx-10 justify-between">
                    <div className="flex flex-row">
                        <Title className="m-2 align-middle self-center">
                            Época:
                        </Title>
                        <NumberInput
                            className="m-2 w-16 h-10 self-center"
                            value={epochCount}
                            onValueChange={setEpochCount}
                            min={1}
                            max={TrainingHistory.length}
                        />
                    </ div>
                    <Flex className="w-1/2 flex-row">
                        <Card
                            className="mr-2 w-2/4"
                        >
                            <Text> Épocas (Total) </Text>
                            <Metric>{TrainingHistory.length}</Metric>
                        </Card>
                        <Card
                            className="mr-2 w-2/4"
                        >
                            <Text> Média de Acertos </Text>
                            <Metric>{has_data ?
                                epoch_data?.filter(data => data.output_is_correct).length / epoch_data.length * 100
                                :
                                0
                            }%</Metric>
                        </Card>
                    </Flex>

                </div>

                <div className="flex flex-row justify-center w-full gap-6 my-6">
                    {
                        Array.isArray(final_weights) &&
                        final_weights.length > 0 &&
                        final_weights.map((weight, index) => {
                            const is_last = index === final_weights.length - 1
                            return (
                                <Card
                                    key={index}
                                >
                                    <Subtitle>
                                        W{is_last ? 0 : index + 1} (Final)
                                    </Subtitle>
                                    <Metric>
                                        {weight.toFixed(5)}
                                    </Metric>
                                </Card>
                            )
                        })

                    }
                </div>

            </Card>
            <EpochToRender />
        </>
    )
}

HistoryTable.displayName = "HistoryTable";

export default HistoryTable;