(function ($) {
    // USE STRICT
    "use strict";

    $(document).ready(function(){
        getProducts();
    })

    $(document).on('click', '#product-table tr button', function(e){
        e.preventDefault();
        var id = $(this).attr('id')
        $.ajax({
            url: "https://localhost:8080/api/products",
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({"id": id})
        }).done(function(data){
            if(data.error == false){
                $('#'+id).remove();
                var total = $('#totalProduct').text(); 
                $('#totalProduct').text(parseInt(total) - 1);
            }
        })
        
    })


    $(document).on('click', '#product-table tr a', function(e){
        e.preventDefault();
        var id = $(this).attr('id')
        $.ajax({
            url: "https://localhost:8080/api/products/"+id,
            type: 'GET',
            // contentType: 'application/json',
            // data: JSON.stringify({"id": id})
        }).done(function(data){
            if(data.error == false){
                var p = data.product;
                $('.product-table').hide('slow');
                $('.product-form').show('slow'); 
                setTimeout(function(){
                    $('#sku').val(p.sku);
                    $('#name').val(p.name);
                    $('#description').text(p.description);
                    $('#quantity').val(p.quantity);
                    $('#regularPrice').val(p.regularPrice);
                    $('#discountPrice').val(p.discountPrice);
                    getCategories();
                    getTags();
                    getColors();
                    getMeasurements();
                }, 500)           
            }
        })
        
    })

    $('.btn-addProduct').click(function(e){
        e.preventDefault();
        $('.product-table').hide('slow');
        $('.product-form').show('slow');
        $(document).ready(function(){
            getCategories();
            getTags();
            getColors();
            getMeasurements();
        })
    })

    $(document).ready(function(){
        // getCategories();
        // getTags();
        getColors();
        getMeasurements();
    })

    $('.btn-viewProduct').click(function(e){
        e.preventDefault();
        $('.product-form').hide('slow');
        $('.product-table').show('slow');
    })

    $('.btn-save').click(function(e){
        e.preventDefault();
        addProduct();
        $('.btn-reset').click();
        $('.product-form').hide('slow');
        $('.product-table').show('slow');
    })


    var sku = '', name = '', description = '', categories = [], tags = [], colors = [], measures = [];
    var quantity = 0, regularPrice = 0, discountPrice = 0, images = []; 
    
    $('#sku').on('change', function(){ 
        sku = $(this).val()
    })
    $('#name').on('change', function(){ 
        name = $(this).val()
    })
    $('#description').on('change', function(){ 
        description = $(this).val()
    })
    $('#categories').on('change', function(){ 
        categories = $(this).val()
    })
    $('#tags').on('change', function(){ 
        tags = $(this).val()
    })
    $('#colors').on('change', function(){ 
        colors = $(this).val()
    })
    $('#measure').on('change', function(){ 
        measures = $(this).val()
    })
    $('#quantity').on('change', function(){ 
        quantity = $(this).val()
    })
    $('#regularPrice').on('change', function(){ 
        regularPrice = $(this).val()
    })
    $('#discountPrice').on('change', function(){ 
        discountPrice = $(this).val()
    })
    $('#images').on('change', function(){ 
        images = $(this)[0].files
    })

    function addProduct(){
        var fd = new FormData();
        fd.append("sku", sku);
        fd.append("name", name);
        fd.append("description", description);
        fd.append("categories", categories);
        fd.append("tags", tags);
        fd.append("colors", colors);
        fd.append("measures", measures);
        fd.append("quantity", quantity);
        fd.append("regularPrice", regularPrice);
        fd.append("discountPrice", discountPrice);
        
        $.each(images, function(key, file){
            fd.append('images', file)
        })
    

        $.ajax({
            url: "https://localhost:8080/api/products",
            type: 'POST',
            contentType: false,
            processData: false,
            data: fd
        }).done(function(data){
            sku = '', name = '', description = '', categories = [], tags = [], colors = [], measures = [];
            quantity = 0, regularPrice = 0, discountPrice = 0, images = [];

            var table = $('#product-table');
            var e = data.product; 
        
            var ele = '<tr class="mw-100 p-3 text-center" id='+ e._id +'>'+
            '<td class="text-center">'+e.sku+'</td>'+
            '<td class="h-50 mx-auto my-auto text-center">'+
            '<img src='+e.imageUrl[0]+' alt="Image" class="img-fluid img-thumbnail rounded" width="100px"/></td>'+
            '<td class="text-center">'+e.name+'</td>'+
            '<td class="text-center regularPrice">'+e.regularPrice+'</td>'+
            '<td class="text-center discountPrice">'+e.discountPrice+'</td>'+
            '<td class="text-center">'+e.quantity+'</td>'
            if(e.status){
                ele += '<td class="text-center"><span class="label label-success" style="background-color:#449d44">Available</span></td>'
            } else {
                ele += '<td class="text-center"><span class="label label-danger" style="background-color:red">Out of Stock</span></td>'
            }
            ele += '<td class="text-center">'
            e.categories.forEach(c => {
                ele += '<p class="text-center">' +c+ '</p>'
            })
            ele += '</td><td class="text-center"><p class="text-center">'
            e.tags.forEach(t => {
                ele += '<p class="text-center">' +t+ '</p>'
            })
            ele += '</p></td><td class="text-center">'+ e.createdOn +'</td><td class="text-center">' +
                '<a href="" class="edit" id="' + e._id + '">' +
                '<i class="fas fa-edit"></i>'+
                '</a><button type="submit" class="btn btn-sm btn-del" id="' + e._id + '">' +
                '<i class="fas fa-trash-alt" style="color:red"></i>' +
                '</a></td></tr>'
            
            table.append(ele);
            var total = $('#totalProduct').text();
            $('#totalProduct').text(parseInt(total) + 1);
        })
    }

    function getCategories(){
        $.ajax({
            url: "https://localhost:8080/api/categories",
            type: 'GET',
            contentType: 'application/json',
            data: null
        }).done(function(data){
            var categories = data.categories;
            categories.forEach(element => {
                $('#categories').append($('<option></option>').attr('value', element.name).text(element.name))
            });
        })
    }

    function getTags(){
        $.ajax({
            url: "https://localhost:8080/api/tags",
            type: 'GET',
            contentType: 'application/json',
            data: null
        }).done(function(data){
            var tags = data.tags;
            tags.forEach(element => {
                $('#tags').append($('<option></option>').attr('value', element.name).text(element.name))
            });
        })
    }

    function getColors(){
        $.ajax({
            url: "https://localhost:8080/api/colors",
            type: 'GET',
            contentType: 'application/json',
            data: null
        }).done(function(data){
            var colors = data.colors;
            colors.forEach(element => {
                $('#colors').append($('<option></option>').attr('value', element.name).text(element.name))
            });
        })
    }

    function getMeasurements(){
        $.ajax({
            url: "https://localhost:8080/api/measurements",
            type: 'GET',
            contentType: 'application/json',
            data: null
        }).done(function(data){
            var measurements = data.measurements;
            measurements.forEach(element => {
                $('#measure').append($('<option></option>').attr('value', element.measure).text(element.measure))
            });
        })
    }

    function getProducts(){
        $.ajax({
            url: "https://localhost:8080/api/products",
            type: 'GET',
            contentType: 'application/json',
            data: null
        }).done(function(data){
            var table = $('#product-table');
            var products = data.products; 
            
            products.forEach(e => {
                var ele = '<tr class="mw-100 p-3 text-center" id='+ e._id +'>'+
                '<td class="text-center">'+e.sku+'</td>'+
                '<td class="h-50 mx-auto my-auto text-center">'+
                '<img src='+e.imageUrl[0]+' alt="Image" class="img-fluid img-thumbnail rounded" width="100px"/></td>'+
                '<td class="text-center">'+e.name+'</td>'+
                '<td class="text-center regularPrice">'+e.regularPrice+'</td>'+
                '<td class="text-center discountPrice">'+e.discountPrice+'</td>'+
                '<td class="text-center">'+e.quantity+'</td>'
                if(e.status){
                    ele += '<td class="text-center"><span class="label label-success" style="background-color:#449d44">Available</span></td>'
                } else {
                    ele += '<td class="text-center"><span class="label label-danger" style="background-color:red">Out of Stock</span></td>'
                }
                ele += '<td class="text-center">'
                e.categories.forEach(c => {
                    ele += '<p class="text-center">' +c+ '</p>'
                })
                ele += '</td><td class="text-center"><p class="text-center">'
                e.tags.forEach(t => {
                    ele += '<p class="text-center">' +t+ '</p>'
                })
                ele += '</p></td><td class="text-center">'+ e.createdOn +'</td><td class="text-center">' +
                    '<a href="" class="edit" id="' + e._id + '">' +
                    '<i class="fas fa-edit"></i>'+
                    '</a><button type="submit" class="btn btn-sm btn-del" id="' + e._id + '">' +
                    '<i class="fas fa-trash-alt" style="color:red"></i>' +
                    '</a></td></tr>'
                
                table.append(ele);
            })
            
            $('#outOfStock').text(data.outOfStock);
            $('#totalProduct').text(data.total);
        })
    }

})(jQuery);

