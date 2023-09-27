function init()
{
    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    $container = $('#container');
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
                                    ASPECT,
                                    NEAR,
                                    FAR);
    scene = new THREE.Scene();
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    camera.position.z = 500;
    scene.add(camera);

    renderer.setSize(WIDTH, HEIGHT);

    $container.append(renderer.domElement);

    noGround = [];
    players_enemies = new Ground(0xffffff, WIDTH, HEIGHT, 10);
    for (player in players_enemies)
        scene.add(players_enemies[player].graphic);

    light1 = new Light("sun", 0xffffff, "0,0,340");
    scene.add(light1);
}

function Ground(color, size_x, size_y, nb_tile)
{
    colors = Array(0xff0000, 0x00ff00, 0x0000ff, 0x000000);

    sizeOfTileX = size_x / nb_tile;
    minX = -(size_x/2);
    maxX = (size_x/2);
    
    sizeOfTileY = size_y / nb_tile;
    minY = -(size_y/2);
    maxY = (size_y/2);

    for (x = minX; x <= maxX; x = x+sizeOfTileX){
        for (y = minY; y <= maxY; y = y+sizeOfTileY){

            color = colors[Math.floor(Math.random()*colors.length)];
       
            if (0x000000 != color)
            {
                tmpGround = new THREE.Mesh(
                new THREE.PlaneGeometry(sizeOfTileX-10, sizeOfTileY-10),
                new THREE.MeshLambertMaterial({color: color, transparent: true, opacity: 0.6}));
                tmpGround.position.x = x;
                tmpGround.position.y = y;
                scene.add(tmpGround);
            }
            else
                noGround.push([x, y]);
        }
    }
    vector_player = new THREE.Vector2(0, 0);
    vector_enemy = new THREE.Vector2(0, 0);

    while (containsVector(noGround, vector_player, sizeOfTileX, sizeOfTileY))
    {
        // random position of player between -WIDTH/4 and WIDTH/4
        vector_player.x = Math.floor(Math.random() * WIDTH/2) - WIDTH/4;
        vector_player.y = Math.floor(Math.random() * HEIGHT/2) - HEIGHT/4;

    }
    while (containsVector(noGround, vector_enemy, sizeOfTileX, sizeOfTileY) && vector_enemy.x != vector_player.x && vector_enemy.y != vector_player.y)
    {
        // random position of enemy between -WIDTH/4 and WIDTH/4
        vector_enemy.x = Math.floor(Math.random() * WIDTH/2) - WIDTH/4;
        vector_enemy.y = Math.floor(Math.random() * HEIGHT/2) - HEIGHT/4;
    }

    player1 = new Player("player1", 0xffff00, vector_player, 0);
    enemy1 = new Enemy(vector_enemy, 0);

    players_enemies = new Array();
    players_enemies["player1"] = player1;
    players_enemies["enemy1"] = enemy1;
    return players_enemies;

}

function Light(name, color, position)
{
    pointLight = new THREE.PointLight(color, 50, 5500000);

    pointLight.position.x = position.split(',')[0];
    pointLight.position.y = position.split(',')[1];
    pointLight.position.z = position.split(',')[2];

    return pointLight;
}

function containsVector(array, vector, sizeOfTileX, sizeOfTileY) {
    var halfSizeX = sizeOfTileX / 2;
    var halfSizeY = sizeOfTileY / 2;

    for (var i = 0, len = array.length; i < len; i++) {
        var tileX = array[i][0] - halfSizeX;
        var tileY = array[i][1] - halfSizeY;
        var mtileX = array[i][0] + halfSizeX;
        var mtileY = array[i][1] + halfSizeY;

        if (vector.x > tileX && vector.x < mtileX && vector.y > tileY && vector.y < mtileY) {
            return true;            
        }
    }

    return false;
}
