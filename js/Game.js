class Game {
  constructor() {
    this.resetTitle = createElement("h2")
    this.resetButton = createButton("")
    this.leaderboard = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playerMoving = false
    this.rightKeyActive = false
    this.blast = false
  }

  getState(){
    database.ref("gameState").on("value",x=>{
      gameState=x.val()
    })
  }
  updateState(x){
    database.ref("/").update({
      gameState:x
      
    })
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();

    car1=createSprite(width/2-100,height-100)
    car1.addImage(c1)
    car1.addImage("kaboom",boom)
    car1.scale=0.07

    car2=createSprite(width/2+100,height-100)
    car2.addImage(c2)
    car2.addImage("kaboom",boom)
    car2.scale=0.07

    cars = [car1,car2]

    fuels = new Group()
    coins = new Group()
    obstacles = new Group()

    var obPositions = [
      {x:width/2+250,y:height-800,image:ob2},
      {x:width/2-180,y:height-2300,image:ob2},
      {x:width/2,y:height-2800,image:ob2},
      {x:width/2+180,y:height-3300,image:ob2},
      {x:width/2+250,y:height-3800,image:ob2},
      {x:width/2+250,y:height-4800,image:ob2},
      {x:width/2-180,y:height-5500,image:ob2},

      {x:width/2-150,y:height-1300,image:ob1},
      {x:width/2+250,y:height-1800,image:ob1},
      {x:width/2-180,y:height-3300,image:ob1},
      {x:width/2-150,y:height-4300,image:ob1},
      {x:width/2,y:height-5300,image:ob1},
    ]
    this.addSprites(fuels,4,fuel,0.02)
    this.addSprites(coins,20,coin,0.09)
    this.addSprites(obstacles,obPositions.length,ob1,0.04,obPositions)
  }
  addSprites(group,number,image,scale,positions=[]){
    for(var i=0;i<number;i++){
      var x,y 
      if(positions.length>0){
        x=positions[i].x
        y=positions[i].y
        image=positions[i].image
      }
      else{
        x=random(width/2+150,width/2-150)
        y=random(-height*6,height-400)
      }
        var sprite = createSprite(x,y)
        sprite.addImage(image)
        sprite.scale=scale
        group.add(sprite)
    }
  }


  handleElements(){
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("Cheese")

    this.resetTitle.html("Reset Game?")
    this.resetTitle.position(width/2+200,40)
    this.resetTitle.class("resetText")

    this.resetButton.position(width/2+230,100)
    this.resetButton.class("resetButton")

    this.leaderboard.html("Leaderboard")
    this.leaderboard.position(width/3-60,40)
    this.leaderboard.class("resetText")

    this.leader1.position(width/3-50,80)
    this.leader1.class("leadersText")

    this.leader2.position(width/3-50,130)
    this.leader2.class("leadersText")
  }

  play(){
    this.handleElements()
    this.handleResetButton()
    Player.getPlayersInfo()
    player.getCarsAtEnd()
    if(allPlayers){
      image(track,0,-height*7,width,height*8)
      this.showLeaderboard()
      this.showLife()
      this.showFuel()
      var index=0

      for(var plr in allPlayers){
        index +=1

        var x=allPlayers[plr].positionX
        var y=height-allPlayers[plr].positionY
      
        cars[index-1].position.x = x
        cars[index-1].position.y = y

        var currentLife = allPlayers[plr].life
        if(currentLife<=0){
          cars[index-1].changeImage("kaboom")
          cars[index-1].scale = 0.3
        }


        if(index==player.index){
          fill("blue")
          ellipse(x,y,70,70)
          camera.position.y = cars[index-1].position.y
          camera.position.x = width/2

          this.handleFuel(index)
          this.handleCoins(index)
          this.handleCollision(index)
          this.handelCarCollision(index)
          if(player.life<=0){
            this.blast = true
            this.playerMoving = false
          }
        }
      }
      this.handlePlayerControls()
      if(this.playerMoving){
        player.positionY+=3
        player.update()
      }

      const finishLine = height*8-100
      if(player.positionY>finishLine){
        gameState = 2
        player.rank+=1
        Player.updateCarsAtEnd(player.rank)
        player.update()
        this.showRank()
      }
      drawSprites()
    }
  }
  handlePlayerControls(){
    if(!this.blast){
      if(keyIsDown(UP_ARROW)){
        this.playerMoving = true
        player.positionY+=5
        player.update()
      }
      if(keyIsDown(LEFT_ARROW)&&player.positionX>width/3-50){
        this.rightKeyActive = false
        player.positionX-=5
        player.update()
      }
      if(keyIsDown(RIGHT_ARROW)&&player.positionX<width/2+300){
        this.rightKeyActive = true
        player.positionX+=5
        player.update()
      }
    }
    
  }
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        players:{},
        carsAtEnd:0
      
      })
      window.location.reload()
    })

  }
  showLeaderboard(){
    var leader1,leader2
    var players = Object.values(allPlayers)
    if(
      (players[0].rank==0&&players[1].rank==0)||players[0].rank==1
    ){
      leader1=players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
      leader2=players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
    }
    if(players[1].rank==1){
      leader2=players[0].rank+"&emsp;"+players[0].name+"&emsp;"+players[0].score
      leader1=players[1].rank+"&emsp;"+players[1].name+"&emsp;"+players[1].score
    }
    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }
  handleFuel(index){
    cars[index-1].overlap(fuels,function(c,f){
      player.fuel=200
      f.remove()
    })
    if(player.fuel>0 && this.playerMoving){
      player.fuel-=0.4

    }
    if(player.fuel<=0){
      gameState = 2
      this.gameOver()
    }
  }


  handleCoins(index){
    cars[index-1].overlap(coins,function(cr,cn){
      player.score+=5
      player.update()
      cn.remove()
    })
  }
  showRank(){
    swal({
      title:`Fantastic!${"\n"}Rank${"\n"}${player.rank}`,
      text:"You smell like bread. Congrats on finishing. Go take a shower.",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText:"Okay???"
    })
  }
  gameOver(){
    swal({
      title:"Game Over :(",
      text:"Sorry. Better luck next time : )",
      imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize:"100x100",
      confirmButtonText:"..."
    })
  }
  showFuel(){
    push()
    image(fuel,width/2-130,height-player.positionY-350,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-350,200,20)
    fill("orange")
    rect(width/2-100,height-player.positionY-350,player.fuel,20)
    pop()
  }
  showLife(){
    push()
    image(life,width/2-130,height-player.positionY-300,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-300,200,20)
    fill("Red")
    rect(width/2-100,height-player.positionY-300,player.life,20)
    pop()
  }
  handleCollision(index){
    if(cars[index-1].collide(obstacles)){
      if(player.life>0){
        player.life-=200/3
      }
      player.update()
      if(this.rightKeyActive){
        player.positionX-=100
      }
      else{
        player.positionX+=100
      }
    }
  }
  handelCarCollision(index){
    if(index==1){
      if(cars[0].collide(cars[1])){
        if(player.life>0){
          player.life-=200/3
        }
        player.update()
        if(this.rightKeyActive){
          player.positionX-=100
        }
        else{
          player.positionX+=100
        }
      }
    }
    if(index==2){
      if(cars[1].collide(cars[0])){
        if(player.life>0){
          player.life-=200/3
        }
        player.update()
        if(this.rightKeyActive){
          player.positionX-=100
        }
        else{
          player.positionX+=100
        }
      }
    }
  }
}


