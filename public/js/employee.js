(function ($) {
    // USE STRICT
    "use strict";
    
    $(document).ready(function(){
        getEmployees();
    })

    $('#add-employee').click(function(e){
        e.preventDefault();
        $('.employee-table').hide('slow');
        $('.employee-form').show('slow');
    })

    $('.btn-save').click(function(e){
        e.preventDefault();
        addEmployee();
        $('.btn-reset').click();
        $('.employee-form').hide('slow');
        $('.employee-table').show('slow');
    })

    $(document).on('click', '#employee-table tr button', function(e){
        e.preventDefault();
        var id = $(this).attr('id')
        $.ajax({
            url: "https://localhost:8080/api/employees",
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({"id": id})
        }).done(function(data){
            if(data.error == false){
                $('#'+id).remove();
            }
        })
        
    })

    var name = '', email = '', password = '', phone = '',  address = '', role = [];
    var image; 
    
    $('#name').on('change', function(){ 
        name = $(this).val()
    })
    $('#email').on('change', function(){ 
        email = $(this).val()
    })
    $('#password').on('change', function(){ 
        password = $(this).val()
    })
    $('#phone').on('change', function(){ 
        phone = $(this).val()
    })
    $('#address').on('change', function(){ 
        address = $(this).val()
    })
    $('#role').on('change', function(){ 
        role = $(this).val()
    })
    $('#image').on('change', function(){ 
        image = $(this)[0].files[0]
    })

    function addEmployee(){
        var fd = new FormData();

        fd.append("name", name);
        fd.append("email", email);
        fd.append("password", password);
        fd.append("phone", phone);
        fd.append("address", address);
        fd.append("role", role);
        fd.append('image', image)

        $.ajax({
            url: "https://localhost:8080/api/employees",
            type: 'POST',
            contentType: false,
            processData: false,
            data: fd
        }).done(function(data){
            name = '', email = '', password = '', phone = '',  address = '', role = [], image=null; 

            var table = $('#employee-table');
            var e = data.user; 
        
            var ele = '<tr class="mw-100 p-3 text-center" id='+ e._id +'>'+
            '<td class="h-50 mx-auto my-auto text-center">'+
            '<img src="'+ e.imageUrl + '" alt="Image" class="img-fluid img-thumbnail rounded" width="100px"/></td>'+
            '<td class="text-center">'+e.name+'</td>'+
            '<td class="text-center email">'+e.email+'</td>'+
            '<td class="text-center phone">'+e.phone+'</td>'+
            '<td class="text-center address">'+e.address+'</td>' +
            '<td class="text-center role">'+e.role+'</td>' +
            '<td class="text-center">'+ e.createdOn +'</td><td class="text-center">' +
            '<a href="" class="edit" id="' + e._id + '">' +
            '<i class="fas fa-edit"></i>'+
            '</a><button type="submit" class="btn btn-sm btn-del" id="' + e._id + '">' +
            '<i class="fas fa-trash-alt" style="color:red"></i>' +
            '</a></td></tr>'
            
            table.append(ele);
        })
    }

    function getEmployees(){
        $.ajax({
            url: "https://localhost:8080/api/employees",
            type: 'GET',
            contentType: 'application/json',
            data: null
        }).done(function(data){
            var table = $('#employee-table');
            var employees = data.employees; 
            
            employees.forEach(e => {
                var ele = '<tr class="mw-100 p-3 text-center" id='+ e._id +'>'+
                '<td class="h-50 mx-auto my-auto text-center">'+
                '<img src="'+ e.imageUrl + '" alt="Image" class="img-fluid img-thumbnail rounded" width="100px"/></td>'+
                '<td class="text-center">'+e.name+'</td>'+
                '<td class="text-center email">'+e.email+'</td>'+
                '<td class="text-center phone">'+e.phone+'</td>'+
                '<td class="text-center address">'+e.address+'</td>' +
                '<td class="text-center role">'+e.role+'</td>' +
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
