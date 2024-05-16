document.addEventListener("DOMContentLoaded", function(){
  var popup;
  function moveWindow(){
    console.log("moveWindow");
    // 화면 크기를 약간 줄인다.
    window.resizeTo(window.outerWidth - 10, window.outerHeight - 10);
    window.moveTo(100, 100);
  // 새 창을 열고 위치를 지정

    if (popup === undefined || popup.closed) {
      console.log("새 창 열기");
      popup = window.open('about:blank', 'popup', 'width=600,height=400,left=100,top=100,resizable=yes,movable=yes');
    }
    popup.document.write('<h1>팝업 창</h1>');
    // 랜덤한 위치로 이동
    var x = Math.floor(Math.random() * 500);
    var y = Math.floor(Math.random() * 500);
    console.log("x: " + x + ", y: " + y);
    popup.moveTo(x, y);
  }
  document.getElementById("moveWindow").addEventListener("click", function(){
    interval = setInterval(moveWindow, 100);
    timeout = setTimeout(function() {
      clearInterval(interval);  
    }, 5000);
    
  });
  // $("#moveWindow").click(function(){
  //   moveWindow();
  // });
});