(function ($) {
    // USE STRICT
    "use strict";

    $(document).ready(function(){
        getCategories();
    })

    function getCategories(){

        var table = $('#category-table');

        $.ajax({
            url: "https://localhost:8080/api/categories",
            type: 'GET',
            data: null
        }).done(function(data){
            var categories = data.categories;

            categories.forEach(c => {
                var ele = '<tr class="mw-100 p-3" id="'+ c._id + '">' +
                '<td>' + c.name + '</td><td>' + c.createdOn + '</td><td>' + c.updatedOn + '</td>' +
                '<td><button type="submit" class="btn btn-sm btn-del" id="' + c._id + '"><i class="fas fa-trash-alt fa-lg" style="color:red"></i></button></td></tr>'
                table.append(ele);
            })
        })
    }

    $(document).on('click', '#categories-table tr button', function(e){
        e.preventDefault();
        var id = $(this).attr('id')
    
            $.ajax({
                url: "https://localhost:8080/api/categories",
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({"id": id})
            }).done(function(data){
                if(data.error == false){
                    $('#'+id).remove();
                }
            })
            
    })


    var name = ''
    $('#name').on('change', function(){
        name = $(this).val();
    })

    $('#btn-save').click(function(e){
        e.preventDefault();
        $.ajax({
            url: "https://localhost:8080/api/categories",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({"name": name})
        }).done(function(data){
            if(data.error == false){
                var table = $('#category-table');
                var ele = '<tr class="mw-100 p-3" id="'+ data.category._id + '">' +
                '<td>' + data.category.name + '</td><td>' + data.category.createdOn + '</td><td>' + data.category.updatedOn + '</td>' +
                '<td><a href="" class="deletion" id="' + data.category._id + '"><i class="fas fa-trash-alt fa-lg" style="color:red"></i></a></td></tr>'
                table.append(ele);
                $('#name').val('');
            }
        })
    })

})(jQuery);