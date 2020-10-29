function goUp() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
var prev_scroll_pos = 0;
window.onscroll = function hideNav() {
  if (window.pageYOffset > prev_scroll_pos && window.pageYOffset > 40) {
    document.getElementsByClassName("nav")[0].style.display = "none";
    prev_scroll_pos = window.pageYOffset;
  } else {
    document.getElementsByClassName("nav")[0].style.display = "flex";
    prev_scroll_pos = window.pageYOffset;
  }
};
var modal = document.getElementById("id01");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function showLogin() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("btns").style.display = "none";
}
function showUpdate() {
  document.getElementById("p2").style.display = "block";
  document.getElementById("p1").style.display = "none";
}
function showProf() {
  document.getElementById("p1").style.display = "block";
  document.getElementById("p2").style.display = "none";
}
document.onload = window.scrollTo({

	x: 0,
})


