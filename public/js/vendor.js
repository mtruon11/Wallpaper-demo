(function ($) {
    // USE STRICT
    "use strict";
    
    $(document).ready(function(){
        getVendors();
    })

    $('#add-vendor').click(function(e){
        e.preventDefault();
        $('.vendor-table').hide('slow');
        $('.vendor-form').show('slow');
    })

    $('.btn-save').click(function(e){
        e.preventDefault();
        addVendor();
        $('.btn-reset').click();
        $('.vendor-form').hide('slow');
        $('.vendor-table').show('slow');
    })

    $(document).on('click', '#vendor-table tr button', function(e){
        e.preventDefault();
        var id = $(this).attr('id')
        $.ajax({
            url: "https://localhost:8080/api/vendors",
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({"id": id})
        }).done(function(data){
            if(data.error == false){
                $('#'+id).remove();
            }
        })
        
    })

    var name = '', email = '', phone = '',  address = '', company = '';
    var image; 
    
    $('#name').on('change', function(){ 
        name = $(this).val()
    })
    $('#email').on('change', function(){ 
        email = $(this).val()
    })
    $('#phone').on('change', function(){ 
        phone = $(this).val()
    })
    $('#address').on('change', function(){ 
        address = $(this).val()
    })
    $('#company').on('change', function(){ 
        company = $(this).val()
    })
    $('#image').on('change', function(){ 
        image = $(this)[0].files[0]
    })

    function addVendor(){
        var fd = new FormData();

        fd.append("name", name);
        fd.append("email", email);
        fd.append("phone", phone);
        fd.append("address", address);
        fd.append("company", company);
        fd.append('image', image)

        $.ajax({
            url: "https://localhost:8080/api/vendors",
            type: 'POST',
            contentType: false,
            processData: false,
            data: fd
        }).done(function(data){
            name = '', email = '', phone = '',  address = '', company = '', image=null; 

            var table = $('#vendor-table');
            var e = data.vendor; 
        
            var ele = '<tr class="mw-100 p-3 text-center" id='+ e._id +'>'+
                '<td class="h-50 mx-auto my-auto text-center">'+
                '<img src="'+ e.imageUrl + '" alt="Image" class="img-fluid img-thumbnail rounded" width="100px"/></td>'+
                '<td class="text-center company">'+e.company+'</td>'+
                '<td class="text-center name">'+e.name+'</td>'+
                '<td class="text-center email">'+e.email+'</td>'+
                '<td class="text-center phone">'+e.phone+'</td>' +
                '<td class="text-center address">'+e.address+'</td>' +
                '<td class="text-center">'+ e.createdOn +'</td><td class="text-center">' +
                '<a href="" class="edit" id="' + e._id + '">' +
                '<i class="fas fa-edit"></i>'+
                '</a><button type="submit" class="btn btn-sm btn-del" id="' + e._id + '">' +
                '<i class="fas fa-trash-alt" style="color:red"></i>' +
                '</a></td></tr>'
            
            table.append(ele);
        })
    }

    function getVendors(){
        $.ajax({
            url: "https://localhost:8080/api/vendors",
            type: 'GET',
            contentType: 'application/json',
            data: null
        }).done(function(data){
            var table = $('#vendor-table');
            var vendors = data.vendors; 
            
            vendors.forEach(e => {
                var ele = '<tr class="mw-100 p-3 text-center" id='+ e._id +'>'+
                '<td class="h-50 mx-auto my-auto text-center">'+
                '<img src="'+ e.imageUrl + '" alt="Image" class="img-fluid img-thumbnail rounded" width="100px"/></td>'+
                '<td class="text-center company">'+e.company+'</td>'+
                '<td class="text-center name">'+e.name+'</td>'+
                '<td class="text-center email">'+e.email+'</td>'+
                '<td class="text-center phone">'+e.phone+'</td>' +
                '<td class="text-center address">'+e.address+'</td>' +
                '<td class="text-center">'+ e.createdOn +'</td><td class="text-center">' +
                '<a href="" class="edit" id="' + e._id + '">' +
                '<i class="fas fa-edit"></i>'+
                '</a><button type="submit" class="btn btn-sm btn-del" id="' + e._id + '">' +
                '<i class="fas fa-trash-alt" style="color:red"></i>' +
                '</a></td></tr>'
                table.append(ele);
            })
        });
    }

})(jQuery);
