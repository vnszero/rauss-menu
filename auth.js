function showLoggedOptions(user) {
    if (!user) {
        document.querySelectorAll(".logged-only").forEach(btn => {
            btn.style.display = "none";
        });
        document.querySelectorAll(".admin-only").forEach(btn => {
            btn.style.display = "none";
        });
        return;
    }

    db.collection('users').doc(user.uid).get().then(doc => {
        const data = doc.data();
        if (data) {
            document.querySelectorAll(".logged-only").forEach(btn => {
                btn.style.display = "block";
            });
        }

        if (data && data.role === 'admin') {
            document.querySelectorAll(".admin-only").forEach(btn => {
                btn.style.display = "block";
            });
        }
    });
}

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // signup user
    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
        return db.collection('users').doc(cred.user.uid).set({
            name: signupForm['signup-name'].value,
            email: email,
            role: "common"
        });
    }).then(() => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    });
});

// logout
const logout = document.querySelector('#btn-logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

// listen for auth status changes
auth.onAuthStateChanged((user) => {
    showLoggedOptions(user);
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    });
});
