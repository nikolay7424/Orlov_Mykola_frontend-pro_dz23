const products = [
    {
        title: "Футболки",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/t-shirt.jpg",
        price: 500,
    },
    {
        title: "Худі",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/hoodie.jpg",
        price: 600,
    },
    {
        title: "Джинси",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/jeans.jpg",
        price: 700,
    },
    {
        title: "Кросівки",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/sneakers.jpg",
        price: 800,
    },
    {
        title: "Головні убори",
        description: "Lorem ipsum dolor sit amet.",
        image: "img/hats.jpg",
        price: 900,
    },
]

const categories = document.querySelector('.categories')
const productsDiv = document.querySelector('.products')
const cart = document.querySelector('.cart')
const notification = document.querySelector('.notification')
const ordersBtn = document.querySelector('.orders-btn')
var productPriceGlobal;

// modal vars
const modal = document.querySelector('dialog')
const nameIput = modal.querySelector('#name')
const departmentIput = modal.querySelector('#department')
const textInputs = Array.from(modal.querySelectorAll('input[type=text]'))
const select = modal.querySelector('select')
const radio = Array.from(modal.querySelectorAll('input[type=radio]'))
const radioWrapper = modal.querySelector('.radio-wrapper')
const form = modal.querySelector('form')
const quantity = modal.querySelector('#quantity')
const comment = modal.querySelector('#comment')
const inputsArr = [nameIput, departmentIput, select, radioWrapper]
const allInputsArr = [nameIput, departmentIput, select, radioWrapper, quantity, comment]


categories.addEventListener('click', caterogiesHandler)
productsDiv.addEventListener('click', productstHandler)
window.addEventListener('click', buttonHandler)
window.addEventListener('load', localStorageHandler)

nameIput.addEventListener('keyup', function() {
    validateTextInput(nameIput)
})
departmentIput.addEventListener('keyup', function() {
    validateTextInput(departmentIput)
})
select.addEventListener('change', function() {
    validateSelect(select)
})

radioWrapper.addEventListener('click', function(){
    validateRadio(radio)
})

ordersBtn.addEventListener('click', ordersHandler)

function localStorageHandler() {
    if (localStorage.getItem('orders') === null) {
        localStorage.setItem('orders', JSON.stringify([]))
      }
}

function ordersHandler(e) {
    if(productsDiv.children[0]) {
        productsDiv.innerHTML = ''
        cart.innerHTML = ''
    }
    e.preventDefault()

    const orders = JSON.parse(localStorage.getItem('orders'))
    const ordersUl = document.createElement('ul')
    ordersUl.classList.add('orders')
    orders.forEach((order, key) => {
        const orderLi = document.createElement('li')
        orderLi.classList.add('order')
        const orderInfo = document.createElement('div')
        orderInfo.classList.add('order-info')
        const orderTable = document.createElement('div')
        orderTable.classList.add('order-table')
        
        orderLi.appendChild(orderInfo)
        orderLi.appendChild(orderTable)

        // order-info
        const orderNumber = document.createElement('span')
        orderNumber.textContent = key + 1
        orderInfo.appendChild(orderNumber)
        const orderDate = document.createElement('span')
        orderDate.textContent = order.date
        orderInfo.appendChild(orderDate)
        const orderPrice = document.createElement('span')
        orderPrice.textContent = order.price + ' грн.'
        orderInfo.appendChild(orderPrice)
        const deleteBtn = document.createElement('button')
        deleteBtn.classList.add('delete-btn')
        deleteBtn.textContent = 'Видалити X'
        orderInfo.appendChild(deleteBtn)

        const table = document.createElement('table')
        table.innerHTML = order.table
        table.classList.add('is-hidden')

        orderTable.appendChild(table)
        
        ordersUl.appendChild(orderLi)
        productsDiv.appendChild(ordersUl)
    })
}

function caterogiesHandler(e) {
    if(productsDiv.children[0]) {
        productsDiv.innerHTML = ''
        cart.innerHTML = ''
    }

    products.forEach(product => {
        if(e.target.textContent === product.title) {
            for(let i = 0; i < 6; i++) {
                const productDiv = createProductDiv(
                    product.title, 
                    product.description, 
                    product.image,
                    product.price)
                productsDiv.appendChild(productDiv)
            }
        }
    })
}

function productstHandler(e) {
    if(cart.children[0]) {
        cart.innerHTML = ''
    }
    if(e.target.classList.contains('product')) {
        const button = document.createElement('button')
        button.textContent = 'Купити'
        button.classList.add('btn')
        const productDiv = createProductDiv(
            e.target.children[1].textContent, 
            e.target.children[2].textContent, 
            e.target.children[0].src,
            e.target.children[3].textContent, 
            button)
        cart.appendChild(productDiv)
    }

    if(e.target.classList.contains('order-info')) {
        e.target.parentElement.children[1].children[0].classList.toggle('is-hidden')
    }
    if(e.target.classList.contains('delete-btn')) {
        const orders = JSON.parse(localStorage.getItem('orders'))
        const index = Number(e.target.parentElement.children[0].textContent) - 1
        orders.splice(index, 1)
        localStorage.setItem('orders', JSON.stringify(orders))
        e.target.parentElement.parentElement.remove()
        ordersBtn.click()
    }
}

