const fs = require("fs")

const rawData = require("./captain-of-data/data/machines_and_buildings.json")

function categoryNameToId(name) {
    return typeof name === 'string' && name.length ? name.replaceAll('&','and').toLowerCase().replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '') : null
}

function categoryParseName(name) {
    let words = name.replaceAll('(', '( ').replaceAll(')', ' )').split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }
    return words.join(' ').replaceAll('( ', '(').replaceAll(' )', ')')
}

function machineNameToId(name) {
    return typeof name === 'string' && name.length ? name.toLowerCase().replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '') : null
}

function machineParseName(name) {
    let words = name.replaceAll('(', '( ').replaceAll(')', ' )').split(" ")
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }
    return words.join(' ').replaceAll('( ', '(').replaceAll(' )', ')')
}

function recipeNameToId(name) {
    return typeof name === 'string' && name.length ? name.replaceAll('&','and').toLowerCase().replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '') : null
}

function recipeParseName(name) {
    let words = name.replaceAll('(', '( ').replaceAll(')', ' )').split(" ")
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }
    return words.join(' ').replaceAll('( ', '(').replaceAll(' )', ')')
}

function productNameToId(name) {
    return typeof name === 'string' && name.length ? name.toLowerCase().replaceAll(' ', '_').replaceAll('(', '').replaceAll(')', '') : null
}

function productParseName(name) {
    let isSet = typeof name === 'string' && name.length
    if (!isSet) return null
    let words = name.replaceAll('(', '( ').replaceAll(')', ' )').split(" ")
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }
    return words.join(' ').replaceAll('( ', '(').replaceAll(' )', ')')
}

function sortObject(unordered) {
    return Object.keys(unordered).sort().reduce(
        (obj, key) => {
            obj[key] = unordered[key];
            return obj;
        },
        {}
    );
}

let CATEGORIES_DATA = {}
let MACHINES_DATA = {}
let RECIPES_DATA = {}
let PRODUCTS_DATA = {}

