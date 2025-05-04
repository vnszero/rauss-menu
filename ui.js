function formatEUR(input) {
    input.addEventListener("input", () => {
        let value = input.value.replace(/\D/g, ""); // Remove anything not digit
        value = (parseInt(value, 10) / 100).toFixed(2) + "";
        // value = value.replace(".", ",");
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, "");
        input.value = `${value}`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Initialize all Materialize modals
    document.querySelectorAll('.modal').forEach(modal => {
        M.Modal.init(modal);
    });

    // Initialize all selectors
    document.querySelectorAll('select').forEach(select => {
        M.FormSelect.init(select);
    });

    const itemValueInput = document.getElementById("item-value");
    if (itemValueInput) {
        formatEUR(itemValueInput);
    }

    // Sidebar logic
    const settingsIcon = document.querySelector(".settings-icon");
    const settingsSidebar = document.querySelector(".settings-sidebar");
    const closeBtn = document.querySelector(".close-settings");

    if (settingsIcon) {
        settingsIcon.addEventListener("click", () => {
            settingsSidebar.classList.add("open");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            settingsSidebar.classList.remove("open");
        });
    }

    // Sidebar buttons
    const btnLogin = document.getElementById("btn-login");
    const btnSignup = document.getElementById("btn-signup");
    const btnLogout = document.getElementById("btn-logout");
    const btnCreate = document.getElementById("btn-create");
    const btnManage = document.getElementById("btn-manage");

    if (btnLogin) {
        btnLogin.addEventListener("click", () => {
            const modal = document.querySelector('#modal-login');
            if (modal) M.Modal.getInstance(modal).open();
            settingsSidebar.classList.remove("open");
        });
    }

    if (btnSignup) {
        btnSignup.addEventListener("click", () => {
            const modal = document.querySelector('#modal-signup');
            if (modal) M.Modal.getInstance(modal).open();
            settingsSidebar.classList.remove("open");
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            auth.signOut().then(() => {
                settingsSidebar.classList.remove("open");
            });
        });
    }

    if (btnCreate) {
        btnCreate.addEventListener("click", () => {
            const modal = document.querySelector('#modal-create-item');
            if (modal) {
                M.Modal.getInstance(modal).open();
            } else {
                alert("Modal de criação de item ainda não implementado.");
            }
            settingsSidebar.classList.remove("open");
        });
    }

    if (btnManage) {
        btnManage.addEventListener("click", () => {
            alert("Gerenciamento de contas ainda não implementado.");
            settingsSidebar.classList.remove("open");
        });
    }
});
