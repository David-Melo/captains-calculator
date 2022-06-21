import { Box, Image, Stack, Text, Table } from '@mantine/core';

import { useAppState } from 'state';
import { needMap } from 'components/ui/NeedsBadge';

export const ResultsSummary = () => {

    const { selectedRecipies } = useAppState(state => state.recipes)
    const { items: allProducts } = useAppState(state => state.products)
    const { items: allMachines } = useAppState(state => state.machines)

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

    selectedRecipies.forEach(recipe => {

        let machine = allMachines[recipe.machine]

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

    })

    return (
        <Box>

            <Text weight="bold" mb="xs">Production Chain Summary</Text>

            <Stack spacing="xs">

                <Table
                    horizontalSpacing={6}
                    verticalSpacing={6}
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
                                                    height={22}
                                                    width={22}
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

                <Table
                    horizontalSpacing={6}
                    verticalSpacing={6}
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
                                                    height={18}
                                                    width={18}
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

                <Table
                    horizontalSpacing={6}
                    verticalSpacing={6}
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
                                                    height: 32,
                                                    width: 32,
                                                    borderRadius: theme.radius.sm,
                                                    border: `1px solid ${theme.colors.gray[4]}`,
                                                    background: need.color,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                })}
                                            >
                                                <Image
                                                    height={18}
                                                    width={18}
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

            </Stack>
        </Box>
    )

}