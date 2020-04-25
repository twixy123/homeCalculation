const hashId = (str) => `${str + Math.round(Math.random() * 1e8).toString(16) + (Math.round(Math.random() * str.charCodeAt(Math.round(Math.random() * str.length))).toString() + Math.round(Math.random() * str.charCodeAt(Math.round(Math.random() * str.length))).toString()).toString(16)}`

const totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.getElementById('form'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount')


let dbOperation = JSON.parse(localStorage.getItem('calc')) || []

const renderList = (obj) => {

    const className = +obj.amount < 0 ? 'history__item-minus' : 'history__item-plus'

    const whatAmount = obj.amount > 0 ? `+${obj.amount}` : obj.amount

    const listItem = document.createElement('li')

    listItem.classList.add('history__item')
    listItem.classList.add(className)

    listItem.innerHTML = `${obj.description}
        <span class="history__money"> ${whatAmount} ₽ </span> 
        <button class="history_delete" data-id="${obj.id}"> x </button>
    `

    historyList.append(listItem)
}

const result = (obj) => {
    const resultIncome = obj
        .filter(item => +item.amount > 0)
        .reduce((res, item) => res + +item.amount, 0)

    const resultExtantion = obj
        .filter(item => +item.amount < 0)
        .reduce((res, item) => res + +item.amount, 0)

    totalMoneyIncome.textContent = `+${resultIncome} ₽`
    totalMoneyExpenses.textContent = `${resultExtantion} ₽`

    totalBalance.textContent = `${resultIncome + resultExtantion} ₽`
}

const intit = () => {
    historyList.textContent = ''

    dbOperation.forEach(item => renderList(item))

    result(dbOperation)

    localStorage.setItem('calc', JSON.stringify(dbOperation))
}

const addOptions = (e) => {
    e.preventDefault()

    operationName.style.borderColor = ''
    operationAmount.style.borderColor = ''

    const nameValue = operationName.value,
        nameAmount = operationAmount.value

    if (nameValue && nameAmount) {

        const operationObj = {
            id: hashId(nameValue),
            description: nameValue,
            amount: nameAmount
        }

        dbOperation.push(operationObj)

        intit()
        
        operationName.value = ''
        operationAmount.value = ''
    } else if (!nameValue) operationName.style.borderColor = 'red'
    else if (!nameAmount) operationAmount.style.borderColor = 'red'

}

const deleteOperation = (event) => {
    const target = event.target
    if (target.classList.contains('history_delete')) {
        dbOperation = dbOperation.filter(operation => operation.id !== target.dataset.id)

        intit()
    }    
}

form.addEventListener('submit', addOptions)

historyList.addEventListener('click', deleteOperation)

intit()