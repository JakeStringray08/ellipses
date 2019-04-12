import React, {Component} from 'react';
import * as d3 from 'd3';

import Ellipse from '../../components/Ellipse';

import * as c from '../../constants';
import * as u from '../../utils';

class Canvas extends Component {
  state = {
    ellipses: [],
  };
  
  svgEl;
  newEllipseIdx = -1;
  startDrawPoint;
  startDragPoint;
  isDrawing = false;
  
  componentDidMount() {
    const svg = d3.select(this.svgEl);
    svg
      .on("mousedown", this.createMouseDownHandler(this))
      .on("mousemove", this.createMouseMoveHandler(this));
    
    window.addEventListener('mouseup', this.handleMouseUp, false);
  }
  
  componentWillUnmount() {
    const svg = d3.select(this.svgEl);
    svg
      .on("mousedown", null)
      .on("mousemove", null);
    
    window.removeEventListener('mouseup', this.handleMouseUp);
  }
  
  createMouseDownHandler(self) {
    return function () {
      self.isDrawing = true;
      const [clickX, clickY] = d3.mouse(this);
      const newEllipse = {
        cx: clickX,
        cy: clickY,
        rx: c.MIN_ELLIPSE_RX,
        ry: c.MIN_ELLIPSE_RY,
      };
      
      self.setState({
        ellipses: [...self.state.ellipses, newEllipse],
      });
      self.newEllipseIdx += 1;
      self.startDrawPoint = [clickX, clickY];
    };
  }
  
  createMouseMoveHandler(self) {
    return function () {
      if (!self.isDrawing) {
        return;
      }
      
      const [moveX, moveY] = d3.mouse(this);
      if (self.newEllipseIdx >= 0) {
        const cx = u.avg(moveX, self.startDrawPoint[0]);
        const cy = u.avg(moveY, self.startDrawPoint[1]);
        const rx = c.MIN_ELLIPSE_RX + u.distance(cx, self.startDrawPoint[0]);
        const ry = c.MIN_ELLIPSE_RY + u.distance(cy, self.startDrawPoint[1]);
        
        let newEllipses = [...self.state.ellipses];
        newEllipses[self.newEllipseIdx] = {cx, cy, rx, ry};
        
        self.setState({
          ellipses: newEllipses,
        });
      }
    }
  }
  
  handleMouseUp = () => {
    this.isDrawing = false;
  };
  
  handleEllipseDragStart = (ellipseIdx, target) => {
    d3.select(target).raise();
    this.startDragPoint = [d3.event.x, d3.event.y];
    
    let newEllipses = [...this.state.ellipses];
    newEllipses[ellipseIdx].isDragging = true;
    this.setState({
      ellipses: newEllipses,
    });
  };
  
  handleEllipseDrag = (ellipseIdx) => {
    const [dx, dy] = [
      d3.event.x - this.startDragPoint[0],
      d3.event.y - this.startDragPoint[1],
    ];
    
    let newEllipses = [...this.state.ellipses];
    const activeEllipse = newEllipses[ellipseIdx];
    newEllipses[ellipseIdx] = {
      ...activeEllipse,
      cx: activeEllipse.cx + dx,
      cy: activeEllipse.cy + dy,
    };
    
    this.startDragPoint = [d3.event.x, d3.event.y];
    this.setState({
      ellipses: newEllipses,
    });
  };
  
  handleEllipseDragEnd = (ellipseIdx) => {
    let newEllipses = [...this.state.ellipses];
    newEllipses[ellipseIdx].isDragging = false;
    this.setState({
      ellipses: newEllipses,
    });
  };
  
  render() {
    const { ellipses } = this.state;
    
    return (
      <svg width="800" height="600" ref={svgEl => this.svgEl = svgEl}>
        <g>
          {ellipses.map((el, i) =>
            <Ellipse
              index={i}
              key={i}
              cx={el.cx}
              cy={el.cy}
              rx={el.rx}
              ry={el.ry}
              onDragStart={this.handleEllipseDragStart}
              onDrag={this.handleEllipseDrag}
              onDragEnd={this.handleEllipseDragEnd}
              isActive={el.isDragging}
            />)
          }
        </g>
      </svg>
    );
  }
}

export default Canvas;