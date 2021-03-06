var table;
var id = 0;
$(document).ready(function () {
    ListDatatable();
    SelectLanguage();
    SelectType();
    catch_parameters();
});
// datatable catalogos
function ListDatatable() {
    table = $('#table').DataTable({
        dom: 'lfBrtip',
        processing: true,
        serverSide: true,
        "paging": true,
        language: {
            "url": "/js/assets/Spanish.json"
        },
        ajax: {
            url: 'locations_datatable'
        },
        columns: [{
                data: 'Imagen',
                orderable: false,
                searchable: false
            },
            {
                data: 'name'
            },
            {
                data: 'description'
            },
            {
                data: 'coordinates'
            },
            {
                data: 'location_type.name'
            },
            {
                data: 'language.name'
            },
            {
                data: 'state',
                "render": function (data, type, row) {
                    if (row.state === 'ACTIVO') {
                        return '<center><p class="text-success"><b>ACTIVO</b></p></center>';
                    } else if (row.state === 'INACTIVO') {
                        return '<center><p class="text-warning"><b>INACTIVO</b></p></center>';
                    } else if (row.state === 'ELIMINADO') {
                        return '<center><p class="text-danger"><b>ELIMINADO</b></p></center>';
                    }
                }
            },
            {
                data: 'Mapa',
                orderable: false,
                searchable: false
            },
            {
                data: 'Enlace',
                orderable: false,
                searchable: false
            },
            {
                data: 'QR',
                orderable: false,
                searchable: false
            },
            {
                data: 'Editar',
                orderable: false,
                searchable: false
            },
            {
                data: 'Eliminar',
                orderable: false,
                searchable: false
            },
        ],
        buttons: [{
                text: '<i class="fas fa-eye"></i> ',
                className: 'btn btn-dark rounded m-2',
                titleAttr: 'Columnas',
                extend: 'colvis'
            },
            {
                text: '<i class="fas fa-file-excel"></i>',
                className: 'btn btn-dark rounded m-2',
                titleAttr: 'Excel',
                extend: 'excel',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6]
                }
            },
            {
                text: '<i class="fas fa-file-pdf"></i> ',
                className: 'btn btn-dark rounded m-2',
                titleAttr: 'PDF',
                extend: 'pdf',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6]
                }
            },
            {
                text: '<i class="fas fa-print"></i> ',
                className: 'btn btn-dark rounded m-2',
                titleAttr: 'Imprimir',
                extend: 'print',
                messageTop: '<i class="fas fa-print"></i>',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6]
                }
            },
            //btn Refresh
            {
                text: '<i class="fas fa-sync-alt"></i>',
                className: 'btn btn-info rounded m-2',
                action: function () {
                    table.ajax.reload();
                }
            }
        ],
    });
};

function SelectLanguage() {
    $.ajax({
        url: "list_catalogue",
        method: 'get',
        data: {
            by: "type_catalogue_id",
            type_catalogue_id: 4
        },
        success: function (result) {
            var code = '<div class="form-group">';
            code += '<label><b>Idioma:</b></label>';
            code += '<select class="form-control rounded" name="language_id" id="language_id" required>';
            code += '<option disabled value="" selected>(Seleccionar)</option>';
            $.each(result, function (key, value) {
                code += '<option value="' + value.id + '">' + value.name + '</option>';
            });
            code += '</select>';
            code += '<div class="invalid-feedback">';
            code += 'Dato necesario.';
            code += '</div>';
            code += '</div>';
            $("#select_language").html(code);
        },
        error: function (result) {
            toastr.error(result.msg + ' CONTACTE A SU PROVEEDOR POR FAVOR.');
            //console.log(result);
        },

    });
}

function SelectType() {
    $.ajax({
        url: "list_catalogue",
        method: 'get',
        data: {
            by: "type_catalogue_id",
            type_catalogue_id: 7
        },
        success: function (result) {
            var code = '<div class="form-group">';
            code += '<label><b>Tipo de locatione:</b></label>';
            code += '<select class="form-control rounded" name="location_type_id" id="location_type_id" required>';
            code += '<option disabled value="" selected>(Seleccionar)</option>';
            $.each(result, function (key, value) {
                code += '<option value="' + value.id + '">' + value.name + '</option>';
            });
            code += '</select>';
            code += '<div class="invalid-feedback">';
            code += 'Dato necesario.';
            code += '</div>';
            code += '</div>';
            $("#select_type").html(code);
        },
        error: function (result) {
            toastr.error(result.msg + ' CONTACTE A SU PROVEEDOR POR FAVOR.');
            //console.log(result);
        },

    });
}

