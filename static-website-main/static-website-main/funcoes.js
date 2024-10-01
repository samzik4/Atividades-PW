let textoOriginal = document.getElementById("titulo").textContent


// document.getElementById("botao-trocar-texto").addEventListener("click", function (){
//     let titulo = document.getElementById("titulo");

//     if(titulo.textContent == "Texto Trocado"){
//         titulo.textContent = textoOriginal
//     } else{

//         titulo.textContent = "Texto Trocado"

//     }

// }) 


$(document).ready(function () {
    $("#botao-trocar-texto").on("click", function () {
        let titulo = document.getElementById("titulo");

        if (titulo.textContent === "Texto Trocado") {
            titulo.textContent = textoOriginal
        } else {

            titulo.textContent = "Texto Trocado"

        }

    })


    let corAtualBranca = true

    $("#botao-trocar-cor").on("click", function () {
        if (corAtualBranca) {
            $('body').css('background-color', "pink")

        } else {
            $('body').css('background-color', "white")

        }
        corAtualBranca = !corAtualBranca
    })

    //pegar o input e trocar o texto
    $("#botao-alterar-texto").on("click", function () {
        let novoTexto = $('#input-novo-texto').val()

        if (novoTexto) {
            $("#titulo").text(novoTexto)

        } else {
            alert("escreve alguma coisa por gentileza? 🌹🌹🌹🩷🩷")
        }
    })
})

