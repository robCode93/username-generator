document.addEventListener("DOMContentLoaded", () => {
    let usercount = 0;
    const userNames = [];
    const csvRows = [
        ["ID", "Firstname", "Lastname", "Username", "Email-Address", "TimeStamp"],
    ];

    const elements = {
        firstNameInput: document.getElementById("firstNameInput"),
        lastNameInput: document.getElementById("lastNameInput"),
        domainInput: document.getElementById("domain"),
        sqlInput: document.getElementById("sql"),
        submitButton: document.getElementById("submitButton"),
        userTable: document.getElementById("userTable"),
        generateListButton: document.getElementById("generateListButton"),
        generateSqlButton: document.getElementById("generateSqlButton")
    }

    function generateUserName(firstName, lastName){
        let firstPart = "";
        let secondPart = "";
        let userName = "";
        let sameNameCount = 1;
        let sameNameUserName = "";

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

        userName = firstPart + secondPart;
        sameNameUserName = userName;

        while(userNames.indexOf(userName) > -1){
            sameNameCount++;
            userName = sameNameUserName + sameNameCount;
        };

        userNames.push(userName);
        return userName;
    }

    function addTableData(firstName, lastName, userName){
        const newTableRow = document.createElement("tr");

        for(let i = 0; i < 7; i++){
            newTableRow.appendChild(document.createElement("td"));
        }

        newTableRow.children[0].innerText = usercount + 1;
        newTableRow.children[1].innerText = firstName;
        newTableRow.children[2].innerText = lastName;
        newTableRow.children[3].innerText = userName;
        newTableRow.children[4].innerText = generateEmailAddress(userName);
        newTableRow.children[5].innerText = new Date().toISOString();

        const deleteButton = generateDeleteButton();
        newTableRow.children[6].appendChild(deleteButton);

        elements.userTable.appendChild(newTableRow);

        addCsvLine(elements.userTable.children.length, firstName, lastName, userName, newTableRow.children[4].innerText, newTableRow.children[5].innerText);
    }

    function generateEmailAddress(userName){
        if(elements.domainInput.value.length < 1){
            return userName + "@mail-provider.de";
        }else{
            return userName + "@" + elements.domainInput.value;
        }
    }

    function generateDeleteButton(){
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn");
        deleteButton.classList.add("btn-danger");
        deleteButton.classList.add("deleteButton");
        deleteButton.innerText = "Löschen";

        return deleteButton;
    }

    function removeTableRow(event){
        const tableRow = event.target.closest("tr");
        tableRow.remove();
    }

    function addCsvLine(index, firstName, lastName, userName, mailAddress, timeStamp){
        csvRows.push([index, firstName, lastName, userName, mailAddress, timeStamp]);
    }

    function createCsvFile(){
        let csvContent = "data:text/csv;charset=utf-8,";

        csvRows.forEach(function(row) {
            csvContent += row.join(",") + "\n";
        });

        // Erstelle ein temporäres a-Tag und setze die CSV als den href-Link
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "usernames-data.csv");

        // Füge das a-Tag zum Dokument hinzu und klicke darauf um den Download zu starten
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function createSqlScript(){
        let tableName = "";
        let sqlQueryString = "CREATE TABLE";
        let idCount = 0;

        if(elements.sqlInput.length < 1 || elements.sqlInput.value === null){
            tableName = "maytable";
            sqlQueryString += " " + tableName + " (id INT PRIMARY KEY, firstname VARCHAR(50), lastname VARCHAR(50), username VARCHAR(50), mail VARCHAR(50), timestamp VARCHAR(50));\n";
        }else{
            tableName = elements.sqlInput.value;
            sqlQueryString +=  " " + tableName + " (id INT PRIMARY KEY, firstname VARCHAR(50), lastname VARCHAR(50), username VARCHAR(50), mail VARCHAR(50), timestamp VARCHAR(50));\n";
        }

        for(const row of elements.userTable.children){
            idCount++;

            sqlQueryString += "INSERT INTO " + tableName + " (id, firstname, lastname, username, mail, timestamp) VALUES ";
            sqlQueryString += "(" + idCount + ", '" + row.children[1].innerText + "', '" + row.children[2].innerText + "', '" + row.children[3].innerText + "', '" + row.children[4].innerText + "', '" + row.children[5].innerText + "');\n";
        }

        const encodedSqlQueryString = encodeURIComponent(sqlQueryString);
        const link = document.createElement("a");
        link.setAttribute("href", "data:text/plain;charset=utf-8," + encodedSqlQueryString);
        link.setAttribute("download", "username-data.sql");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }   
    
    elements.submitButton.addEventListener("click", (event) => {
        event.preventDefault();
    
        const firstName = elements.firstNameInput.value.trim().toLowerCase();
        const lastName = elements.lastNameInput.value.trim().toLowerCase();
    
        const userName = generateUserName(firstName, lastName);
        addTableData(firstName, lastName, userName);

        elements.firstNameInput.value = "";
        elements.lastNameInput.value = "";

        usercount++;
    
        const deleteButtons = document.querySelectorAll(".deleteButton");
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener("click", removeTableRow);
        });
    });

    elements.generateListButton.addEventListener("click", (event) => {
        event.preventDefault();
        createCsvFile();
    })

    elements.generateSqlButton.addEventListener("click", (event) => {
        event.preventDefault();
        createSqlScript();
    })
})