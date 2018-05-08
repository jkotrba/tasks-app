import React from 'react';

class TaskList extends React.Component {
  constructor() {
    super();

    this.state = { tasks: []};
  }

  render() {
    return (
      <div>
        <h2>Tasks</h2>
      </div>
    )
  }
}

export default TaskList;
