var idTasks = 0;

// https://github.com/alamshertiwana/to-do-list-pwa/blob/master/index.html
var request = indexedDB.open("TodoList", 5);
var db;

request.onupgradeneeded = function () {
  // The database did not previously exist, so create object stores and indexes.
  var db = request.result;
  const store = db.createObjectStore("tasks", {
    keyPath: "id",
    autoIncrement: true,
  });
};

request.onsuccess = function () {
  db = request.result;
  printData();
};

function printData() {
  var objectStore = db.transaction("tasks").objectStore("tasks"); //objectstore variable for database

  objectStore.openCursor().onsuccess = (event) => {
    var cursor = event.target.result;

    if (cursor) {
      updateIdTasks(cursor.value.id);

      let list = document.getElementById("tasks-list");
      list.innerHTML += `
        <div class="row-task" id="task-${cursor.value.id}">
          <input class="grid-size" type="checkbox" />
          <span class="name-task grid-size">${cursor.value["name-task"]}</span>
          <div class="tags-container grid-size">
            ${cursor.value["tags-task"]
              .map((tag) => `<span class="tag-task">${tag}</span>`)
              .join("")}
          </div>
        </div>`;
      cursor.continue();
    } else {
      console.log("No more entries!");
    }
  };
}

const updateIdTasks = (taskValue) => {
  if (taskValue > idTasks) {
    idTasks = taskValue;
  }
};

const verifyForm = (formObj) => {
  if (formObj["name-task"] == "" || formObj["tags-task"] == "") {
    return false;
  }
  return true;
};

function addTask(form) {
  let data = new FormData(form);
  let formObj = Object.fromEntries(data);

  formObj["tags-task"] = formObj["tags-task"].split(",");

  if (verifyForm(formObj)) {
    let htmlRow = `
        <div class="row-task" id="task-${idTasks + 1}">
          <input class="grid-size" type="checkbox" />
          <span class="name-task grid-size">${formObj["name-task"]}</span>
          <div class="tags-container grid-size">
            ${formObj["tags-task"]
              .map((tag) => `<span class="tag-task">${tag}</span>`)
              .join("")}
          </div>
        </div>`;

    document.getElementById("tasks-list").innerHTML += htmlRow;
    updateIndexDB(formObj);
  }
}

function updateIndexDB(formObj) {
  request = indexedDB.open("TodoList", 5);
  request.onerror = function (event) {
    console.log("Error opening database");
  };
  request.onsuccess = function () {
    // db = request.result;
    var transaction = db.transaction(["tasks"], "readwrite");
    var objectStore = transaction.objectStore("tasks");
    var request = objectStore.add(formObj);
    request.onsuccess = function (event) {
      console.log("Task added to the database");
    };
  };
}
