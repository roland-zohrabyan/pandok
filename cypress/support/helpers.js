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