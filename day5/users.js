
const loadButton = document.getElementById("load-users");
const filterInput = document.getElementById("filter-input");
const statusParagraph = document.getElementById("status");
const usersList = document.getElementById("users-list");

// Our own users, stored locally in JavaScript
const users = [
    {
        name: "Charles Keya",
        email: "charlesmosoti@gmail.com",
        address: { city: "Nairobi" },
        company: { name: "Keya Digital Solutions" }
    },
    {
        name: "Mary Wanjiku",
        email: "mary@gmail.com",
        address: { city: "Mombasa" },
        company: { name: "Coastal Creatives" }
    },
    {
        name: "Brian Otieno",
        email: "brianothis@gmail.com",
        address: { city: "Kisumu" },
        company: { name: "Lakeview Technologies" }
    },
    {
        name: "Grace Achieng",
        email: "gracehope@gmail.com",
        address: { city: "Nakuru" },
        company: { name: "Green Valley Enterprises" }
    },
    {
        name: "David Mwangi",
        email: "davidolo@gmail.com",
        address: { city: "Eldoret" },
        company: { name: "Highlands Software" }
    },

    {
        name: "john harry",
        email:" harryjic@gmail.com",
        address: { city: "Lamu"},
        company: { name: "Kilimani springs"}
    

    }
];

let usersLoaded = false;

// Display a list of users
function renderUsers(list) {
    usersList.replaceChildren();

    list.forEach((user) => {
        const listItem = document.createElement("li");
        const name = document.createElement("h3");
        const email = document.createElement("p");
        const city = document.createElement("p");
        const company = document.createElement("p");

        name.textContent = user.name;
        email.textContent = `Email: ${user.email}`;
        city.textContent = `City: ${user.address.city}`;
        company.textContent = `Company: ${user.company.name}`;

        listItem.append(name, email, city, company);
        usersList.appendChild(listItem);
    });
}

// Load our local users
function loadUsers() {
    loadButton.disabled = true;
    statusParagraph.textContent = "Loading users...";

    // Display the local array
    renderUsers(users);
    usersLoaded = true;

    statusParagraph.textContent =
        `Successfully loaded ${users.length} users.`;

    loadButton.disabled = false;
}

// Filter users by name
filterInput.addEventListener("input", () => {
    if (!usersLoaded) {
        statusParagraph.textContent =
            "Click Load Users to display users first.";
        return;
    }

    const searchText = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText)
    );

    renderUsers(filteredUsers);

    if (filteredUsers.length === 0) {
        statusParagraph.textContent = "No users match your filter.";
    } else {
        statusParagraph.textContent =
            `Showing ${filteredUsers.length} of ${users.length} users.`;
    }
});

// Handle the button click
loadButton.addEventListener("click", loadUsers);



const addUserForm = document.getElementById("add-user-form");

addUserForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newUser = {
        name: document.getElementById("user-name").value.trim(),
        email: document.getElementById("user-email").value.trim(),
        address: {
            city: document.getElementById("user-city").value.trim()
        },
        company: {
            name: document.getElementById("user-company").value.trim()
        }
    };

    users.push(newUser);
    usersLoaded = true;

    // Keep the current search filter applied.
    const searchText = filterInput.value.trim().toLowerCase();

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchText)
    );

    renderUsers(filteredUsers);

    statusParagraph.textContent =
        `${newUser.name} was added successfully.`;

    addUserForm.reset();
});
