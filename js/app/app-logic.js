export class Application {
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