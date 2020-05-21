class Gems {
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
            dr(em)
        })
        console.log(JSON.stringify(payload, null, 4))
    }
}


const mock3x3 = [
    [0, 1, 1],
    [1, 2, 1],
    [0, 1, 0]
]
module.exports = { Gems, mock3x3 }