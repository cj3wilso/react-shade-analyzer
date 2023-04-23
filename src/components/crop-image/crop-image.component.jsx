import { useState, useEffect, useRef } from "react";
import "./crop-image.css";

// import {
//   CircleSelectedContainer,
//   CircleSelector,
// } from "./crop-image.styles.jsx";

import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component.tsx";

const CropImage = ({ src, chooseCroppedImage }) => {
  const imgColRef = useRef(null);

  // const [outputImage, setOutputImage] = useState(null);
  const [circleX, setCircleX] = useState(null);
  const [circleY, setCircleY] = useState(null);
  const [circleWidth, setCircleWidth] = useState(null);
  const [circleHeight, setCircleHeight] = useState(null);
  const [classCropped, setClassCropped] = useState("");

  const minimum_size = 20;

  const resizableRef = useRef(null);
  const resizerRef = useRef([]);

  useEffect(() => {
    makeResizableDiv();
  }, []);

  useEffect(() => {
    const imgColWidth = imgColRef.current.offsetWidth;
    const imgColHeight = imgColRef.current.offsetHeight;
    const circleWidthHalfPicture = imgColWidth / 2;
    const circleHeightHalfPicture = imgColHeight / 2;

    resizableRef.current.style.left =
      (imgColWidth - imgColWidth / 2) / 2 + "px";
    resizableRef.current.style.top =
      (imgColHeight - imgColHeight / 2) / 2 + "px";
    resizableRef.current.style.width = circleWidthHalfPicture + "px";
    resizableRef.current.style.height = circleHeightHalfPicture + "px";

    setCircleX((imgColWidth - imgColWidth / 2) / 2);
    setCircleY((imgColHeight - imgColHeight / 2) / 2);
    setCircleWidth(circleWidthHalfPicture);
    setCircleHeight(circleHeightHalfPicture);
  }, [src]);

  const makeResizableDiv = () => {
    let originalWidth = 0;
    let originalHeight = 0;
    let originalX = 0;
    let originalY = 0;
    let originalMouseX = 0;
    let originalMouseY = 0;
    let classlist = null;

    for (let i = 0; i < resizerRef.current.length; i++) {
      resizerRef.current[i].addEventListener("pointerdown", function (e) {
        e.preventDefault();
        classlist = e.target.classList;
        if (resizableRef !== null) {
          originalWidth = parseFloat(
            getComputedStyle(resizableRef.current, null)
              .getPropertyValue("width")
              .replace("px", "")
          );
          originalHeight = parseFloat(
            getComputedStyle(resizableRef.current, null)
              .getPropertyValue("height")
              .replace("px", "")
          );
          originalX = resizableRef.current.getBoundingClientRect().left;
          originalY = resizableRef.current.getBoundingClientRect().top;
          originalMouseX = e.pageX;
          originalMouseY = e.pageY;
          window.addEventListener("pointermove", resize);
          window.addEventListener("pointerup", stopResize);
        }
      });

      const resize = (e) => {
        let newWidth = null;
        let newHeight = null;
        if (classlist.contains("bottom-right")) {
          newWidth = originalWidth + (e.pageX - originalMouseX);
          newHeight = originalHeight + (e.pageY - originalMouseY);
          if (newWidth > minimum_size) {
            setCircleWidth(newWidth);
          }
          if (newHeight > minimum_size) {
            setCircleHeight(newHeight);
          }
        } else if (classlist.contains("bottom-left")) {
          newHeight = originalHeight + (e.pageY - originalMouseY);
          newWidth = originalWidth - (e.pageX - originalMouseX);
          if (newHeight > minimum_size) {
            setCircleHeight(newHeight);
          }
          if (newWidth > minimum_size) {
            setCircleWidth(newWidth);
            setCircleX(originalX + (e.pageX - originalMouseX));
          }
        } else if (classlist.contains("top-right")) {
          newWidth = originalWidth + (e.pageX - originalMouseX);
          newHeight = originalHeight - (e.pageY - originalMouseY);
          if (newWidth > minimum_size) {
            setCircleWidth(newWidth);
          }
          if (newHeight > minimum_size) {
            setCircleHeight(newHeight);
            setCircleY(originalY + (e.pageY - originalMouseY));
          }
        } else {
          newWidth = originalWidth - (e.pageX - originalMouseX);
          newHeight = originalHeight - (e.pageY - originalMouseY);
          if (newWidth > minimum_size) {
            setCircleWidth(newWidth);
            setCircleX(originalX + (e.pageX - originalMouseX));
          }
          if (newHeight > minimum_size) {
            setCircleHeight(newHeight);
            setCircleY(originalY + (e.pageY - originalMouseY));
          }
        }
      };

      const stopResize = () => {
        window.removeEventListener("pointermove", resize);
      };
    }
  };

  const handleButtonClick = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = src;
    canvas.width = circleWidth;
    canvas.height = circleHeight;

    ctx.save();
    ctx.beginPath();
    let rx = circleWidth / 2;
    let ry = circleHeight / 2;
    ctx.ellipse(rx, ry, rx, ry, 0, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.drawImage(
      image,
      circleX,
      circleY,
      circleWidth,
      circleHeight,
      0,
      0,
      circleWidth,
      circleHeight
    );
    ctx.restore();

    const croppedImage = canvas.toDataURL();
    //setOutputImage(croppedImage);
    setClassCropped("cropped");
    chooseCroppedImage(croppedImage);
  };

  return (
    <div
      ref={imgColRef}
      style={{
        position: "relative",
        backgroundImage: `url("${src}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className="resizable"
        ref={resizableRef}
        style={{
          top: circleY,
          left: circleX,
          width: circleWidth,
          height: circleHeight,
        }}
      >
        <div className="resizers">
          <div className="outline"></div>
          <div
            ref={(el) => (resizerRef.current[0] = el)}
            className="resizer top-left"
          ></div>
          <div
            ref={(el) => (resizerRef.current[1] = el)}
            className="resizer top-right"
          ></div>
          <div
            ref={(el) => (resizerRef.current[2] = el)}
            className="resizer bottom-left"
          ></div>
          <div
            ref={(el) => (resizerRef.current[3] = el)}
            className="resizer bottom-right"
          ></div>
        </div>
      </div>
      <Button
        buttonType={BUTTON_TYPE_CLASSES.inverted}
        onClick={handleButtonClick}
        className={classCropped}
      >
        Crop
      </Button>
      {/* {outputImage && (
        <img
          src={outputImage}
          alt="Cropped Picture"
          style={{
            width: "auto",
            height: "auto",
            position: "absolute",
            top: "0",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          top: "-100px",
          display: "inline-block",
        }}
      >
        Circle Width: {circleWidth} <br />
        Circle Height: {circleHeight} <br />
        Circle Y: {circleY} <br />
        Circle X: {circleX} <br />
        Radius of Arc: {Math.min(circleWidth, circleHeight)}
      </div> */}
    </div>
  );
};

export default CropImage;
