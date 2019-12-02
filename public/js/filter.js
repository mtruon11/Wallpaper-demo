(function ($) {
    // USE STRICT
    "use strict";

    $(document).ready(function(){
        
    })
    var categories = [], tags = [], colors = [], measures = [];
    
    $('.category').on('click', function(){ 
        categories.push($(this).attr('id'))
    })
    $('.color').on('click', function(){ 
        colors.push($(this).attr('id'))
    })
    $('.tag').on('click', function(){ 
        tags.push($(this).attr('id'))
    })
    $('.measure').on('click', function(){ 
        measures.push($(this).attr('id'))
    })

    $('.filter').click(function(e){
        e.preventDefault();
       
        $.ajax({
            url: "https://localhost:8080/api/filter?pageNum=1&size=12",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                "categories": categories, "colors": colors, "tags": tags, "measures": measures
            })    
        }).done(function(data){
            var row = $('.products');
            var products = data.products;
            row.empty();
            categories = [], tags = [], colors = [], measures = [];
            products.forEach(e => {
                var ele = '<div class="col-sm-12 col-md-4 col-lg-3 p-b-50"><div class="block2">'
                if(e.isSale){
                    ele += ' <div class="block2-img wrap-pic-w of-hidden pos-relative block2-labelsale"> '
                } else {
                    ele += ' <div class="block2-img wrap-pic-w of-hidden pos-relative"> '
                }
                
                ele += '<img src="'+e.imageUrl[0]+'" alt="IMG-PRODUCT"><div class="block2-overlay trans-0-4"><a href="#" class="block2-btn-addwishlist hov-pointer trans-0-4"><i class="icon-wishlist icon_heart_alt" aria-hidden="true"></i>'+
                    '<i class="icon-wishlist icon_heart dis-none" aria-hidden="true"></i></a>' +
                    '<div class="block2-btn-addcart w-size1 trans-0-4"><a href="/cart/addToCart/'+ e._id +'?pageNum=' + data.currentPage+ '&size='+12+'" class="flex-c-m size1 bg4 bo-rad-23 hov1 s-text1 trans-0-4 btn">'+
                    'Add to Cart</a></div></div></div>'+
                    '<div class="block2-txt p-t-20"><a href="/products/'+ e._id +'" class="block2-name dis-block s-text3 p-b-5">'+ e.name + '</a>' +
                    '<span class="block2-price m-text6 p-r-5 text-danger">'
                if(e.isSale){
                    ele += '<del>$'+e.regularPrice+'</del> $'+ e.discountPrice +'</span>'
                } else {
                    ele += '$'+ e.regularPrice +'</span>'
                }
                ele += '</div></div></div>'
                row.append(ele);
            })

            var product_col = $('.product-col');
            var ele = '<div class="pagination flex-m flex-w p-t-26">'

            for(var i = 1; i <= data.pages; i++) {
                ele += '<a href="/products?pageNum='+ i + '&size=12" class="item-pagination flex-c-m trans-0-4">'+i+'</a>'
            }
            ele += '</div>'
            product_col.append(ele);
        })
    })
})(jQuery);
