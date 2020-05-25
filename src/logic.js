export class Gems {
    constructor(mock, makeobj) {
        this.list = this.parseMokc(mock, makeobj)
        this.weight = mock[0].length
        this.height = mock.length
    }
    parseMokc(mock, makeobj = () => 1) {
        let payload = [];
        for (let y = 0; y < mock.length; y++) {
            for (let x = 0; x < mock[0].length; x++) {

                payload.push({ x, y, t: mock[y][x], o: makeobj(x, y, mock[y][x]) })
            }
        }
        return payload
    }
    Chek(list) {
        let payload = [];
        let verts = Array(this.height).fill(1).map((em, i) => list.filter(e => e.y == i))
        let horis = Array(this.weight).fill(1).map((em, i) => list.filter(e => e.x == i))
        horis.forEach(pars => {
            for (let i = 1; i < pars.length - 1; i++) {
                const el = pars[i]
                const links = pars[i - 1]
                const rechts = pars[i + 1]
                if (el.t == links.t && el.t == rechts.t) {
                    pars.slice(i - 1, i + 2).forEach(em => {
                        if (payload.findIndex(e => e == em) == -1) payload.push(em)
                    });
                }
            }
        })
        verts.forEach(pars => {
            for (let i = 1; i < pars.length - 1; i++) {
                const el = pars[i]
                const links = pars[i - 1]
                const rechts = pars[i + 1]
                if (el.t == links.t && el.t == rechts.t) {
                    pars.slice(i - 1, i + 2).forEach(em => {
                        if (payload.findIndex(e => e == em) == -1) payload.push(em)
                    });
                }
            }
        })
        return payload.filter(em => em.t != 0).sort((em, em2) => em.t - em2.t)
    }
    Swap(x1, y1, x2, y2) {
        let chlist = Object.create(this.list)
        let from = chlist.find(em => em.x == x1 && em.y == y1)
        let to = chlist.find(em => em.x == x2 && em.y == y2)
        let buff = from.t
        from.t = to.t
        to.t = buff
        return this.Chek(chlist)
    }
    Draw(dr = () => true) {
        let payload = []
        this.list.forEach(em => {
            if (!payload[em.y]) payload[em.y] = []
            payload[em.y][em.x] = em.t
        })
        console.log(JSON.stringify(payload, null, 4))
    }
    CheckCur(obj, func = () => true) {
        return this.list.filter(e => {
            if ((e.x == obj.data.values.x || e.x == obj.data.values.x) && (e.y == obj.data.values.y + 1 || e.y == obj.data.values.y - 1)) { return true }
            else if ((e.x == obj.data.values.x + 1 || e.x == obj.data.values.x - 1) && (e.y == obj.data.values.y || e.y == obj.data.values.y)) { return true }
            else if ((e.x == obj.data.values.x + 1 || e.x == obj.data.values.x - 1) && (e.y == obj.data.values.y + 1 || e.y == obj.data.values.y - 1)) { return true }
            else { return false }
        })
    }
}


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
        console.log("process:", y)
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
            fn(true, weight - count, count, mock[y][weight])
        }
    }
    //verticles
    for (let x = 0; x < weight; x++) {
        console.log("process:", x)
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