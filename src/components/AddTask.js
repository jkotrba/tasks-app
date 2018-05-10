import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class AddTask extends React.Component {
  constructor() {
    super();

    this.state = { title: '', description: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const target = e.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const task = this.state;

    if(this.props.onAdd) {
      this.props.onAdd(task);
    }
    this.setState({ title: '', description: ''});
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel htmlFor="title">Title</ControlLabel>
            <FormControl
              type="text"
              name="title"
              id="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
          <ControlLabel htmlFor="description">Description</ControlLabel>
          <FormControl
            componentClass="textarea"
            name="description"
            id="description"
            value={this.state.description}
            onChange={this.handleChange}
          />
          </FormGroup>
          <Button type="submit" bsStyle="primary">Add New Task</Button>
        </form>
      </div>
    )
  }
}

export default AddTask;
