function addAccount(email, password) {

    // Work on later to add multi account support
    let details = {
        email: email,
        password: password
    }

    let fs = require('fs');
    let jsonData = JSON.stringify(details, null, 4);
    fs.writeFileSync("../accounts.json", jsonData, function(err) {
        if(err) {
            console.log(err);
        }
    });
}