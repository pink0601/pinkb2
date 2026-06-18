// =========================
// 元素获取
// =========================

const leftBg = document.querySelector(".left");
const rightBg = document.querySelector(".right");
const lantern = document.getElementById("lantern");

// =========================
// 参数配置
// =========================

// 背景渐变触发角度
const MAX_TILT = 35;

// 马灯最大摆动距离
const MAX_MOVE = 50;

// 缓动系数（越小越稳）
const EASING = 0.06;

// =========================
// 状态变量
// =========================

let targetX = 0;
let currentX = 0;

// =========================
// 工具函数
// =========================

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

// =========================
// 陀螺仪处理
// =========================

function handleOrientation(event) {

    let gamma = event.gamma || 0;

    // 限制范围
    gamma = clamp(gamma, -45, 45);

    // =====================
    // 背景透明度计算
    // =====================

    const leftOpacity = Math.max(
        0,
        Math.min(1, -gamma / MAX_TILT)
    );

    const rightOpacity = Math.max(
        0,
        Math.min(1, gamma / MAX_TILT)
    );

    leftBg.style.opacity = leftOpacity;
    rightBg.style.opacity = rightOpacity;

    // =====================
    // 马灯摆动
    // =====================

    targetX =
        (gamma / 45) * MAX_MOVE;
}

// =========================
// 马灯缓动动画
// =========================

function animate() {

    currentX +=
        (targetX - currentX) * EASING;

    lantern.style.transform =
        `translateX(${currentX}px)`;

    requestAnimationFrame(animate);
}

// =========================
// 启动陀螺仪
// =========================

function startMotion() {

    // Android
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission !== "function"
    ) {

        window.addEventListener(
            "deviceorientation",
            handleOrientation,
            true
        );

        return;
    }

    // iOS
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent
            .requestPermission()
            .then(permissionState => {

                if (permissionState === "granted") {

                    window.addEventListener(
                        "deviceorientation",
                        handleOrientation,
                        true
                    );

                } else {

                    console.warn("陀螺仪权限被拒绝");

                }

            })
            .catch(err => {

                console.error(err);

            });
    }
}

// =========================
// 页面启动
// =========================

window.addEventListener("load", () => {

    startMotion();

    animate();

});

// =========================
// 页面切换回来重新监听
// =========================

document.addEventListener(
    "visibilitychange",
    () => {

        if (!document.hidden) {

            startMotion();

        }

    }
);