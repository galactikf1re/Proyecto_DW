function initCanvas(){
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage   = new Image(); // nave
    var enemiespic1  = new Image(); // enemigo 1
    var enemiespic2 = new Image(); // enemigo 2

    // backgroundImage y naveImage
    backgroundImage.src = "images/background.png";
    naveImage.src       = "images/spaceship-pic.png"; 
    // Enemigos fotos
    enemiespic1.src     = "images/enemigo1.png";
    enemiespic2.src     = "images/enemigo2.png"; 
    
    // Dimensiones de la pantalla
    var cW = ctx.canvas.width; // 700px 
    var cH = ctx.canvas.height;// 600px

    // Nave de jugador
    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1,
            health: options.health || 1
        }
    }

    var enemies = [
                   new enemyTemplate({id: "enemy1", x: 100, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy2", x: 225, y: -20, w: 50, h: 30 }),
                   new enemyTemplate({id: "enemy3", x: 350, y: -20, w: 80, h: 30 }),
                   new enemyTemplate({id: "enemy4", x:100,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy5", x:225,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy6", x:350,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy7", x:475,  y:-70,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy8", x:600,  y:-70,  w:80,  h: 30}),
                   new enemyTemplate({id: "enemy9", x:475,  y:-20,  w:50,  h: 30}),
                   new enemyTemplate({id: "enemy10",x: 600, y: -20, w: 50, h: 30}),

                   // Segundo tipo de enemigos
                   new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2, health: 2 }),
                   new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2, health: 2 })
                  ];

    // Se asegura que los enemigos sepan si estan en contacto con el jugador y reduce problemas de render
    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
            // Detecta la posicion de la nave
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        // Ubicacion de las balas
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white", // Color del proyectil
        this.misiles = [];

         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function () {
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10); // Fondo
            ctx.drawImage(naveImage,this.x,this.y, 100, 90); // Alinear las balas con la nave

            for(var i=0; i < this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); // Direccion del proyectil
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){ // Si la bala se sale del mapa se borra
                    this.misiles.splice(i,1); // Sacar la bala del array
                }
            }
            // Si ganas. . .
            if (enemies.length === 0) {
                clearInterval(animateInterval); // Detener el jeugo
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Nah, id win!', cW * .5, cH * .5);
            }
        }
        // Detectar impacto de bala
        this.hitDetect = function (m, mi) {
            console.log('crush');
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi],1); // Remover el proyectil
                    e.health -= 1; // Reducir vida
                    if(e.health <= 0) {
                        enemies.splice(i, 1); // Solo matar al enemigo si su salud es 0
                    }
                    document.querySelector('.barra').innerHTML = "Destroyed "+ e.id+ " ";
                }
            }
        }

        this.hitDetectLowerLevel = function(enemy){
            // Para detectar que los enemigos ya pasaron al limite de abajo de la pantalla
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = 'Nigga the enemy(s) have passed!';
            }
            // Esto detecta un choque de la nave con enemigos
            //console.log(this);
            // this.y -> ubicacion de la nave
            if(enemy.id === 'enemy3'){
                console.log(this.x);
            }
            
            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { 
                    this.gameStatus.over = true;
                    this.gameStatus.message = 'Youre a Nigga!'
                }

            if(this.gameStatus.over === true){  
                clearInterval(animateInterval); // Parar la animacion
                ctx.fillStyle = this.gameStatus.fillStyle; // Establecer el color a texto
                ctx.font = this.gameStatus.font;
                // Mostrar texto en pantalla
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.gameStatus.message, cW * .5, cH * .5);
            }
        }
    }
    
    //Hacer que aparezcan los enemigos
    var launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    var animateInterval = setInterval(animate, 6);
    
    //Obtener los botones
    var left_btn  = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn  = document.getElementById('fire_btn'); 

    //Eventos para que te permita moverte hacia todas las direcciones

   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37)
        {
         launcher.direccion = 'left';  
            if(launcher.x < cW*.2-130){
                launcher.x+=0;
                launcher.direccion = '';
            }
       }    
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37)
        {
         launcher.x+=0;
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39)
        {
         launcher.direccion = 'right';
         if(launcher.x > cW-110){
            launcher.x-=0;
            launcher.direccion = '';
         }
        
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39)
        {
         launcher.x-=0;   
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38)
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) 
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40) 
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 80) // Esto es para resetear el juego :v
         {
          location.reload();
         }
    });

    // Botones de direcciones
    left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });
    //Disparar asi bien maniacote
    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });
    // Detectar el espacio del teclado
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}

window.addEventListener('load', function(event) {
    initCanvas();
});
