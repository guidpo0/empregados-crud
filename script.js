let employees = [];
let roles = [];
const filters = {
  sortedBy: 'nameAsc',
  rolesSelected: [],
};

function populateFilterByRoles() {
  roles.forEach(({ name }) => {
    const filterByRolesContainer = document.querySelector('.filter-by-roles-container');
    const checkboxInputLabel = document.createElement('label');
    const checkboxInput = document.createElement('input');
    checkboxInputLabel.textContent = name;
    checkboxInput.value = name;
    checkboxInput.name = 'filter-by-role';
    checkboxInput.type = 'checkbox';
    checkboxInputLabel.insertBefore(checkboxInput, checkboxInputLabel.firstChild);
    filterByRolesContainer.appendChild(checkboxInputLabel);
  });
}

function populateTable() {
  employees.forEach(({
    id, name, role, salary,
  }) => {
    const tableBody = document.querySelector('.table-body');
    const newRow = document.createElement('tr');
    const idTd = document.createElement('td');
    const nameTd = document.createElement('td');
    const roleTd = document.createElement('td');
    const salaryTd = document.createElement('td');
    idTd.innerText = id;
    nameTd.innerText = name;
    roleTd.innerText = role;
    salaryTd.innerText = salary;
    newRow.appendChild(idTd);
    newRow.appendChild(nameTd);
    newRow.appendChild(roleTd);
    newRow.appendChild(salaryTd);
    tableBody.appendChild(newRow);
  });
}

async function getDatabase() {
  const getEmployees = () => fetch('http://localhost:3000/employees').then(
    (response) => response.json(),
  ).then(
    (response) => { employees = response; },
  );

  const getRoles = () => fetch('http://localhost:3000/roles').then(
    (response) => response.json(),
  ).then(
    (response) => { roles = response; },
  );

  await getEmployees();
  await getRoles();

  employees = employees.map(({
    id, name, salary, role_id: roleId,
  }) => ({
    id,
    name,
    salary,
    role: roles.find((role) => role.id === roleId).name,
  }));

  populateFilterByRoles();
  populateTable();
}

getDatabase();
