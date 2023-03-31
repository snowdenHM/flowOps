(function ($) {

    $(".dm-accordion").on("click",".dm-collapse-item__header", function (e) {
        e.stopPropagation();
        $(this).next().collapse('show');
        $(this).parent().parent().find(".dm-collapse-item__body").not($(this).next()).collapse('hide');
    });

    $(".dm-collapse").on("click",".dm-collapse-item__header", function (e) {
        $(this).toggleClass("active")
    });


})(jQuery);