rawData.machines_and_buildings.forEach(m=>{

    //## ##################
    //## Prep Items
    //## ##################

    // Prep Category
    let category = {
        id: categoryNameToId(m.category),
        name: categoryParseName(m.category),
        machines: [],
        recipes: []
    }

    // Prep Machine
    let machine = {
        id: machineNameToId(m.name),
        game_id: m.id,
        name: machineParseName(m.name),
        category_id: categoryNameToId(m.category),
        category_name: categoryParseName(m.category),
        build_cost_units: productNameToId(m.build_cost_units),
        build_cost_quantity: m.build_cost_quantity,
        workers: m.workers,
        maintenance_cost_units: productNameToId(m.maintenance_cost_units),
        maintenance_cost_quantity: m.maintenance_cost_quantity,
        electricity_consumed: m.electricity_consumed,
        electricity_generated: m.electricity_generated,
        recipes: [],
        products: {
            input: [],
            output: []
        }
    }

    // Prep Recipes

    m.recipes.forEach(r=>{

        try {

            let recipeId = recipeNameToId(r.name)

            if (RECIPES_DATA.hasOwnProperty(recipeId)) {
                recipeId += "_2"
            }

            let recipe = {
                id: recipeId,
                name: recipeParseName(r.name),
                machine: machine.id,
                duration: r.duration,
                inputs: [],
                outputs: []
            }

            // Set Products

            r.inputs.forEach(p=>{

                let product = {
                    id: productNameToId(p.name),
                    name: productParseName(p.name),
                    quantity: p.quantity
                }

                // Add New Product
                if (!PRODUCTS_DATA.hasOwnProperty(product.id)) {
                    PRODUCTS_DATA[product.id] = {
                        id: product.id,
                        name: product.name,
                        recipes: {
                            input: [],
                            output: [],
                        },
                        machines: {
                            input: [],
                            output: [],
                        }
                    }
                }

                // Update Product
                if (PRODUCTS_DATA.hasOwnProperty(product.id)) {
                    if (PRODUCTS_DATA[product.id].recipes.input.indexOf(recipeId) < 0) {
                        PRODUCTS_DATA[product.id].recipes.input = [...PRODUCTS_DATA[product.id].recipes.input, recipeId].sort((a, b) => a.localeCompare(b))
                    }
                }

                if (PRODUCTS_DATA[product.id].machines.input.indexOf(machine.id) < 0) {
                    PRODUCTS_DATA[product.id].machines.input = [...PRODUCTS_DATA[product.id].machines.input, machine.id].sort((a, b) => a.localeCompare(b))
                }

                if (machine.products.input.indexOf(product.id) < 0) {
                    machine.products.input = [...machine.products.input, product.id].sort((a, b) => a.localeCompare(b))
                }

                recipe.inputs.push(product)

            })

            r.outputs.forEach(p=>{

                let product = {
                    id: productNameToId(p.name),
                    name: productParseName(p.name),
                    quantity: p.quantity
                }

                // Add New Product
                if (!PRODUCTS_DATA.hasOwnProperty(product.id)) {
                    PRODUCTS_DATA[product.id] = {
                        id: product.id,
                        name: product.name,
                        recipes: {
                            input: [],
                            output: [],
                        },
                        machines: {
                            input: [],
                            output: [],
                        }
                    }
                }

                // Update Product
                if (PRODUCTS_DATA.hasOwnProperty(product.id)) {

                    if (PRODUCTS_DATA[product.id].recipes.output.indexOf(recipeId) < 0) {
                        PRODUCTS_DATA[product.id].recipes.output = [...PRODUCTS_DATA[product.id].recipes.output, recipeId].sort((a, b) => a.localeCompare(b))
                    }

                    if (PRODUCTS_DATA[product.id].machines.output.indexOf(machine.id) < 0) {
                        PRODUCTS_DATA[product.id].machines.output = [...PRODUCTS_DATA[product.id].machines.output, machine.id].sort((a, b) => a.localeCompare(b))
                    }

                }

                if (machine.products.output.indexOf(product.id) < 0) {
                    machine.products.output = [...machine.products.output, product.id].sort((a, b) => a.localeCompare(b))
                }

                recipe.outputs.push(product)

            })

            // Add New Recipe
            if (!RECIPES_DATA.hasOwnProperty(recipe.id)) {
                RECIPES_DATA[recipe.id] = {
                    ...recipe
                }
            }

            machine.recipes.push(recipe.id)

        } catch (e) {
            console.log(r)
            console.error(e)
        }

    })

    //## ##################
    //## Set Lists
    //## ##################

    // Add New Category
    if (!CATEGORIES_DATA.hasOwnProperty(category.id)) {
        CATEGORIES_DATA[category.id] = category
    }

    // Update Category
    if (CATEGORIES_DATA.hasOwnProperty(category.id)) {
        CATEGORIES_DATA[category.id] = {
            ...CATEGORIES_DATA[category.id],
            machines: [
                ...CATEGORIES_DATA[category.id].machines,
                machine.id
            ].sort((a, b) => a.localeCompare(b))
        }
        machine.recipes.forEach(r=>{
            if (CATEGORIES_DATA[category.id].recipes.indexOf(r) < 0) {
                CATEGORIES_DATA[category.id].recipes = [...CATEGORIES_DATA[category.id].recipes, r].sort((a, b) => a.localeCompare(b))
            }
        })
        
    }

    // Add New Machine
    if (!MACHINES_DATA.hasOwnProperty(machine.id)) {
        MACHINES_DATA[machine.id] = {
            ...machine
        }
    }

    // Update Machine
    if (MACHINES_DATA.hasOwnProperty(machine.id)) {
        MACHINES_DATA[machine.id].recipes = machine.recipes.sort((a, b) => a.localeCompare(b))
    }

})

let recipesOutput = sortObject(RECIPES_DATA)
let categoriesOutput = sortObject(CATEGORIES_DATA)
let machinesOutput = sortObject(MACHINES_DATA)
let productsOutput = sortObject(PRODUCTS_DATA)

fs.writeFileSync(`./src/data/recipes.json`, JSON.stringify(recipesOutput, null, 4), "utf8")
fs.writeFileSync('./src/data/categories.json', JSON.stringify(categoriesOutput, null, 4), "utf8")
fs.writeFileSync('./src/data/machines.json', JSON.stringify(machinesOutput, null, 4), "utf8")
fs.writeFileSync('./src/data/products.json', JSON.stringify(productsOutput, null, 4), "utf8")
