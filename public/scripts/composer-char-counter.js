$(document).ready(function() {
    const maxLength = 140;
    $('.new-tweet textarea').on('input', function() {
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

    // Submit tweet validation
    $('.new-tweet form').submit(function(event) {
        event.preventDefault();
        const tweetText = $('.new-tweet textarea').val().trim();
        const $errorMessage = $('.error-message');

        $errorMessage.slideUp('fast', function() {
            $errorMessage.empty();
        }); // Hide the error message initially for every new submission

        // Checks if the text box is empty OR it exceeds the length of the limit
        if (!tweetText) {
            $errorMessage.text('Your tweet cannot be empty.').slideDown('fast');
            return;
        }
        if (tweetText.length > maxLength) {
            $errorMessage.text('Your tweet exceeds the character limit.').slideDown('fast');
            return;
        }
    });
});