// guarda los datos nuevos
function Save() {
    //console.log(catch_parameters());
    $.ajax({
        url: "locations",
        method: 'post',
        data: catch_parameters(),
        success: function (result) {
            if (result.success) {
                VanillaToasts.create({
                    text: result.msg,
                    type: 'success',
                    timeout: 5000
                });
                Push.create(result.msg);
                console.log(result.msg);
            } else {
                VanillaToasts.create({
                    text: result.msg,
                    type: 'warning',
                    timeout: 5000
                });
                Push.create(result.msg);
                console.log(result.msg);
            }
        },
        error: function (result) {
            VanillaToasts.create({
                text: result.responseJSON.message,
                type: 'error',
                timeout: 5000
            });
            Push.create(result.responseJSON.message);
            console.log(result);
        },
    });
    table.ajax.reload();
}

// captura los datos
function Edit(id) {
    $.ajax({
        url: "locations/{location}/edit",
        method: 'get',
        data: {
            id: id
        },
        success: function (result) {
            //console.log(result);
            show_data(result);
        },
        error: function (result) {
            VanillaToasts.create({
                text: result.responseJSON.message,
                type: 'error',
                timeout: 5000
            });
            Push.create(result.responseJSON.message);
            console.log(result);
        },

    });
};

/// muestra la vista con los datos capturados
var data_old;

function show_data(obj) {
    ClearInputs();
    obj = JSON.parse(obj);
    id = obj.id;
    $("#name").val(obj.name);
    $("#description").val(obj.description);
    $('#image').attr('src', obj.photo);
    $('#label_image').html(obj.photo);
    $('#lat').val(obj.lat);
    $('#lng').val(obj.lng);
    $('#lat_lng').html('Latitud: ' + obj.lat + ' | Longitud: ' + obj.lng);
    SetMap(obj.lat, obj.lng);
    $("#link").val(obj.link);
    $("#location_type_id").val(obj.location_type_id);
    $("#language_id").val(obj.language_id);
    if (obj.state == "ACTIVO") {
        $('#estado_activo').prop('checked', true);
    }
    if (obj.state == "INACTIVO") {
        $('#estado_inactivo').prop('checked', true);
    }
    $("#title-modal").html("Editar Registro");
    data_old = catch_parameters();

    $('#modal_datos').modal('show');
};

// actualiza los datos
function Update() {
    var data_new = catch_parameters();
    if (data_old != data_new) {
        $.ajax({
            url: "locations/{location}",
            method: 'put',
            data: catch_parameters(),
            success: function (result) {
                if (result.success) {
                    VanillaToasts.create({
                        text: result.msg,
                        type: 'success',
                        timeout: 5000
                    });
                    Push.create(result.msg);

                } else {
                    VanillaToasts.create({
                        text: result.msg,
                        type: 'warning',
                        timeout: 5000
                    });
                    Push.create(result.msg);
                }
            },
            error: function (result) {
                VanillaToasts.create({
                    text: 'CONTACTE AL ADMINISTRADOR.',
                    type: 'error',
                    timeout: 5000
                });
                Push.create(result.responseJSON.message);
                console.log(result);
            },
        });
        table.ajax.reload();

    }
}

//funcion para eliminar valor seleccionado
function Delete(id_) {
    id = id_;
    $('#modal_eliminar').modal('show');
}
$("#btn_delete").click(function () {
    $.ajax({
        url: "locations/{location}",
        method: 'delete',
        data: {
            id: id
        },
        success: function (result) {
            if (result.success) {
                VanillaToasts.create({
                    text: result.msg,
                    type: 'success',
                    timeout: 5000
                });
                Push.create(result.msg);

            } else {
                VanillaToasts.create({
                    text: result.msg,
                    type: 'warning',
                    timeout: 5000
                });
                Push.create(result.msg);
            }
        },
        error: function (result) {
            VanillaToasts.create({
                text: result.responseText,
                type: 'error',
                timeout: 5000
            });
            Push.create(result.responseJSON.message);
            console.log(result);
        },

    });
    table.ajax.reload();
    $('#modal_eliminar').modal('hide');
});

