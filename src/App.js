import { useState, useRef } from "react";
import { isDesktop } from "react-device-detect";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

import Products from "./data/products.json";
import CropImage from "./components/crop-image/crop-image.component.jsx";

import Button, {
  BUTTON_TYPE_CLASSES,
} from "./components/button/button.component.tsx";
import {
  GlobalStyle,
  Container,
  Title,
  Subtitle,
  MarginArea,
  ContentBox,
  Content1,
  Content2,
  NearestShadeText,
} from "./app.styles.jsx";

const SkinTonePicker = () => {
  const [photo, setPhoto] = useState(null);
  const [photoChosen, setPhotoChosen] = useState(null);
  const [nearestShades, setNearestShades] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const fileInputRef = useRef(null);

  const handleTakePhoto = (dataUri) => {
    setPhoto(dataUri);
    setPhotoChosen(dataUri);
    fileInputRef.current.value = "";
    setShowCamera(false);
  };

  const handleUploadPhoto = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setPhotoChosen(reader.result);
    };
    reader.readAsDataURL(file);
    setShowStartScreen(false);
  };

  const showResults = async () => {
    var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d"),
      image = new Image();
    image.addEventListener(
      "load",
      function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const averageRGB = getAverageSkinToneRGB(
          context.getImageData(0, 0, canvas.width, canvas.height)
        );
        getNearestShade(averageRGB);
      },
      false
    );
    image.src = photoChosen;
  };

  const getAverageSkinToneRGB = (imageData) => {
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      const red = imageData.data[i];
      const green = imageData.data[i + 1];
      const blue = imageData.data[i + 2];
      const skinTone = isSkinTone(red, green, blue);

      if (skinTone) {
        totalR += red;
        totalG += green;
        totalB += blue;
        count++;
      }
    }

    const averageR = Math.round(totalR / count);
    const averageG = Math.round(totalG / count);
    const averageB = Math.round(totalB / count);

    return {
      r: averageR,
      g: averageG,
      b: averageB,
    };
  };

  const getNearestShade = (averageRGB) => {
    let nearest_shades_array = [];
    nearest_shades_array = Object.keys(Products).map((key, index) => {
      // console.log("key", key);
      // console.log("value", Products[key]);
      const productRGB = hexToRgb(Products[key]);
      // console.log(
      //   "color distance inside loop",
      //   colourDistance(
      //     productRGB.r,
      //     productRGB.g,
      //     productRGB.b,
      //     averageRGB.r,
      //     averageRGB.b,
      //     averageRGB.g
      //   )
      // );
      return [
        key,
        colourDistance(
          productRGB.r,
          productRGB.g,
          productRGB.b,
          averageRGB.r,
          averageRGB.b,
          averageRGB.g
        ),
        Products[key],
      ];
    });
    nearest_shades_array.sort(function (a, b) {
      return a[1] - b[1];
    });
    setNearestShades(nearest_shades_array.slice(0, 5));
  };

  const colourDistance = (r, g, b, cr, cb, cg) => {
    const distance = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    return distance;
  };

  const isSkinTone = (red, green, blue) => {
    const deltaRedGreen = Math.abs(red - green);
    const deltaRedBlue = Math.abs(red - blue);
    const deltaGreenBlue = Math.abs(green - blue);
    // const isSkin = red > 95 && green > 40 && blue > 20 && red > green + 15 && red > blue;
    const isSkin =
      red > 95 &&
      green > 40 &&
      blue > 20 &&
      deltaRedGreen > 15 &&
      red > green &&
      red > blue &&
      deltaRedBlue > 15 &&
      deltaGreenBlue > 15;
    return isSkin;
  };

  const hexToRgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const handleClickUpload = (event) => {
    fileInputRef.current.click();
  };

  const handleClickCamera = (event) => {
    setShowCamera(true);
    setShowStartScreen(false);
  };

  const chooseCroppedImage = (croppedPhoto) => {
    setPhotoChosen(croppedPhoto);
  };

  return (
    <Container>
      <GlobalStyle />
      {showStartScreen && (
        <MarginArea>
          <Title>Shade Finder</Title>
          <Subtitle>Find your exact shade using your camera or photo</Subtitle>

          {isDesktop && (
            <Button
              buttonType={BUTTON_TYPE_CLASSES.wide}
              onClick={handleClickCamera}
            >
              Use Camera
            </Button>
          )}
          <Button
            buttonType={BUTTON_TYPE_CLASSES.wide}
            onClick={handleClickUpload}
          >
            Upload a file
          </Button>
        </MarginArea>
      )}

      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleUploadPhoto}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      {showCamera && (
        <Camera
          isFullscreen="true"
          onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
        />
      )}

      {photo && (
        <MarginArea>
          <ContentBox>
            <Content1>
              <CropImage src={photo} chooseCroppedImage={chooseCroppedImage} />
            </Content1>
            <Content2>
              {nearestShades && 0 in nearestShades && (
                <div>
                  <NearestShadeText>
                    You're nearest shade is Shade #{nearestShades[0][0]}
                    <span
                      style={{
                        backgroundColor: `#${nearestShades[0][2]}`,
                        width: "20px",
                        height: "20px",
                        display: "inline-block",
                        marginLeft: "10px",
                        borderRadius: "50%",
                      }}
                    ></span>
                  </NearestShadeText>
                  <p>Top five shades in order:</p>
                  <ol>
                    {Object.entries(nearestShades).map((t, k) => (
                      <li key={k}>
                        Shade #{nearestShades[k][0]}{" "}
                        <span
                          style={{
                            backgroundColor: `#${nearestShades[k][2]}`,
                            width: "20px",
                            height: "20px",
                            display: "inline-block",
                            marginLeft: "10px",
                            borderRadius: "50%",
                          }}
                        ></span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Content2>
          </ContentBox>
          <Button buttonType={BUTTON_TYPE_CLASSES.base} onClick={showResults}>
            Use this photo
          </Button>
          <Button
            buttonType={BUTTON_TYPE_CLASSES.base}
            onClick={handleClickUpload}
          >
            Try another
          </Button>
        </MarginArea>
      )}
    </Container>
  );
};

export default SkinTonePicker;
