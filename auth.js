function finishModal() {
    const modal = document.querySelector('#modal-create-item');
    createForm.reset();
    createForm.removeAttribute('data-edit-id');

    // Reset the select field (to avoid showing previous value in edit mode)
    const categorySelect = createForm.querySelector('#item-category');
    const selectInstance = M.FormSelect.getInstance(categorySelect);
    if (selectInstance) selectInstance.destroy();
    M.FormSelect.init(categorySelect);

    // Close the modal
    M.Modal.getInstance(modal).close();
}

function openEditModal(item) {
    const modal = document.querySelector('#modal-create-item');
    const form = document.querySelector('#create-item-form');

    // Fill in form values
    form['item-name'].value = item.name;
    form['item-value'].value = item.value.toFixed(2);
    form['item-category'].value = item.category;
    M.updateTextFields();

    // Refresh select field (destroy previous instance and reinitialize it)
    const categorySelect = form.querySelector('#item-category');
    const selectInstance = M.FormSelect.getInstance(categorySelect);
    if (selectInstance) selectInstance.destroy();
    M.FormSelect.init(categorySelect);

    // Store ID on form to detect edit mode
    form.setAttribute('data-edit-id', item.id);

    // Open the modal
    M.Modal.getInstance(modal).open();
}

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

// create new item or edit
const createForm = document.querySelector('#create-item-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = createForm.getAttribute('data-edit-id');
    const itemData = {
        name: createForm['item-name'].value,
        category: createForm['item-category'].value.toLowerCase(),
        value: parseFloat(createForm['item-value'].value)
    };

    if (editId) {
        // Update existing item
        db.collection('menu').doc(editId).update(itemData).then(() => {
            finishModal();
        });
    } else {
        // Create new item
        db.collection('menu').add(itemData).then(() => {
            finishModal();
        });
    }
});