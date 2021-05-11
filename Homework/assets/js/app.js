let users = [];
let table = document.getElementById("user-list");
let searchInput = document.querySelector(".search-input");
let logOutBtn = document.querySelector(".log-out");

TotalMonthlyPay = (loans) => {
  return loans.reduce((total, loan) => {
    if (!loan.closed) {
      total += loan.perMonth.value;
    }
    return total;
  }, 0);
};

IsActiveLoan = (loans) => {
  let status = false;
  loans.forEach((loan) => {
    if (!loan.closed) {
      status = true;
      return;
    }
  });
  return status;
};

CreditPermit = (loans, salary) => {
  let total = TotalMonthlyPay(loans);
  salary = salary * 0.45;
  if (total == 0) {
    return true;
  } else if (total > salary) {
    return false;
  } else {
    return true;
  }
};

userList = (data) => {
  table.innerHTML = " ";
  data.forEach((user, index) => {
    let tr = document.createElement("tr");
    tr.className = "user";
    tr.innerHTML = `<th scope="row">${index + 1}</th>
                      <td><img src="${user.img}" class="w-50" alt=""></td>
                      <td class = "fullname">${
                        user.name + " " + user.surname
                      }</td>
                      <td>${user.salary.value + " " + user.salary.currency}</td>
                      <td>${TotalMonthlyPay(user.loans)}</td>
                      <td>${
                        CreditPermit(user.loans, user.salary.value)
                          ? '<span class="badge bg-success">Active</span></td>'
                          : '<span class="badge bg-danger">Deactive</span></td>'
                      }
                      
                      <td class="is-active">${
                        !IsActiveLoan(user.loans)
                          ? '<span class="badge bg-danger">Deactive</span>'
                          : '<span class="badge bg-success">Active</span>'
                      }
                      </td>`;

    let moreBtn = document.createElement("button");
    moreBtn.className = "btn btn-primary w-100";
    moreBtn.innerHTML = "More detail";
    moreBtn.setAttribute("data-bs-toggle", "modal");
    moreBtn.setAttribute("data-bs-target", "#userModal");

    moreBtn.addEventListener("click", () => {
      userLoanList(index);
    });

    let td = document.createElement("td");
    td.append(moreBtn);
    tr.append(td);
    table.append(tr);
  });
};

function userLoanList(userIndex) {
  let loansTable = document.getElementById("loan-list");
  loansTable.innerHTML = " ";
  users[userIndex].loans.forEach((loan, index) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `<tr>
                            <th scope="row">${index + 1}</th>
                            <td>${loan.loaner}</td>
                            <td>${
                              loan.amount.value + " " + loan.amount.currency
                            }</td>
                            <td>${
                              loan.closed
                                ? '<span class="badge bg-danger">Deactive</span>'
                                : '<span class="badge bg-success">Active</span>'
                            }</td>
                            <td>${
                              loan.closed
                                ? "0"
                                : loan.perMonth.value +
                                  " " +
                                  loan.perMonth.currency
                            } </td>
                            <td>${
                              loan.dueAmount.value +
                              " " +
                              loan.dueAmount.currency
                            }</td>
                            <td>${loan.loanPeriod.start}</td>
                            <td>${loan.loanPeriod.end}</td>
                        </tr>`;
    loansTable.append(tr);
  });
}

function Search(data) {
  let value = searchInput.value.toLowerCase();
  data = data.filter((user) =>
    (user.name.toLowerCase() + " " + user.surname.toLowerCase()).includes(value)
  );
  userList(data);
}

let urlData = "./assets/data/db.json";
let userInfo = "https://randomuser.me/api/";

async function getJson(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

async function getUserInfo(url) {
  let response = await fetch(url);
  let data = await response.results.json();
  return data;
}

async function main() {
  users = await getJson(urlData);
  let loginUserInfo = await getJson(userInfo);

  if (table) {
    if (!userAuthentication()) {
      window.location.replace("/login.html");
    } else if (sessionStorage.getItem("user") == null) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          email: `${loginUserInfo.results[0].email}`,
          fullname: `${
            loginUserInfo.results[0].name.first +
            "  " +
            loginUserInfo.results[0].name.last
          }`,
          country: `${loginUserInfo.results[0].location.country}`,
          image: `${loginUserInfo.results[0].picture.thumbnail}`,
          timezome: `${loginUserInfo.results[0].location.timezone.description}`,
        })
      );
    }

    userList(users);

    let user = document.querySelector(".user .user-name");
    let userImg = document.querySelector(".user .user-img");
    user.innerText = JSON.parse(sessionStorage.getItem("user")).fullname;
    userImg.src = JSON.parse(sessionStorage.getItem("user")).image;

    let checkBox = document.querySelector(".active-loan");
    let isActive = document.querySelectorAll(".is-active");
    checkBox.addEventListener("click", () => {
      isActive.forEach((e) => {
        let span = e.querySelector("span");
        if (!e.parentNode.classList.contains("active")) {
          if (span.innerText == "Active") {
            e.parentNode.style.display = "";
          } else {
            e.parentNode.style.display = "none";
          }
          e.parentNode.classList.add("active");
        } else {
          e.parentNode.classList.remove("active");
          e.parentNode.style.display = "";
        }
      });
    });

    searchInput.addEventListener("keyup", () => Search(users));
  }

  if (logOutBtn) {
    // Log-out
    logOutBtn.addEventListener("click", () => {
      let date = new Date();
      date.setDate(date.getDate() - 1);
      document.cookie = `token=; expires=${date}`;
    });
  }

  if (JSON.parse(localStorage.getItem("Lang")) != null) {
    changeLang(JSON.parse(localStorage.getItem("Lang")).lang);
    themeChange();
  }
}

