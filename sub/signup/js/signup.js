
// ==============================
// Lucide 아이콘 생성
// ==============================

function refreshIcons() {

    if (window.lucide) {
        lucide.createIcons();
    }

}

refreshIcons();


// ==============================
// HTML 요소 가져오기
// ==============================

const signupForm = document.querySelector("#signupForm");

const userName = document.querySelector("#userName");
const userId = document.querySelector("#userId");

const password = document.querySelector("#password");
const passwordConfirm = document.querySelector("#passwordConfirm");

const phone = document.querySelector("#phone");

const checkIdBtn = document.querySelector("#checkIdBtn");

const idMessage = document.querySelector("#idMessage");
const passwordMessage = document.querySelector("#passwordMessage");
const confirmMessage = document.querySelector("#confirmMessage");

const errorMessage = document.querySelector("#errorMessage");

const agreeAll = document.querySelector("#agreeAll");
const agreeTerms = document.querySelector("#agreeTerms");
const agreePrivacy = document.querySelector("#agreePrivacy");
const agreeMarketing = document.querySelector("#agreeMarketing");

const termChecks = document.querySelectorAll(".term-check");

const signupBtn = document.querySelector(".signup-btn");


// ==============================
// 모달 요소
// ==============================

const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modalTitle");
const modalMessage = document.querySelector("#modalMessage");
const modalConfirm = document.querySelector("#modalConfirm");

let modalAction = null;


// ==============================
// 아이디 중복 확인 상태
// ==============================

let isIdChecked = false;
let checkedId = "";


// ==============================
// 회원 정보 가져오기
// ==============================

function getUsers() {

    const users = JSON.parse(
        localStorage.getItem("ipdeokUsers") || "[]"
    );

    if (!Array.isArray(users)) {
        throw new Error("회원 정보 형식이 올바르지 않습니다.");
    }

    return users;

}


// ==============================
// 검사 메시지 표시
// ==============================

function showMessage(element, message, type) {

    element.textContent = message;
    element.className = "field-message " + type;

}


// ==============================
// 아이디 유효성 검사
// ==============================

function validateId(value) {

    const idPattern = /^[a-zA-Z0-9]{4,20}$/;

    return idPattern.test(value);

}


// ==============================
// 아이디 중복 확인
// ==============================

checkIdBtn.addEventListener("click", () => {

    const inputId = userId.value.trim();

    isIdChecked = false;
    checkedId = "";

    errorMessage.textContent = "";

    if (!validateId(inputId)) {

        showMessage(
            idMessage,
            "영문 또는 숫자로 4~20자 입력해 주세요.",
            "error"
        );

        return;

    }

    try {

        const users = getUsers();

        const duplicated = users.some(user =>
            user.id.toLowerCase() === inputId.toLowerCase()
        );

        if (duplicated) {

            showMessage(
                idMessage,
                "이미 사용 중인 아이디예요.",
                "error"
            );

            return;

        }

        isIdChecked = true;
        checkedId = inputId;

        showMessage(
            idMessage,
            "사용 가능한 아이디예요!",
            "success"
        );

    } catch (error) {

        showMessage(
            idMessage,
            "회원 정보를 확인할 수 없어요. 다시 시도해 주세요.",
            "error"
        );

    }

});


// 아이디 변경 시 중복 확인 초기화

userId.addEventListener("input", () => {

    isIdChecked = false;
    checkedId = "";

    idMessage.textContent = "";
    errorMessage.textContent = "";

});


// ==============================
// 비밀번호 유효성 검사
// ==============================

function validatePassword(value) {

    const passwordPattern =
        /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

    return passwordPattern.test(value);

}

password.addEventListener("input", () => {

    const value = password.value;

    if (value === "") {

        passwordMessage.textContent = "";

    } else if (validatePassword(value)) {

        showMessage(
            passwordMessage,
            "사용 가능한 비밀번호예요!",
            "success"
        );

    } else {

        showMessage(
            passwordMessage,
            "영문과 숫자를 포함하여 8자 이상 입력해 주세요.",
            "error"
        );

    }

    checkPasswordMatch();

});


