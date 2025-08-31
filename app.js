const validLanguages = ["es", "en"];
const translations = {
  en: {
    introText: "This is your task for today!",
    newTask: "Give me a new task!",
  },
  es: {
    introText: "Ésta es tu tarea del día!",
    newTask: "Dame una nueva tarea!",
  },
};

const getBrowserLanguage = () => {
  const langCode = navigator.language.substring(0, 2);
  return validLanguages.includes(langCode) ? langCode : "en";
};

document.addEventListener("DOMContentLoaded", () => {
  const enButton = document.getElementById("set_en");
  const esButton = document.getElementById("set_es");
  const taskDiv = document.getElementById("current_task");
  const introDiv = document.getElementById("intro_text");
  const newTaskButton = document.getElementById("new_task");

  let lastTaskDate = null;
  const loadStoredDate = () => {
    const storedDate = localStorage.getItem("lastTaskDate");
    if (storedDate) {
      const [year, month, date] = storedDate.split("-");
      lastTaskDate = new Date(year, month - 1, date);
    }
  };
  loadStoredDate();

  let currentLang = getBrowserLanguage();
  let currentTask = null;

  // language
  const getCurrentLanguage = () => {
    currentLang = localStorage.getItem("lang") || getBrowserLanguage();
    updateCopy();
  };
  const updateCopy = () => {
    const t = translations[currentLang];
    introDiv.innerText = t.introText;
    newTaskButton.innerText = t.newTask;
  };

  const setLanguage = (lang) => {
    lang = validLanguages.includes(lang) ? lang : "en";
    document.querySelector("html").lang = navigator.language;
    localStorage.setItem("lang", lang);
    currentLang = lang;
    updateCopy();
    setTaskText(currentTask);
  };

  getCurrentLanguage();

  enButton.addEventListener("click", () => setLanguage("en"));
  esButton.addEventListener("click", () => setLanguage("es"));

  // show task
  const getRandomTask = () => {
    const randomId = Math.ceil(Math.random() * totalTasks);
    return tasks[randomId];
  };

  const setTaskText = (task) => {
    currentTask = task;
    taskDiv.innerText = task[`text_${currentLang}`];
  };

  const setRandomTask = () => {
    const randomTask = getRandomTask();
    localStorage.setItem("currentTaskId", randomTask.id);
    localStorage.setItem(
      "lastTaskDate",
      new Date().toISOString().split("T")[0]
    );
    setTaskText(randomTask);
    return randomTask;
  };

  const getTask = (id) => tasks[id];

  const loadCurrentTask = () => {
    const taskId = localStorage.getItem("currentTaskId");
    return taskId ? setTaskText(getTask(parseInt(taskId))) : setRandomTask();
  };

  const getCurrentTaskOrNew = () => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    if (lastTaskDate < today) {
      setRandomTask();
    } else {
      loadCurrentTask();
    }
  };

  getCurrentTaskOrNew();

  newTaskButton.addEventListener("click", () => setRandomTask());
});
