export const mock3x3 = [
    [1, 1, 1],
    [1, 2, 1],
    [3, 1, 3]
]
export const mock5x5 = [
    [1, 0, 1, 1, 0, 0, 0],
    [1, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
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

function testMove(mock, fromX, fromY, toX, toY, x1, y1, x2, y2) {
    const payload = []
    for (let y = fromY; y < toY; y++) {
        let fr = mock[y][fromX]
        let count = 1
        debugger
        for (let x = fromX + 1; x < toX; x++) {
            let frto = mock[y][x]
            debugger
            if ((x == x2 || x == x1) && (y == y2 || y == y1)) {
                frto = mock[y1][x1]
                fr = mock[y2][x2]
            }
            debugger
            if (fr == frto) {
                count++
            }
            else {
                if (count > 2) {
                    payload.push({ count, t: fr })
                }
                fr = frto
                count = 1
            }
        }
        if (count > 2) {
            payload.push({ count, t: fr })
        }
    }
    return payload.filter(e => e.t != 0)
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
    let fromX = x - 3
    if (fromX < 0) fromX = 0
    let fromY = y - 3
    if (fromY < 0) fromY = 0
    let toX = x + 4
    if (toX > weight) toX = weight
    let toY = y + 4
    if (toY > height) toY = height
    let moves = {
        left: x > 0,
        right: x < weight - 1,
        up: y > 0,
        down: y < height - 1
    }
    const gems = []
    for (let y = fromY; y < toY; y++)
        for (let x = fromX; x < toX; x++) {
            gems.push([x, y])
        }

    if (moves.right) {
        console.log(testMove(mock, fromX, fromY, toX, toY, x, y, x + 1, y))
    }
    if (moves.left) {
        console.log(testMove(mock, fromX, fromY, toX, toY, x, y, x - 1, y))
    }
    if (moves.up) {
        // console.log(testMove(mock, fromX, fromY, toX, toY, x, y, x, y - 1))
    }
    if (moves.down) {
        // console.log(testMove(mock, fromX, fromY, toX, toY, x, y, x, y + 1))
    }
    return { gems, moves }
}