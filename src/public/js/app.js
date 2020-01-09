$(document).ready(() => {

    var taskList = [];

    function createTask(i, d, p, c) {
        var task = {
            id: i,
            description: d,
            priority: p,
            status: c
        }
        return task;
    }

    $(window).on('load', () => {
        axios.get('http://localhost:5000/api/tasks', {
        }).then(res => {
            res.data.result.forEach(task => {
                let newTask = createTask(task.id, task.description,
                    task.priority, task.complete);
                writeTask(task);
                taskList.push(newTask);
            });
        }).catch(err => {
            console.log(err);
        })
    });

    /*
        Create and add task
    */
    function addTask() {
        axios.post('http://localhost:5000/api/tasks', {
            description: $('#ipt-taskname').val(),
            priority: $('#priorityButtons input[name="priority"]:checked').val(),
            status: 0
        }).then(res => {
            var newTask = createTask(res.data.newTask.id, res.data.newTask.description,
                res.data.newTask.priority, res.data.newTask.complete);
            writeTask(newTask);
            taskList.push(newTask);
            console.log(taskList);
        }).catch(err => {
            console.log(err);
        });
    }

    /*
        Requests all tasks for user on login
    */
    function getTasks() {
        axios.get('/', {
            timeout: 5000,
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    /*
        Update a task description
    */
    function editTaskDescription(task) {
        const id = task.parent().parent().attr('id');
        const descript = task.parent().prev().text();
        axios.put('http://localhost:5000/api/tasks/' + id, {
            description: descript
        }).then(res => {
            console.log('Edit Saved');
        }).catch(err => console.error(err));
    }
    /*
        Update a task status (incomplete/complete)
    */
    function editTaskStatus(checkbox) {
        const id = checkbox.parent().attr('id');
        var stat = '0';
        if (checkbox.is(":checked")) {
            stat = '1';
        }
        axios.put('http://localhost:5000/api/tasks/' + id, {
            status: stat
        }).then(res => {
            console.log(res);
        }).catch(err => console.error(err));
    }

    /*
        Delete Task
    */
    function deleteTask(task) {
        const id = task.attr('id');
        axios.delete('http://localhost:5000/api/tasks/' + id, {

        }).then(res => {
            const found = taskList.some(task2 => task2.id === id);
            if (found) {
                taskList = taskList.filter(task2 => task2.id !== id);
                task.remove();
            }
        }).catch(err => console.error(err));
    }

    /*
        Delete all completed tasks
    */
    function deleteAllCompleteTasks() {
        axios.delete('http://localhost:5000/api/tasks', {

        }).then(res => {
            $('li').each(function (i) {
                if ($(this).hasClass('complete')) {
                    $(this).remove();
                }
            });
        }).catch(err => console.error(err));

    }

    /*
        Appends task to list
    */
    function writeTask(task) {

        let id = task.id;
        let description = task.description;
        let priority = task.priority;
        let status = task.status;
        console.log(status);
        if (status == 1) {
            status = 'complete';
        } else {
            status = 'incomplete';
        }

        if (priority === undefined) {
            alert('No priority selected! Please select a priority.');
        } else {
            $('#ul-tasks').append('<li id = "' + id + '" class= "' + status + '">' +
                '<input class="checkbox" type="checkbox">' +
                '<label class="taskName ' + priority + '">' + description + '</label>' +
                '<div class="itemButtons">' +
                '<button class="btn-edit-task"">Edit</button>' +
                '<button class="btn-delete-task">Delete</button>' +
                '</div>' +
                '</li>');
            console.log('Task Added');
        }

        if ($('#' + id).hasClass('complete')) {
            $('#' + id).children()[1].style.textDecoration = 'line-through';
            $('#' + id).children()[0].checked = true;
        }
    }

    // Event handlers 
    /*
        When the add button is clicked, addTask method is called.
    */
    $('#btn-addtask').click(function () {
        addTask();
    });

    /*
        Enter Button feature for inputting a task.
        Clicks add button when enter key is pressed
        inside the task name input box.
    */
    $('#ipt-taskname').on('keyup', function (e) {
        var key = e.which;
        if (key === 13) {
            e.preventDefault();
            $('#btn-addtask').click();
        }
    });

    /*
        When checkbox is checked
    */
    $(document).on('change', ':checkbox', function (e) {
        if ($(e.target).is(':checked')) {
            $(e.target).next('label').css('textDecoration', 'line-through');
            $(e.target).parent().removeClass('incomplete');
            $(e.target).parent().addClass('complete');
            console.log('Task Complete');
            editTaskStatus($(this));
        } else {
            $(e.target).next('label').css('textDecoration', 'none');
            $(e.target).parent().removeClass('complete');
            $(e.target).parent().addClass('incomplete');
            console.log('Task Incomplete');
            editTaskStatus($(this));
        }
    });

    /*
        Calls delete method when delete button is clicked
    */
    $(document).on('click', '.btn-delete-task', function () {
        deleteTask($(this).parents('li'));
    });

    /*
        Allows taskName to be editted when Edit Button is clicked.
        Edits are saved by clicking the enter button when label is in focus
        or by clicking the save button.
    */
    $(document).on('click', '.btn-edit-task', function () {
        var taskName = $(this).parent().prev();

        this.innerText = 'Edit';
        if ($(taskName).attr('contentEditable')) {
            $(taskName).removeAttr('contentEditable');
            editTaskDescription($(this));
            //console.log('Edit Saved');
        } else {
            $(taskName).attr('contentEditable', 'true');
            $(taskName).focus();
            console.log('Edit Task');
            this.innerText = 'Save';
        }
    });

    $(document).on('keydown', '.taskName', function (e) {
        var key = e.which;
        var taskName = $(this);
        var editButton = taskName.next().children().first();
        if (key === 13) {
            e.preventDefault();
            editButton.click();
        }
    });

    $('#btn-delete-completed-tasks').click(function () {
        deleteAllCompleteTasks();
    });
});