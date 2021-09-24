let employees = [];
let employeesFiltered = [];
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
    checkboxInput.className = 'role-filter';
    checkboxInput.name = 'filter-by-role';
    checkboxInput.type = 'checkbox';
    checkboxInputLabel.insertBefore(checkboxInput, checkboxInputLabel.firstChild);
    filterByRolesContainer.appendChild(checkboxInputLabel);
  });
}

function filterEmployees() {
  const { sortedBy, rolesSelected } = filters;

  switch (sortedBy) {
    case 'nameAsc':
      employeesFiltered = employees.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      break;
    case 'nameDesc':
      employeesFiltered = employees.sort((a, b) => {
        if (a.name < b.name) return 1;
        if (a.name > b.name) return -1;
        return 0;
      });
      break;
    case 'salaryAsc':
      employeesFiltered = employees.sort((a, b) => a.salary - b.salary);
      break;
    case 'salaryDesc':
      employeesFiltered = employees.sort((a, b) => b.salary - a.salary);
      break;
    default:
      break;
  }

  if (rolesSelected.length > 0) {
    employeesFiltered = employees.filter(({ role }) => rolesSelected.includes(role));
  }
}

function populateTable() {
  const tableLength = document.querySelector('.table-length');
  tableLength.innerHTML = employeesFiltered.length;

  employeesFiltered.forEach(({
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

function addListeners() {
  const sortFilter = document.querySelector('.sort-filter');
  const roleFilters = document.querySelectorAll('.role-filter');

  function removeTable() {
    const tableBody = document.querySelector('.table-body');
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.lastChild);
    }
  }

  sortFilter.addEventListener('change', ({ target }) => {
    filters.sortedBy = target.value;
    removeTable();
    filterEmployees();
    populateTable();
  });

  roleFilters.forEach((roleFilter) => roleFilter.addEventListener('click', ({ target }) => {
    if (target.checked) filters.rolesSelected.push(target.value);
    if (!target.checked) {
      filters.rolesSelected = filters.rolesSelected.filter(
        (role) => target.value !== role,
      );
    }
    removeTable();
    filterEmployees();
    populateTable();
  }));
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
  filterEmployees();
  populateTable();
  addListeners();
}

getDatabase();
