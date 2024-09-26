
import fs, { readFile } from 'fs';
import Task from '../models/task.js';
import crypto from 'crypto';

let tasksPath = './database/tasks.json';
let historyPath = './database/history.json';
let favouritesPath = './database/favouries.json';

let fileType = {
    tasks: "tasks",
    history: "history",
    favourites: "favourites",
}

const readTaskFile = (type = fileType.tasks) => {
    let filePath = null;
    switch (type) {
        case fileType.tasks:
            filePath = tasksPath;
            break;
        case fileType.history:
            filePath = historyPath;
            break;
        case fileType.favourites:
            filePath = favouritesPath;
            break;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));

}

const writeTaskFile = (taskJSON, type = fileType.tasks) => {
    let filePath = null;
    console.log(type);
    switch (type) {
        case fileType.tasks:
            filePath = tasksPath;
            break;
        case fileType.history:
            filePath = historyPath;
            break;
        case fileType.favourites:
            filePath = favouritesPath;
            break;
    }
    console.log(filePath);
    return fs.writeFileSync(filePath, JSON.stringify(taskJSON));
}
const getTaskHistory = () => {
    let histroy = [];
    try {
        readTaskFile(fileType.history);
    }
    catch {
        writeTaskFile(fileType.history, history);
    }
}

const fixTasks = () => {
    const tasks = readTaskFile();
    tasks.forEach((task, index) => {
        task.id = crypto.randomUUID();
        task.completed = false;
        task.sequence = index;
    });
    writeTaskFile(tasks);
}


export default {
    loadTasker: async (req, res) => {
        //fixTasks();
        let tasks = [];
        let history = [];
        try {
            tasks = readTaskFile();
        }
        catch {
            writeTaskFile(tasks);
        }
        try {
            history = readTaskFile(fileType.history);
        }
        catch {
            writeTaskFile(history, fileType.history);
        }
        res.render("index.ejs", { tasks: tasks, history: history });
    },
    addTask: (req, res) => {
        let newTask = new Task();
        const uuid = crypto.randomUUID();
        newTask.id = uuid;
        newTask.task = req.body.taskName;
        newTask.completed = false;

        let tasks = [];
        tasks = readTaskFile();
        newTask.sequence = tasks.length;
        tasks.push(newTask);
        tasks.sort((a, b) => a.sequence - b.sequence);
        writeTaskFile(tasks);
        res.redirect("/");
    },
    deleteTask: (req, res) => {
        let taskIDToDelete = req.body.taskID;
        let tasks = readTaskFile();
        let taskIndexToSplice = tasks.findIndex(task => task.id == taskIDToDelete);
        tasks.splice(taskIndexToSplice, 1);
        tasks.sort((a, b) => a.sequence - b.sequence);
        writeTaskFile(tasks);
        res.redirect("/")
    },
    updateTask: (req, res) => {
        console.log(req.body);
        let taskIDToComplete = req.body.taskID;
        let completed = req.body.completed;
        let tasks = readTaskFile();
        let taskToComplete = tasks.find(task => task.id === taskIDToComplete);
        taskToComplete.completed = completed ? true : false;
        tasks.sort((a, b) => a.sequence - b.sequence);
        writeTaskFile(tasks);
        res.redirect("/")
    },
    moveTask: (req, res) => {
        let taskIDToMoveUp = req.body.taskID;
        let taskDirection = req.body.taskDirection;
        console.log(req.body);
        let tasks = readTaskFile();
        let taskIndexToMove = tasks.findIndex(task => task.id === taskIDToMoveUp);
        if (taskDirection === "0") {
            if (tasks[taskIndexToMove].sequence > 0) {
                console.log(tasks[taskIndexToMove].task)
                tasks[taskIndexToMove].sequence = tasks[taskIndexToMove].sequence - 1;
                console.log(tasks[taskIndexToMove].task)
                console.log(tasks[taskIndexToMove - 1].task)
                tasks[taskIndexToMove - 1].sequence = tasks[taskIndexToMove - 1].sequence + 1;
                console.log(tasks[taskIndexToMove - 1].task)
            }
        }
        else {
            if (tasks[taskIndexToMove].sequence < tasks.length - 1) {
                tasks[taskIndexToMove].sequence = tasks[taskIndexToMove].sequence + 1;
                tasks[taskIndexToMove + 1].sequence = tasks[taskIndexToMove + 1].sequence - 1;
            }
        }
        console.log(tasks);
        tasks.sort((a, b) => a.sequence - b.sequence);
        writeTaskFile(tasks);
        res.redirect("/")
    },
    archiveTask: (req, res) => {
        let taskIDToArchive = req.body.taskID;
        let tasks = readTaskFile();
        let taskToArchive = tasks.find(task => task.id == taskIDToArchive);
        let taskIndexToSplice = tasks.findIndex(task => task.id == taskIDToArchive);
        let history = readTaskFile(fileType.history);
        history.push(taskToArchive);
        writeTaskFile(history, fileType.history);
        tasks.splice(taskIndexToSplice, 1);
        writeTaskFile(tasks);
        res.redirect("/");
    }
}