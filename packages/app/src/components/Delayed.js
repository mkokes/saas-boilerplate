import React from 'react';
import PropTypes from 'prop-types';

class Delayed extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = { hidden: true };
  }

  componentDidMount() {
    this._isMounted = true;

    setTimeout(
      () => {
        if (this._isMounted) this.setState({ hidden: false });
      },
      this.props.noDelay ? 0 : this.props.wait,
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
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
