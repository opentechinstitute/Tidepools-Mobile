$(document).ready(function () {
    $(window).bind("scroll", function () {
// Scroll 400px down and this will add a stripe class to your div
        $(this).scrollTop() > 400 && $(".header-Nav").addClass("add-Stripe"), 400 > $(this).scrollTop() && $(".header-Nav").removeClass("add-Stripe"), 
// Scroll 100px down and this will slide in the red logo
//        $(this).scrollTop() > 100 && ($(".logo").addClass("in-View"), $(".constant-Nav").addClass("in-View")), 
//        100 > $(this).scrollTop() && ($(".logo").removeClass("in-View"), $(".constant-Nav").removeClass("in-View"))
// and remove white logo
//        $(this).scrollTop() > 100 && ($(".logo").addClass("in-View"), $(".constant-Nav").addClass("in-View")), 
//        100 > $(this).scrollTop() && ($(".logo").removeClass("in-View"), $(".constant-Nav").removeClass("in-View"))

   ), $(".small-Nav").click(function () {
        $(".header-Nav").toggleClass("show-Nav")
    })
});
