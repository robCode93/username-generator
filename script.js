document.addEventListener("DOMContentLoaded", () => {
    let usercount = 0;

    const elements = {
        firstNameInput: document.getElementById("firstNameInput"),
        lastNameInput: document.getElementById("lastNameInput"),
        submitButton: document.getElementById("submitButton"),
        userTable: document.getElementById("userTable"),
    }

    function generateUserName(firstName, lastName){
        let firstPart = "";
        let secondPart = "";

        if(firstName.length > 2){
            firstPart = firstName[0] + (firstName.length - 2) + firstName[firstName.length - 1];
        }else if(firstName.length > 0){
            firstPart = firstName;
        }else{
            return null;
        }

        if(lastName.length > 2){
            secondPart = lastName[0] + (lastName.length - 2) + lastName[lastName.length - 1];
        }else if(lastName.length > 0){
            secondPart = lastName;
        }else{
            return null;
        }

        return firstPart + secondPart;
    }

    function addTableData(firstName, lastName, userName){
        const newTableRow = document.createElement("tr");

        for(let i = 0; i < 5; i++){
            newTableRow.appendChild(document.createElement("td"));
        }

        newTableRow.children[0].innerText = usercount + 1;
        newTableRow.children[1].innerText = firstName;
        newTableRow.children[2].innerText = lastName;
        newTableRow.children[3].innerText = userName;
        newTableRow.children[4].innerText = new Date().toISOString();

        elements.userTable.appendChild(newTableRow);
    }

    elements.submitButton.addEventListener("click", () => {
        const firstName = elements.firstNameInput.value.trim().toLowerCase();
        const lastName = elements.lastNameInput.value.trim().toLowerCase();

        const userName = generateUserName(firstName, lastName);
        addTableData(firstName, lastName, userName);
        usercount++;
    })
})