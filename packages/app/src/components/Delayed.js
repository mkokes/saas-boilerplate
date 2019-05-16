import React from 'react';
import PropTypes from 'prop-types';

class Delayed extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hidden: true };
  }

  componentDidMount() {
    setTimeout(
      () => {
        this.setState({ hidden: false });
      },
      this.props.noDelay ? 0 : this.props.wait,
    );
  }

  render() {
    return this.state.hidden ? '' : this.props.children;
  }
}

Delayed.propTypes = {
  children: PropTypes.node,
  wait: PropTypes.number.isRequired,
  noDelay: PropTypes.bool,
};

export default Delayed;
