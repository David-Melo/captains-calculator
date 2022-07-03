import { Box, Image, Stack, Table, Alert, ScrollArea, Divider } from '@mantine/core';

import { useAppState } from 'state';
import { needMap } from 'components/ui/NeedsBadge';
import React from 'react';

export const ResultsSummary = () => {

    const { nodesList } = useAppState(state => state.recipes)
    const { items: allProducts } = useAppState(state => state.products)

    let needs: { [index: string]: { label: string, icon: string, total: number, color: string } } = {
        workers: {
            icon: needMap['workers'].icon,
            label: 'Workers',
            total: 0,
            color: needMap['workers'].color
        },
        electricity: {
            icon: needMap['electricity'].icon,
            label: 'Electricity',
            total: 0,
            color: needMap['electricity'].color
        },
        maintenance1: {
            icon: needMap['maintenance1'].icon,
            label: 'Maintenance I',
            total: 0,
            color: needMap['maintenance1'].color
        },
        maintenance2: {
            icon: needMap['maintenance2'].icon,
            label: 'Maintenance II',
            total: 0,
            color: needMap['maintenance2'].color
        },
        unity: {
            icon: needMap['unity'].icon,
            label: 'Unity',
            total: 0,
            color: needMap['unity'].color
        },
        computing: {
            icon: needMap['computing'].icon,
            label: 'Computing',
            total: 0,
            color: needMap['computing'].color
        }
    }

    let costs: { [index: string]: { label: string, icon: string, total: number } } = {}
    let buildings: { [index: string]: { id: string, label: string, icon: string, total: number } } = {}
    let inputs: { [index: string]: { id: string, label: string, icon: string, total: number } } = {}
    let outputs: { [index: string]: { id: string, label: string, icon: string, total: number } } = {}

    nodesList.forEach(recipe => {

        let machine = recipe.machine

        if (!buildings.hasOwnProperty(machine.id)) {
            buildings[machine.id] = {
                id: machine.id,
                label: machine.name,
                icon: machine.icon,
                total: 0
            }
        }

        if (buildings.hasOwnProperty(machine.id)) {
            buildings[machine.id].total += 1
        }

        // Needs

        needs.workers.total += machine.workers
        needs.electricity.total += machine.electricity_consumed
        if (machine.maintenance_cost_units === 'maintenance_i') {
            needs.maintenance1.total += machine.maintenance_cost_quantity
        }
        if (machine.maintenance_cost_units === 'maintenance_ii') {
            needs.maintenance2.total += machine.maintenance_cost_quantity
        }

        needs.unity.total += machine.unity_cost
        needs.computing.total += machine.computing_consumed

        // Costs
        machine.build_costs.forEach(product => {
            let productData = allProducts[product.id]
            if (!costs.hasOwnProperty(product.id)) {
                costs[product.id] = {
                    label: product.name,
                    icon: productData.icon,
                    total: 0
                }
            }
            if (costs.hasOwnProperty(product.id)) {
                costs[product.id].total += product.quantity
            }
        })

        Object.values(recipe.outputs).forEach(output => {
            if (!machine.isFarm && !machine.isStorage && !machine.isMine) {
                if (!outputs.hasOwnProperty(output.id)) {
                    outputs[output.id] = {
                        id: output.id,
                        label: output.name,
                        icon: output.icon,
                        total: 0
                    }
                }
                if (outputs.hasOwnProperty(output.id)) {
                    outputs[output.id].total += output.quantity
                }
            }
        })

        Object.values(recipe.inputs).forEach(input => {
            if (!machine.isFarm && !machine.isStorage && !machine.isMine) {
                if (!inputs.hasOwnProperty(input.id)) {
                    inputs[input.id] = {
                        id: input.id,
                        label: input.name,
                        icon: input.icon,
                        total: 0
                    }
                }
                if (inputs.hasOwnProperty(input.id)) {
                    inputs[input.id].total += input.quantity
                }
            }
        })

    })

    const renderBuildings = () => {
        return (
            <Table
                horizontalSpacing={4}
                verticalSpacing={4}
                sx={{
                    '& .fitwidth': {
                        width: 1,
                        whiteSpace: 'nowrap'
                    }
                }}
            >
                <thead>
                    <tr>
                        <th colSpan={3}>Buildings</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(buildings).map((buildingId, k) => {
                        let building = buildings[buildingId]
                        if (building.total > 0) {
                            return (
                                <tr key={`costs-${buildingId}-${k}`} >
                                    <td className='fitwidth'>
                                        <Box
                                            p={4}
                                            sx={theme => ({
                                                borderRadius: theme.radius.sm,
                                                border: `1px solid ${theme.colors.gray[4]}`,
                                                background: theme.colors.dark[5]
                                            })}
                                        >
                                            <Image
                                                height={16}
                                                width={16}
                                                src={`/assets/buildings/${building.icon}`} alt={building.label}
                                                sx={{ display: 'block', objectFit: 'contain' }}
                                            />
                                        </Box>
                                    </td>
                                    <td>{building.label}</td>
                                    <td align='right'>x<strong>{building.total}</strong></td>
                                </tr>
                            )
                        }
                        return null
                    })}
                </tbody>
            </Table>
        )
    }

    const renderCosts = () => {
        return (
            <Table
                horizontalSpacing={4}
                verticalSpacing={4}
                sx={{
                    '& .fitwidth': {
                        width: 1,
                        whiteSpace: 'nowrap'
                    }
                }}
            >
                <thead>
                    <tr>
                        <th colSpan={3}>Construction Costs</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(costs).map((costId, k) => {
                        let cost = costs[costId]
                        if (cost.total > 0) {
                            return (
                                <tr key={`costs-${costId}-${k}`} >
                                    <td className='fitwidth'>
                                        <Box
                                            p={6}
                                            sx={theme => ({
                                                borderRadius: theme.radius.sm,
                                                border: `1px solid ${theme.colors.gray[4]}`,
                                                background: theme.colors.dark[5]
                                            })}
                                        >
                                            <Image
                                                height={12}
                                                width={12}
                                                src={`/assets/products/${cost.icon}`} alt={cost.label}
                                                sx={{ display: 'block', objectFit: 'contain' }}
                                            />
                                        </Box>
                                    </td>
                                    <td>{cost.label}</td>
                                    <td align='right'>x<strong>{cost.total}</strong></td>
                                </tr>
                            )
                        }
                        return null
                    })}
                </tbody>
            </Table>
        )
    }

    const renderNeeds = () => {
        return (
            <Table
                horizontalSpacing={4}
                verticalSpacing={4}
                sx={{
                    '& .fitwidth': {
                        width: 1,
                        whiteSpace: 'nowrap'
                    }
                }}
            >
                <thead>
                    <tr>
                        <th colSpan={3}>Needs</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(needs).map((needId, k) => {
                        let need = needs[needId]
                        let iconFilter = needId === 'maintenance2' ? 'brightness(0) saturate(100%) invert(99%) sepia(95%) saturate(7485%) hue-rotate(323deg) brightness(104%) contrast(97%)' : ''
                        if (need.total > 0) {
                            return (
                                <tr key={`needs-${needId}-${k}`} >
                                    <td className='fitwidth'>
                                        <Box

                                            sx={theme => ({
                                                height: 24,
                                                width: 24,
                                                borderRadius: theme.radius.sm,
                                                border: `1px solid ${theme.colors.gray[4]}`,
                                                background: need.color,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            })}
                                        >
                                            <Image
                                                height={12}
                                                width={12}
                                                src={`/assets/ui/${need.icon}`} alt={need.label}
                                                sx={{ display: 'block', objectFit: 'contain' }}
                                                styles={{ image: { filter: iconFilter } }}
                                            />
                                        </Box>
                                    </td>
                                    <td>{need.label}</td>
                                    <td align='right'>x<strong>{need.total}</strong>
                                    </td>
                                </tr>
                            )
                        }
                        return null
                    })}
                </tbody>
            </Table>
        )
    }

    const renderTotalOutputs = () => {
        return (
            <Table
                horizontalSpacing={4}
                verticalSpacing={4}
                sx={{
                    '& .fitwidth': {
                        width: 1,
                        whiteSpace: 'nowrap'
                    }
                }}
            >
                <thead>
                    <tr>
                        <th colSpan={3}>Total Outputs (60s)</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(outputs).map((itemId, k) => {
                        let item = outputs[itemId]
                        if (item.total > 0) {
                            return (
                                <tr key={`outputs-${itemId}-${k}`} >
                                    <td className='fitwidth'>
                                        <Box
                                            p={6}
                                            sx={theme => ({
                                                borderRadius: theme.radius.sm,
                                                border: `1px solid ${theme.colors.gray[4]}`,
                                                background: theme.colors.dark[5]
                                            })}
                                        >
                                            <Image
                                                height={12}
                                                width={12}
                                                src={`/assets/products/${item.icon}`} alt={item.label}
                                                sx={{ display: 'block', objectFit: 'contain' }}
                                            />
                                        </Box>
                                    </td>
                                    <td>{item.label}</td>
                                    <td align='right'>x<strong>{item.total}</strong></td>
                                </tr>
                            )
                        }
                        return null
                    })}
                </tbody>
            </Table>
        )
    }

    const renderTotalInputs = () => {
        return (
            <Table
                horizontalSpacing={4}
                verticalSpacing={4}
                sx={{
                    '& .fitwidth': {
                        width: 1,
                        whiteSpace: 'nowrap'
                    }
                }}
            >
                <thead>
                    <tr>
                        <th colSpan={3}>Total Inputs (60s)</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(inputs).map((itemId, k) => {
                        let item = inputs[itemId]
                        if (item.total > 0) {
                            return (
                                <tr key={`inputs-${itemId}-${k}`} >
                                    <td className='fitwidth'>
                                        <Box
                                            p={6}
                                            sx={theme => ({
                                                borderRadius: theme.radius.sm,
                                                border: `1px solid ${theme.colors.gray[4]}`,
                                                background: theme.colors.dark[5]
                                            })}
                                        >
                                            <Image
                                                height={12}
                                                width={12}
                                                src={`/assets/products/${item.icon}`} alt={item.label}
                                                sx={{ display: 'block', objectFit: 'contain' }}
                                            />
                                        </Box>
                                    </td>
                                    <td>{item.label}</td>
                                    <td align='right'>x<strong>{item.total}</strong></td>
                                </tr>
                            )
                        }
                        return null
                    })}
                </tbody>
            </Table>
        )
    }

    return (
        <Box sx={{ position: 'relative', height: 'calc(100vh - 70px)' }}>
            <ScrollArea
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }}
            >
                <Box
                    p="md"
                >

                    <Divider label="Production Chain Summary" mb="sm" />

                    <Stack spacing="xs">

                        {nodesList.length ? (
                            <React.Fragment>
                                {renderBuildings()}
                                {renderCosts()}
                                {renderNeeds()}
                                {renderTotalOutputs()}
                                {renderTotalInputs()}
                            </React.Fragment>
                        ) : (
                            <Alert>
                                Customize your production chan in the right to see a summary below.
                            </Alert>
                        )}

                    </Stack>

                </Box>

            </ScrollArea>

        </Box>
    )

}