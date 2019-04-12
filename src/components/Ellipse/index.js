import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import cn from 'classnames';

import * as u from '../../utils';
import styles from './index.module.css';

class Ellipse extends Component {
  static defaultProps = {
    onDragStart: u.noop,
    onDrag: u.noop,
    onDragEnd: u.noop,
  };
  
  componentDidMount() {
    d3.select(this.elRef)
      .call(d3.drag()
        .on('start', this.createDragStartHandler(this))
        .on("drag", this.handleDrag)
        .on('end', this.handleDragEnd),
      );
  }
  
  createDragStartHandler(self) {
    return function () {
      self.props.onDragStart(self.props.index, this);
    };
  };
  
  handleDragEnd = () => {
    this.props.onDragEnd(this.props.index);
  };
  
  handleDrag = () => {
    this.props.onDrag(this.props.index);
  };
  
  render() {
    const { cx, cy, rx, ry, isActive } = this.props;
    
    return (
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        className={cn(styles.ellipse, isActive && styles.active)}
        ref={elRef => this.elRef = elRef}
      />
    );
  }
}

Ellipse.propTypes = {
  index: PropTypes.number.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  rx: PropTypes.number.isRequired,
  ry: PropTypes.number.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

export default Ellipse;
