/* Header menu transform on scroll down. Uses jquery. */   
window.onscroll=function () {
// defining top as page offset from top
    var top = window.pageXOffset ? window.pageXOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
// menu is the element id of the header/menu
    var head = document.getElementById("header")
// only applies if you're scrolling greater than X pixels
    if(top > 50){
        head.style.position = "fixed";
// height of the menu post-scroll
	head.style.height="75px"
// gap from the top
        head.style.top="0px"
        }
        else {
if(head.getAttribute("style"))
    head.removeAttribute("style")                
        }
}
