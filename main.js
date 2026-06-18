
// =========================
// DOM
// =========================

const bg1 = document.getElementById("bg1");
const bg2 = document.getElementById("bg2");
const bg3 = document.getElementById("bg3");

const lantern = document.getElementById("lantern");
const tip = document.getElementById("tip");

// =========================
// 参数（核心调参区）
// =========================

// 背景切换阈值
const THRESHOLD = 20;

// 最大识别角度
const MAX_ANGLE = 60;

// ⭐ 手的最大移动范围（已限制）
const MOVE_LIMIT = 80;

// ⭐ 响应压缩角度（越小越稳）
const ANGLE_LIMIT = 45;

// 缓动系数（越小越慢）
const EASE = 0.08;

// =========================
// 状态
// =========================

let state = "center";

let targetX = 0;
let currentX = 0;

// =========================
// 状态切换（背景）
// =========================

function setState(newState){

    if(state === newState) return;

    state = newState;

    if(state === "left"){

        bg1.style.opacity = 0;
        bg2.style.opacity = 1;
        bg3.style.opacity = 0;

        tip.innerText = "左侧探路中…";

    } else if(state === "right"){

        bg1.style.opacity = 0;
        bg2.style.opacity = 0;
        bg3.style.opacity = 1;

        tip.innerText = "右侧探路中…";

    } else {

        bg1.style.opacity = 1;
        bg2.style.opacity = 0;
        bg3.style.opacity = 0;

        tip.innerText = "保持手机平稳，探索前方";
    }
}

// =========================
// 核心输入处理
// =========================

function handleGamma(gamma){

    // 限制输入范围
    gamma = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, gamma));

    // =========================
    // 背景状态
    // =========================

    if(gamma < -THRESHOLD){
        setState("left");
    }
    else if(gamma > THRESHOLD){
        setState("right");
    }
    else{
        setState("center");
    }

    // =========================
    // ⭐ 手部运动（关键优化）
    // =========================

    let mapped = gamma / ANGLE_LIMIT;

    if(mapped > 1) mapped = 1;
    if(mapped < -1) mapped = -1;

    targetX = mapped * MOVE_LIMIT;
}

// =========================
// 陀螺仪
// =========================

function onGyro(e){

    if(!e.gamma && e.gamma !== 0) return;

    handleGamma(e.gamma);
}

// =========================
// PC模拟（鼠标）
// =========================

window.addEventListener("mousemove", (e) => {

    const ratio = e.clientX / window.innerWidth;

    const gamma = (ratio - 0.5) * 2 * MAX_ANGLE;

    handleGamma(gamma);
});

// =========================
// 动画循环（平滑移动）
// =========================

function animate(){

    currentX += (targetX - currentX) * EASE;

    lantern.style.transform =
        `translateX(calc(-50% + ${currentX}px))`;

    requestAnimationFrame(animate);
}

// =========================
// iOS 陀螺仪权限
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

            } catch(err){
                console.log(err);
            }

        }, { once:true });

    } else {

        window.addEventListener("deviceorientation", onGyro, true);
    }
}

// =========================
// 启动
// =========================

initGyro();
animate();
