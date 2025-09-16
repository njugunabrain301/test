export const colorComponent = (className) => {
  let elems = document.getElementsByClassName(className);
  for (var i = 0; i < elems.length; i++) {
    const attributeNodeArray = [...elems[0].attributes];
    const attrs = attributeNodeArray.reduce((attrs, attribute) => {
      attrs[attribute.name] = attribute.value;
      return attrs;
    }, {});
    let elem = elems[i];
    let children = [elem];
    let queue = [elem];

    while (queue.length > 0) {
      let curr = queue.pop();
      if (curr.childNodes.length > 0) {
        children = [...children, ...curr.childNodes];
        queue = [...queue, ...curr.childNodes];
      }
    }
    for (var j = 0; j < children.length; j++) {
      if (attrs.color) {
        if (children[j].style) {
          children[j].style.color = attrs.color;
          children[j].style.borderColor = attrs.color;
        }
      }
    }
  }
};

// utils/colorUtils.js
export async function getBackgroundColor(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // This is important if the image is hosted on another domain
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const colorMap = {};
      let maxCount = 0;
      let backgroundColor = null;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a === 0) continue;

        const colorKey = `${r},${g},${b}`;

        if (!colorMap[colorKey]) {
          colorMap[colorKey] = 0;
        }

        colorMap[colorKey]++;

        if (colorMap[colorKey] > maxCount) {
          maxCount = colorMap[colorKey];
          backgroundColor = `rgb(${r},${g},${b})`;
        }
      }

      resolve(backgroundColor);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}
