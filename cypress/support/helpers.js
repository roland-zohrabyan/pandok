export const getRandomInt = (max) => {
    return Math.ceil(Math.random() * max);
}

// export const getDropdownLength = (elSelector) => {
//     return cy.get(elSelector).
// }

export const getRandomOptionIndex = (max) => {


    return Math.floor(Math.random() * (max - 1)) + 1;
}

// cy.get('#group').then((ele) => {
//     cy.get('input', {
//         withinSubject: ele,
//     })
// })

export const verifyResultSimple = ($el, price, quantity, servicePerc, discountPerc) => {

    let actResult = $el.text().replace(/\s/g, "")
    let netPrice = parseInt(price * quantity)
    let expResult = netPrice + (netPrice * parseInt(servicePerc) / 100) - (netPrice * parseInt(discountPerc) / 100)
    expect(actResult).to.be.equal(expResult.toString())

}





export const verifyResultComplex = ($el, table, servicePerc, discountPerc) => {
    console.log('service', servicePerc)
    console.log("discount", discountPerc)
    console.log('table', table)
    let actResult = $el.text().replace(/\s/g, "")
    let totalNetPrice = 0

    for (let i = 0; i <= table.price.length - 1; i++) {
        totalNetPrice += parseInt(table.price[i] * table.quantity[i])
    }
    console.log("totalNetPrice", totalNetPrice)
    let expResult = totalNetPrice + (totalNetPrice * parseInt(servicePerc) / 100) - (totalNetPrice * parseInt(discountPerc) / 100)
    console.log("-----------------------------")
    console.log('actualResult', actResult)
    console.log("result", expResult)
    console.log("-----------------------------")
    expect(expResult.toString()).to.be.equal(actResult)
}