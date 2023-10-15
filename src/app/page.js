"use client";

import { EmptyState, HistoryTable, Table } from "@/components";
import { 
  Widrow_Hoff_Algorithm 
} from "@/utils";

import { 
  Card, 
  NumberInput, 
  Subtitle, 
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TableRow,
  TextInput,
  Title 
} from "@tremor/react";

import { 
  useEffect,
  useMemo,
  useRef,
  useState 
} from "react";

export default function Home() {
  const DEFAULT_DATA = [
    { X1: 0, X2: 0, Expected: 1 },
    { X1: 0, X2: 0, Expected: 1 },
  ];

  const [data, setData] = useState(DEFAULT_DATA);
  const [dataTraining, setDataTraining] = useState([]);

  const [learningRate, setLearningRate] = useState(0.1);
  const [epochs, setEpochs] = useState(1000);

  const [bias, setBias] = useState({
    X0: 1,
    W0: 1,
  });

  const [classifications, setClassifications] = useState([{
    text: "-1",
    value: -1,
  }, {
    text: "1",
    value: 1,
  }]);

  const [weights, setWeights] = useState([0, 0]);

  const StartTraining = () => {

    const no_valid_rows_data = data.filter((data_row) => {
      Object.values(data_row).filter((value) => {
        if (value === "" || !Number.isFinite(Number(value))) {
          return true;
        }
      })
    })

    const no_valid_weights = weights.filter((weight) => {
      if (weight === "" || !Number.isFinite(Number(weight))) {
        return true;
      }
    })

    const has_no_valid_rows_data = no_valid_rows_data.length > 0;
    const has_no_valid_weights = no_valid_weights.length > 0;

    if (has_no_valid_rows_data || has_no_valid_weights) {
      alert("Preencha todos os campos");
      return;
    }

    Widrow_Hoff_Algorithm({
      data_to_calculate: data,
      weights: weights,
      learning_rate: learningRate,
      epochs: epochs,
      set_data_training: setDataTraining,
      bias: bias,
    });
  }

  const columns = useMemo(
    () =>
      data.reduce((columns, data) => {
        return [
          ...columns,
          ...Object.keys(data).filter((key) => !columns.includes(key)),
        ];
      }, []),
    [data]
  );

  return (
    <body className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-full my-4" decoration="top">
        <Title className="text-center">Configurações</Title>
        <Subtitle className="text-center mt-2">
          Aqui se encontram os valores de configuração essenciais para a
          utilização do sistema.
        </Subtitle>

        <div className="flex flex-row justify-center w-full gap-6">
          <Card className="w-1/3 my-4">
            <Title className="text-left mb-2 text-xs">
              Taxa de Aprendizado
            </Title>
            <NumberInput
              value={learningRate}
              onValueChange={(number) => setLearningRate(number)}
              className="w-full"
              step="0.01"
              min={0}
            />
          </Card>

          <Card className="w-1/3 my-4">
            <Title className="text-left mb-2 text-xs">
              Quantidade de Épocas
            </Title>
            <NumberInput
              value={epochs}
              onValueChange={(number) => setEpochs(number)}
              className="w-full"
              step="10"
              min={0}
            />
          </Card>
        </div>

        <div className="flex flex-row justify-center w-full mb-4">
          <Card className="flex flex-row justify-center w-1/2 gap-12">
            <div className="w-1/3 my-4">
              <Title className="text-left mb-2 text-xs">
                Classificação para 1
              </Title>
              <TextInput
                value={classifications[1].text}
                onChange={(event) => {
                  const newClassifications = [...classifications];
                  newClassifications[1].text = event.target.value;
                  setClassifications(newClassifications); 
                }}
                className="w-full"
              />
            </div>

            <div className="w-1/3 my-4">
              <Title className="text-left mb-2 text-xs">
                Classificação para -1
              </Title>
              <TextInput
                value={classifications[0].text}
                onChange={(event) => {
                  const newClassifications = [...classifications];
                  newClassifications[0].text = event.target.value;
                  setClassifications(newClassifications); 
                }}
                className="w-full"
              />
            </div>
          </Card>
        </div>

        <div className="flex flex-row justify-center w-full">
          <Card className="flex flex-row justify-center w-1/4 gap-12">
            <div className="w-1/3 my-4">
              <Title className="text-left mb-2 text-xs">
                X0
              </Title>
              <NumberInput
                value={bias.X0}
                onChange={(event) => {
                  const newBias = Object.assign({}, bias);
                  newBias.X0 = event.target.value;
                  setBias(newBias); 
                }}
                className="w-1/4"
              />
            </div>

            <div className="w-1/3 my-4">
              <Title className="text-left mb-2 text-xs">
                W0
              </Title>
              <NumberInput
                value={bias.W0}
                onChange={(event) => {
                  const newBias = Object.assign({}, bias);
                  newBias.W0 = event.target.value;
                  setBias(newBias); 
                }}
                className="w-1/4"
              />
            </div>
          </Card>
        </div>

        <div className="flex flex-row justify-center w-full gap-6">
        {columns.reduce((acc, column, index) => {
          if (columns.length == index + 1) return acc;

          return acc.concat(
              <Card className="w-1/5 my-4" key={index}>
                <Title className="text-left mb-2 text-xs">
                  W{index + 1} {"->"} X{index + 1}
                </Title>
                <NumberInput
                  value={weights[index]}
                  onValueChange={(number) => {
                    const newWeights = [...weights];
                    newWeights[index] = number;
                    setWeights(newWeights);
                  }}
                  className="w-full"
                  step="0.1"
                  min={0}
                />
              </Card>
            );
          }, [])
        }
      </div>
      </Card>

      <Card className="w-full" decoration="top">
        <Title className="text-center">Tabela de Treinamento</Title>
        <Subtitle className="text-center mt-2">
          Aqui se encontra os valores de treinamentos utilizados para o sistema.
        </Subtitle>
        <Subtitle className="text-center">
          É possível adicionar até 5 parametros diferentes.
        </Subtitle>

        <Card className="w-full my-4">
          <Table 
            data={data} 
            setData={setData} 
            defaultData={DEFAULT_DATA}
            selectOptions={classifications}
            StartTraining={StartTraining}
            weights={weights}
            setWeights={setWeights}
          />
        </Card>
      </Card>

      <Card className="w-full my-4" decoration="top">
        <Title className="text-center">Resultados</Title>
        <Subtitle className="text-center mt-2">
          Aqui se encontra os resultados obtidos pelo sistema.
        </Subtitle>

        <div className="flex flex-row justify-center w-full gap-6">
          <TabGroup className="w-3/4 my-4">
            <TabList>
              <Tab key={1}>Tabela de Treinamento</Tab>
              <Tab key={2}>Grafico de Posições</Tab>
            </TabList>
            <TabPanels>
              {
                Array.isArray(dataTraining) && dataTraining.length > 0 ?
                (
                  [
                    <TabPanel key={1}>
                      <HistoryTable TrainingHistory={dataTraining} />
                    </TabPanel>,
                    <TabPanel key={2}>

                    </TabPanel>
                  ]
                )
                :
                (
                  [
                    <TabPanel key={1} >
                      <EmptyState />
                    </TabPanel>,
                    <TabPanel key={2}>
                      <EmptyState />
                    </TabPanel>
                  ]
                )
              }
            </TabPanels>
          </TabGroup>
        </div>
      </Card>
    </body>
  );
}
