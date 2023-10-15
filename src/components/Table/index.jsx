'use client'

import {
    PlusCircleIcon,
    AcademicCapIcon,
    XIcon
} from "@heroicons/react/outline";

import {
    Card,
    Button,
    Table,
    TableHead,
    TableRow,
    TableHeaderCell,
    TableBody,
    TableCell,
    NumberInput,
    Text,
    Title,
    Badge,
    TextInput,
    Select,
    SelectItem
} from "@tremor/react";


import React, { useMemo, useState } from 'react'

const ConstructTable = ({
    data = [],
    setData = () => { },
    defaultData = [],
    selectOptions = [],
    StartTraining = () => { },
    weights = [],
    setWeights = () => { }
}) => {

    const setSelection = (Object, index) => {
        const new_value = Object.value;
        const new_data = [...data]
        new_data[index]["Expected"] = new_value;

        setData(new_data);
    }

    const columns = useMemo(() =>
        data.reduce((columns, data) => {
            return [...columns, ...Object.keys(data).filter((key) => !columns.includes(key))]
        }, [])
        , [data]);

    const handleTextInput = ({
        rowIndex,
        column_name,
        value
    }) => {
        const newData = [...data];
        newData[rowIndex][column_name] = value;
        setData(newData);
    }

    const columnSplit = useMemo(() => {
        const half = columns.length / 2;
        const half_is_float = half % 1 !== 0;

        if (half_is_float) {
            return [
                Math.floor(half) + 1,
                Math.floor(half)
            ]
        }

        return [
            half,
            half
        ];
    }, [columns]);

    const clearTable = () => {
        setData(defaultData);
        setWeights([0, 0]);
    }

    const addNewParameter = () => {

        if (columns.length > 5) {
            alert('Limite de parametros atingido')
            return false;
        };

        const newData = [...data].map((row) => {
            const new_column_name = `X${columns.length}`
            const {
                Expected,
                ...another_columns
            } = row;

            return {
                ...another_columns,
                [new_column_name]: 0,
                Expected
            }
        });

        const new_weights = [...weights, 0];

        setWeights(new_weights);

        setData(newData);
    }

    const addNewTraining = () => {
        const newRow = columns.reduce((row, column_name, index, complete_array) => {
            const is_last_column = index === complete_array.length - 1;
            return {
                ...row,
                [column_name]: is_last_column ? 1 : 0
            }
        }, {});
        const newData = [...data, newRow];
        setData(newData);
    }

    return (
        <Table className="mt-5">
            <TableHead>
                <TableRow>
                    {columns.map((column, columnIndex) => (
                        <TableHeaderCell
                            key={columnIndex}
                            className="text-center"
                        >
                            {column}
                        </TableHeaderCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columns.map((column_name, columnIndex, arrayComp) => {
                            const is_last_column = columnIndex === arrayComp.length - 1;
                            return (
                                <TableCell key={columnIndex}>
                                    {
                                        is_last_column ?
                                            <Select
                                                value={selectOptions.find(option => {
                                                    const column_value = row[column_name];
                                                    return option.value === column_value;
                                                })}
                                                onValueChange={(obj) => setSelection(obj, rowIndex)}
                                            >
                                                {
                                                    selectOptions.map((option, optionIndex) => (
                                                        <SelectItem key={optionIndex} value={option}>
                                                            {option.text}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </Select>
                                            :
                                            <NumberInput
                                                value={row[column_name]}
                                                onChange={(e) => handleTextInput({
                                                    rowIndex,
                                                    column_name,
                                                    value: e.target.value
                                                })}
                                                step="1"
                                                min="0"
                                                max="1"
                                            />
                                    }
                                </TableCell>
                            )
                        })}
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell colSpan={columnSplit[0]}>
                        <Button
                            variant="primary"
                            className="w-half mr-2"
                            icon={PlusCircleIcon}
                            onClick={addNewTraining}
                        >
                            Treino
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-half"
                            icon={PlusCircleIcon}
                            onClick={addNewParameter}
                        >
                            Parametro
                        </Button>
                    </TableCell>
                    <TableCell
                        colSpan={columnSplit[1]}
                        className="text-right"
                    >
                        <Button
                            variant="secondary"
                            className="w-half mr-2"
                            icon={XIcon}
                            onClick={clearTable}
                        >
                            Limpar
                        </Button>
                        <Button
                            variant="primary"
                            className="w-half"
                            icon={AcademicCapIcon}
                            onClick={StartTraining}
                        >
                            Treinar
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default ConstructTable;