/* ==========================================
   DOM READY
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupPasswordToggle();

        setupRegister();

        applySavedTheme();

    }
);

/* ==========================================
   PASSWORD TOGGLES
========================================== */

function setupPasswordToggle(){

    setupSingleToggle(
        "password",
        "togglePassword"
    );

    setupSingleToggle(
        "confirmPassword",
        "toggleConfirmPassword"
    );

}

function setupSingleToggle(
    inputId,
    buttonId
){

    const input =
        document.getElementById(
            inputId
        );

    const button =
        document.getElementById(
            buttonId
        );

    if(!input || !button)
        return;

    button.addEventListener(
        "click",
        () => {

            const icon =
                button.querySelector("i");

            if(
                input.type ===
                "password"
            ){

                input.type =
                    "text";

                icon.classList.remove(
                    "bi-eye"
                );

                icon.classList.add(
                    "bi-eye-slash"
                );

            }else{

                input.type =
                    "password";

                icon.classList.remove(
                    "bi-eye-slash"
                );

                icon.classList.add(
                    "bi-eye"
                );

            }

        }
    );

}

/* ==========================================
   REGISTER
========================================== */

function setupRegister(){

    const form =
        document.getElementById(
            "registerForm"
        );

    if(!form) return;

    form.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const fullName =
                document.getElementById(
                    "fullName"
                ).value.trim();

            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const username =
                document.getElementById(
                    "username"
                ).value.trim();

            const password =
                document.getElementById(
                    "password"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;

            const acceptedTerms =
                document.getElementById(
                    "terms"
                ).checked;

            /* Validation */

            if(
                !fullName ||
                !email ||
                !username ||
                !password ||
                !confirmPassword
            ){

                showToast(
                    "Please fill all fields",
                    "error"
                );

                return;
            }

            if(
                password.length < 6
            ){

                showToast(
                    "Password must be at least 6 characters",
                    "error"
                );

                return;
            }

            if(
                password !==
                confirmPassword
            ){

                showToast(
                    "Passwords do not match",
                    "error"
                );

                return;
            }

            if(
                !acceptedTerms
            ){

                showToast(
                    "Please accept Terms & Conditions",
                    "error"
                );

                return;
            }

            /* Existing Users */

            const users =
                JSON.parse(
                    localStorage.getItem(
                        "users"
                    )
                ) || [];

            const userExists =
                users.find(
                    user =>
                    user.email === email
                );

            if(userExists){

                showToast(
                    "Email already registered",
                    "error"
                );

                return;
            }

            /* Create User */

            const newUser = {

                id:
                Date.now(),

                name:
                fullName,

                email:
                email,

                username:
                username,

                password:
                password,

                joinedDate:
                new Date()
                .toLocaleDateString(),

                image:
                "https://ui-avatars.com/api/?background=8B5CF6&color=fff&name="
                +
                encodeURIComponent(
                    fullName
                )
            };

            users.push(
                newUser
            );

            localStorage.setItem(
                "users",
                JSON.stringify(
                    users
                )
            );

            showToast(
                "Account Created Successfully 🎉",
                "success"
            );

            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1800
            );

        }
    );

}

/* ==========================================
   APPLY THEME
========================================== */

function applySavedTheme(){

    const theme =
        localStorage.getItem(
            "theme"
        );

    if(
        theme === "dark"
    ){

        document.body.classList.add(
            "dark"
        );

    }

}

/* ==========================================
   TOAST
========================================== */

function showToast(
    message,
    type = "success"
){

    const existingToast =
        document.querySelector(
            ".toast-message"
        );

    if(existingToast){

        existingToast.remove();

    }

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `toast-message ${type}`;

    toast.innerHTML =
        message;

    document.body.appendChild(
        toast
    );

    setTimeout(
        () => {

            toast.classList.add(
                "show"
            );

        },
        50
    );

    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

            setTimeout(
                () => {

                    toast.remove();

                },
                300
            );

        },
        2500
    );

}

/* ==========================================
   TOAST STYLES
========================================== */

const toastStyle =
document.createElement(
    "style"
);

toastStyle.innerHTML = `

.toast-message{

    position:fixed;

    top:25px;

    right:25px;

    z-index:9999;

    padding:16px 24px;

    border-radius:18px;

    color:white;

    font-weight:600;

    transform:
    translateX(120%);

    transition:.35s;

    box-shadow:
    0 15px 30px rgba(0,0,0,.15);
}

.toast-message.show{

    transform:
    translateX(0);
}

.toast-message.success{

    background:
    linear-gradient(
        135deg,
        #8B5CF6,
        #EC4899
    );
}

.toast-message.error{

    background:
    linear-gradient(
        135deg,
        #EF4444,
        #DC2626
    );
}

`;

document.head.appendChild(
    toastStyle
);