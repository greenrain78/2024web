document.addEventListener('DOMContentLoaded', function() {
    // 배경 음악 요소 가져오기
    const backgroundMusic = document.getElementById('background_music');    
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        // 음악 파일이 선택되어 있으면 로드
        if (localStorage.getItem('selectedMusic')) {
            backgroundMusic.src = "../" + localStorage.getItem('selectedMusic');
        }
        // 배경 음악 재생
        if (localStorage.getItem('musicMute') === 'true') {
            backgroundMusic.pause();
        } else {
            backgroundMusic.play();
        }       
    }).catch(e => {
        console.error(`Audio permissions denied: ${e}`);
    }).finally(() => {
  });
});