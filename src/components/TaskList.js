import React from 'react';
import { Table } from 'react-bootstrap';
import '../css/task-list.css';
import AddTask from './AddTask';

class TaskList extends React.Component {
  constructor() {
    super();

    this.state = { tasks: [] };
    this.onAddTask = this.onAddTask.bind(this);
  }

  getTasks() {
    fetch('http://localhost:3001/api/tasks')
      .then(response => response.json())
      .then(json => {
        this.setState({ tasks: json.data });
      });
  }

  componentDidMount() {
    this.getTasks();
  }

  onAddTask(task) {
    const payload = JSON.stringify({ data: task });
    fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: payload
    }).then(() => this.getTasks());
  }

  render() {
    return (
      <div className="task-list">
        <h2>Tasks</h2>
        <Table className="striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Created</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {this.state.tasks.map(t => {
              return (
                <tr key={t.taskId}>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td>{t.createdDate}</td>
                  <td>{t.completedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <AddTask onAdd={this.onAddTask} />
      </div>
    );
  }
}

export default TaskList;
