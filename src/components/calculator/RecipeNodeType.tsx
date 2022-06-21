import { Box, Grid, Image, Group, Divider, Stack, Tooltip, Text } from '@mantine/core';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import { Icon } from '@iconify/react';
import { useModals } from '@mantine/modals';

import { sortArray } from 'utils/objects';

import { ProductId } from 'state/app/effects';
import { RecipeIOProduct } from 'state/recipes/ProductionNode';

import CostsBadge from 'components/ui/CostsBadge';
import NeedsBage from 'components/ui/NeedsBadge';
import Icons from 'components/ui/Icons';
import { DrawerBody, DrawerBodyScrollArea } from 'components/ui/DrawerBody';
import { NodeRecipeLink } from 'components/recipes/NodeRecipeSelect';
import { RecipeNodeData } from './Editor';

const handleStyle: React.CSSProperties = { border: 'none', width: 'auto', height: 'auto', position: 'relative', top: 'initial', left: 'initial', right: 'initial', bottom: 'initial', borderRadius: 0, transform: 'initial', backgroundColor: 'transparent' }

export const RecipeNodeType = ({ id, data: { recipe, machine, category, inputs, outputs, sources } }: NodeProps<RecipeNodeData>) => {

    const modals = useModals();

    const openContentModal = (direction: 'input' | 'output', product: RecipeIOProduct) => {
        modals.openModal({
            title: `Select ${direction === 'input' ? 'Source' : 'Target'} For ${product.name}`,
            size: 'xl',
            children: (
                <>
                    <Box sx={{ height: 400 }}>
                        <DrawerBody>
                            <DrawerBodyScrollArea>
                                <Box>
                                    <Stack spacing="xs">
                                        {Object.keys(inputs).map((productId, key) => {
                                            try {
                                                let sourceRecipes = sources[productId as ProductId]
                                                let product = inputs[productId]
                                                return (
                                                    <NodeRecipeLink
                                                        key={key}
                                                        direction="input"
                                                        recipes={sourceRecipes}
                                                        label={product.name}
                                                        currentNodeId={recipe.id}
                                                        productId={product.id}
                                                    />
                                                )
                                            } catch (e: any) {
                                                console.error(e.message)
                                                return productId
                                            }
                                        })}
                                    </Stack>
                                </Box>
                            </DrawerBodyScrollArea>
                        </DrawerBody>
                    </Box>
                </>
            ),
        });
    };

    const handleLinkCreate = (direction: 'input' | 'output', product: RecipeIOProduct) => {
        console.log('clicked')
        openContentModal(direction, product)
    }

    return (

        <Box
            key={`recipe-node-${id}`}
            sx={theme => ({
                backgroundColor: theme.white,
                borderRadius: theme.radius.sm,
                boxShadow: theme.shadows.sm,
                width: 400
            })}
        >

            <Box>
                <Group position="apart" px="md" pt="md" pb={0}>
                    <Tooltip
                        label={category.name}
                        withArrow
                        withinPortal
                    >
                        <Box
                            p={4}
                            sx={theme => ({
                                borderRadius: theme.radius.sm,
                                background: theme.colors.dark[3]
                            })}
                        >
                            <Image src={`/assets/categories/${category.id}.png`} alt={category.name} height={22} />
                        </Box>
                    </Tooltip>
                    <Text weight="bolder" size="lg" sx={{ lineHeight: '1em' }}>{machine.name}</Text>
                    <Tooltip
                        label={machine.name}
                        withArrow
                        withinPortal
                    >
                        <Box
                            p={4}
                            sx={theme => ({
                                borderRadius: theme.radius.sm,
                                background: theme.colors.dark[3]
                            })}
                        >
                            <Image
                                height={22}
                                radius="md"
                                src={`/assets/buildings/${machine.icon}`} alt={machine.name}
                            />
                        </Box>
                    </Tooltip>
                </Group>


            </Box>

            <Divider py="xs" variant="solid" labelPosition="center" label="Inputs & Outputs" color="gray" sx={theme => ({ borderTopColor: theme.colors.gray[4] })} />
            <Grid gutter={40}>
                <Grid.Col span={6}>
                    <Stack spacing="sm" justify="space-around">
                        {Object.keys(inputs).sort((a, b) => sortArray(inputs[a].name, inputs[b].name)).map(productId => {
                            let product = inputs[productId]
                            return (
                                <Box key={`recipe-handle-input-${productId}`} sx={{ marginLeft: !!product.source ? -14 : -47 }} className='nodrag'>
                                    <Group spacing={5} noWrap>
                                        {!product.source && (
                                            <Tooltip
                                                label="Add Input Source"
                                                withArrow
                                                withinPortal
                                                allowPointerEvents
                                            >
                                                <Box
                                                    onClick={() => handleLinkCreate('input', product)}
                                                    sx={theme => ({
                                                        width: 28,
                                                        height: 28,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: theme.white,
                                                        borderRadius: theme.radius.sm,
                                                        boxShadow: theme.shadows.sm,
                                                        cursor: "default",
                                                        '&:hover': {
                                                            backgroundColor: theme.colors.gray[2],
                                                        }
                                                    })}
                                                >
                                                    <Icon icon={Icons.add} />
                                                </Box>
                                            </Tooltip>
                                        )}
                                        <Handle
                                            key={`${id}-${product.id}-input`}
                                            id={`${id}-${product.id}-input`}
                                            type="target"
                                            position={Position.Left}
                                            style={handleStyle}
                                        >
                                            <Box sx={theme => ({
                                                width: 28,
                                                height: 28,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: theme.colors.red[8],
                                                borderRadius: theme.radius.sm,
                                                pointerEvents: 'none'
                                            })}
                                            >
                                                <Text color="white" align="center" size="sm" sx={{ lineHeight: 24 }}>{product.quantity}</Text>
                                            </Box>
                                        </Handle>
                                        <Group spacing={5} noWrap>
                                            <Box
                                                sx={theme => ({
                                                    border: `1px dashed ${theme.colors.gray[4]}`,
                                                    borderRadius: theme.radius.sm,
                                                    padding: 3
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} alt='test' height={22} width={22} style={{ pointerEvents: 'none' }} />
                                            </Box>
                                            <Text sx={{ whiteSpace: 'nowrap' }}>{product.name}</Text>
                                        </Group>
                                    </Group>
                                </Box>
                            )
                        })}
                    </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Stack spacing="sm" justify="space-around" align="flex-end">
                        {Object.keys(outputs).sort((a, b) => sortArray(outputs[a].name, outputs[b].name)).map(productId => {
                            let product = outputs[productId]
                            return (
                                <Box key={`recipe-handle-output-${productId}`} sx={{ marginRight: !!product.target ? -14 : -47 }} className='nodrag'>
                                    <Group spacing={5} noWrap>
                                        <Group spacing={5} noWrap>
                                            <Text sx={{ whiteSpace: 'nowrap' }}>{product.name}</Text>
                                            <Box
                                                sx={theme => ({
                                                    border: `1px dashed ${theme.colors.gray[4]}`,
                                                    borderRadius: theme.radius.sm,
                                                    padding: 3
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} alt='test' height={22} width={22} style={{ pointerEvents: 'none' }} />
                                            </Box>
                                        </Group>
                                        <Handle
                                            key={`${id}-${product.id}-output`}
                                            id={`${id}-${product.id}-output`}
                                            type="source"
                                            position={Position.Right}
                                            style={handleStyle}
                                        >
                                            <Box sx={theme => ({
                                                width: 28,
                                                height: 28,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: theme.colors.green[8],
                                                borderRadius: theme.radius.sm,
                                                pointerEvents: 'none'
                                            })}
                                            >
                                                <Text color="white" align="center" size="sm" sx={{ lineHeight: 24 }}>{product.quantity}</Text>
                                            </Box>
                                        </Handle>
                                        {!product.target && (
                                            <Tooltip
                                                label="Add Output Target"
                                                withArrow
                                                withinPortal
                                                allowPointerEvents
                                            >
                                                <Box
                                                    onClick={() => handleLinkCreate('output', product)}
                                                    sx={theme => ({
                                                        width: 28,
                                                        height: 28,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        backgroundColor: theme.white,
                                                        borderRadius: theme.radius.sm,
                                                        boxShadow: theme.shadows.sm,
                                                        cursor: "default",
                                                        '&:hover': {
                                                            backgroundColor: theme.colors.gray[2],
                                                        }
                                                    })}
                                                >
                                                    <Icon icon={Icons.add} />
                                                </Box>
                                            </Tooltip>
                                        )}
                                    </Group>
                                </Box>
                            )
                        })}
                    </Stack>
                </Grid.Col>
            </Grid>

            <Divider py="xs" variant="solid" labelPosition="center" label="Costs & Needs" color="gray" sx={theme => ({ borderTopColor: theme.colors.gray[4] })} />
            <Box pb="md" px="md">

                <Group spacing={4} position="center">
                    {machine.build_costs.map((product, key) => {
                        return <CostsBadge key={key} product={product} />
                    })}
                    <NeedsBage need="workers" value={machine.workers} />
                    {machine.maintenance_cost_units === 'maintenance_i' && (
                        <NeedsBage need="maintenance1" value={machine.maintenance_cost_quantity} />
                    )}
                    {machine.maintenance_cost_units === 'maintenance_iI' && (
                        <NeedsBage need="maintenance2" value={machine.maintenance_cost_quantity} />
                    )}
                    <NeedsBage need="electricity" value={machine.electricity_consumed} />
                    <NeedsBage need="unity" value={machine.unity_cost} />
                    <NeedsBage need="computing" value={machine.computing_consumed} suffix="tf" />
                </Group>

            </Box>


        </Box >


    );
}
