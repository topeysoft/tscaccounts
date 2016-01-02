function Init() {
    //tinymce.init({
    //    selector: '.editable.plain',
    //    inline: true,
    //    toolbar: 'undo redo',
    //    menubar: false
    //});

    //tinymce.init({
    //    selector: '.editable.rich',
    //    inline: true,
    //    plugins: [
    //      'advlist autolink lists link image charmap print preview anchor',
    //      'searchreplace visualblocks code fullscreen',
    //      'insertdatetime media table contextmenu paste'
    //    ],
    //    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
    //});
    $('.body:not(.is-mobile) aside').pushpin({ top: $('body').offset().top });
}

$(document).ready(function () {
    Init();
})