const baseURL = "http://localhost:3000";

$(document).ready(function () {
  document.querySelector(".signup_form").style.display = "none";
  document.querySelector(".login_form").style.display = "none";
  document.querySelector("#table_id").style.display = "none";
  document.querySelector("#logout").style.display = "none";

  const token = localStorage.getItem("token");
  if (token) {
    document.querySelector("#logout").style.display = "block";
    loadData();
  } else {
    document.querySelector(".login_form").style.display = "flex";
  }
});

function loadData() {
  $(document).ready(function () {
    document.querySelector(".login_form").style.display = "none";
    document.querySelector("#table_id").style.display = "table";
    let table = $("#table_id").DataTable({
      bDestroy: true,
      ajax: `${baseURL}/service/get`,
      columnDefs: [
        {
          targets: -1,
          data: null,
          defaultContent:
            "<button id='edit_row' class='btn btn-primary'>Edit</button> <button id='delete_row' class='btn btn-danger'>Delete</button>",
        },
      ],
    });

    $("#table_id tbody").on("click", "button#edit_row", function () {
      var data = table.row($(this).parents("tr")).data();
      onEdit(data);
    });

    $("#table_id tbody").on("click", "button#delete_row", function () {
      var data = table.row($(this).parents("tr")).data();
      onDelete(data);
    });
  });
}

function onEdit(data) {
  const [id, name, phone, email] = data;
  $("#modal_name").val(name);
  $("#modal_phone").val(phone);
  $("#modal_email").val(email);

  $("#myModal").modal("show");
}

function onDelete(data) {
  const [id] = data;
  const input = confirm("Are you sure?");
  if (input) {
    $.post(`${baseURL}/actions/delete/${id}`, function (data, status) {
      console.log(data, "deleted");
    });
  }
}

function onLogin() {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  if (username === "") {
    return alert("Please enter username");
  }

  if (password === "") {
    return alert("Please enter password");
  }

  $.get(`${baseURL}/action/login`, function (data, status) {
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      document.querySelector(".login_form").style.display = "none";
      document.querySelector("#table_id").style.display = "table";
      document.querySelector("#logout").style.display = "block";
      loadData();
    }
  });
}

function openSignForm() {
  document.querySelector(".login_form").style.display = "none";
  document.querySelector(".signup_form").style.display = "flex";
}

function onSubmitData() {
  const name = $("#name").val();
  const phone = $("#phone").val();
  const email = $("#email").val();
  const _passwword = $("#_passwword").val();

  if (name === "") {
    return alert("Please enter name");
  }

  if (phone === "") {
    return alert("Please enter phone");
  }

  if (email === "") {
    return alert("Please enter email");
  }

  if (_passwword === "") {
    return alert("Please enter password");
  }

  $.post(`${baseURL}/action/signup`, function (data, status) {
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      document.querySelector(".signup_form").style.display = "none";
      document.querySelector("#table_id").style.display = "table";
      document.querySelector("#logout").style.display = "block";
      loadData();
    }
  });
}

function onLogout() {
  localStorage.removeItem("token");
  location.reload();
}

function saveEditData() {
  $("#myModal").modal("hide");
}
