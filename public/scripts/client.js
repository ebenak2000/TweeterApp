const escapeText = function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

const createTweetElement = function(tweet) {
    const safeAvatar = escapeText(tweet.user.avatars);
    const safeName = escapeText(tweet.user.name);
    const safeHandle = escapeText(tweet.user.handle);
    const safeText = escapeText(tweet.content.text);

    let $tweet = $(`
        <article class="tweet">
            <header>
                <img src="${safeAvatar}" alt="User's Avatar">
                <div>
                    <h3>${safeName}</h3>
                    <p>${safeHandle}</p>
                </div>
            </header>
            <p>${safeText}</p>
            <footer>
                <span>${timeago.format(new Date(tweet.created_at))}</span>
                <div>
                    <i class="fas fa-flag"></i>
                    <i class="fas fa-retweet"></i>
                    <i class="fas fa-heart"></i>
                </div>
            </footer>
        </article>
    `);
    return $tweet;
};

const renderTweets = function(tweets) {
    const $tweetContainer = $('#tweet-container');
    $tweetContainer.empty();
    tweets.forEach(tweet => {
        const $tweet = createTweetElement(tweet);
        $tweetContainer.append($tweet);
    });
};

$(document).ready(function() {
    const loadTweets = function() {
        $.ajax({
            url: '/tweets',
            method: 'GET',
            dataType: 'json',
            success: function(tweets) {
                renderTweets(tweets);
            },
            error: function(err) {
                console.error('Error fetching tweets:', err);
            }
        });
    };

    $('.new-tweet form').submit(function(event) {
        event.preventDefault();
        const tweetText = $(this).find('textarea').val();
        const $errorMessage = $('.tweet-error-message');

        $errorMessage.slideUp('fast', function() {
            $errorMessage.empty();
        });

        if (!tweetText || tweetText.trim().length === 0) {
            $errorMessage.text('Your tweet content cannot be empty.').slideDown('fast');
            return;
        } else if (tweetText.length > 140) {
            $errorMessage.text('Your tweet content is too long.').slideDown('fast');
            return;
        }

        $.ajax({
            url: '/tweets',
            method: 'POST',
            data: $(this).serialize(),
            success: function() {
                $('.new-tweet textarea').val('');
                $('.new-tweet .counter').text('140');
                loadTweets();
                $errorMessage.hide();
            },
            error: function(err) {
                $errorMessage.text('There was an error submitting your tweet. Please try again.').slideDown('fast');
                console.error(err);
            }
        });
    });

    $('#compose-btn').click(function() {
        $('.new-tweet').slideToggle('fast', function() {
            if ($('.new-tweet').is(':visible')) {
                $('.new-tweet textarea').focus();
            }
        });
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#scroll-to-top-btn').fadeIn('fast');
        } else {
            $('#scroll-to-top-btn').fadeOut('fast');
        }
    });

    $('#scroll-to-top-btn').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 'fast', function() {
            $('.new-tweet').slideDown('fast');
            $('.new-tweet textarea').focus();
        });
    });

    loadTweets();
});