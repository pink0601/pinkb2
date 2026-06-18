// =========================
// DOM
// =========================

const bg1 = document.getElementById("bg1");
const bg2 = document.getElementById("bg2");
const bg3 = document.getElementById("bg3");

const lantern = document.getElementById("lantern");
const tip = document.getElementById("tip");

// =========================
// 参数
// =========================

const THRESHOLD = 20;
const MAX_ANGLE = 60;

const MAX_MOVE = 120;
const EASE = 0.08;

// =========================
// 状态
// =========================

let state = "center";

let targetX = 0;
let currentX = 0;

// =========================
// 背景切换
// =========================

function setState(s){

    if(state === s) return;

    state = s;

    if(state === "left"){
        bg1.style.opacity = 0;
        bg2.style.opacity = 1;
        bg3.style.opacity = 0;
        tip.innerText = "左侧探路中…";
    }
    else if(state === "right"){
        bg1.style.opacity = 0;
        bg2.style.opacity = 0;
        bg3.style.opacity = 1;
        tip.innerText = "右侧探路中…";
    }
    else{
        bg1.style.opacity = 1;
        bg2.style.opacity = 0;
        bg3.style.opacity = 0;
        tip.innerText = "保持手机平稳";
    }
}

// =========================
// 输入处理
// =========================

function handleGamma(gamma){

    gamma = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, gamma));

    if(gamma < -THRESHOLD){
        setState("left");
    }
    else if(gamma > THRESHOLD){
        setState("right");
    }
    else{
        setState("center");
    }

    // 马灯跟随
    targetX = (gamma / MAX_ANGLE) * MAX_MOVE;
}

// =========================
// 陀螺仪
// =========================

function onGyro(e){
    handleGamma(e.gamma || 0);
}

// =========================
// PC模拟
// =========================

window.addEventListener("mousemove", e => {

    const ratio = e.clientX / window.innerWidth;

    const gamma = (ratio - 0.5) * 2 * MAX_ANGLE;

    handleGamma(gamma);
});

// =========================
// 动画
// =========================

function animate(){

    currentX += (targetX - currentX) * EASE;

    lantern.style.transform =
        `translateX(calc(-50% + ${currentX}px))`;

    requestAnimationFrame(animate);
}

// =========================
// iOS权限
// =========================

function initGyro(){

    if(
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ){

        document.body.addEventListener("touchstart", async () => {

            try{
                const res =
                    await DeviceOrientationEvent.requestPermission();

                if(res === "granted"){
                    window.addEventListener("deviceorientation", onGyro, true);
                }

            }catch(e){
                console.log(e);
            }

        }, { once:true });

    }else{
        window.addEventListener("deviceorientation", onGyro, true);
    }
}

// =========================
// 启动
// =========================

initGyro();
animate();
