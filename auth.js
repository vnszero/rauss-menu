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

// Add admin
const manageForm = document.querySelector('#manage-form');
manageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#manage-email').value;

    db.collection('users')
        .where('email', '==', email)
        .get()
        .then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    doc.ref.update({ role: 'admin' });
                });
                manageForm.reset();
                manageForm.querySelector('.error').innerHTML = '';
                M.Modal.getInstance(document.querySelector('#modal-manage-account')).close();
                M.toast({ html: 'Administrador adicionado com sucesso!', classes: 'green' });
            } else {
                manageForm.querySelector('.error').innerHTML = 'Nenhum usuário encontrado com esse email.';
            }
        })
        .catch(err => {
            console.error("Erro ao definir admin:", err);
            manageForm.querySelector('.error').innerHTML = 'Erro ao adicionar administrador.';
        });
});

// create new item
const createForm = document.querySelector('#create-item-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('menu').add({
        name: createForm['item-name'].value,
        category: createForm['item-category'].value,
        value: parseFloat(createForm['item-value'].value) || 0
    }).then(() => {
        // close the modal and reset form
        const modal = document.querySelector('#modal-create-item');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }).catch(err => {
        console.log(err.message);
    });
});