document.addEventListener('DOMContentLoaded', function() {
    // 버튼 요소 가져오기
    const musicButton = document.getElementById('select_music');
    const ballButton = document.getElementById('select_ball');
    const muteButton = document.getElementById('mute_sound');

    // 옵션 divs 가져오기
    const musicOptions = document.getElementById('music_options');
    const ballOptions = document.getElementById('ball_options');

    // 배경 음악 요소 가져오기
    const backgroundMusic = document.getElementById('background_music');

    // 음악 선택 버튼 클릭 이벤트
    musicButton.addEventListener('click', function() {
        hideAllOptions(); // 모든 옵션 숨기기
        musicOptions.classList.remove('hidden'); // 음악 옵션만 보이기
    });

    // 공 선택 버튼 클릭 이벤트
    ballButton.addEventListener('click', function() {
        hideAllOptions(); // 모든 옵션 숨기기
        ballOptions.classList.remove('hidden'); // 공 옵션만 보이기
    });

    // 소리제거 버튼 클릭 이벤트
    muteButton.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            console.log(backgroundMusic)
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
        }
    });

    // 모든 옵션 숨기는 함수
    function hideAllOptions() {
        musicOptions.classList.add('hidden');
        ballOptions.classList.add('hidden');
    }

    // 배경음악 자동 재생을 위한 로직은 제거됨
    // 사용자 인터랙션을 통해 배경음악을 제어하세요
});

// 음악 변경 함수
function changeMusic(musicFile) {
    const backgroundMusic = document.getElementById('background_music');
    backgroundMusic.src = musicFile;
    if(backgroundMusic.paused) {
        backgroundMusic.play();
    }
}

// 공 선택 함수
function selectBall(ballType) {
    console.log(ballType + ' selected');
    // 여기에 선택된 공을 처리하는 코드를 추가하세요.
}