if (window.lucide) {
    lucide.createIcons();
}

// HTML 요소 가져오기

const character = document.querySelector("#character");
const characterMessage = document.querySelector("#characterMessage");

const userId = document.querySelector("#userId");
const password = document.querySelector("#password");

const togglePassword = document.querySelector("#togglePassword");
const loginForm = document.querySelector("#loginForm");
const errorMessage = document.querySelector("#errorMessage");
const keepLogin = document.querySelector("#keepLogin");

const loginBtn = document.querySelector(".login-btn");

// 캐릭터 이미지 및 메시지

const characterStates = {

    default: {
    image: "character_default.png",
    message: "로그인하고 맛있는 떡볶이를 만나보세요!"
    },

    id: {
        image: "character_id.png",
        message: "어떤 분이 찾아오셨나요?"
    },

    password: {
        image: "character_password.png",
        message: "비밀번호는 안 볼게요!"
    },

    peek: {
        image: "character_peek.png",
        message: "살짝 눈을 떠볼까요?"
    },

    fail: {
        image: "character_fail.png",
        message: "앗! 다시 한번 확인해 주세요!"
    },

    success: {
        image: "character_success.png",
        message: "반가워요! 오늘도 맛있게 입덕하세요!"
    }

};

// 캐릭터 이미지 미리 불러오기

Object.values(characterStates).forEach(state => {
    const img = new Image();
    img.src = "./img/" + state.image;
});

// 캐릭터 상태 변경

function changeCharacter(state) {

    const selected = characterStates[state];

    character.src = "./img/" + selected.image;
    characterMessage.textContent = selected.message;

    character.className = "character";

    if (state === "default") {
        character.classList.add("idle");
    }

    if (state === "success") {
        character.classList.add("success");
    }

    if (state === "fail") {
        character.classList.add("fail");
    }

}

// 아이디 입력

userId.addEventListener("focus", () => {
    changeCharacter("id");
    errorMessage.textContent = "";
});

// 비밀번호 입력

password.addEventListener("focus", () => {

    if (password.type === "password") {
        changeCharacter("password");
    } else {
        changeCharacter("peek");
    }

    errorMessage.textContent = "";

});

// 입력창에서 벗어날 때

[userId, password].forEach(input => {

    input.addEventListener("blur", (event) => {

        if (
            event.relatedTarget !== userId &&
            event.relatedTarget !== password &&
            event.relatedTarget !== togglePassword
        ) {
            changeCharacter("default");
        }

    });

});

// 비밀번호 보기 / 숨기기

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML =
            '<i data-lucide="eye-off"></i>';

        togglePassword.setAttribute(
            "aria-label",
            "비밀번호 숨기기"
        );

        changeCharacter("peek");

    } else {

        password.type = "password";

        togglePassword.innerHTML =
            '<i data-lucide="eye"></i>';

        togglePassword.setAttribute(
            "aria-label",
            "비밀번호 보기"
        );

        changeCharacter("password");

    }

  if (window.lucide) {
    lucide.createIcons();
}

});

// 로그인 기능

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const inputId = userId.value.trim();
    const inputPassword = password.value;

    // LocalStorage 회원 정보 가져오기

    const users = JSON.parse(
        localStorage.getItem("ipdeokUsers") || "[]"
    );

    // 일치하는 회원 찾기

    const matchedUser = users.find(user =>
        user.id === inputId &&
        user.password === inputPassword
    );

    // 로그인 실패

    if (!matchedUser) {

        errorMessage.textContent =
            "아이디 또는 비밀번호를 확인해 주세요.";

        changeCharacter("fail");

        return;

    }

    // 현재 로그인 사용자 정보

    const currentUser = {
        id: matchedUser.id,
        name: matchedUser.name
    };

    // 이전 로그인 정보 제거

    localStorage.removeItem("ipdeokCurrentUser");
    sessionStorage.removeItem("ipdeokCurrentUser");

    // 로그인 상태 유지

    if (keepLogin.checked) {

        localStorage.setItem(
            "ipdeokCurrentUser",
            JSON.stringify(currentUser)
        );

    } else {

        sessionStorage.setItem(
            "ipdeokCurrentUser",
            JSON.stringify(currentUser)
        );

    }

    // 로그인 성공

    errorMessage.textContent = "";
    changeCharacter("success");

    loginBtn.textContent = "로그인 성공!";
    loginBtn.disabled = true;

    // 메인 페이지 이동

// 로그인 성공 후 페이지 이동

setTimeout(() => {

    const params = new URLSearchParams(
        window.location.search
    );

    const redirect = params.get("redirect");

    if (redirect === "order") {

        // 배달 주문을 위해 로그인한 경우

        window.location.href =
            "../lists/lists.html";

    } else {

        // 일반 로그인을 진행한 경우

        window.location.href =
            "../../index.html";

    }

}, 1500);

});