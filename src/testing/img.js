import React, { useState } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators
} from "reactstrap";
import { Button } from "react-bootstrap";const ImageSlider = props => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);  const next = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === props.data.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };  const previous = () => {
    if (animating) return;
    const nextIndex =
      activeIndex === 0 ? props.data.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };  const goToIndex = newIndex => {
    if (animating) return;
    setActiveIndex(newIndex);
  };  const slides =
    props.data.length > 0 &&
    props.data.map((item, index) => {
      return (
        <CarouselItem
          onExiting={() => setAnimating(true)}
          onExited={() => setAnimating(false)}
          key={index}
        >
          <img
            src={item && URL.createObjectURL(item)}
            alt={"Title"}
            style={{ height: 300, width: "100%" }}
          />
        </CarouselItem>
      );
    });  return (
    <>
      {props.data.length > 0 && (
        <Carousel activeIndex={activeIndex} next={next} previous={previous}>
          <CarouselIndicators
            items={props.data}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
          {slides}          <CarouselControl
            direction="prev"
            directionText="Previous"
            onClickHandler={previous}
          />
          <CarouselControl
            direction="next"
            directionText="Next"
            onClickHandler={next}
          />
        </Carousel>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2>Title: {props.extraData.title}</h2>
        <p>Description: {props.extraData._def.extendedProps.description}</p>
        <Button variant="primary" onClick={props.editStatus}>
          Edit
        </Button>
      </div>
    </>
  );
};export default ImageSlider;