//////////////////////////////////////////////

// METODOS NECESARIOS
// funcion para volver mayusculas
function Mayus(e) {
    e.value = e.value.toUpperCase();
}

// obtiene los datos del formulario
function catch_parameters() {
    var data = $(".form-data").serialize();
    data += "&id=" + id;
    data += "&extension_image=" + extension_image;
    data += "&image=" + reader.result;
    return data;
}

// muestra el modal
$("#btn-agregar").click(function () {
    ClearInputs();
    $("#title-modal").html(title_modal_data);
    $("#modal_datos").modal("show");
});

// metodo de bootstrap para validar campos

(function () {
    'use strict';
    window.addEventListener('load', function () {
        var forms = document.getElementsByClassName('form-data');
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    event.preventDefault();
                    event.stopPropagation();
                    if (id == 0) {
                        Save();
                    } else {
                        Update();
                    }
                    $('#modal_datos').modal('hide');
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

//limpiar campos despues de utilizar el modal
function ClearInputs() {
    var forms = document.getElementsByClassName('form-data');
    Array.prototype.filter.call(forms, function (form) {
        form.classList.remove('was-validated');
    });
    //__Clean values of inputs
    $('#label_image').html("");
    $('#image').attr('src','');
    $("#form-data")[0].reset();
    id = 0;
    SetMap(-21.521699999, -64.742499999);
};

//Metodos para imagen
var reader = new FileReader();
var extension_image = "";
$("#photo").change(function (e) {
    ImgPreview(this);
    $fileName = e.target.files[0].name;
    extension_image = $fileName.replace(/^.*\./, '');
    $('#label_image').html($fileName);
    //console.log(extension_image);
});

function ImgPreview(input) {
    if (input.files && input.files[0]) {
        reader.onload = function (e) {
            //console.log(e);
            $('#image').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

//QR CODE
function Gen_QR(text) {
    console.log();
    $('#qrcode').html("");



    var qrcode = new QRCode(document.getElementById("qrcode"), {
        colorDark: "#1CC88A",
        colorLight: "#ffffff",
        width: 512,
        height: 512,
        text: text,
        logo: "images/logo.jpg",
        logoBackgroundColor: '#ffffff',
        logoBackgroundTransparent: false
    });
    $('#modal_qr').modal('show');
}

//Google Maps Location

// Get element references
var confirmBtn = document.getElementById('confirmPosition');
var onClickPositionView = document.getElementById('onClickPositionView');
var onIdlePositionView = document.getElementById('onIdlePositionView');
var map = document.getElementById('map');

// Initialize LocationPicker plugin
var lp = new locationPicker(map, {
    setCurrentPosition: true, // You can omit this, defaults to true
    lat: -21.521699999,
    lng: -64.742499999
}, {
    zoom: 15 // You can set any google map options here, zoom defaults to 15
});
// Listen to button onclick event
confirmBtn.onclick = function () {
    // Get current location and show it in HTML
    var location = lp.getMarkerPosition();
    onClickPositionView.innerHTML = 'The chosen location is ' + location.lat + ',' + location.lng;

    /*    
    $('#lat_lng').html(location.lat.toFixed(6));
    $('#lat').val(location.lat);
    $('#lng').val(location.lng);*/
};

// Listen to map idle event, listening to idle event more accurate than listening to ondrag event
google.maps.event.addListener(lp.map, 'idle', function (event) {
    // Get current location and show it in HTML
    var location = lp.getMarkerPosition();
    $('#lat_lng').html('Latitud: ' + location.lat.toFixed(6) + ' | Longitud: ' + location.lng.toFixed(6));
    $('#lat').val(location.lat.toFixed(6));
    $('#lng').val(location.lng.toFixed(6));
});



function SetMap(lat, lng) {
    $('#map').html('');
    lp = new locationPicker(map, {
        setCurrentPosition: true,
        lat: lat,
        lng: lng
    }, {
        zoom: 15
    });

    google.maps.event.addListener(lp.map, 'idle', function (event) {
        // Get current location and show it in HTML
        var location = lp.getMarkerPosition();
        $('#lat_lng').html('Latitud: ' + location.lat.toFixed(6) + ' | Longitud: ' + location.lng.toFixed(6));
        $('#lat').val(location.lat.toFixed(6));
        $('#lng').val(location.lng.toFixed(6));
    });
}
