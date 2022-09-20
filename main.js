const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const header = $('.header__heading-song-name');
const cdImage = $('.slider__img');
const audio = $('#audio');
const cd = $('.app-slider');
const songsList = $('.content__song-list');
const playPauseContainer = $('.nav__playing-control');
const pauseButton = $('.nav__button-pause');
const playButton = $('.nav__button-play');
const playSeek = $('#progress');
const nextBtn = $('.nav__button-next');
const prevBtn = $('.nav__button-prev');
const shuffleBtn = $('.nav__button-shuffle');
const replayBtn = $('.nav__button-replay');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isReplay: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    songs: [
        {
            name: "Blue tequila",
            singer: "Táo",
            path: "./access/audio/blue-tequila.mp3",
            image: "./access/image/blue-tequila.jpg"
        },
        {
            name: "Dẫu có lỗi lầm",
            singer: "Jackie",
            path: "./access/audio/dau-co-loi-lam.mp3",
            image: "./access/image/dau-co-loi-lam.jpg"
        },
        {
            name: "Huyền thoại",
            singer: "Phan Mạnh Quỳnh",
            path: "./access/audio/huyen-thoai.mp3",
            image: "./access/image/huyen-thoai.jpg"
        },
        {
            name: "Xuân thì",
            singer: "Phan Mạnh Quỳnh",
            path: "./access/audio/xuan-thi.mp3",
            image: "./access/image/xuan-thi.jpg"
        },
        {
            name: "Tự tình 2",
            singer: "Trung Quân Idol",
            path: "./access/audio/tu-tinh-2.mp3",
            image: "./access/image/tu-tinh-2.jpg"
        },
        {
            name: "Gác lại âu lo",
            singer: "Dalab",
            path: "./access/audio/gac-lai-au-lo.mp3",
            image: "./access/image/gac-lai-au-lo.jpg"
        },
        {
            name: "Chuyện đôi ta",
            singer: "Trung Quân Idol",
            path: "./access/audio/chuyen-doi-ta.mp3",
            image: "./access/image/chuyen-doi-ta.jpg"
        },
        {
            name: "Thanh xuân",
            singer: "Dalab",
            path: "./access/audio/thanh-xuan.mp3",
            image: "./access/image/thanh-xuan.jpg"
        },
        {
            name: "Từ ngày em đến",
            singer: "Dalab",
            path: "./access/audio/tu-ngay-em-den.mp3",
            image: "./access/image/tu-ngay-em-den.jpg"
        },
        {
            name: "Một ngàn nỗi đau",
            singer: "Văn Mai Hương",
            path: "./access/audio/mot-ngan-noi-dau.mp3",
            image: "./access/image/mot-ngan-noi-dau.jpg"
        },
    ],
    // định nghĩa các thuộc tính cho object
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    // render bài hát hiện tại lên trình phát
    loadCurrentSong: function() {
        header.textContent = this.currentSong.name;
        cdImage.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = `${this.currentSong.path}`;
        var activeSong = $('.nav__song--active');
        if(activeSong)
        activeSong.classList.remove('nav__song--active'); 
        const playingSong = $(`.content__song-${app.currentIndex}`);
        playingSong.classList.add('nav__song--active');
    },
    loadConfig: function() {
        console.log(this.config['isShuffle'])
        this.isShuffle = this.config['isShuffle'];
        this.isReplay = this.config['isReplay'];
    },
    // render các bài hát ra playlist
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <li class="content__song content__song-${index}" data-index="${index}">
                    <div class="content__song-img" style="background-image:url(${song.image}) ;"></div>
                    <div class="content__song-info">
                        <h2 class="content__song-name">${song.name}</h2>
                        <p class="content__song-artist">${song.singer}</p>
                    </div>
                    <div class="content__song-icon">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </li>
                `
        })
        songsList.innerHTML = htmls.join("");
    },
    // xử lí sự kiện
    handleEvent: function() {
        // xử lí sự kiện cuộn và thu nhỏ cd 
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // xử lý sự kiện click vào nút play
        const _this = this;
        playPauseContainer.addEventListener("click" , () => {
            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        })
        // xử lí seeking(thanh hiển thị quá trình phát)
        const songDuration = audio.duration;
        audio.ontimeupdate = () => {
            var currentTime = audio.currentTime;
            if(currentTime)
            playSeek.value = currentTime/audio.duration * 100;
        }
        playSeek.oninput = () => {
            console.log(playSeek.value)
            audio.currentTime = audio.duration/100 * playSeek.value;
        }
        //xử lí quay của cd
        const cdAnimation = cdImage.animate(
            [
            {transform: 'rotate(360deg)'}
            ], 
            {
            duration: 5000,
            iterations: Infinity,
            });
        cdAnimation.pause();
        
        // xử lí khi click vào next
        nextBtn.onclick = () => {
            if(_this.isShuffle) {
                shuffleSongs();
            }
            else {
                nextSong();
            }
        };
        // xử lí khi click vào prev 
        prevBtn.onclick = () => {
            if(_this.isShuffle) {
                shuffleSongs();
            }
            else {
                prevSong();
            }
        };
        // xử lí khi click vào random
        shuffleBtn.onclick = () => {
            shuffleBtn.classList.toggle('nav__button-s--active');
            _this.isShuffle = !_this.isShuffle;
            _this.setConfig('isShuffle' , _this.isShuffle);
        };

        shuffleSongs = () => {
            let saveIndex = _this.currentIndex;
            do {
                _this.currentIndex = (Math.floor((Math.random()*_this.songs.length)));
            }
            while (_this.currentIndex === saveIndex);
            _this.loadCurrentSong();
            audio.play();
            scrollToActiveSong();
        }
        // xử lí khi click vào replay 
        replayBtn.onclick = () => {
            replayBtn.classList.toggle('nav__button-s--active');
            _this.isReplay = !_this.isReplay;
            _this.setConfig('isReplay', _this.isReplay);
        }
        // xử lí khi click vào bài hát bất kì 
        songsList.onclick = (event) => {
            if (!event.target.closest('.content__song-icon')) {
                const song = event.target.closest('.content__song:not(.nav__song--active)');
                if(song) {
                _this.currentIndex = Number(song.getAttribute('data-index'));
                _this.loadCurrentSong();
                audio.play()
                }
            }
        }
        // xử lí scroll đến bài hát đang phát 
        scrollToActiveSong = () => {
            setTimeout( () => {
                window.scrollTo({top: (100 +  _this.currentIndex*100), behavior: 'smooth'});
            }, 200)
        }
        
        // hàm next bài hát
        nextSong = () => {
            if(_this.currentIndex < (_this.songs.length - 1)) {
                _this.currentIndex += 1;
                _this.loadCurrentSong();
                audio.play()
                scrollToActiveSong();}
            else{
                _this.currentIndex = 0;
                _this.loadCurrentSong();
                audio.play()
                scrollToActiveSong();}
        }
        // hàm prev bài hát 
        prevSong = () => {
            if(_this.currentIndex > 0) {
                _this.currentIndex -= 1;
                _this.loadCurrentSong();
                audio.play()
                scrollToActiveSong();}
            else{
                _this.currentIndex = _this.songs.length - 1;
                _this.loadCurrentSong();
                audio.play()
                scrollToActiveSong();}
        }
        // xử lí khi phát hết bài hát hiện tại 
        audio.onended = () => {
            if(_this.isReplay) {
                audio.play();
            }
            else if(_this.isShuffle) {
                shuffleSongs();
            }
            else {
                nextSong();
            }
        }
        
        // các sự việc diễn ra khi nhạc đang phát/ dừng 
        audio.onplay = () => {
            playPauseContainer.classList.add('nav__button-playing');
            _this.isPlaying = true;
            cdAnimation.play();
        }
        audio.onpause = () => {
            playPauseContainer.classList.remove('nav__button-playing');
            _this.isPlaying = false;
            cdAnimation.pause();
        }
    },

    start: function() {
        this.loadConfig();
        this.render();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        console.log(this.isReplay, this.isShuffle)
        replayBtn.classList.toggle('nav__button-s--active',this.isReplay);
        shuffleBtn.classList.toggle('nav__button-s--active',this.isShuffle);
    },
};

app.start();
