export const mock3x3 = [
    [1, 1, 1],
    [1, 2, 1],
    [3, 1, 3]
]
export const mock5x5 = [
    [1, 0, 1, 1, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
]

function testFild(mock, fn = (ob) => console.log) {
    const payload = []
    for (let y = fromY; y < toY; y++) {
        let fr = cords(fromX, y)
        let count = 1
        for (let x = fromX + 1; x < toX; x++) {
            let frto = cords(x, y)
            if (fr == frto) {
                count++
            }
            else {
                if (count > 2) {
                    fn({ count, t: fr })
                }
                fr = frto
                count = 1
            }
        }
        if (count > 2) {
            fn({ count, t: fr })
        }
    }
    for (let x = fromX; x < toX; x++) {
        let fr = cords(x, fromY)
        let count = 1
        for (let y = fromY + 1; y < toY; y++) {
            let frto = cords(x, y)
            if (fr == frto) {
                count++
            }
            else {
                if (count > 2) {
                    fn({ count, t: fr })
                }
                fr = frto
                count = 1
            }
        }
        if (count > 2) {
            fn({ count, t: fr })
        }
    }
    return payload.filter(e => e.t != 0)
}

function testMove(mock, fromX, fromY, toX, toY, x1, y1, x2, y2) {
    const cords = (x, y) => {
        if (x == x1 && y == y1) return mock[y2][x2];
        if (x == x2 && y == y2) return mock[y1][x1];
        return mock[y][x]
    }
    const payload = []
    for (let y = fromY; y < toY; y++) {
        let fr = cords(fromX, y)
        let count = 1
        for (let x = fromX + 1; x < toX; x++) {
            let frto = cords(x, y)
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
    for (let x = fromX; x < toX; x++) {
        let fr = cords(x, fromY)
        let count = 1
        for (let y = fromY + 1; y < toY; y++) {
            let frto = cords(x, y)
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
    return (payload.filter(e => e.t != 0).length > 0)
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
    // const gems = []
    // for (let y = fromY; y < toY; y++)
    //     for (let x = fromX; x < toX; x++) {
    //         gems.push([x, y])
    //     }

    if (moves.right) {
        moves.right = testMove(mock, fromX, fromY, toX, toY, x, y, x + 1, y)
    }
    if (moves.left) {
        moves.left = testMove(mock, fromX, fromY, toX, toY, x, y, x - 1, y)
    }
    if (moves.up) {
        moves.up = testMove(mock, fromX, fromY, toX, toY, x, y, x, y - 1)
    }
    if (moves.down) {
        moves.down = testMove(mock, fromX, fromY, toX, toY, x, y, x, y + 1)
    }
    return { moves }
}