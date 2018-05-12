import React from 'react';
import { Table, Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import '../css/task-list.css';
import AddTask from './AddTask';

class TaskList extends React.Component {
  constructor() {
    super();

    this.state = { tasks: [], showEdit: false, editTask: {} };
    this.getTasks = this.getTasks.bind(this);
    this.onAddTask = this.onAddTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.handleShowEdit = this.handleShowEdit.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.editTask = this.editTask.bind(this);
  }

  getTasks() {
    fetch('http://localhost:3001/api/tasks')
      .then(response => response.json())
      .then(json => {
        this.setState({ tasks: json.data });
      });
  }

  deleteTask(e, taskId) {
    e.preventDefault();
    fetch(`http://localhost:3001/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    }).then(() => this.getTasks());
  }

  editTask(e) {
    e.preventDefault();
    console.log(`editTask taskId: ${this.state.editTask.taskId}`);
    console.log(`editTask: ${JSON.stringify(this.state.editTask)}`);
    const payload = JSON.stringify({data: this.state.editTask});
    fetch(`http://localhost:3001/api/tasks/${this.state.editTask.taskId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json'
      },
      body: payload
    }).then(() => this.getTasks());
  }

  handleCloseEdit(e) {
    this.setState({ showEdit: false });
  }

  handleShowEdit(e, task) {
    this.setState({ showEdit: true, editTask: task });
  }

  handleEditChange(e) {
    const target = e.target;
    const name = target.name;

    const edit = Object.assign(this.state.editTask, {[name]: target.value});
    this.setState((prev, props) => ({
      editTask: edit
    }));
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
                  <td> </td>
                  <td> </td>
                  <td>
                    <Button
                      bsStyle="danger"
                      onClick={e => this.deleteTask(e, t.taskId)}
                    >
                      <Glyphicon glyph="remove" />
                    </Button>
                  </td>
                  <td>
                    <Button bsStyle="info" onClick={e => this.handleShowEdit(e, t)}>
                      <Glyphicon glyph="pencil" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <AddTask onAdd={this.onAddTask} />

        <Modal show={this.state.showEdit} onHide={this.handleCloseEdit}>
            <Modal.Header closeButton>
              <Modal.Title>
                Edit Task
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
          <form onSubmit={this.editTask}>
          <FormGroup>
            <ControlLabel htmlFor="title">Title</ControlLabel>
            <FormControl
              type="text"
              name="title"
              id="title"
              value={this.state.editTask.title}
              onChange={this.handleEditChange}
            />
          </FormGroup>
          <FormGroup>
          <ControlLabel htmlFor="description">Description</ControlLabel>
          <FormControl
            componentClass="textarea"
            name="description"
            id="description"
            value={this.state.editTask.description}
            onChange={this.handleEditChange}
          />
          </FormGroup>
          <Button type="submit" bsStyle="primary">Save</Button>
        </form>
            </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default TaskList;
