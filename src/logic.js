export const mock3x3 = [
    [1, 1, 1],
    [1, 2, 1],
    [3, 1, 3]
]
export const mock5x5 = [
    [1, 2, 1, 1, 2, 2, 3],
    [2, 1, 2, 1, 1, 3, 3],
    [1, 2, 2, 0, 0, 0, 0],
    [1, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
]

export function moveGems(mock, objFrom, objTo, fn = (mock, objFrom, objTo) => console.log) {
    const cords = (x, y) => mock[y][x]
    let from = cords(objFrom[0], objFrom[1])
    let to = cords(objTo[0], objTo[1])
    mock[objTo[1]][objTo[0]] = from
    mock[objFrom[1]][objFrom[0]] = to
    return fn(mock, objFrom, objTo)
}

export function testFild(mock, fn = (ob) => console.log) {
    const cords = (x, y) => mock[y][x]
    const height = mock.length
    const weight = mock[0].length
    let fromX = 0
    let fromY = 0
    let toX = weight
    let toY = height
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
                    fn({ n: false, y, x, count, t: fr })
                }
                fr = frto
                count = 1
            }
        }
        if (count > 2) {
            fn({ n: false, y, x: toX, count, t: fr })
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
                    fn({ n: true, x, y, count, t: fr })
                }
                fr = frto
                count = 1
            }
        }
        if (count > 2) {
            fn({ n: true, x, y: toY, count, t: fr })
        }
    }
    return payload.filter(e => e.t != 0)
}

export function scoreFild(mock, fn = (ob) => console.log) {
    return fn(mock)
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