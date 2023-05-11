const htmlTask = (id, name, tags, isCompleted, isStarred) => {
  return `<div class="row-task" id="task-${id}">
              <input class="grid-size" type="checkbox" />
              <span class="name-task grid-size">${name}</span>
              <div class="tags-container grid-size">
                  ${tags
                    .map((tag) => `<span class="tag-task">${tag}</span>`)
                    .join("")}
              </div>
              <div>
                  <span class="fa fa-check-circle task-completed ${
                      isCompleted ? "task-completed-checked" : null
                    }" onclick="toggleCompletedTask(this, ${id})"></span>
              </div>

              <div class="tags-container grid-size">
                  <span class="fa fa-star task-star ${
                    isStarred ? "task-star-checked" : null
                  }" onclick="toggleStarTask(this, ${id})"></span>
              </div>
              <div class="modal-container">
                <button id="button-config-tasks">
                  <img src="assets/dots.svg" alt="dots" class="icon-size" />
                </button>
                <div id="modal-delete">
                  <label>Delete selected Task?</label>
                  <button
                    class="button button-delete"
                    onclick="deleteSelectedTask(${id})"
                  >
                    Delete
                  </button>
                </div>
              </div>`;
};

const verifyTaskForm = (formObj) => {
  if (formObj["name-task"] == "" || formObj["tags-task"] == "") {
    return false;
  }
  return true;
};

const convertTaskForm = (form) => {
  let data = new FormData(form);
  let formObj = Object.fromEntries(data);

  formObj["tags-task"] = formObj["tags-task"].split(",");
  const selectedTab = getActiveTabName();
  formObj["isCompleted"] = false;
  if (selectedTab === "completed") {
    formObj["isCompleted"] = true;
  }
  formObj["isStarred"] = false;
  if (selectedTab === "star") {
    formObj["isStarred"] = true;
  }
  return formObj;
};

function addHtmlTask(formObj) {
  let htmlRow = htmlTask(
    formObj["id"],
    formObj["name-task"],
    formObj["tags-task"],
    formObj["isCompleted"],
    formObj["isStarred"]
  );
  document.getElementById("tasks-list").innerHTML += htmlRow;
}
