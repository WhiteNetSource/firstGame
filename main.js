//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas"); //canvas 창조
ctx = canvas.getContext("2d"); //canvas 에서 2d를 가지고 온다

//이제 canvas size choose

canvas.width = 400;
canvas.height = 700;
//이제 이 캔버스 HTML에 넣어주기
document.body.appendChild(canvas); //body 테그에다가 자식으로 붙여주세요 누구를? 그 안에든 변수를
//크롬에 이미지 라인 체크 후 이미지 가져오기
//이거는 움직을려면 값이 계속 바뀌니 따로 빼주기

let backgroundImage, lionImage, enemyImage, bulletImage, gameoverImage;
let gameOver = false; //true이면 게임이 끝남
let score = 0;

let lionX = canvas.width / 2 - 32; //canvas의 넒이 반으로 나눈 뒤 -32 왜냐 사자 픽셀이64
let lionY = canvas.height - 64;

let bulletList = []; // 총알들을 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  //init 최기화 하는 함수
  this.init = function () {
    this.x = lionX + 20; //발사 시작점
    this.y = lionY;
    this.alive = true; // true면 살아있는 총알
    bulletList.push(this); //여기 this 안에 xyinit다있음
  };
  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        score++;
        this.alive = false; //죽은 총알
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min; //0~1사이 숫자 랜덤하게 반환
  return randomNum;
}

let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 48);
    enemyList.push(this);
  };

  this.update = function () {
    this.y += 2; //적군의 속도 조절

    if (this.y >= canvas.height - 48) {
      gameOver = true;
    }
  };
}

function loadImage() {
  backgroundImage = new Image(); //앞으로 이변수는 이미지가 될건데
  backgroundImage.src = "img/background.gif";

  lionImage = new Image();
  lionImage.src = "img/lion.png";

  enemyImage = new Image();
  enemyImage.src = "img/enemy.png";

  bulletImage = new Image();
  bulletImage.src = "img/bullet.png";

  gameoverImage = new Image();
  gameoverImage.src = "img/gameover.jpg";
}
//이제 위 이미지를 캔버스에 그려준다 이미지를 보여주는 함수를 만들어 줘야한다.
//render ui를 그려주는 전문용어처럼 걍 불림

let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    console.log("무슨 키가 눌렸어?", event.keyCode);
    keysDown[event.keyCode] = true;
    console.log("키다운객체에 들어가는 값은?", keysDown);
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];

    if (event.keyCode == 32) {
      //스페이스는 숫자가 32임
      createBullet(); //총알생성
    }
    console.log("버튼 클릭후 , keysDown");
  });
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy(); //적군으 찍어내서 하나 만들겠다.
    e.init(); //그리고 이 e를 초기화 시켜주겠습니다.
  }, 1000); //셋인터벌(기본함수)임 원하는 시간마다 함수를 호출하는 거임
} //셋인터벌은 2개의 함수가 들어간다 1번째 내가 호출하고 싶은 함수 2번째는 얼마마다 호출할 시간
//생성하는 하는 은 함수니깐 함수를 만들어 준다.
function createBullet() {
  console.log("총알생성");
  let b = new Bullet(); //총알 하나 생성!
  b.init();
}

function update() {
  //라이온 좌표 업데이트 해줘여하니
  if (39 in keysDown) {
    //오른쪽 버튼이 눌렸다 그러면
    lionX += 5; //5씩증가시킨다
  }
  if (37 in keysDown) {
    lionX -= 5; //이거는 -이유 알겠지? 함수도표
  }

  if (lionX <= 0) {
    lionX = 0;
  }
  //이거 ㅋㅋㅋ 생각해봐
  if (lionX >= canvas.width - 64) {
    lionX = canvas.width - 64;
  }
  //총알의y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update(); //총알을 업데이트 하면서
      bulletList[i].checkHit(); //총알이 적을 쳤느냐도 확인시켜줌
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }

  //우주선의 좌표값이 무한대로 업데이트가 되는게 아닌! 경기장 안에서만 있게 하려면?
} //엥 작동이 안된다 왜 안될까? 업데이트 불렸어?ㅋㅋㅋㅋㅋㅋㅋㅋㅋ

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); //(image, dx,dy,dwidth,dHeight)
  ctx.drawImage(lionImage, lionX, lionY); //lion 의 좌표는 따로 빼보자! 14번 라인
  ctx.fillText(`Score:${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

//이제 도구를 만들었으면 도구를 써야 불러나오지 불러 나오게 하자!
function main() {
  if (!gameOver) {
    update(); //여기서 불러준다 왜냐? 게임의 원리는 좌표값을 업데이트하고 그려주고 미친듯이 반복하는게 애니메이션 효과!
    render(); //또랜더해
    //console.log("animation call main-function");
    requestAnimationFrame(main); //이함수는 미친듯이 호출한다
  } else {
    ctx.drawImage(gameoverImage, 10, 100, 380, 380);
  }
}

loadImage(); //안보여짐 여기서 render 함수를 계속 호출해야 보인다/.
//render();이거는 지워 준다 왜? 메인안에 들어가 있으니 또 부를 필요 x
setupKeyboardListener(); //함수 만들면 쓰자!
createEnemy(); //웹사이트 시작하자마자 생성
main();

//이제 방향키를 누르면
//사자가 xy좌표로 움직이고
//다시 render 그려준다
//34밑으로 가서 함수 만들자

//1번만 이해하면 된다!!! 다 적용되
//총알만들기
//1.스페이스누르면 총알 발사
//2. 총알이 발사 = 총알의 y값이 -- ,총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표
//3. 발사된 총알들은 총알 배열에 저장을 한다
//4. 모든 총알들은 x,y좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render 그려준다

//적군만들기
//적군 위치가 랜덤
//적군은 밑으로 내려온다 = y좌표가 증가한다
//1초마다 하나씩 내려옴
//적군 바닥에 도착시 게임 오버
//적군이 총알이 만날시 1점 획득

//적군이 죽는다
//총알이 닫는다 = 총알.y <= 적군.y and 총알.x >= 적군.ㅌ.andc 총알.x <=적군.x +40(적군의 넒이)
//닿았다
//총알이 죽게됨 적군의 우주선이 없어짐,점수획득
