export const mock3x3 = [
    [1, 1, 1],
    [1, 2, 1],
    [3, 1, 3]
]
export const mock5x5 = [
    [1, 1, 2, 3, 1, 3, 3],
    [1, 1, 3, 3, 3, 3, 1],
    [1, 1, 1, 3, 3, 3, 1],
    [3, 1, 1, 2, 3, 3, 1],
    [2, 2, 1, 2, 2, 3, 1],
    [3, 2, 2, 2, 2, 1, 1],
    [2, 2, 3, 1, 2, 1, 3]
]

export function test(mock, fn = (hor, s, c, t) => console.log({ hor, s, c, t })) {
    let payload = []
    const height = mock.length
    const weight = mock[0].length
    //horisontals
    for (let y = 0; y < height; y++) {
        let count = 1
        for (let x = 1; x < weight; x++) {
            if (mock[y][x - 1] == mock[y][x]) {
                count++
            }
            else {
                if (count > 2) {
                    // payload.push({ y, x: x - count, x2: x })
                    fn(true, x - count, count, mock[y][x])
                }
                count = 1
            }
        }
        if (count > 2) {
            // payload.push({ y, x: weight - count, x2: weight })
            fn(true, weight - count, count, mock[y][weight - 1])
        }
    }
    //verticles
    for (let x = 0; x < weight; x++) {
        let count = 1
        for (let y = 1; y < height; y++) {
            if (mock[y - 1][x] == mock[y][x]) {
                count++
            }
            else {
                if (count > 2) {
                    // console.log({ x, y, ys: y - count, count })
                    // payload.push({ x, y, ys: y - count })
                    fn(false, y - count, count, mock[y][x])
                }
                count = 1
            }
        }
        if (count > 2) {
            // console.log({ x, y: height, ys: height - count, count })
            // payload.push({ x, y: height, ys: height - count })
            fn(true, height - count, count, mock[height - 1][x])
        }
    }
    return payload;
}

function testQuad(x, y, x2, y2, fn = (x, y, x2, y2) => console.log) {

}

export function makeFild(mock, makeobj = () => 1) {
    let payload = [];
    for (let y = 0; y < mock.length; y++) {
        for (let x = 0; x < mock[0].length; x++) {
            payload.push({ x, y, t: mock[y][x], o: makeobj(x, y, mock[y][x]) })
        }
    }
    return payload
}

export function testMoves(mock, x, y, fn = (type, x, y, c) => console.log) {
    const height = mock.length
    const weight = mock[0].length
    let fromX = x - 4
    if (fromX < 0) fromX = 0
    let fromY = y - 4
    if (fromY < 0) fromY = 0
    let toX = x + 4
    if (toX > weight) toX = weight
    let toY = y + 4
    if (toY > height) toY = height
    testQuad(fromX, fromY, toX, toY)
    return { fromX, fromY, toX, toY }
}