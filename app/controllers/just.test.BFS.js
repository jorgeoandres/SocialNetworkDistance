var db = {
    "userA": ["userB", "userD", "userE", "userG"],
    "userB": ["userC", "userJ", "userI", "userE"],
    "userC": ["userM", "userN", "userJ", "userI", "userE"],
    "userM": ["userY"],
    "userY": ["userX"]
}

function get_followings(id) {
    if (db[id] != undefined) {
        return db[id];
    }
    return [];
}

function checkea(current_childs, destino) {
    return current_childs.includes(destino);
}

function BFS(origen, destino, maxLevel) {
    visitados = []
    nivel = 1;
    current_node = origen;
    current_childs = get_followings(origen);
    console.log(current_childs);
    queue = [];
    queueChilds = [];
    //check first level, the most easy.
    if (checkea(current_childs, destino)) {
        return nivel;
    } else {
        visitados.push(origen);
        queue = queue.concat(current_childs);
        console.log(queue);
        nivel++;
    }

    // //check BFS
    while (queue.length > 0) {
        current_node = queue.shift();
        console.log("Current node " + current_node);
        console.log("Nivel " + nivel)
        if (!visitados.includes(current_node)) {
            current_childs = get_followings(current_node);
            console.log("Current childs " + current_childs);
            visitados.push(current_node);
            console.log("Visitados " + visitados);
            if (current_childs.length > 0) {
                if (checkea(current_childs, destino)) {
                    return nivel;
                } else {
                    queueChilds = queueChilds.concat(current_childs);
                }
            }
        }
        if (queue.length == 0) {
            console.log("acabamos el nivel");
            console.log("Los childs son" + queueChilds);
            if (queueChilds.length > 0) {
                if (nivel == maxLevel) {
                    return "Max level conecction found";
                }
                queue = queueChilds;
                queueChilds = [];
                nivel++;
            }
        }
    }
}

console.log(BFS("userA", "userX", 6));