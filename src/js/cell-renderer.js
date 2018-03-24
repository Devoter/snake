function cellRenderer(width, height, active = false) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    const paddingFactor = 0.03555;
    const borderFactor = 0.075;
    const paddingX = width * paddingFactor;
    const paddingY = height * paddingFactor;
    const borderWidth = Math.min(width * borderFactor, height * borderFactor);
    const squarePaddingFactor = 0.2;
    const lr = width * squarePaddingFactor;
    const tb = height * squarePaddingFactor;
    const color = `rgba(0, 0, 0, 0.${active ? 9 : 2})`;

    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = borderWidth;
    context.strokeRect(paddingX + borderWidth / 2, paddingY + borderWidth / 2,
        width - paddingX * 2 - borderWidth, height - paddingY * 2 - borderWidth);
    context.fillRect(lr, tb, width - lr * 2, height - tb * 2);

    return canvas;
}

export default cellRenderer;
