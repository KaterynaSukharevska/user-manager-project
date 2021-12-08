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

// TODO Update table row
// TODO Validate email duplicate
// TODO Edit email, validate duplicate during process
// TODO Add date

let App = new Application;

$(document).ready(function () {

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
        // const textNoUser = document.querySelector(".no-users"); not working!!!!
        // textNoUser.remove();
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
    document.querySelector("#add-users button").addEventListener("click", (event) => {
        let user = {};
        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let email = document.getElementById("email").value;
        let login = document.getElementById("login").value;
        let password = document.getElementById("password").value;
        let role = document.getElementById("role").checked;
        let status = document.getElementById("status").checked;

        user.firstName = (firstName) ? firstName : 'User';
        user.lastName = (lastName) ? lastName : 'Guest';
        user.email = (email) ? email : false;
        user.login = (login) ? login : 'user';
        user.password = (password) ? password : 'guest123';
        user.role = (role) ? "admin" : "user";
        user.status = (status) ? "active" : "inactive";

        if (user.email) {
            App.addNewUser('users', user);
        }

        document.getElementById("add-users").reset();

        addUserToList(user);

        event.preventDefault();
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
});
