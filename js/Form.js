class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.playButton = createButton("Play");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }
  handelElements(){
    this.titleImg.position(120,50)
    this.titleImg.class("gameTitle")

    this.input.position(width/2-110,height/2-80)
    this.input.class("customInput")

    this.playButton.position(width/2-90,height/2-20)
    this.playButton.class("customButton")

    this.greeting.position(width/2-300,height/2-100)
    this.greeting.class("greeting")
  }
  handelMousePressed(){
    this.playButton.mousePressed(()=>{
      this.input.hide()
      this.playButton.hide()
      var name = this.input.value()
      var message = `Gooday ${name}!</br>Please wait for another human to join...</br>Or else   >:-)`
      this.greeting.html(message)
      player.name=this.input.value()
      playerCount+=1
      player.index=playerCount
      player.addPlayer()
      player.updateCount(playerCount)
      player.getDistance()
      })
  }

  display(){
    this.handelElements()
    this.handelMousePressed()
  }
}
