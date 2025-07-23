/**
 * Challenge: Create a Pizza object type. It should include a `name`
 * and a `price` property.
 */
type Pizza = {
    id: number
    name: string
    price: number
}

/**
 * Challenge: Add an Order type. It should have `id`, `pizza`, and `status` properties.
 * Look through the code if you need a reminder as to what data types those should be.
 */

/**
 * Challenge: using literal types and unions, update the Order status so that
 * it can only ever be "ordered" or "completed"
 */

type Order = {
    id: number
    pizza: Pizza
    status: "ordered" | "completed"
}

let pizzaId = 1;

const menu: Pizza[] = [
    { id: pizzaId++, name: "Margherita", price: 8 },
    { id: pizzaId++, name: "Pepperoni", price: 10 },
    { id: pizzaId++, name: "Hawaiian", price: 10 },
    { id: pizzaId++, name: "Veggie", price: 9 },
]

/**
 * Challenge: Fix the TS warnings about orderQueue!
 */

let cashInRegister = 100
let nextOrderId = 1
const orderQueue: Order[] = []

/**
 * Challenge: teach TS that the pizzaObj is supposed to be a Pizza type.
 * Then like before, look through the code to see if there are any new
 * TS warnings to deal with (😉), and fix those issues
 */

/**
 * Challenge:
 * Fix the addNewPizza function using the Omit utility type. This might
 * require more than just changing the "Pizza" typed `pizzaObj` parameter.
 * Return the new pizza object (with the id added) from the function.
 */

function addNewPizza(pizzaObj: Omit<Pizza, "id">): Pizza {
    const newPizza = {
        id: pizzaId++,
        ...pizzaObj,
    }
    menu.push(newPizza)
    return newPizza; 
}

function placeOrder(pizzaName: string): Order | undefined {
    const selectedPizza = menu.find(pizzaObj => pizzaObj.name === pizzaName)
    if (!selectedPizza) {
        console.error(`${pizzaName} does not exist in the menu`)
        return
    }
    cashInRegister += selectedPizza.price
    const newOrder: Order = { id: nextOrderId++, pizza: selectedPizza, status: "ordered" }
    orderQueue.push(newOrder)
    return newOrder
}

/**
 * Challenge (part 1): add a return type to the getPizzaDetail function.
 * 
 * NOTE: you're very likely going to get a big TS warning once you do this 😅
 * Don't fret, we'll address this warning next!
 */

export function getPizzaDetail(identifier: string | number): Pizza | undefined {
    if (typeof identifier === "string") {
        return menu.find(pizza => pizza.name.toLowerCase() === identifier.toLowerCase())
    } else if (typeof identifier === "number") {
        return menu.find(pizza => pizza.id === identifier)
    } else {
        throw new TypeError("Parameter `identifier` must be either a string or a number")
    }
}


/**
 * Challenge: Teach TS what data type should be used for the 
 * orderId in the completeOrder function. Then check for any
 * additional warnings TS comes up with and fix those.
 */


/**
 * Challenge: Fix the warning below by handling the "sad path" scenario!
 */

function completeOrder(orderId: number): Order | undefined {
    const order = orderQueue.find(order => order.id === orderId)
    if (!order) {
        console.error(`${orderId} was not found in the orderQueue`)
        return
    }
    order.status = "completed"
    return order
}

/**
 * Challenge part 1: Make it so we can use a global variable to track the nextPizzaId
 * and use the same trick we use with `nextOrderId++` when you're calling addNewPizza.
 * Update the menu items to use this as well so we don't have to manually enter ids 1-4
 * like we're currently doing
 */

/**
 * Challenge part 1.5: Try to move the logic for adding an ID to the pizza objects 
 * inside the addNewPizza function, so that we can call addNewPizza with no id, and
 * the function will handle that part for us.
 * 
 * NOTE: you will run into TS warnings that we'll address soon, but the code should
 * still run.
 */

addNewPizza({ name: "Chicken Bacon Ranch", price: 12 })
addNewPizza({ name: "BBQ Chicken", price: 12 })
addNewPizza({ name: "Spicy Sausage", price: 11 })

placeOrder("Chicken Bacon Ranch")
completeOrder(1)

console.log("Menu:", menu)
console.log("Cash in register:", cashInRegister)
console.log("Order queue:", orderQueue)