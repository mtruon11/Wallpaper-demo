(function ($) {
    // USE STRICT
    "use strict";

    $(document).ready(function(){
        getMeasurements();
    })

    function getMeasurements(){

        var table = $('#measurement-table');

        $.ajax({
            url: "https://localhost:8080/api/measurements",
            type: 'GET',
            data: null
        }).done(function(data){
            var measurements = data.measurements;

            measurements.forEach(t => {
                var ele = '<tr class="mw-100 p-3" id="'+ t._id + '">' +
                '<td>' + t.measure + '</td><td>' + t.createdOn + '</td><td>' + t.updatedOn + '</td>' +
                '<td><button type="submit" class="btn btn-sm btn-del" id="' + t._id + '"><i class="fas fa-trash-alt fa-lg" style="color:red"></i></button></td></tr>'
                table.append(ele);
            })
        })
    }

    $(document).on('click', '#measurement-table tr button', function(e){
        e.preventDefault();
        var id = $(this).attr('id')
    
            $.ajax({
                url: "https://localhost:8080/api/measurements",
                type: 'DELETE',
                contentType: 'application/json',
                data: JSON.stringify({"id": id})
            }).done(function(data){
                if(data.error == false){
                    $('#'+id).remove();
                }
            })
            
    })


    var measure = ''
    $('#measure').on('change', function(){
        measure = $(this).val();
    })

    $('#btn-save').click(function(e){
        e.preventDefault();
        $.ajax({
            url: "https://localhost:8080/api/measurements",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({"measure": measure})
        }).done(function(data){
            if(data.error == false){
                var table = $('#measurement-table');
                var ele = '<tr class="mw-100 p-3" id="'+ data.measurement._id + '">' +
                '<td>' + data.measurement.measure + '</td><td>' + data.measurement.createdOn + '</td><td>' + data.measurement.updatedOn + '</td>' +
                '<td><a href="" class="deletion" id="' + data.measurement._id + '"><i class="fas fa-trash-alt fa-lg" style="color:red"></i></a></td></tr>'
                table.append(ele);
                $('#name').val('');
            }
        })
    })

})(jQuery);