// Login
const account = {
  email: "admin@admin",
  fullname: "Admin Admin",
  username: "Admin",
  password: "54321",
};

let loginForm = document.querySelector("#login .login");
let email = document.querySelector("#email");
let password = document.querySelector("#password");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      email.value.trim().toLowerCase() == account.email &&
      password.value.trim() == account.password
    ) {
      window.location.replace("/");
      
      localStorage.setItem(
        "Lang",
        JSON.stringify({
          lang: "AZ",
          theme: "dark",
        })
      );

      sessionStorage.removeItem("user");
      let date = new Date();
      date.setDate(date.getDate() + 1);
      document.cookie = `token=supersecuretoken11; expires=${date}`;
    } else {
      let span = document.querySelector(".login span");
      span.classList.remove("d-none");
    }
  });
  if (userAuthentication()) {
    window.location.replace("/");
  }
}

function userAuthentication() {
  if (document.cookie.indexOf("token") != -1) {
    return document.cookie.includes("token=supersecuretoken11");
  }
  return false;
}

// Language data
var langs = {
  EN: {
    UserList: {
      table_column_number: "№",
      table_column_image: "Image",
      table_column_fullname: "Fullname",
      table_column_salary: "Monthly Salary",
      table_column_total: "Total monthly pay",
      table_column_credit_permit: "Credit permit",
      table_column_active_loan: "Active loan",
    },
    ModalList: {
      table_column_number: "№",
      table_column_loaner: "Loaner",
      table_column_amount: "Amount",
      table_column_loan: "Loan",
      table_column_pay: "Monthly pay",
      table_column_due: "Due amount",
      table_column_start: "Start date",
      table_column_end: "End date",
    },
    logo_name: "Credit",
    modal_title: "User credit list",
    table_column_button: "More detail",
    logOut: "Log Out",
  },
  AZ: {
    UserList: {
      table_column_number: "№",
      table_column_image: "Şəkil",
      table_column_fullname: "Ad Soyad",
      table_column_salary: "Aylıq gəlir",
      table_column_total: "Aylıq ümumi ödəniş",
      table_column_credit_permit: "Kredit icazəsi",
      table_column_active_loan: "Aktiv borc",
    },
    ModalList: {
      table_column_number: "№",
      table_column_loaner: "Bank",
      table_column_amount: "Məbləğ",
      table_column_loan: "Borc",
      table_column_pay: "Aylıq ödəniş",
      table_column_due: "Qalıq Borc",
      table_column_start: "Başlanğıc tarix",
      table_column_end: "Son tarix",
    },
    logo_name: "Kredit",
    modal_title: "İstifadəçinin kredit listi",
    table_column_button: "Əlavə məlumatlar",
    logOut: "Çıxış",
  },
};

// Change Language
function changeLang(key) {
  let thUserList = document.querySelectorAll(".user-list-header th");

  let userList = langs[key.toString()].UserList;
  for (let i = 0; i < Object.values(userList).length; i++) {
    if (thUserList[i].className == "check") {
      thUserList[i].firstChild.innerText = Object.values(userList)[i];
    } else {
      thUserList[i].innerText = Object.values(userList)[i];
    }
  }

  let thModalList = document.querySelectorAll(".modal-list-header th");
  let modalList = langs[key.toString()].ModalList;
  if (thModalList.length > 0) {
    for (let i = 0; i < Object.values(modalList).length; i++) {
      thModalList[i].innerText = Object.values(modalList)[i];
    }
  }

  let moreBtn = document.querySelectorAll("td button");
  moreBtn.forEach((btn) => {
    btn.innerText = langs[key.toString()].table_column_button.toString();
  });

  let modelTitle = document.querySelector(".modal-title");
  modelTitle.innerText = langs[key.toString()].modal_title.toString();

  let logo = document.querySelector(".logo");
  logo.innerText = langs[key.toString()].logo_name.toString();
  logOutBtn.innerText = langs[key.toString()].logOut.toString();
}

let navbar = document.querySelector(".navbar");

if (navbar) {
  let langBtn = document.querySelectorAll(".lang");
  if (JSON.parse(localStorage.getItem("Lang")) != null) {
    langBtn.forEach((btn) => {
      if (
        btn.getAttribute("data-id") ==
        JSON.parse(localStorage.getItem("Lang")).lang
      ) {
        btn.classList.add("btn-success");
      } else {
        btn.classList.remove("btn-success");
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.setItem(
            "Lang",
            JSON.stringify({
              lang: btn.getAttribute("data-id").toString(),
              theme: JSON.parse(localStorage.getItem("Lang")).theme,
            })
          );
          window.location.replace("/");
        });
      }
    });
  }
}

// Theme
themeChange = () => {
  let themeBtn = document.querySelector(".theme-btn");
  let mainTable = document.querySelector(".main-table")
  if(JSON.parse(localStorage.getItem("Lang")).theme != "dark"){
    mainTable.classList.remove("table-dark")
    themeBtn.removeAttribute("checked");
  }else{
    mainTable.classList.add("table-dark")
  }

  themeBtn.addEventListener("click", () => {
    if (themeBtn.hasAttribute("checked")) {
      mainTable.classList.remove("table-dark")
      themeBtn.removeAttribute("checked");
      localStorage.setItem(
        "Lang",
        JSON.stringify({
          lang: JSON.parse(localStorage.getItem("Lang")).lang,
          theme: "light",
        })
      );
    } else {
      mainTable.classList.add("table-dark")
      themeBtn.setAttribute("checked", "");
      localStorage.setItem(
        "Lang",
        JSON.stringify({
          lang: JSON.parse(localStorage.getItem("Lang")).lang,
          theme: "dark",
        })
      );
    }
  });
};

main();
