/* ==========================================
   DOM READY
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupPasswordToggle();

        setupRememberMe();

        setupLogin();

        applySavedTheme();

    }
);

/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

function setupPasswordToggle(){

    const passwordInput =
        document.getElementById(
            "password"
        );

    const toggleBtn =
        document.getElementById(
            "togglePassword"
        );

    if(!passwordInput || !toggleBtn)
        return;

    toggleBtn.addEventListener(
        "click",
        () => {

            const icon =
                toggleBtn.querySelector("i");

            if(
                passwordInput.type ===
                "password"
            ){

                passwordInput.type =
                    "text";

                icon.classList.remove(
                    "bi-eye"
                );

                icon.classList.add(
                    "bi-eye-slash"
                );

            }else{

                passwordInput.type =
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
   REMEMBER ME
========================================== */

function setupRememberMe(){

    const savedEmail =
        localStorage.getItem(
            "rememberedEmail"
        );

    if(savedEmail){

        document.getElementById(
            "email"
        ).value = savedEmail;

        document.getElementById(
            "rememberMe"
        ).checked = true;
    }

}

/* ==========================================
   LOGIN
========================================== */

function setupLogin(){

    const form =
        document.getElementById(
            "loginForm"
        );

    if(!form) return;

    form.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const password =
                document.getElementById(
                    "password"
                ).value.trim();

            const rememberMe =
                document.getElementById(
                    "rememberMe"
                ).checked;

            if(
                email === "" ||
                password === ""
            ){

                showToast(
                    "Please fill all fields",
                    "error"
                );

                return;
            }

            if(rememberMe){

                localStorage.setItem(
                    "rememberedEmail",
                    email
                );

            }else{

                localStorage.removeItem(
                    "rememberedEmail"
                );

            }

            const users =
    JSON.parse(
        localStorage.getItem(
            "users"
        )
    ) || [];

const user =
    users.find(
        user =>
            (
                user.email.toLowerCase() === email.toLowerCase() ||
                user.username.toLowerCase() === email.toLowerCase()
            ) &&
            user.password === password
    );

if(!user){

    showToast(
        "Invalid Email or Password",
        "error"
    );

    return;
}

localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
);

showToast(
    `Welcome ${user.name} 🎉`,
    "success"
);

setTimeout(
    () => {

        window.location.href =
            "home.html";

    },
    1500
);

        }
    );

}

function applySavedTheme(){

    const theme =
        localStorage.getItem(
            "theme"
        );

    if(theme === "dark"){

        document.body.classList.add(
            "dark"
        );
    }
}

/* ==========================================
   TOAST MESSAGE
========================================== */

function showToast(
    message,
    type = "success"
){

    const existing =
        document.querySelector(
            ".toast-message"
        );

    if(existing){

        existing.remove();
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

    border-radius:16px;

    color:white;

    font-weight:600;

    transform:
    translateX(120%);

    transition:.3s;

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