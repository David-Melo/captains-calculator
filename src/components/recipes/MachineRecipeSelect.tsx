import React from "react";
import { Box, Group, Select, Image, Tooltip, Indicator, Text } from "@mantine/core";
import { useAppState, useActions } from '../../state/index';
import { Machine, Recipe, RecipeId } from '../../state/app/effects/loadJsonData';
import { Icon } from "@iconify/react";

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
    recipe: Recipe;
}

interface ItemPropsWithMachine extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
    recipe: Recipe;
    machine: Machine;
}

const SelectItem = React.forwardRef<HTMLDivElement, ItemProps>(
    ({ label, recipe, ...others }: ItemProps, ref) => {
        const products = useAppState(state => state.products.items)
        let recipeInputs = recipe.inputs.map(p => {
            return {
                ...products[p.id],
                quantity: p.quantity
            }
        })
        let recipeOutputs = recipe.outputs.map(p => {
            return {
                ...products[p.id],
                quantity: p.quantity
            }
        })
        return (
            <div ref={ref} {...others}>
                <Group spacing="xs" noWrap>
                    <Group
                        noWrap
                        spacing="xs"
                        sx={theme => ({
                            '& .product-input .product-icon': {
                                color: theme.colors.gray[6]
                            },
                            '& .product-input:last-child .product-icon': {
                                display: 'none'
                            }
                        })}
                    >
                        {recipeInputs.map(product => {
                            return (
                                <Group className="product-input" spacing="xs" key={`input_${product.id}`} noWrap>
                                    <Tooltip
                                        label={product.name}
                                        withArrow
                                        color="green"
                                        withinPortal
                                    >
                                        <Indicator label={product.quantity} color="green" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                            <Box
                                                p={8}
                                                sx={theme => ({
                                                    borderRadius: theme.radius.md,
                                                    border: `1px solid ${theme.colors.gray[1]}`,
                                                    background: theme.colors.gray[7]
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} height={22} width={22} />
                                            </Box>
                                        </Indicator>
                                    </Tooltip>
                                    <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                </Group>
                            )
                        })}
                    </Group>
                    <Group
                        spacing="xs">
                        <Icon className="results-icon" icon="icomoon-free:arrow-right" width={15} />
                    </Group>
                    <Group
                        noWrap
                        spacing="xs"
                        sx={theme => ({
                            '& .product-output .product-icon': {
                                color: theme.colors.gray[6]
                            },
                            '& .product-output:last-child .product-icon': {
                                display: 'none'
                            }
                        })}
                    >
                        {recipeOutputs.map(product => {
                            return (
                                <Group className="product-output" spacing="xs" key={`output_${product.id}`} noWrap>
                                    <Tooltip
                                        label={product.name}
                                        withArrow
                                        color="red"
                                        withinPortal
                                    >
                                        <Indicator label={product.quantity} color="red" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                            <Box
                                                p={8}
                                                sx={theme => ({
                                                    borderRadius: theme.radius.md,
                                                    border: `1px solid ${theme.colors.gray[1]}`,
                                                    background: theme.colors.gray[7]
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} height={26} width={26} />
                                            </Box>
                                        </Indicator>
                                    </Tooltip>
                                    <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                </Group>
                            )
                        })}
                    </Group>
                </Group>
            </div>
        )
    }
);

const SelectItemWithMachine = React.forwardRef<HTMLDivElement, ItemPropsWithMachine>(
    ({ label, recipe, machine, ...others }: ItemPropsWithMachine, ref) => {
        const products = useAppState(state => state.products.items)
        let recipeInputs = recipe.inputs.map(p => {
            return {
                ...products[p.id],
                quantity: p.quantity
            }
        })
        let recipeOutputs = recipe.outputs.map(p => {
            return {
                ...products[p.id],
                quantity: p.quantity
            }
        })
        return (
            <div ref={ref} {...others}>
                <Group spacing="xs" noWrap>
                    <Group spacing="xs">
                        {machine ? (
                            <React.Fragment>
                                <Box
                                    p={5}
                                    sx={theme => ({
                                        borderRadius: theme.radius.md,
                                        border: `1px solid ${theme.colors.gray[2]}`,
                                        background: theme.colors.gray[0]
                                    })}
                                >
                                    <Image
                                        height={35}
                                        radius="md"
                                        src={`/assets/buildings/${machine.icon}`} alt={machine.name}
                                    />
                                </Box>
                                <Box>
                                    <Text weight={500} size="md" sx={{ lineHeight: '1em' }}>{machine.name}</Text>
                                </Box>
                            </React.Fragment>
                        ):(
                            <React.Fragment>
                                <Box
                                    p={5}
                                    sx={theme => ({
                                        borderRadius: theme.radius.md,
                                        border: `1px solid ${theme.colors.gray[2]}`,
                                        background: theme.colors.gray[0]
                                    })}
                                >
                                    <Image
                                        height={35}
                                        radius="md"
                                        src={`/assets/buildings/Placeholder.png`} alt={recipe.name}
                                    />
                                </Box>
                                <Box>
                                    <Text weight={500} size="md" sx={{ lineHeight: '1em' }}>{recipe.name}</Text>
                                </Box>
                            </React.Fragment>
                        )}
                    </Group>
                    <Group
                        noWrap
                        spacing="xs"
                        sx={theme => ({
                            '& .product-input .product-icon': {
                                color: theme.colors.gray[6]
                            },
                            '& .product-input:last-child .product-icon': {
                                display: 'none'
                            }
                        })}
                    >
                        {recipeInputs.map(product => {
                            return (
                                <Group className="product-input" spacing="xs" key={`input_${product.id}`} noWrap>
                                    <Tooltip
                                        label={product.name}
                                        withArrow
                                        color="green"
                                        withinPortal
                                    >
                                        <Indicator label={product.quantity} color="green" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={5}>
                                            <Box
                                                p={8}
                                                sx={theme => ({
                                                    borderRadius: theme.radius.md,
                                                    border: `1px solid ${theme.colors.gray[1]}`,
                                                    background: theme.colors.gray[7]
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} height={18} width={18} />
                                            </Box>
                                        </Indicator>
                                    </Tooltip>
                                    <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                </Group>
                            )
                        })}
                    </Group>
                    <Group
                        spacing="xs">
                        <Icon className="results-icon" icon="icomoon-free:arrow-right" width={15} />
                    </Group>
                    <Group
                        noWrap
                        spacing="xs"
                        sx={theme => ({
                            '& .product-output .product-icon': {
                                color: theme.colors.gray[6]
                            },
                            '& .product-output:last-child .product-icon': {
                                display: 'none'
                            }
                        })}
                    >
                        {recipeOutputs.map(product => {
                            return (
                                <Group className="product-output" spacing="xs" key={`output_${product.id}`} noWrap>
                                    <Tooltip
                                        label={product.name}
                                        withArrow
                                        color="red"
                                        withinPortal
                                    >
                                        <Indicator label={product.quantity} color="red" radius="xs" styles={{ indicator: { fontSize: 11, height: 'auto', paddingRight: 5, paddingLeft: 5 } }} size={8}>
                                            <Box
                                                p={8}
                                                sx={theme => ({
                                                    borderRadius: theme.radius.md,
                                                    border: `1px solid ${theme.colors.gray[1]}`,
                                                    background: theme.colors.gray[7]
                                                })}
                                            >
                                                <Image src={`/assets/products/${product.icon}`} height={18} width={18} />
                                            </Box>
                                        </Indicator>
                                    </Tooltip>
                                    <Icon className="product-icon" icon="icomoon-free:plus" width={10} />
                                </Group>
                            )
                        })}
                    </Group>
                </Group>
            </div>
        )
    }
);

export const MachineRecipeSelect = () => {
    const currentProduct = useAppState(state => state.products.currentItem)
    const currentMachine = useAppState(state => state.machines.currentItem)
    const { itemsList: allRecipes, currentItemId } = useAppState(state => state.recipes)
    const selectRecipe = useActions().recipes.selectRecipe
    const selectRecipesItem = useActions().recipes.selectRecipesItem
    const onChange = (recipeId: RecipeId) => {
        selectRecipe(recipeId)
        selectRecipesItem(recipeId)
    }
    if (!currentMachine || !currentProduct) return null;
    let filteredRecipes = allRecipes.filter(recipe => {
        return currentMachine.recipes.indexOf(recipe.id as RecipeId) >= 0 && recipe.outputs.find(product => product.id === currentProduct.id)
    })
    return (
        <Select
            size="md"
            value={currentItemId}
            onChange={onChange}
            label="3. Select Recipe"
            placeholder="Make Selection..."
            itemComponent={SelectItem}
            data={filteredRecipes.map(r => ({
                label: r.name,
                value: r.id,
                recipe: r
            }))}
            searchable
            maxDropdownHeight={400}
            nothingFound="No Match Found"
            filter={(value, item) => item.label ? item.label.toLowerCase().includes(value.toLowerCase().trim()) : false}
        />
    )
}

type RecipeSelectControlledProps = {
    label: string;
    recipes: Recipe[];
    onSelect(recipeId: RecipeId): void;
}

export const RecipeSelectControlled: React.FC<RecipeSelectControlledProps> = ({ recipes, onSelect, label }) => {

    const { items: allMachines } = useAppState(state => state.machines)
    const [selectedId, selectId] = React.useState<RecipeId | null>(null)

    const onChange = (recipeId: RecipeId) => {
        selectId(recipeId)
        onSelect(recipeId)
    }

    return (
        <Select
            size="sm"
            value={selectedId}
            onChange={onChange}
            placeholder={`Select Source For ${label} Input`}
            itemComponent={SelectItemWithMachine}
            data={recipes.map(r => ({
                label: `${r.name} [${allMachines[r.machine].name}]`,
                value: r.id,
                recipe: r,
                machine: allMachines[r.machine]
            }))}
            searchable
            maxDropdownHeight={400}
            nothingFound="No Match Found"
            filter={(value, item) => item.label ? item.label.toLowerCase().includes(value.toLowerCase().trim()) : false}
        />
    )
}