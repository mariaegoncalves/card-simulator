import "./css/index.css"
import IMask from "imask"
const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')
const ccTypeIcon = document.querySelector('.cc-logo span:nth-child(2) img')
function setCardType(type){
    const colors = { // define a cor por tipo do cartão
        visa: ["#2D57F2", "#436D99"],
        mastercard: ["#DF6F29", "#C69347"],
        default: ["black", "gray"],
    }
    ccBgColor01.setAttribute("fill", colors[type][0]) // muda a cor do cartão de acordo com o tipo
    ccBgColor02.setAttribute("fill", colors[type][1]) 
    ccTypeIcon.setAttribute("src",`cc-${type}.svg`)
}
globalThis.setCardType =  setCardType //função global
//security code
const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
    mask: "0000" //4 digitos no cvc + só números
}
const securityCodeMasked = IMask (securityCode, securityCodePattern)
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12  
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },
    },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000", 
            regex: /^4\d{0,15}/, // inicia com 4, seguido de 0 a 15 digitos
            cardtype: "visa"
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            /*inicia com 5; proximo digito de 1-5, seguido de 0 ou 2 digitos.
            ou: inicia com 22, proximo digito do 2 ao 9. \d = pode ter mais um digito qualquer
            ou: inicia com 2, proximo digito de 3 a 7, seguido de 0 a 2 digitos
            \d{0,12} = adiciona de 0 ate 12 digitos */
            cardtype: "mastercard"
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default"
        },
    ],
    dispatch: function(appended, dynamicMasked ){ //appended: a cada caractere digitado, roda a função.
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")// \D = NÃO digito
        // replace: tudo que não é digito retorna como vazio ""
        const foundMask =  dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        })
        return foundMask
    }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => { //função anônima
    alert("O cartão foi adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault() //não recarregar automaticamente apos clicar no botão
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value") //mudar o nome do titular na imagem do cartão
    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => { //.on =  mesma função do addEventListener.
//capturo o conteudo quando ele for "accept", ou seja, quando ele estiver dentro das regras.
    updateSecurityCode(securityCodeMasked.value)
})
function updateSecurityCode (code){
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype // acessa a mascara que descobre o tipo do cartão
    setCardType(cardType) 
    updateCardNumber(cardNumberMasked.value)
})
function updateCardNumber(number){
    const ccNumber = document.querySelector(".cc-number")
    ccNumber.innerText = number.length === 0 ? "1234 1234 1234 1234" : number
}

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value)
})
function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-expiration .value")
    ccExpiration.innerText = date.length === 0 ? "01/22" : date
}