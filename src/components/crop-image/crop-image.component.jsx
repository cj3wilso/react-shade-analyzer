import { useState, useEffect } from "react";
import "./crop-image.css";

// import {
//   CircleSelectedContainer,
//   CircleSelector,
// } from "./crop-image.styles.jsx";

import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component.tsx";

const CropImage = ({ src, width, height, chooseCroppedImage }) => {
  const [circleX, setCircleX] = useState(null);
  const [circleY, setCircleY] = useState(null);
  // const [outputImage, setOutputImage] = useState(null);
  const [circleWidth, setCircleWidth] = useState(null);
  const [circleHeight, setCircleHeight] = useState(null);
  const [classCropped, setClassCropped] = useState("");

  useEffect(() => {
    makeResizableDiv(".resizable");
  }, [makeResizableDiv]);

  useEffect(() => {
    const circleWidthHalfPicture = width / 2;
    const circleHeightHalfPicture = height / 2;
    setCircleX((width - width / 2) / 2);
    setCircleY((height - height / 2) / 2);
    setCircleWidth(circleWidthHalfPicture);
    setCircleHeight(circleHeightHalfPicture);
  }, [width, height]);

  function makeResizableDiv(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + " .resizer");
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener("mousedown", function (e) {
        e.preventDefault();
        original_width = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("width")
            .replace("px", "")
        );
        original_height = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue("height")
            .replace("px", "")
        );
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
      });

      function resize(e) {
        let newWidth = null;
        let newHeight = null;
        if (currentResizer.classList.contains("bottom-right")) {
          newWidth = original_width + (e.pageX - original_mouse_x);
          newHeight = original_height + (e.pageY - original_mouse_y);
          if (newWidth > minimum_size) {
            //element.style.width = newWidth + "px";
            setCircleWidth(newWidth);
          }
          if (newHeight > minimum_size) {
            //element.style.height = newHeight + "px";
            setCircleHeight(newHeight);
          }
        } else if (currentResizer.classList.contains("bottom-left")) {
          newHeight = original_height + (e.pageY - original_mouse_y);
          newWidth = original_width - (e.pageX - original_mouse_x);
          if (newHeight > minimum_size) {
            //element.style.height = newHeight + "px";
            setCircleHeight(newHeight);
          }
          if (newWidth > minimum_size) {
            //element.style.width = newWidth + "px";
            //element.style.left = original_x + (e.pageX - original_mouse_x) + "px";
            setCircleWidth(newWidth);
            setCircleX(original_x + (e.pageX - original_mouse_x));
          }
        } else if (currentResizer.classList.contains("top-right")) {
          newWidth = original_width + (e.pageX - original_mouse_x);
          newHeight = original_height - (e.pageY - original_mouse_y);
          if (newWidth > minimum_size) {
            //element.style.width = newWidth + "px";
            setCircleWidth(newWidth);
          }
          if (newHeight > minimum_size) {
            //element.style.height = newHeight + "px";
            //element.style.top = original_y + (e.pageY - original_mouse_y) + "px";
            setCircleHeight(newHeight);
            setCircleY(original_y + (e.pageY - original_mouse_y));
          }
        } else {
          newWidth = original_width - (e.pageX - original_mouse_x);
          newHeight = original_height - (e.pageY - original_mouse_y);
          if (newWidth > minimum_size) {
            // element.style.width = newWidth + "px";
            // element.style.left = original_x + (e.pageX - original_mouse_x) + "px";
            setCircleWidth(newWidth);
            setCircleX(original_x + (e.pageX - original_mouse_x));
          }
          if (newHeight > minimum_size) {
            // element.style.height = newHeight + "px";
            // element.style.top = original_y + (e.pageY - original_mouse_y) + "px";
            setCircleHeight(newHeight);
            setCircleY(original_y + (e.pageY - original_mouse_y));
          }
        }
      }

      function stopResize() {
        window.removeEventListener("mousemove", resize);
      }
    }
  }

  const handleButtonClick = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("image");
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
    // setOutputImage(croppedImage);
    setClassCropped("cropped");
    chooseCroppedImage(croppedImage);
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        className="resizable"
        style={{
          top: circleY,
          left: circleX,
          width: circleWidth,
          height: circleHeight,
        }}
      >
        <div className="resizers">
          <div className="outline"></div>
          <div className="resizer top-left"></div>
          <div className="resizer top-right"></div>
          <div className="resizer bottom-left"></div>
          <div className="resizer bottom-right"></div>
        </div>
      </div>
      <img
        id="image"
        src={src}
        width={width}
        height={height}
        alt="Uploaded face"
      />
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
        Circle Radius: {radius} <br />
        Radius of Arc: {Math.min(circleWidth, circleHeight)}
      </div> */}
    </div>
  );
};

export default CropImage;
