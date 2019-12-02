(function ($) {
    // USE STRICT
    "use strict";

    $(document).ready(function(){
        getTags();
    })

    function getTags(){

        var table = $('#tag-table');

        $.ajax({
            url: "https://localhost:8080/api/tags",
            type: 'GET',
            data: null
        }).done(function(data){
            var tags = data.tags;

            tags.forEach(t => {
                var ele = '<tr class="mw-100 p-3" id="'+ t._id + '">' +
                '<td>' + t.name + '</td><td>' + t.createdOn + '</td><td>' + t.updatedOn + '</td>' +
                '<td><button type="submit" class="btn btn-sm btn-del" id="' + t._id + '"><i class="fas fa-trash-alt fa-lg" style="color:red"></i></button></td></tr>'
                table.append(ele);
            })
        })
    }

    $(document).on('click', '#tags-table tr button', function(e){
        e.preventDefault();
        var id = $(this).attr('id')
    
            $.ajax({
                url: "https://localhost:8080/api/tags",
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
            url: "https://localhost:8080/api/tags",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({"name": name})
        }).done(function(data){
            if(data.error == false){
                var table = $('#tag-table');
                var ele = '<tr class="mw-100 p-3" id="'+ data.tag._id + '">' +
                '<td>' + data.tag.name + '</td><td>' + data.tag.createdOn + '</td><td>' + data.tag.updatedOn + '</td>' +
                '<td><a href="" class="deletion" id="' + data.tag._id + '"><i class="fas fa-trash-alt fa-lg" style="color:red"></i></a></td></tr>'
                table.append(ele);
                $('#name').val('');
            }
        })
    })

})(jQuery);