// ==============================
// 비밀번호 일치 확인
// ==============================

function checkPasswordMatch() {

    if (passwordConfirm.value === "") {

        confirmMessage.textContent = "";
        return false;

    }

    if (password.value === passwordConfirm.value) {

        showMessage(
            confirmMessage,
            "비밀번호가 일치해요!",
            "success"
        );

        return true;

    }

    showMessage(
        confirmMessage,
        "비밀번호가 일치하지 않아요.",
        "error"
    );

    return false;

}

passwordConfirm.addEventListener(
    "input",
    checkPasswordMatch
);


// ==============================
// 비밀번호 보기 / 숨기기
// ==============================

document.querySelectorAll(".toggle-password")
    .forEach(button => {

        button.addEventListener("click", () => {

            const targetId = button.dataset.target;

            const targetInput =
                document.getElementById(targetId);

            if (targetInput.type === "password") {

                targetInput.type = "text";

                button.innerHTML =
                    '<i data-lucide="eye-off"></i>';

                button.setAttribute(
                    "aria-label",
                    "비밀번호 숨기기"
                );

            } else {

                targetInput.type = "password";

                button.innerHTML =
                    '<i data-lucide="eye"></i>';

                button.setAttribute(
                    "aria-label",
                    "비밀번호 보기"
                );

            }

            refreshIcons();

        });

    });


// ==============================
// 휴대폰 번호 자동 하이픈
// ==============================

phone.addEventListener("input", () => {

    let value = phone.value.replace(/[^0-9]/g, "");

    value = value.slice(0, 11);

    if (value.length <= 3) {

        phone.value = value;

    } else if (value.length <= 7) {

        phone.value =
            value.slice(0, 3) + "-" +
            value.slice(3);

    } else {

        phone.value =
            value.slice(0, 3) + "-" +
            value.slice(3, 7) + "-" +
            value.slice(7);

    }

});


// ==============================
// 약관 전체 동의
// ==============================

agreeAll.addEventListener("change", () => {

    termChecks.forEach(checkbox => {

        checkbox.checked = agreeAll.checked;

    });

    agreeAll.indeterminate = false;

});


// 개별 약관 동의

termChecks.forEach(checkbox => {

    checkbox.addEventListener("change", () => {

        const checkedCount = [...termChecks]
            .filter(item => item.checked).length;

        agreeAll.checked =
            checkedCount === termChecks.length;

        agreeAll.indeterminate =
            checkedCount > 0 &&
            checkedCount < termChecks.length;

    });

});


// ==============================
// 모달 열기
// ==============================

function openModal(title, message, icon, action = null) {

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    const iconBox = document.querySelector(".modal-icon");

    iconBox.innerHTML =
        `<i data-lucide="${icon}"></i>`;

    modalAction = action;

    modalConfirm.textContent =
        action ? "로그인하러 가기" : "확인";

    refreshIcons();

    modal.showModal();

}


// 모달 확인 버튼

modalConfirm.addEventListener("click", () => {

    const action = modalAction;

    modalAction = null;

    modal.close();

    if (action) {
        action();
    }

});


// 회원가입 완료 모달은 ESC로 닫지 않음

modal.addEventListener("cancel", event => {

    if (modalAction) {
        event.preventDefault();
    }

});


// ==============================
// 약관 상세 내용 (프로토타입용)
// ==============================

const termsContent = {

    service: {

        title: "이용약관",

        message:
            "입덕볶이 프로토타입 서비스의 회원가입 및 주문 기능을 체험하기 위한 테스트용 약관입니다.\n\n" +
            "실제 주문 및 결제는 진행되지 않습니다."

    },

    privacy: {

        title: "개인정보 수집 및 이용",

        message:
            "이름, 아이디, 비밀번호, 휴대폰 번호를 회원가입 기능 테스트 목적으로 입력받습니다.\n\n" +
            "입력한 정보는 현재 브라우저의 LocalStorage에 저장됩니다.\n\n" +
            "실제 개인정보는 입력하지 말아 주세요."

    },

    marketing: {

        title: "마케팅 정보 수신 동의",

        message:
            "이벤트 및 할인 혜택 수신 동의를 체험하기 위한 선택 항목입니다.\n\n" +
            "프로토타입에서는 실제 광고 메시지가 발송되지 않습니다."

    }

};

