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

    var size = 20; // Size of the square
    var enemyMesh = new THREE.BoxGeometry(size, size, size);
    this.graphic = new THREE.Mesh(enemyMesh, this.material);
    this.graphic.position.z = 10; // Adjusted Z position

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
    var moveTo = new THREE.Vector3(
        this.speed * Math.cos(this.direction) + this.position.x,
        this.speed * Math.sin(this.direction) + this.position.y,
        this.graphic.position.z
    );

    this.position = moveTo;

    if (this.speed > 0) {
        this.speed = this.speed - 0.04;
    }
    else if (this.speed < 0) {
        this.speed = this.speed + 0.04;
    }

    this.graphic.position.x = this.position.x;
    this.graphic.position.y = this.position.y;

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

Enemy.prototype.moveai = function () {
    var self = this;

    function moveStraight() {
        self.accelerate(5); 
        self.move();
    }

    // Function to turn the enemy by 180 degrees
    function turnAround() {
        self.turnRight(Math.PI);  
    }

    var moveInterval = setInterval(moveStraight, 50);
    setTimeout(function() {
        clearInterval(moveInterval);  // Stop moving straight
        turnAround();                 // Turn by 180 degrees

        // Set the interval again to start moving straight in the opposite direction
        moveInterval = setInterval(moveStraight, 50);
        
        // And, after another 2 seconds, repeat the whole process
        setTimeout(arguments.callee, 2000);

    }, 2000);
};

