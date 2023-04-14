import { useState, useRef, useEffect } from "react";
import { isDesktop } from "react-device-detect";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

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
} from "./app.styles.jsx";

var products = {
  1: "c9ad95",
  2: "cbac95",
  3: "caab96",
  4: "cbab99",
  5: "c8ac99",
  6: "c5a991",
  7: "c7a992",
  8: "c8a994",
  9: "c9a996",
  10: "c8a995",
  11: "c7a896",
  12: "c4a890",
  13: "c6a891",
  14: "c7a792",
  15: "c8a793",
  16: "c5a691",
  17: "c7a694",
  18: "caa596",
  19: "c0a48d",
  20: "c2a48d",
  21: "c2a38f",
  22: "c3a28f",
  23: "c2a38e",
  24: "c3a38f",
  25: "c5a192",
  26: "c6a195",
  27: "c6a096",
  28: "c6a098",
  29: "bd9f87",
  30: "bd9f87",
  31: "be9d88",
  32: "be9c87",
  33: "be9d86",
  34: "bf9f8c",
  35: "c29c8c",
  36: "c39a8d",
  37: "c39a8e",
  38: "c39990",
  39: "b89a7e",
  40: "b99980",
  41: "ba9982",
  42: "bd9983",
  43: "bb9881",
  44: "bb9983",
  45: "bd9584",
  46: "c29787",
  47: "c19487",
  48: "c1958c",
  49: "b19175",
  50: "b39276",
  51: "b49277",
  52: "b5927b",
  53: "b69279",
  54: "b7927b",
  55: "b68d7b",
  56: "b98d7e",
  57: "bc8d80",
  58: "be9186",
  59: "aa8b6d",
  60: "ad8b6f",
  61: "b0896e",
  62: "af8870",
  63: "b1886c",
  64: "b3886e",
  65: "b38672",
  66: "b58576",
  67: "b58678",
  68: "a38264",
  69: "a58163",
  70: "a68266",
  71: "a98167",
  72: "a87f64",
  73: "ab8167",
  74: "ac7e69",
  75: "ae7f6e",
  76: "ad7e71",
  77: "99795d",
  78: "9b775d",
  79: "a0795f",
  80: "a0765a",
  81: "a2785d",
  82: "a5755f",
  83: "a57461",
  84: "8f7054",
  85: "906f54",
  86: "986f54",
  87: "946c51",
  88: "976c52",
  89: "9a6b54",
  90: "996a58",
  91: "846349",
  92: "89634c",
  93: "876249",
  94: "866048",
  95: "8c624e",
  96: "895f4d",
  97: "795945",
  98: "775741",
  99: "775642",
  100: "785444",
  101: "775445",
  102: "654d3e",
  103: "644b3c",
  104: "634b3f",
  105: "664c41",
  106: "63483e",
  107: "544338",
  108: "514239",
  109: "53433a",
  110: "544239",
};

const SkinTonePicker = () => {
  const [photo, setPhoto] = useState(null);
  const [photoChosen, setPhotoChosen] = useState(null);
  const [photoWidth, setPhotoWidth] = useState(null);
  const [photoHeight, setPhotoHeight] = useState(null);
  const [skinTone, setSkinTone] = useState(null);
  const [nearestShades, setNearestShades] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Create a new image object with the Base64 URL as the source
    const img = new Image();
    img.src = photo;

    // Once the image has loaded, get the width/height and set
    img.onload = () => {
      setPhotoWidth(img.width);
      setPhotoHeight(img.height);
    };
  }, [photo]);

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

  const showResults = async (photoUri) => {
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
        setSkinTone(averageRGB);
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
    nearest_shades_array = Object.keys(products).map((key, index) => {
      console.log("key", key);
      console.log("value", products[key]);
      const productRGB = hexToRgb(products[key]);
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
        )
        ];
    });
    nearest_shades_array.sort(function (a, b) {
      return a[1] - b[1];
    });
    // console.log("in order", nearest_shades_array);
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

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
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
              <CropImage
                src={photo}
                width={photoWidth}
                height={photoHeight}
                chooseCroppedImage={chooseCroppedImage}
              />
            </Content1>
            <Content2>
              {nearestShades && 0 in nearestShades && (
                <div>
                  {skinTone && (
                    <p
                      style={{
                        backgroundColor: rgbToHex(
                          skinTone.r,
                          skinTone.g,
                          skinTone.b
                        ),
                      }}
                    >
                      Average skin tone: {skinTone.r} {skinTone.g} {skinTone.b}
                    </p>
                  )}
                  <p>You're nearest shade is Shade #{nearestShades[0][0]}</p>
                  <p>Top five shades in order:</p>
                  <ol>
                    {Object.entries(nearestShades).map((t, k) => (
                      <li key={k}>Shade #{nearestShades[k][0]}</li>
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
