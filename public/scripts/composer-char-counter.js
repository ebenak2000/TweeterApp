$(document).ready(function() {

    $('.new-tweet textarea').on('input', function() {
        const maxLength = 140;
        const currentLength = $(this).val().length;
        const remainingLength = maxLength - currentLength;

        const counterElement = $(this).siblings('div').find('.counter');
        
        counterElement.text(remainingLength);

        if (remainingLength < 0) {
            counterElement.addClass('invalid');
        } else {
            counterElement.removeClass('invalid');
        }
    });
});