document.querySelectorAll(".terms-detail")
    .forEach(button => {

        button.addEventListener("click", () => {

            const selected =
                termsContent[button.dataset.term];

            openModal(
                selected.title,
                selected.message,
                "file-text"
            );

        });

    });


// ==============================
// 회원가입 기능
// ==============================

signupForm.addEventListener("submit", event => {

    event.preventDefault();

    errorMessage.textContent = "";

    const inputName = userName.value.trim();
    const inputId = userId.value.trim();
    const inputPassword = password.value;
    const inputPhone = phone.value.trim();


    // 이름 확인

    if (inputName === "") {

        errorMessage.textContent =
            "이름을 입력해 주세요.";

        userName.focus();

        return;

    }


    // 아이디 확인

    if (!validateId(inputId)) {

        errorMessage.textContent =
            "올바른 아이디를 입력해 주세요.";

        userId.focus();

        return;

    }


    // 아이디 중복 확인 여부

    if (!isIdChecked || checkedId !== inputId) {

        errorMessage.textContent =
            "아이디 중복 확인을 진행해 주세요.";

        checkIdBtn.focus();

        return;

    }


    // 비밀번호 확인

    if (!validatePassword(inputPassword)) {

        errorMessage.textContent =
            "비밀번호 입력 조건을 확인해 주세요.";

        password.focus();

        return;

    }


    // 비밀번호 일치 확인

    if (!checkPasswordMatch()) {

        errorMessage.textContent =
            "비밀번호가 일치하지 않아요.";

        passwordConfirm.focus();

        return;

    }


    // 휴대폰 번호 확인

    const phonePattern = /^010-\d{4}-\d{4}$/;

    if (!phonePattern.test(inputPhone)) {

        errorMessage.textContent =
            "올바른 휴대폰 번호를 입력해 주세요.";

        phone.focus();

        return;

    }


    // 필수 약관 동의 확인

    if (!agreeTerms.checked || !agreePrivacy.checked) {

        errorMessage.textContent =
            "필수 약관에 모두 동의해 주세요.";

        return;

    }


    // 회원 정보 저장

    try {

        const users = getUsers();


        // 저장 직전 아이디 중복 재확인

        const duplicated = users.some(user =>
            user.id.toLowerCase() === inputId.toLowerCase()
        );

        if (duplicated) {

            isIdChecked = false;

            showMessage(
                idMessage,
                "이미 사용 중인 아이디예요.",
                "error"
            );

            errorMessage.textContent =
                "다른 아이디를 사용해 주세요.";

            userId.focus();

            return;

        }


        // 신규 회원 정보

        const newUser = {

            name: inputName,
            id: inputId,
            password: inputPassword,
            phone: inputPhone,

            termsAgreed: agreeTerms.checked,
            privacyAgreed: agreePrivacy.checked,
            marketingAgreed: agreeMarketing.checked,

            createdAt: new Date().toISOString(),

            stamps: 0,
            orders: []

        };


        // 기존 회원 목록에 추가

        users.push(newUser);


        // LocalStorage 저장

        localStorage.setItem(
            "ipdeokUsers",
            JSON.stringify(users)
        );


        // 회원가입 완료

        signupBtn.disabled = true;
        signupBtn.textContent = "회원가입 완료!";

        openModal(

            "입덕 완료!",

            inputName + "님, 환영해요!\n" +
            "이제 입덕볶이의 맛있는 혜택을 만나보세요.",

            "party-popper",

            () => {

                window.location.href =
                    "../login/login.html";

            }

        );

    } catch (error) {

        errorMessage.textContent =
            "회원 정보를 저장하지 못했어요. 다시 시도해 주세요.";

    }

});