function createProductDiv(title, description, img, price, button = null) {
    const productDiv = document.createElement('div')
    productDiv.classList.add('product')

    const productImg = document.createElement('img')
    productImg.src = img

    const procutTitle = document.createElement('h2')
    procutTitle.classList.add('product-name')
    procutTitle.textContent = title

    const procutDescription = document.createElement('p')
    procutDescription.classList.add('product-description')
    procutDescription.textContent = description

    const productPrice = document.createElement('div')
    productPrice.classList.add('product-price')
    productPrice.textContent = price
    
    productDiv.appendChild(productImg)
    productDiv.appendChild(procutTitle)
    productDiv.appendChild(procutDescription)
    productDiv.appendChild(productPrice)
    if(button) {
        productDiv.appendChild(button)
    }
    return productDiv
}

function buttonHandler(e) {
    if(e.target.classList.contains('btn')) {
        e.preventDefault()
        modal.showModal()
        productPriceGlobal = e.target.previousElementSibling.textContent
        modal.addEventListener('click', modalHandler)
    }
}

// modal functions
function modalHandler(e) {
    const modalDimentions = modal.getBoundingClientRect();
    if(
        e.clientX < modalDimentions.left ||
        e.clientX > modalDimentions.right ||
        e.clientY < modalDimentions.top ||
        e.clientY > modalDimentions.bottom
        ) {
        modal.close();
        modal.removeEventListener('click', modalHandler)
    }

    if(e.target.classList.contains('submit')) {
        e.preventDefault()
        if(validateTextInput(nameIput) 
        && validateSelect(select) 
        && validateTextInput(departmentIput) 
        && validateRadio(radio)) {
            productsDiv.innerHTML = ''
            cart.innerHTML = ''
            const date = new Date().toLocaleString()
            const orderTable = createOrderTable(date)
            productsDiv.appendChild(orderTable)

            modal.close()
            modal.removeEventListener('click', modalHandler)
            formReset()
        }
    }
}

function createOrderTable(date) {
    const table = document.createElement('table')
    const order = {}
    order.date = date
    createTableRow('Дата:', date, table)
    allInputsArr.forEach(input => {
        switch(input.type) {
            case('text') :
                createTableRow(input.previousElementSibling.textContent, input.value, table)
                break
            case('number') :
                order.quantity = input.value
                createTableRow(input.previousElementSibling.textContent, input.value, table)
                break
            case('textarea') :
                order.comment = input.value
                createTableRow(input.previousElementSibling.textContent, input.value, table)
                break
            case('select-one') :
                for(let option of input) {
                    if(option.selected === false) {
                        continue
                    } else {
                        order.city = option.textContent
                        createTableRow('Місто:', option.textContent, table)    
                    }
                    break
                }
            }
        })
        for(let radioInput of radio) {
            if(radioInput.checked === false) {
                continue
            } else {
                order.paymentMethod = radioInput.nextElementSibling.textContent
                createTableRow(radioInput.parentElement.parentElement.previousElementSibling.textContent, radioInput.nextElementSibling.textContent, table)    
            }
            break
        }
        order.price = productPriceGlobal
        createTableRow('Цена:', productPriceGlobal, table)
        order.table = table.innerHTML.toString()
        const ordersFromLS = JSON.parse(localStorage.getItem('orders'))
        ordersFromLS.push(order)
        localStorage.setItem('orders', JSON.stringify(ordersFromLS))
    return table
}

function createTableRow(key, value, appendTo) {
    const tr = document.createElement('tr')
    const tdKey = document.createElement('td')
    tdKey.textContent = key
    const tdValue = document.createElement('td')
    tdValue.textContent = value
    tr.appendChild(tdKey)
    tr.appendChild(tdValue)
    appendTo.appendChild(tr)
}

function validateTextInput(element) {
    if(element.value.length === 0) {
        const message = 'поле не може бути пустим'
        showErrorMessage(element, message, 'red')
        return false
    } else if(element.value.length < 1) {
        const message = 'поле повинно мати хочаб 1 символ'
        showErrorMessage(element, message, 'red')
        return false
    } else {
        const message = ' '
        showErrorMessage(element, message, '#0ea50e')
        return true
    }
}

function validateSelect(element) {
    for(let option of Array.from(element.children)) {
        if(option.value == '' && option.selected) {
            const message = 'оберіть місто будь ласка'
            showErrorMessage(element, message, 'red')
            return false
        } else {
            const message = ' '
            showErrorMessage(element, message, '#0ea50e')
            return true
        }
    }
}

function validateRadio(radioArr) {
    let validated = false
    for(let radioEl of radioArr) {
        if(radioEl.checked) {
            const message = ' '
            showErrorMessage(radioWrapper, message, '#0ea50e')
            validated = true
            return true
        } else {
            const message = 'оберіть спосіб оплати будь ласка'
            showErrorMessage(radioWrapper, message, 'red')
            validated = false
        }
    }
    return validated
}

function showErrorMessage(element, message, color) {
    element.nextElementSibling.textContent = message
    element.nextElementSibling.style.color = color
    element.style.borderColor = color
}

function formReset() {
    form.reset()
    inputsArr.forEach(element => {
        showErrorMessage(element, ' ', 'black')
    });
}