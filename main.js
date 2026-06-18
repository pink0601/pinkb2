// =========================
// DOM
// =========================

const bgCenter = document.querySelector(".bg-center");
const bgLeft = document.querySelector(".bg-left");
const bgRight = document.querySelector(".bg-right");

const hand = document.getElementById("handLamp");

// =========================
// 参数
// =========================

const LEFT_THRESHOLD = -20;
const RIGHT_THRESHOLD = 20;
const MAX_ANGLE = 60;

const MAX_MOVE = 80;
const EASE = 0.08;

// =========================
// 状态机
// =========================

let state = "center"; // center | left | right

let targetX = 0;
let currentX = 0;

// =========================
// 限制角度
// =========================

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

// =========================
// 状态切换
// =========================

function setState(newState) {

    if (state === newState) return;

    state = newState;

    // 背景切换
    if (state === "left") {

        bgLeft.style.opacity = 1;
        bgCenter.style.opacity = 0;
        bgRight.style.opacity = 0;

    } else if (state === "right") {

        bgRight.style.opacity = 1;
        bgCenter.style.opacity = 0;
        bgLeft.style.opacity = 0;

    } else {

        bgCenter.style.opacity = 1;
        bgLeft.style.opacity = 0;
        bgRight.style.opacity = 0;
    }
}

// =========================
// 输入处理（核心）
// =========================

function handleAngle(gamma) {

    gamma = clamp(gamma, -MAX_ANGLE, MAX_ANGLE);

    // 状态判断
    if (gamma < LEFT_THRESHOLD) {
        setState("left");
    } 
    else if (gamma > RIGHT_THRESHOLD) {
        setState("right");
    } 
    else {
        setState("center");
    }

    // 手部映射（连续）
    targetX = (gamma / MAX_ANGLE) * MAX_MOVE;
}

// =========================
// 陀螺仪
// =========================

function onDeviceOrientation(e) {

    const gamma = e.gamma || 0;

    handleAngle(gamma);
}

// =========================
// PC调试（鼠标模拟）
// =========================

function onMouseMove(e) {

    const ratio = e.clientX / window.innerWidth;

    const gamma = (ratio - 0.5) * 2 * MAX_ANGLE;

    handleAngle(gamma);
}

// =========================
// 动画（手部缓动）
// =========================

function animate() {

    currentX += (targetX - currentX) * EASE;

    hand.style.transform =
        `translateX(calc(-50% + ${currentX}px))`;

    requestAnimationFrame(animate);
}

// =========================
// iOS权限处理
// =========================

function initGyro() {

    const bind = () => {
        window.addEventListener("deviceorientation", onDeviceOrientation, true);
    };

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        document.body.addEventListener("touchstart", async () => {

            try {

                const res =
                    await DeviceOrientationEvent.requestPermission();

                if (res === "granted") {
                    bind();
                }

            } catch (err) {
                console.log(err);
            }

        }, { once: true });

    } else {

        bind();
    }
}

// =========================
// PC辅助
// =========================

window.addEventListener("mousemove", onMouseMove);

// =========================
// 启动
// =========================

initGyro();
animate();
