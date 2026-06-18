// ============================
// 元素
// ============================

const bgCenter = document.querySelector(".bg-center");
const bgLeft = document.querySelector(".bg-left");
const bgRight = document.querySelector(".bg-right");

const hand = document.getElementById("handLamp");

// ============================
// 参数
// ============================

// 背景切换阈值
const THRESHOLD = 20;

// 最大陀螺仪角度
const MAX_GAMMA = 60;

// 手部最大移动像素
const MAX_MOVE = 80;

// 缓动
const EASE = 0.08;

// ============================
// 状态
// ============================

let targetX = 0;
let currentX = 0;

// ============================
// 工具
// ============================

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

// ============================
// 背景更新
// ============================

function updateBackground(gamma) {

    // 左
    if (gamma < -THRESHOLD) {

        bgLeft.style.opacity = 1;
        bgCenter.style.opacity = 0;
        bgRight.style.opacity = 0;

    }

    // 右
    else if (gamma > THRESHOLD) {

        bgRight.style.opacity = 1;
        bgCenter.style.opacity = 0;
        bgLeft.style.opacity = 0;

    }

    // 中
    else {

        bgCenter.style.opacity = 1;
        bgLeft.style.opacity = 0;
        bgRight.style.opacity = 0;
    }
}

// ============================
// 手部移动
// ============================

function updateHand(gamma) {

    // 限幅
    gamma = clamp(gamma, -MAX_GAMMA, MAX_GAMMA);

    targetX = (gamma / MAX_GAMMA) * MAX_MOVE;
}

// ============================
// 统一处理
// ============================

function handleInput(gamma) {

    updateBackground(gamma);
    updateHand(gamma);
}

// ============================
// 陀螺仪
// ============================

function onDeviceOrientation(e) {

    const gamma = e.gamma || 0;

    handleInput(gamma);

}

// ============================
// PC调试（鼠标模拟）
// ============================

function onMouseMove(e) {

    const x = e.clientX / window.innerWidth;

    const gamma = (x - 0.5) * 2 * MAX_GAMMA;

    handleInput(gamma);
}

// ============================
// 动画循环（关键）
// ============================

function animate() {

    currentX += (targetX - currentX) * EASE;

    hand.style.transform =
        `translateX(calc(-50% + ${currentX}px))`;

    requestAnimationFrame(animate);
}

// ============================
// 启动陀螺仪（兼容 iOS）
// ============================

function initGyro() {

    const bind = () => {
        window.addEventListener("deviceorientation", onDeviceOrientation, true);
    };

    // iOS 必须授权
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        document.body.addEventListener("touchstart", async () => {

            try {

                const res =
                    await DeviceOrientationEvent.requestPermission();

                if (res === "granted") bind();

            } catch (err) {
                console.log(err);
            }

        }, { once: true });

    } else {

        bind();
    }
}

// ============================
// 初始化
// ============================

initGyro();

window.addEventListener("mousemove", onMouseMove);

animate();
