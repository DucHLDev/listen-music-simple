const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');    
const playbtn = $('.btn-toggle-play')
const nextbtn = $('.btn-next')
const prevbtn = $('.btn-prev')
const repeatbtn = $('.btn-repeat')
const randombtn = $('.btn-random')
const PLAYER_STORAGE_KEY = 'key_setting'
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Your Man",
      singer: "Josh Turner",
      path: "https://tainhac123.com/download/your-man-josh-turner.uaDIXu2nrs3a.html",
      image:
        "https://i.scdn.co/image/ab67616d0000b273253d8c7120e97d83aa772e4d"
    },
    {
      name: "Chạy về khóc với anh",
      singer: "Erik",
      path: "https://tainhac123.com/download/yeu-duong-kho-qua-thi-chay-ve-khoc-voi-anh-erik.B6rEC4ZEO7oD.html",
      image: "https://images.genius.com/a21ad65d96c05882344bc57e721da31c.300x300x1.jpg"
    },
    {
      name: "Đế vương",
      singer: "Đình Dũng x ACV",
      path: "https://tainhac123.com/download/de-vuong-dinh-dung-ft-acv.w8lmuII1Yn2G.html",
      image:
        "https://i.ytimg.com/vi/qkPgUgkQE4Y/maxresdefault.jpg"
    },
    {
      name: "Baby Shark" ,
      singer: "V.A",
      path:
        "https://tainhac123.com/download/baby-shark-va.gFmmRfrxeyGM.html",
      image: "https://yt3.ggpht.com/ytc/AKedOLTsY8IQxf6785cTQ-gcCnsZuLcaxjvMvbz56YxnkQ=s900-c-k-c0x00ffffff-no-rj"
    },
    {
      name: "Chạy Về Nơi Phía Anh",
      singer: "Khắc Việt",
      path: "https://tainhac123.com/download/chay-ve-noi-phia-anh-khac-viet.K50N4xtWe5y4.html",
      image:
        "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/6/3/0/d/630d20b0a79917e1545b4e2ada081040.jpg"
    },
    {
      name: "Duyên Âm",
      singer: "Hoàng Thùy Linh",
      path: "https://tainhac123.com/download/duyen-am-hoang-thuy-linh.TAqmd5IhCOeq.html",
      image:
        "https://cdn.baogiaothong.vn/upload/images/2019-4/article_img/2019-12-21/4191810122679-1576894463-width700height912.png"
    },
  ],

  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },

  render: function() {
    var htmls = this.songs.map((song, index) =>
        `
          <div class="song" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `
      )
    $('.playlist').innerHTML = htmls.join('');
  },

  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex]
      }
    })
  },

  handleEvent: function() {
    const _this = this;
    const cd = $('.cd')
    const cdWidth = cd.offsetWidth;
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWith = cdWidth - scrollTop;

      cd.style.width = newCdWith > 0 ? newCdWith + 'px' : 0;
      cd.style.opacity = newCdWith / cdWidth;
      
    }
    //xu ly click play 
    playbtn.onclick = function() {
      if(_this.isPlaying) {
        audio.pause();
      } else audio.play();
    }

    // xu ly audio play
    audio.onplay = function() {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimation.play();
    }

    // xu ly audio pause
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimation.pause();
    }

    // khi tien do bai hat thay doi
    audio.ontimeupdate = function() {
      // Neu khong null
      if(audio.duration) {
        const progresspercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progresspercent;
      }
    }

    // sau khi tua xong
    progress.oninput = function(e) {
      const seektime = audio.duration * e.target.value / 100;
      audio.currentTime = seektime;
    }

    // xu ly cd quay
    const cdRotate = [
      { transform: 'rotate(360deg'}
    ]

    const cdTiming = {
      duration: 8000,
      iterations: Infinity,
    }

    const cdThumbAnimation = cdThumb.animate(cdRotate, cdTiming)
    cdThumbAnimation.pause();

    // xu ly next
    nextbtn.onclick = function() {
      _this.nextSong();
      audio.play();
    }
    
    // xu ly prev
    prevbtn.onclick = function() {
      _this.prevSong();
      audio.play();
    }

    // xu ly random
    randombtn.onclick = function() {
      if(!_this.isRepeat) {
        _this.isRandom = !_this.isRandom;
        randombtn.classList.toggle('active', _this.isRandom);
        _this.setConfig('isRandom', _this.isRandom);
      }
    }

    // xu ly repeat
    repeatbtn.onclick = function () {
      if(!_this.isRandom) {
        _this.isRepeat = !_this.isRepeat;
        repeatbtn.classList.toggle('active', _this.isRepeat); 
        _this.setConfig('isRepeat', _this.isRepeat);
      }
    }
    
    // xu ly end audio 
    audio.onended = function () {
      nextbtn.click(); 
    }
    
    // xu ly chon bai hat
    const allsong = $$('.song');
    const alloption = $$('.option');
    for(i=0; i<=this.songs.length-1; i++) {
      allsong[i].onclick = function(e) {
        var songNumber = this.getAttribute('data-index');
        _this.choseSong(songNumber);
        audio.play();
      }
      alloption[i].onclick = function(e) {
        e.stopPropagation();
        console.log('option bi click');
      }
    }
  },
  
  loadCurrentSong: function() {
    heading.innerHTML = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function() {
    // hien thi trang thai cho random vs repeat tu localStorage
    if(this.config.isRandom == undefined) this.isRandom = false;
    else this.isRandom = this.config.isRandom;
   
    if(this.config.isRepeat == undefined) this.isRepeat = false;
    else this.isRepeat = this.config.isRepeat;

    randombtn.classList.toggle('active',  this.isRandom);
    repeatbtn.classList.toggle('active', this.isRepeat); 
  },
  activeSong: function() {
    const songChose = $$('.song')[this.currentIndex];
    songChose.classList.add('active');
    songChose.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  },

  deactiveSong: function() {
    const songChose = $$('.song')[this.currentIndex];
    songChose.classList.remove('active');
  },

  nextSong: function() {
    this.deactiveSong();

    if(!this.isRepeat) {
      if(this.isRandom) this.playRandomSong();
      else if(this.currentIndex < this.songs.length - 1) {
        this.currentIndex++;
      }
      else this.currentIndex = 0;
    }

    this.loadCurrentSong();
    this.activeSong();
  },

  choseSong: function(songNumber) {
    this.deactiveSong();
    this.currentIndex = songNumber;
    this.loadCurrentSong();
    this.activeSong();
  },

  prevSong: function() {
    this.deactiveSong();
    if(this.currentIndex != 0) {
      this.currentIndex--;
    }
    else this.currentIndex = this.songs.length - 1;
    this.loadCurrentSong();
    this.activeSong();
  },

  playRandomSong: function() {
    // Lay random
    var randomNumber = Math.floor(Math.random() * this.songs.length - 1);
    if(randomNumber == -1 ) randomNumber = 0;

    // Kiem tra khong trung
    if(this.currentIndex != randomNumber) {
      this.currentIndex = randomNumber;
    }
    else this.currentIndex++;

    this.loadCurrentSong();
  },

  start: function() {
    this.loadConfig();
    this.defineProperties();
    // Xu ly nhac
    this.loadCurrentSong();
    this.render();
    this.handleEvent();
    this.activeSong();
  }
}
app.start();
