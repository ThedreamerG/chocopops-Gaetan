var Enemy = function( position, direction) {

    this.position = position;
    this.direction = direction || 0;
    this.life = 1;
    this.speed = 0;

    this.material = new THREE.MeshLambertMaterial({
        color: //red
        0xff0000,
        });

    var singleGeometry = new THREE.Geometry();

    vehiculeMesh = new THREE.ConeGeometry(5, 20, 32);
    this.graphic = new THREE.Mesh(vehiculeMesh, this.material);
    this.graphic.position.z = 6;

    this.graphic.rotateOnAxis(new THREE.Vector3(0,0,1), this.direction+(3*Math.PI/2));
};

Enemy.prototype.accelerate = function (distance) {
    var max = 2;

    this.speed += distance / 4;
    if (this.speed >= max) {
        this.speed = max;
    }
};

Enemy.prototype.decelerate = function (distance) {
    var min = -1;

    this.speed -= distance / 16;
    if (this.speed <= min) {
        this.speed = min;
    }
};

Enemy.prototype.displayInfo = function () {
    jQuery('#'+this.name+' >.life').text(this.life);
}

Enemy.prototype.turnRight = function (angle) {
    this.direction -= angle;
    this.graphic.rotateOnAxis(new THREE.Vector3(0,0,1), -angle);
};

Enemy.prototype.turnLeft = function (angle) {
    this.direction += angle;
    this.graphic.rotateOnAxis(new THREE.Vector3(0,0,1), +angle);
};

Enemy.prototype.move = function () {
    // move to the left then 2 seconds later move to the right
    var now = clock.getElapsedTime();
    if (now - this.lastMove > 2) {
        this.lastMove = now;
        this.speed = -this.speed;
    }
    this.graphic.position.x += this.speed * Math.cos(this.direction);
    this.graphic.position.y += this.speed * Math.sin(this.direction);
    this.graphic.position.z = 6;
    //light1.position.z = this.graphic.position.z + 500;
};

Enemy.prototype.dead = function () {
    // dead animation
    this.graphic.position.z = this.graphic.position.z-0.1;
        //Nettoyage de la div container
        $("#container").html("");
        jQuery('#'+this.name+' >.life').text("Tu es Vainqeur!");
        // play music

    // play music
    var audio = new Audio('https://soundboardguy.com/wp-content/uploads/2022/06/final-fantasy-vii-victory-fanfare-1.mp3');
    audio.play();
    setTimeout(function() {
        audio.pause();
        init();
    }, 5000);

    
}

    

