var stripe = Stripe('pk_test_iUWEQLubWqZFnYwtySQwh0L0');
var elements = stripe.elements();

var style = {
    base: {
        color: "#32325d",
        lineHeight: '18px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder':{
            color: '#aab7c4'
        }
    },
    invalid:{
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

var card = elements.create('card', {style: style});

card.mount('#card-element');

card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if(event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

function createToken(){
    stripe.createToken(card).then(function(result) {
        if(result.error){
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            stripeResponseHandler(result.token);
        }
    });
};

var stripeResponseHandler = function(token){
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    console.log('append successfully', token.id);
    form.submit();
}

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(e){
    e.preventDefault();
    createToken();
});

