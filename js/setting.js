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

    // 초기 배경 음악 재생
    backgroundMusic.play();

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
            localStorage.setItem('musicMute', 'false');
            backgroundMusic.play();
        } else {
            localStorage.setItem('musicMute', 'true');
            backgroundMusic.pause();
        }
    });

    // 모든 옵션 숨기는 함수
    function hideAllOptions() {
        musicOptions.classList.add('hidden');
        ballOptions.classList.add('hidden');
    }

    // localStorage에서 선택된 음악 파일 로드
    const selectedMusic = localStorage.getItem('selectedMusic');
    if (selectedMusic) {
        changeMusic(selectedMusic);
    }

    // localStorage에서 선택된 공 로드
    const selectedBall = localStorage.getItem('selectedBall');
    if (selectedBall) {
        selectBall(selectedBall);
    }
        // 배경 음악 요소 가져오기
    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        // 음악 파일이 선택되어 있으면 로드
        if (localStorage.getItem('selectedMusic')) {
            backgroundMusic.src = localStorage.getItem('selectedMusic');
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

function changeMusic(musicFile) {
    const backgroundMusic = document.getElementById('background_music');
    backgroundMusic.src = musicFile;
    backgroundMusic.play();
    // 선택된 음악 파일을 localStorage에 저장
    localStorage.setItem('selectedMusic', musicFile);
}

// 공 선택 함수 수정
function selectBall(ballType) {
    console.log(ballType + ' selected');
    // 모든 공 이미지들의 'selected' 클래스 제거
    document.querySelectorAll('#ball_options img').forEach(img => {
        img.classList.remove('selected');
    });
    // 선택된 공 이미지에 'selected' 클래스 추가
    document.querySelector(`img[src*="${ballType}"]`).classList.add('selected');
    // 선택된 공을 localStorage에 저장
    localStorage.setItem('selectedBall', ballType);
}