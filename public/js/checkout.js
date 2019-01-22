var $form = $('#credit-card-form');

$form.submit(function(event){
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled', true);    
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val(),
        address: $('#address').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response){
    
    if(response.error) {
        $form.find('#charge-errors').text(response.error.message);
        $form.find('#charge-error').removeClass('invisible');
        $form.find('button').prop('disabled', false);
    } else {
        var token = response.id;
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        $form.get(0).submit;
    }
}