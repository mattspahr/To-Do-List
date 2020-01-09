const express = require('express');
const uuid = require('uuid');
const path = require('path');
const router = express.Router();
var db = require('../../config/db.js');

// Get all tasks for user
router.get('/', (req, res) => {
    let sql = 'SELECT * FROM tasks WHERE user_id = ?'
    let query = db.query(sql, req.user.id, (err, result) => {
        if (err) throw err;
        res.json({
            result
        });
    });
});

// Create a new task
router.post('/', (req, res) => {
    let newTask = {
        id: uuid.v4(),
        user_id: req.user.id,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status
    }
    if (newTask.description == ' ' || newTask.priority == '' || !newTask.description || !newTask.priority) {
        res.status(400).json({ msg: 'Please enter a description and priority' })
    } else {
        let sql = 'INSERT INTO tasks SET ?';
        let query = db.query(sql, newTask, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.json({
                msg: 'Task Created',
                newTask
            });
        });
    }
});

// Delete a task
router.delete('/:id', (req, res) => {
    let sql = 'DELETE FROM tasks WHERE id = ?';
    let query = db.query(sql, req.params.id, (err, result) => {
        if (err) throw err;
        res.json({
            msg: 'Task Deleted',
            result
        })
    });
});

// Delete all completed tasks
router.delete('/', (req, res) => {
    let sql = 'DELETE from tasks WHERE status = 1'; //AND user_id = ?';
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.json({
            msg: 'Tasks Deleted',
            result
        })
    });
});

// Update Task
router.put('/:id', (req, res) => {
    if (req.body.description) {
        let sql = 'UPDATE tasks SET description = ? WHERE id = ?';
        let query = db.query(sql, [req.body.description, req.params.id], (err, result) => {
            if (err) throw err;
            res.json({
                msg: 'Task edited',
                result
            });
        });
    }
    if (req.body.status) {
        let sql = 'UPDATE tasks SET status = ? WHERE id = ?';
        let query = db.query(sql, [req.body.status, req.params.id], (err, result) => {
            if (err) throw err;
            res.json({
                msg: 'Task status changed',
                result
            })
        });
    }
});

module.exports = router;