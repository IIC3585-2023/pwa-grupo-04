function selectAllTasks() {
  const selectAll = document.getElementById("select-all");
  const tasksList = document.getElementById("tasks-list").children;
  if (selectAll.checked) {
    for (let i = 0; i < tasksList.length; i++) {
      tasksList[i].children[0].checked = true;
    }
  } else {
    for (let i = 0; i < tasksList.length; i++) {
      tasksList[i].children[0].checked = false;
    }
  }
}

function deleteSelectedTasks() {
  const tasksList = document.getElementById("tasks-list").children;
  // remove from the end to the beginning
  for (let i = tasksList.length - 1; i >= 0; i--) {
    if (tasksList[i].children[0].checked) {
      let idTask = tasksList[i].id.split("-")[1];
      deleteTaskIndexedDB(idTask);
      tasksList[i].remove();
    }
  }
}

function deleteTaskIndexedDB(idTask) {
  var request = indexedDB.open("TodoList", 5);
  request.onsuccess = function (event) {
    var db = event.target.result;
    var transaction = db.transaction(["tasks"], "readwrite");
    var objectStore = transaction.objectStore("tasks");
    var request = objectStore.delete(parseInt(idTask));
    request.onsuccess = function (event) {
      console.log("Task deleted");
    };
  };
}
