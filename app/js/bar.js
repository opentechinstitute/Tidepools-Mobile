$(document).ready(function () {
    $(window).bind("scroll", function () {
        $(this).scrollTop() > 460 && $(".header-Nav").addClass("add-Stripe"), 460 > $(this).scrollTop() && $(".header-Nav").removeClass("add-Stripe"), $(this).scrollTop() > 100 && ($(".logo").addClass("in-View"), $(".constant-Nav").addClass("in-View")), 100 > $(this).scrollTop() && ($(".logo").removeClass("in-View"), $(".constant-Nav").removeClass("in-View"))
    }), $(".small-Nav").click(function () {
        $(".header-Nav").toggleClass("show-Nav")
    })
});
