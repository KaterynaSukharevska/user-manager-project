class Application {
    storage = localStorage;

    getAllUsers(item) {
        let users = this.storage.getItem(item);
        return JSON.parse(users);
    };

    getUserByEmail(email) {
        let users = this.getAllUsers('users');
        let user = false;
        users.forEach(element => {
            if (element.email === email) user = element
        })
        return user;
    };

    addNewUser(key, value) {
        let users = this.getAllUsers(key); // this?
        let check = false;
        let data = []; // what for?

        if (users && users.length > 0) {
            users.forEach(element => {
                if (element.email == email) check = true;
            })
            if (!check) {
                users.push(value); // what for?
                this.saveToStorage(key, users);
            }
        } else {
            data.push(value); // what for?
            this.saveToStorage(key, data);
        }
    };

    saveToStorage(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    };

    removeUser(email) {
        let users = this.getAllUsers('users');
        users.forEach((user) => {
            if (user.email == email && user.status == "active") {
                user.status = "inactive";
                this.saveToStorage('users', users);
            }
        })
    }
}

let App = new Application;



    /********** Show ************/

    const addUserToList = (user) => {
        let newRow = document.createElement("tr");
        document.getElementById("mytable").appendChild(newRow);

        for (let val in user) {
            if (val !== 'password' && val !== 'login') {
                let newCell = document.createElement("td");
                let infoCell = document.createTextNode(user[val]);
                newCell.appendChild(infoCell);
                document.querySelector("#mytable > tr:last-child").appendChild(newCell);
            }
        }

        const createButton = (txtBtn, dataTarget, className, classNameCell) => {
            const btnName = document.createElement("button");
            const textEditBtn = document.createTextNode(txtBtn);
            btnName.setAttribute('data-email', user['email']);
            btnName.setAttribute('data-bs-toggle', 'modal');
            btnName.setAttribute('data-bs-target', dataTarget);
            btnName.classList.add(className);
            btnName.appendChild(textEditBtn);

            const buttonCell = document.createElement("td");
            buttonCell.classList.add(classNameCell);

            document.querySelector("#mytable > tr:last-child").appendChild(buttonCell);
            document.querySelector(`#mytable > tr:last-child .${classNameCell}`).appendChild(btnName);
        }
        createButton("Edit", '#edit', "button-edit", "button-edit-cell");
        createButton("Delete", '#delete', "button-delete", "button-delete-cell");
    }

    const showUsers = (users) => {
        users.forEach(user => {
            if (user.status === "active") {
                addUserToList(user);
            }
        })
    }

    const usersFromMemory = App.getAllUsers('users');
    if (usersFromMemory && Object.keys(usersFromMemory).length >= 0) {
        showUsers(usersFromMemory);
    } else {
        const newDiv = document.createElement("div");
        newDiv.classList.add("no-users");
        const newTextEl = document.createElement("p");
        const textEditBtn = document.createTextNode("no users in memory");
        newTextEl.appendChild(textEditBtn);
        document.querySelector(".table-responsive").appendChild(newDiv);
        document.querySelector(".no-users").appendChild(newTextEl);
    }

    // Save new user
    const form = document.querySelector("#add-users");
    form.addEventListener("submit", (event) => {
        formValidation(event);
    })

    // Fill modal form
    document.querySelector(".table").addEventListener("click", (event) => {
        let email = event.target.getAttribute('data-email');
        // delete
        let btn = document.querySelector("#delete .button-delete");
        btn.setAttribute('data-email', email);
        // edit
        let user = App.getUserByEmail(email);
        document.querySelector("#edit #edit-firstName").value = user.firstName;
        document.querySelector("#edit #edit-lastName").value = user.lastName;
        document.querySelector("#edit #edit-email").value = user.email;
        // Checkboxes
        document.querySelector("#edit #edit-role").checked = user.role === "admin";
        document.querySelector("#edit #edit-status").checked = user.status === "active";
    });

    // Save edited user
    document.querySelector("#edit-users").addEventListener("submit", (event) => {
        const user = {};
        user.firstName = document.querySelector("#edit-firstName").value;
        user.lastName = document.querySelector("#edit-lastName").value;
        user.email = document.querySelector("#edit-email").value;
        user.role = document.querySelector("#edit-role").checked ? "admin" : "user";
        user.status = document.querySelector("#edit-status").checked ? "active" : "inactive";

        const users = App.getAllUsers('users');
        users.forEach(u => {
            if (u.email === user.email) {
                u.firstName = user.firstName;
                u.lastName = user.lastName;
                u.role = user.role;
                u.status = user.status;
                App.saveToStorage('users', users);
            }
        });

        window.top.location.reload(true);

        event.preventDefault();
    })

    // Delete user
    document.querySelector(".delete").addEventListener("click", (event) => {
        let email = event.target.getAttribute('data-email');
        App.removeUser(email);

        const myModal = new bootstrap.Modal(document.getElementById('delete'), {
            keyboard: false,
        });
        myModal.hide();

        let btn = document.querySelector(`.table .button-delete[data-email="${email}"]`);
        let line = btn.closest("tr");
        line.style.display = "none";
    });


//////////////// Helpers /////////////////////


//Changing custom "on" to "admin"
const changeRoleAndStatus = (newUser) => {
    if(newUser.role === "on") {
        newUser.role = "admin"
    } else {
        newUser.role = "user"
    }
    if(newUser.status === "on") {
        newUser.status = "active"
    } else {
        newUser.status = "inactive"
    }
}

//Form validation
const formValidation = (event) => {
    if (!form.checkValidity()) {
        if(form.classList.contains('was-validated')) {
            checkUserValidation();
            form.classList.remove('was-validated');
        } else {
            form.classList.add('was-validated');
        }

    } else {
        checkUserValidation();
    }
    event.preventDefault()
    event.stopPropagation()
}

//Validation user and add user to users
const checkUserValidation = () => {
    const users = App.getAllUsers('users');
    const formData = new FormData(form);
    const user = {};

    formData.forEach((value, key) => user[key] = value);
    changeRoleAndStatus(user);

    const validate = (data) => {
        let valid = true;
        if (data.length > 0) {
            if (data.some((existedUser) => existedUser.email === user.email)) {
                form.classList.add('was-validated');
                document.getElementById("email").setCustomValidity("invalid");
                valid = false;
            }
        }
        return valid;
    };

    if (validate(users)) {
        App.addNewUser('users', user);
        document.getElementById("add-users").reset();
        addUserToList(user);
    }
}