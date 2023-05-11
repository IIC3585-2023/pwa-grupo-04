// https://github.com/alamshertiwana/to-do-list-pwa/blob/master/index.html
const DB_VERSION = 1;
var request = indexedDB.open("TodoList", DB_VERSION);
var db;

window.addEventListener("load", async (e) => {
  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker.register("./serviceWorker.js");
      console.log("SW registered");
    } catch (error) {
      console.log("SW failed");
    }
  }
});

request.onupgradeneeded = function (versionChangeEvent) {
  // The database did not previously exist, so create object stores and indexes.
  if (versionChangeEvent.oldVersion < 1) {
    var db = request.result;
    db.createObjectStore("tasks", {
      keyPath: "id",
      autoIncrement: true,
      // complete: false,
    });
  }
};

request.onsuccess = function () {
  db = request.result;
  printAllTasks("all"); // función de tasks.js, asumo que siempre parte en all el tab entonces lo harcodeo
};

function printAllTasks(tabName) {
  var objectStore = db.transaction("tasks").objectStore("tasks"); //objectstore variable for database
  const dataRequest = objectStore.getAll();
  dataRequest.onsuccess = function (event) {
    let tasks = event.target.result;
    // Añadido x mi
    if (tabName === "completed") {
      tasks = tasks.filter((task) => task["isCompleted"]);
    } else if (tabName === "uncompleted") {
      tasks = tasks.filter((task) => !task["isCompleted"]);
    }
    // Cierre añadido x mi
    if (tabName === "star") {
      tasks = tasks.filter((task) => task["isStarred"]);
    } else if (tabName === "unstar") {
      tasks = tasks.filter((task) => !task["isStarred"]);
    }
    let list = document.getElementById("tasks-list");
    list.innerHTML = ""; //clear actual data
    tasks.forEach((task) => {
      list.innerHTML += htmlTask(
        task["id"],
        task["name-task"],
        task["tags-task"],
        task["isCompleted"],  // Añadido x mi
        task["isStarred"]
      );
    });
  };
}

const getActiveTabName = () => {
  const tabsDiv = document.querySelector(".tabs");
  const tabButtons = tabsDiv.querySelectorAll("button");
  let selectedTab;
  tabButtons.forEach((button) => {
    button.classList.contains("active")
      ? (selectedTab = button.id.split("-").pop())
      : null;
  });
  return selectedTab;
};

function addTask(form) {
  const formObj = convertTaskForm(form);
  if (verifyTaskForm(formObj)) {
    request = indexedDB.open("TodoList", DB_VERSION);
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
        formObj["id"] = event.target.result;
        addHtmlTask(formObj);
      };
    };
  }
}

const toggleStarTask = (htmlStar, taskId) => {
  const objectStore = db
    .transaction(["tasks"], "readwrite")
    .objectStore("tasks");

  const dataRequest = objectStore.get(taskId);

  dataRequest.onsuccess = () => {
    const task = dataRequest.result;
    // Change the name property
    task.isStarred = !task.isStarred;
    // Create a request to update
    const updateRequest = objectStore.put(task);

    updateRequest.onsuccess = () => {
      const selectedTab = getActiveTabName();
      if (selectedTab === "star" || selectedTab === "unstar") {
        document.getElementById(`task-${taskId}`).remove();
        return;
      }
      htmlStar.classList.toggle("task-star-checked");
    };
  };
};

const toggleActiveStarTab = (htmlTabElement) => {
  if (htmlTabElement.classList.contains("active")) return;
  const tabsDiv = document.querySelector(".tabs");
  const tabButtons = tabsDiv.querySelectorAll("button");
  htmlTabElement.classList.add("active");
  tabButtons.forEach((button) => {
    if (button !== htmlTabElement) {
      button.classList.remove("active");
    }
  });
  printAllTasks(htmlTabElement.id.split("-").pop());
};

// Añadido x mi

const toggleActiveCompleted = (htmlTabElement) => {
  if (htmlTabElement.classList.contains("active")) return;
  const tabsDiv = document.querySelector(".tabs");
  const tabButtons = tabsDiv.querySelectorAll("button");
  htmlTabElement.classList.add("active");
  tabButtons.forEach((button) => {
    if (button !== htmlTabElement) {
      button.classList.remove("active");
    }
  });
  printAllTasks(htmlTabElement.id.split("-").pop());
};

const toggleCompletedTask = (htmlCompleted, taskId) => {
  const objectStore = db
    .transaction(["tasks"], "readwrite")
    .objectStore("tasks");

  const dataRequest = objectStore.get(taskId);

  dataRequest.onsuccess = () => {
    const task = dataRequest.result;
    // Change the name property
    task.isCompleted = !task.isCompleted;
    // Create a request to update
    const updateRequest = objectStore.put(task);

    updateRequest.onsuccess = () => {
      const selectedTab = getActiveTabName();
      if (selectedTab === "completed" || selectedTab === "uncompleted") {
        document.getElementById(`task-${taskId}`).remove();
        return;
      }
      htmlCompleted.classList.toggle("task-completed-checked");
    };
  };
};