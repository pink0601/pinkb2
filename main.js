// ======================
// 元素
// ======================

const bgCenter = document.querySelector('.bg-center');
const bgLeft = document.querySelector('.bg-left');
const bgRight = document.querySelector('.bg-right');

const handLamp = document.getElementById('handLamp');

// ======================
// 参数
// ======================

// 背景切换阈值
const BG_THRESHOLD = 20;

// 最大识别角度
const MAX_GAMMA = 60;

// 手灯最大移动距离
const MAX_HAND_MOVE = 80;

// 缓动系数
const EASING = 0.08;

// ======================
// 状态
// ======================

let targetGamma = 0;

let currentHandX = 0;
let targetHandX = 0;

// ======================
// 工具
// ======================

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

// ======================
// 背景切换
// ======================

function updateBackground(gamma) {

    if (gamma < -BG_THRESHOLD) {

        bgCenter.style.opacity = 0;
        bgLeft.style.opacity = 1;
        bgRight.style.opacity = 0;

    }
    else if (gamma > BG_THRESHOLD) {

        bgCenter.style.opacity = 0;
        bgLeft.style.opacity = 0;
        bgRight.style.opacity = 1;

    }
    else {

        bgCenter.style.opacity = 1;
        bgLeft.style.opacity = 0;
        bgRight.style.opacity = 0;

    }

}

// ======================
// 手灯移动
// ======================

function updateHandTarget(gamma) {

    targetHandX =
        (gamma / MAX_GAMMA)
        * MAX_HAND_MOVE;

}

// ======================
// 统一更新
// ======================

function updateScene(gamma) {

    gamma = clamp(
        gamma,
        -MAX_GAMMA,
        MAX_GAMMA
    );

    updateBackground(gamma);

    updateHandTarget(gamma);

}

// ======================
// 手机陀螺仪
// ======================

function handleOrientation(event) {

    const gamma =
        event.gamma || 0;

    updateScene(gamma);

}

// ======================
// PC鼠标模拟
// ======================

function handleMouseMove(event) {

    const width =
        window.innerWidth;

    const ratio =
        event.clientX / width;

    const gamma =
        (ratio - 0.5)
        * 2
        * MAX_GAMMA;

    updateScene(gamma);

}

// ======================
// 缓动动画
// ======================

function animate() {

    currentHandX +=
        (targetHandX - currentHandX)
        * EASING;

    handLamp.style.transform =
        `translateX(calc(-50% + ${currentHandX}px))`;

    requestAnimationFrame(
        animate
    );

}

// ======================
// 启动
// ======================

function startDeviceOrientation() {

    // iOS

    if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {

        document.body.addEventListener(
            'touchstart',
            async () => {

                try {

                    const result =
                        await DeviceOrientationEvent.requestPermission();

                    if (result === 'granted') {

                        window.addEventListener(
                            'deviceorientation',
                            handleOrientation
                        );

                    }

                } catch (err) {

                    console.error(err);

                }

            },
            { once:true }
        );

    }

    // Android

    else {

        window.addEventListener(
            'deviceorientation',
            handleOrientation
        );

    }

}

// ======================
// PC调试模式
// ======================

window.addEventListener(
    'mousemove',
    handleMouseMove
);

// ======================
// 初始化
// ======================

startDeviceOrientation();

animate();
