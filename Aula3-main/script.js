$(document).ready(function(){

    $('#meuFormulario').on('submit', function(event){
        event.preventDefault();

        $('.form-control').removeClass('is-invalid');

        let isValid = true;

        const nome = $('#nome').val().trim();

        if(!/^[a-zA-z\s]+$/.test(nome)){
            $('#nome').addClass('is-invalid');
            isValid = false
        }

    })

})