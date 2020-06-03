export function makeFild(mock, makeobj = () => 1) {
    let payload = [];
    for (let y = 0; y < mock.length; y++) {
        for (let x = 0; x < mock[0].length; x++) {
            payload.push({ x, y, t: mock[y][x], o: makeobj(x, y, mock[y][x]) })
        }
    }
    return payload
}

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
    const payload = []
    const compare = (arr1) => {
        let res = { res: false, idx: 0 }
        payload.forEach((ems, idx) => {
            ems.pload.forEach(em2 => {
                arr1.pload.forEach(s => {
                    if (s[0] == em2[0] && s[0] == em2[0] && ems.t == arr1.t) {
                        res = { res: true, idx: idx }
                    }
                })
            })
        })
        return res
    }
    const verts = (em) => {
        let pload = []
        for (let y = em.y - em.count; y < em.y; y++) {
            pload.push([em.x, y])
        }
        let hat = compare({ pload, t: em.t })
        if (hat.res) {
            payload[hat.idx].pload = payload[hat.idx].pload.concat(pload)
        } else {
            payload.push({ pload, t: em.t })
        }
    }
    const horis = (em) => {
        let pload = []
        for (let x = em.x - em.count; x < em.x; x++) {
            pload.push([x, em.y])
        }
        payload.push({ pload, t: em.t })
    }
    const height = mock.length
    const weight = mock[0].length
    let fromX = 0
    let fromY = 0
    let toX = weight
    let toY = height
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
                    if (fr != 0) horis({ n: false, y, x, count, t: fr })
                }
                fr = frto
                count = 1
            }
        }
        if (count > 2) {
            fn({ n: false, y, x: toX, count, t: fr })
            if (fr != 0) horis({ n: false, y, x: toX, count, t: fr })
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
                    if (fr != 0) verts({ n: true, x, y, count, t: fr })
                }
                fr = frto
                count = 1
            }
        }
        if (count > 2) {
            fn({ n: true, x, y: toY, count, t: fr })
            if (fr != 0) verts({ n: true, x, y: toY, count, t: fr })
        }
    }
    payload.forEach(gems => {
        gems.pload.forEach(em => {
            mock[em[1]][em[0]] = 0
        })
    })
    return payload
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

export function fallGemes(mock) {
    const cords = (x, y) => mock[y][x]
    const height = mock.length
    const weight = mock[0].length
    let hatMove = false
    const hat = []
    const empty = []
    for (let x = 0; x < weight; x++) {
        hat[x] = []
        empty[x] = []
        for (let y = 0; y < height; y++) {
            if (cords(x, y) == 0) {
                hatMove = true
                empty[x].push({ x, y, t: cords(x, y) })
            }
            else {
                hat[x].push({ x, y, t: cords(x, y) })
            }
        }

    }
    return { hat, empty, hatMove }
}