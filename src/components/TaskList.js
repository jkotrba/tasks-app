import React from 'react';
import { Table, Button, Glyphicon, Modal, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import '../css/task-list.css';
import AddTask from './AddTask';

function DateDisplay(props) {
  if(props.date) {
    let date = new Date(props.date);
    return (
      date.toLocaleDateString()
    )
  }
  return '--';
}

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.apiUrl = props.apiUrl;
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
    fetch(`${this.apiUrl}/tasks`)
      .then(response => response.json())
      .then(json => {
        this.setState({ tasks: json.data });
      });
  }

  deleteTask(e, taskId) {
    e.preventDefault();
    fetch(`${this.apiUrl}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    }).then(() => this.getTasks());
  }

  editTask(e) {
    e.preventDefault();
    const task = this.state.editTask;

    const payload = JSON.stringify({
      data: {
        title: task.title,
        description: task.description,
        taskId: task.taskId,
        completedDate: task.completedDate
      }
    });
    console.log('payload: ' + payload);

    fetch(`${this.apiUrl}/tasks/${task.taskId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: payload
    })
    .then(this.handleCloseEdit)
    .then(() => this.getTasks());
  }

  handleCloseEdit(e) {
    this.setState({ showEdit: false });
  }

  handleShowEdit(e, task) {
    const edit = Object.assign({}, task);
    this.setState({ showEdit: true, editTask: edit });
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
    fetch(`${this.apiUrl}/tasks`, {
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
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col className="task-list-delete" />
            <col className="task-list-edit" />
          </colgroup>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Created</th>
              <th>Completed</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.tasks.map(t => {
              return (
                <tr key={t.taskId}>
                  <td>{t.title}</td>
                  <td>{t.description}</td>
                  <td><DateDisplay date={t.createdDate} /></td>
                  <td><DateDisplay date={t.completedDate} /></td>
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
